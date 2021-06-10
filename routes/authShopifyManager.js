const express = require('express')
const router = express.Router()

///////////// Initial Setup /////////////

const dotenv = require('dotenv').config();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const axios = require('axios');
const { addWorkspace, fetchWorkspace, fetchUser, addUser, addUserToWorkspace } = require("../controller/UserManager");
const { setupWorkspace } = require('../controller/DataManager/Setup')
const { syncAll } = require("../controller/ShopifyManager/index");
const { createWebhooks } = require("../controller/ShopifyManager/Webhooks/index");

const shopifyApiPublicKey = 'eb6b044f4a8cf434a8100f85cac58205';
const shopifyApiSecretKey = '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';
const scopes = 'read_products, read_product_listings, read_customers, read_orders, read_script_tags, write_script_tags, read_checkouts, read_draft_orders, read_price_rules, read_fulfillments, read_assigned_fulfillment_orders, read_content'
const appUrl = 'https://custom-segment-service.herokuapp.com';


///////////// Helper Functions /////////////

const buildRedirectUri = () => `${appUrl}/callback`;

const buildInstallUrl = (shop, state, redirectUri) => `https://${shop}/admin/oauth/authorize?client_id=${shopifyApiPublicKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;

module.exports = {
    buildInstallUrl,
    buildRedirectUri
}
const buildAccessTokenRequestUrl = (shop) => `https://${shop}/admin/oauth/access_token`;

const buildShopDataRequestUrl = (shop) => `https://${shop}/admin/shop.json`;

const generateEncryptedHash = (params) => crypto.createHmac('sha256', shopifyApiSecretKey).update(params).digest('hex');

const fetchAccessToken = async (shop, data) => await axios(buildAccessTokenRequestUrl(shop), {
    method: 'POST',
    data
});

const fetchShopData = async (shop, accessToken) => await axios(buildShopDataRequestUrl(shop), {
    method: 'GET',
    headers: {
        'X-Shopify-Access-Token': accessToken
    }
});



router.get('/install', async (req, res) => {
    const shop = req.query.shop;
    console.log(shop);
    if (!shop) { return res.status(400).send('no shop') }

    const state = nonce();
    const installShopUrl = buildInstallUrl(shop, state, buildRedirectUri())

    res.cookie('state', state)
    res.header('Access-Control-Allow-Origin', '*');
    res.redirect(installShopUrl);

})

router.get('/callback', async (req, res) => {
    console.log('callback');
    const { shop, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) { return res.status(403).send('Cannot be verified') }

    const { hmac, ...params } = req.query
    const queryParams = querystring.stringify(params)
    const hash = generateEncryptedHash(queryParams)

    if (hash !== hmac) { return res.status(400).send('HMAC validation failed') }

    try {
        const data = {
            client_id: shopifyApiPublicKey,
            client_secret: shopifyApiSecretKey,
            code
        };
        const tokenResponse = await fetchAccessToken(shop, data)
        const { access_token } = tokenResponse.data
        let tokenResponseData = {
            ...tokenResponse.data,
            ...req.query
        }
        
        const shopData = await fetchShopData(shop, access_token)
        // console.log("tokenResponse : ", tokenResponseData)
        // console.log("shopData: ", shopData.data.shop)

        const fetchedWorkspace = await fetchWorkspace({ workspace_id: shopData.data.shop.id })
        if (Object.keys(fetchedWorkspace).length === 0) {
            const workspace = {
                workspace_id: shopData.data.shop.id,
                access_token: tokenResponseData.access_token,
                shop: shopData.data.shop,
                shop_name: shopData.data.shop.myshopify_domain,
                scope: tokenResponseData.scope,
                created_at: Date.now(),
                updated_at: Date.now()
            }
            await addWorkspace(workspace);
            // console.log('workspace added');
            await setupWorkspace(workspace.workspace_id);
            // console.log('workspace setup done');
            await createWebhooks(workspace.shop_name, workspace.access_token, workspace.workspace_id)
            // console.log('webhooks created');
            await syncAll({ 
                shopName: workspace.shop_name, 
                accessToken: workspace.access_token,  
                limit: 50, 
                workspaceId: workspace.workspace_id 
            });
        }

        let flag = false;

        const fetchedUser = await fetchUser({ user_id: shopData.data.shop.email })
        if( !fetchedUser.Item || !fetchedUser.Item.password ){
            flag = true;
        }
        if (Object.keys(fetchedUser).length === 0) {
            const user = {
                user_id: shopData.data.shop.email,
                name: shopData.data.shop.shop_owner,
                created_at: Date.now(),
                updated_at: Date.now()
            }
            await addUser(user);
        }

        const userToWorkspace = {
            user_id: shopData.data.shop.email,
            workspace_id: shopData.data.shop.id
        }
        await addUserToWorkspace(userToWorkspace);
        if (flag) {
            res.redirect(`http://localhost:8080/pages/authentication/reset-password-v1?user_id=${shopData.data.shop.email}`)
        } else {        
            res.redirect('http://localhost:8080/apps/customers');
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('something went wrong')
    }
})

module.exports = router
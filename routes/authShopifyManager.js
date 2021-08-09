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
const { insert, fetch, del, query } = require('../aws/index');
const Shopify = require('../controller/ShopifyManager/Shopify')

const shopifyApiPublicKey = 'eb6b044f4a8cf434a8100f85cac58205';
const shopifyApiSecretKey = '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';
const scopes = 'read_products, write_products, read_product_listings, read_customers, write_customers, read_orders, write_orders, read_script_tags, write_script_tags, read_checkouts, read_draft_orders, write_draft_orders, read_price_rules, read_fulfillments, read_assigned_fulfillment_orders, read_content, read_inventory, read_third_party_fulfillment_orders, read_merchant_managed_fulfillment_orders, read_shipping'
const appUrl = 'https://cs-service.herokuapp.com';


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


router.post('/connect', async (req, res) => {
    try{
        let params = {
            TableName: 'ConnectStore',
            Key: {
                shop: req.body.shop
            }
        }
        let resp = await fetch(params);
        if(resp.Item){
            const diff = Math.abs(new Date() - new Date(resp.Item.created_at));
            const minutes = Math.floor((diff/1000)/60);
            if(minutes < 5) {
                return res.status(400).send(`${resp.Item.user_id} already trying to connect to store`)
            }
        }
        params = {
            TableName: 'ConnectStore',
            Item: {
                shop: req.body.shop,
                user_id: req.body.userId,
                created_at: new Date().toISOString(),
            }
        }
        resp = await insert(params)
        res.status(200).send(`${appUrl}/install?shop=${req.body.shop}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something Went Wrong!")
    }
    
})


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
    // console.log('callback');
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

        let params = {
            TableName: 'ConnectStore',
            Key: {
                shop: shopData.data.shop.myshopify_domain
            }
        }
        let resp = await fetch(params);
        if(resp.Item){
            const diff = Math.abs(new Date() - new Date(resp.Item.created_at));
            const minutes = Math.floor((diff/1000)/60);
            if(minutes < 5) {
                await addUserToWorkspace({ user_id: resp.Item.user_id, workspace_id: shopData.data.shop.id, role: 'admin'})
                await del(params);
            }
        }

        const fetchedWorkspace = await fetchWorkspace({ workspace_id: shopData.data.shop.id })
        // console.log(fetchedWorkspace);
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
            console.log('workspace added');
            await Shopify.fetchTrackingScript(workspace.shop_name, workspace.access_token, workspace.workspace_id)
            console.log('tracking script inserted')
            await Shopify.addSocket(workspace.shop_name, workspace.access_token)
            console.log('socket cdn added')
            await Shopify.addJquery(workspace.shop_name, workspace.access_token)
            console.log('jQuery added')
            await setupWorkspace(workspace.workspace_id);
            console.log('workspace setup done');
            await createWebhooks(workspace.shop_name, workspace.access_token, workspace.workspace_id)
            console.log('webhooks created');
            await syncAll({ 
                shopName: workspace.shop_name, 
                accessToken: workspace.access_token,  
                limit: 50, 
                workspaceId: workspace.workspace_id 
            });
            console.log('synced')
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
            workspace_id: shopData.data.shop.id,
            role: 'admin'
        }
        await addUserToWorkspace(userToWorkspace);
        if (flag) {
            res.redirect(`https://app.customsegment.com/pages/authentication/reset-password-v1?user_id=${uriEncodedComponent(shopData.data.shop.email)}`)
        } else {        
            res.redirect('https://app.customsegment.com/apps/customers');
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('something went wrong')
    }
})

module.exports = router
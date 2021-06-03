const express = require('express')
const router = express.Router()


///////////// Initial Setup /////////////

const dotenv = require('dotenv').config();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const axios = require('axios');

const shopifyApiPublicKey = 'eb6b044f4a8cf434a8100f85cac58205';
const shopifyApiSecretKey = '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';
const scopes = 'read_products, read_product_listings, read_customers, read_orders, read_script_tags, write_script_tags, read_checkouts, read_draft_orders, read_price_rules, read_fulfillments, read_assigned_fulfillment_orders, read_content'
const appUrl = 'http://localhost:3000';


///////////// Helper Functions /////////////

const buildRedirectUri = () => `${appUrl}/callback`;

const buildInstallUrl = (shop, state, redirectUri) => `https://${shop}/admin/oauth/authorize?client_id=${shopifyApiPublicKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;

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

    if (!shop) { return res.status(400).send('no shop') }

    const state = nonce();

    const installShopUrl = buildInstallUrl(shop, state, buildRedirectUri())

    res.cookie('state', state)
    res.redirect(installShopUrl);
})

router.get('/callback', async (req, res) => {
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
        console.log("tokenResponse : ", tokenResponseData)
        //save data (shop, access_token, workspaceId, shopData)
        
        res.redirect('http://google.com/');

    } catch (err) {
        console.log(err)
        res.status(500).send('something went wrong')
    }
})

module.exports = router
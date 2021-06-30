const express = require('express')
const router = express.Router()
const { syncAll } = require("../controller/ShopifyManager/index");
const { count } = require("../controller/ShopifyManager/helper");

router.post('/shopify-manager/sync', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await syncAll({ shopName: 'indian-dress-cart.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 56788582584 });
    res.status(200).send({ status: 200, message: "Added" })
})

router.get('/shopify-manager/count', async (req, res) => {
    const { 'x-workspace-name': shopName } = req.headers;
    const response = await count(shopName, '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')
    res.status(200).send({ status: 200, message: "Added", count: response })
})

module.exports = router
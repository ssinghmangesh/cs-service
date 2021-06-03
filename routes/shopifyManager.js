const express = require('express')
const router = express.Router()
const {syncAll} = require("../controller/ShopifyManager/index");

router.post('/shopify-manager/sync', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await syncAll({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: workspaceId } );
    res.status(200).send({ status: 200, message: "Added" })
})

module.exports = router
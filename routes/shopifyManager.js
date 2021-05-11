const express = require('express')
const router = express.Router()
const {syncAll} = require("../controller/ShopifyManager/index");

router.post('/shopify-manager/sync', async (req, res) => {
    // const { workspaceId } = req.body
    const response = syncAll({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 12345 } );
    res.status(200).send(response)
})

module.exports = router
const express = require('express')
const router = express.Router()
const { syncAll } = require("../controller/ShopifyManager/index");
const { count } = require("../controller/ShopifyManager/helper");
const { fetchWorkspace } = require('../controller/UserManager')
const { verify } = require('../controller/AuthManager/helper')

// router.use((req, res, next) => {
//     console.log('shopify');
//     if(verify(req)){
//         next();
//     }else{
//         res.sendStatus(403)
//     }
// })

router.post('/shopify-manager/sync', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const { Item } = await fetchWorkspace({workspace_id: Number(workspaceId)})
    const response = await syncAll({ shopName: Item.shop_name, accessToken: Item.access_token, workspaceId: Number(workspaceId), table: req.body.table });
    res.status(200).send({ status: 200, message: "Added" })
})

router.get('/shopify-manager/count', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const { Item } = await fetchWorkspace({workspace_id: Number(workspaceId)})
    const response = await count(Item.shop_name, Item.access_token)
    res.status(200).send({ status: 200, message: "Added", count: response })
})

module.exports = router
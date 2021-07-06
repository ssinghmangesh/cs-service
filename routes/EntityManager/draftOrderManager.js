const express = require('express')
const router = express.Router()
const DraftOrder = require('../../controller/EntityManager/DraftOrderManager/index')

router.post('/draft-order-manager/draft-order', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `draftorder${workspaceId}`
    let response = await DraftOrder.draftOrder({TABLE_NAME: table, draftOrderId: details.draftOrderId, orderBykey: details.orderBykey, 
                                                orderByDirection: details.orderByDirection, limit: details.limit, 
                                                skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/draft-order-manager/product', async (req, res) => {
    const details = req.body
    // console.log('details: ', details)
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `draftorderlineitems${workspaceId}`
    let response = await DraftOrder.product({TABLE_NAME: table, orderId: details.orderId,
                                                orderBykey: details.orderBykey, orderByDirection: details.orderByDirection, 
                                                limit: details.limit, skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
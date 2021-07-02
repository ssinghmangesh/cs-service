const express = require('express')
const router = express.Router()
const Order = require('../../controller/EntityManager/OrderManager/index')

router.post('/order-manager/order', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `order${workspaceId}`
    let response = await Order.order({TABLE_NAME: table, orderId: details.orderId, orderBykey: details.orderBykey, 
                                    orderByDirection: details.orderByDirection, limit: details.limit, 
                                    skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/order-manager/product-purchased', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `lineitems${workspaceId}`
    let response = await Order.product({TABLE_NAME: table, orderId: details.orderId, 
                                            orderBykey: details.orderBykey, orderByDirection: details.orderByDirection, 
                                            limit: details.limit, skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/order-manager/fulfillments', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `fulfillment${workspaceId}`
    let response = await Order.fulfillments({TABLE_NAME: table, orderId: details.orderId, orderBykey: details.orderBykey, 
                                            orderByDirection: details.orderByDirection, limit: details.limit, 
                                            skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
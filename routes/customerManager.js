const express = require('express')
const router = express.Router()
const Customer = require('../controller/CustomerManager/index')
// const { setupWorkspace } = require('../controller/DataManager/Setup')
// const { update } = require("../controller/ShopifyManager/Webhooks/index");
// const {CUSTOMER_TABLE_NAME, ORDER_TABLE_NAME} = require("../controller/DataManager/helper");
// const customerColumns = require("../controller/DataManager/Setup/customerColumns.json");
// const orderColumns = require("../controller/DataManager/Setup/orderColumns.json");
// const productColumns = require("../controller/DataManager/Setup/productColumns.json");

router.post('/customer-manager/orders', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `order${workspaceId}`
    let response = await Customer.orders({TABLE_NAME: table, startdate: details.startdate, enddate: details.enddate, 
                                            customerId: details.customerId, orderBykey: details.orderBykey, 
                                            orderByDirection: details.orderByDirection, limit: details.limit, 
                                            skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/customer-manager/cart', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `cart${workspaceId}`
    let response = await Customer.cart({TABLE_NAME: table, startdate: details.startdate, enddate: details.enddate, 
                                        customerId: details.customerId, orderBykey: details.orderBykey, 
                                        orderByDirection: details.orderByDirection, limit: details.limit, 
                                        skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/customer-manager/event', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `event${workspaceId}`
    let response = await Customer.event({TABLE_NAME: table, customerId: details.customerId, orderBykey: details.orderBykey, 
                                                orderByDirection: details.orderByDirection, limit: details.limit, 
                                                skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/customer-manager/customer-aggregate', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Customer.aggregate({customerId: details.customerId, workspaceId: workspaceId, aggregateDefinition: details.aggregateDefinition})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router

// let aggregateDefinition = [
//     {
//         aggregate: 'count',
//         columnname: 'total_order_count',
//         alias: 'Total_Count'
//     },
//     {
//         aggregate: 'sum',
//         columnname: 'total_amount_spent',
//         alias: 'Total_Spent'
//     },
//     {
//         aggregate: 'avg',
//         columnname: 'avg_order_price',
//         alias: 'Average'
//     },
//     {
//         aggregate: '',
//         columnname: 'tags',
//         alias: 'Tags'
//     },
//     {
//         aggregate: '',
//         columnname: 'first_order_at',
//         alias: 'First_Order'
//     },
//     {
//         aggregate: '',
//         columnname: 'last_seen',
//         alias: 'Last_Seen'
//     }
// ]
const express = require('express')
const router = express.Router()
const Customer = require('../../controller/EntityManager/CustomerManager/index')

router.post('/customer-manager/customer', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `customer${workspaceId}`
    let response = await Customer.customer({TABLE_NAME: table, customerId: details.customerId})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/customer-manager/orders', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `order${workspaceId}`
    let response = await Customer.orders({TABLE_NAME: table, customerId: details.customerId, orderBykey: details.orderBykey, 
                                            orderByDirection: details.orderByDirection, limit: details.limit, 
                                            skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/customer-manager/cart', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `cart${workspaceId}`
    let response = await Customer.cart({TABLE_NAME: table, customerId: details.customerId, orderBykey: details.orderBykey, 
                                        orderByDirection: details.orderByDirection, limit: details.limit, 
                                        skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/customer-manager/product-purchased', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `lineitems${workspaceId}`
    let response = await Customer.productPurchased({TABLE_NAME: table, customerId: details.customerId,
                                                    orderBykey: details.orderBykey, 
                                                    orderByDirection: details.orderByDirection, limit: details.limit, 
                                                    skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/customer-manager/product-in-cart', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `cart${workspaceId}`
    let response = await Customer.productInCart({TABLE_NAME: table, customerId: details.customerId, orderBykey: details.orderBykey, 
                                                orderByDirection: details.orderByDirection, limit: details.limit, 
                                                skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/customer-manager/timeline', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `event${workspaceId}`
    let response = await Customer.event({TABLE_NAME: table, customerId: details.customerId, orderBykey: details.orderBykey, 
                                        orderByDirection: details.orderByDirection, limit: details.limit, 
                                        skipRowby: details.skipRowby})
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
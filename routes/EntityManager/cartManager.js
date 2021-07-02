const express = require('express')
const router = express.Router()
const Cart = require('../../controller/EntityManager/CartManager/index')

router.post('/cart-manager/cart', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `cart${workspaceId}`
    let response = await Cart.cart({TABLE_NAME: table, cartId: details.cartId, orderBykey: details.orderBykey, 
                                    orderByDirection: details.orderByDirection, limit: details.limit, 
                                    skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/cart-manager/product', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `cart${workspaceId}`
    console.log('api')
    let response = await Cart.product({TABLE_NAME: table, cartId: details.cartId, workspaceId: workspaceId, 
                                    orderBykey: details.orderBykey, orderByDirection: details.orderByDirection, 
                                    limit: details.limit, skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
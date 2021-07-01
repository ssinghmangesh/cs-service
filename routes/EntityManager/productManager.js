const express = require('express')
const router = express.Router()
const Product = require('../../controller/EntityManager/ProductManager/index')

router.post('/product-manager/product', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `product${workspaceId}`
    let response = await Product.product({TABLE_NAME: table, productId: details.productId, orderBykey: details.orderBykey, 
                                        orderByDirection: details.orderByDirection, limit: details.limit, 
                                        skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
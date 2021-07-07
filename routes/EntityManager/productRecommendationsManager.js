const express = require('express')
const router = express.Router()
const { productRecommendations, compute } = require('../../controller/EntityManager/ProductRecommendationsManager/index')

router.post('/product-recommendations-manager/recommendations', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `productrecommendations${workspaceId}`
    let response = await productRecommendations.recommendations({TABLE_NAME: table, customerId: details.customerId, 
                                        orderBykey: details.orderBykey, orderByDirection: details.orderByDirection, 
                                        limit: details.limit, skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/product-recommendations-manager/compute-product-recommendations', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await compute({workspaceId: workspaceId, customerId: details.customerId})
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/product-recommendations-manager/add', async (req, res) => {
    // const details = req.body
    // const { 'x-workspace-id': workspaceId } = req.headers
    // res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
const express = require('express')
const router = express.Router()
const { productRecommendations, historyBased, cartBased, addRecommendations, popularProducts } = require('../../controller/EntityManager/ProductRecommendationsManager/index')

router.post('/product-recommendations-manager/add', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    try {
        await addRecommendations(workspaceId, req.body)
        res.status(200).send( { status: true, message: "successful" } )
    } catch {
        res.status(400).send( { status: false, message: "unsuccessful" } )
    }
})

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

router.post('/product-recommendations-manager/history', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await historyBased({workspaceId: workspaceId, customerId: details.customerId})
    res.status(200).send( { status: true, message: "successful", data: response } )
})


router.post('/product-recommendations-manager/cart', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await cartBased({workspaceId: workspaceId, customerId: details.customerId})
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/product-recommendations-manager/popular', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    try{
        let response = await popularProducts(req.body, workspaceId)
        res.status(200).send( { status: true, message: "successful", data: response } )
    } catch {
        res.status(400).send( { status: false, message: "unsuccessful" } )
    }
})

module.exports = router
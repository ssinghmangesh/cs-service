const express = require('express')
const router = express.Router()
const { setupWorkspace } = require('../controller/DataManager/Setup')


router.post('/data-manager/setup', async (req, res) => {
    const { workspaceId } = req.body
    let response = await setupWorkspace(workspaceId)
    res.status(200).send(response)
})

router.post('/data-manager/customer/add', (req, res) => {
    //delete and insert customer of that id

    res.status(200).send("")
})


router.post('/data-manager/order/add', (req, res) => {
    //delete and insert order of that id, all lineitems of that order, all fufilment of that order

    res.status(200).send("")
})

router.post('/data-manager/product/add', (req, res) => {
    //delete and insert product of that id, all vairant of that order
    
    res.status(200).send("")
})





router.get('/data-manager/cart/add', (req, res) => {
    res.status(200).send("")
})

router.get('/data-manager/checkout/add', (req, res) => {
    res.status(200).send("")
})
router.get('/data-manager/cart/delete', (req, res) => {
    res.status(200).send("")
})

router.get('/data-manager/checkout/delete', (req, res) => {
    res.status(200).send("")
})

module.exports = router
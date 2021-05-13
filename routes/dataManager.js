const express = require('express')
const router = express.Router()
const { setupWorkspace } = require('../controller/DataManager/Setup')
const { update } = require("../controller/ShopifyManager/Webhooks/index");
const {CUSTOMER_TABLE_NAME, ORDER_TABLE_NAME, PRODUCT_TABLE_NAME} = require("../controller/DataManager/helper");
const customerColumns = require("../controller/DataManager/Setup/customerColumns.json");
const orderColumns = require("../controller/DataManager/Setup/orderColumns.json");
const productColumns = require("../controller/DataManager/Setup/productColumns.json");



router.post('/data-manager/setup', async (req, res) => {
    const { workspaceId } = req.body
    let response = await setupWorkspace(workspaceId)
    res.status(200).send(response)
})

router.post('/data-manager/customer/add',async (req, res) => {
    const {customer} = req.body;
    const workspaceId = 2;
    console.log(req);
    const response = await update(CUSTOMER_TABLE_NAME, customerColumns, customer, workspaceId);
    //delete and insert customer of that id
    res.status(200).send(response);
})


router.post('/data-manager/order/add',async (req, res) => {
    const {order} = req.body;
    const workspaceId = 2;
    //delete and insert order of that id, all lineitems of that order, all fufilment of that order
    const response = await update(ORDER_TABLE_NAME, orderColumns, order, workspaceId);
    res.status(200).send(response);
})

router.post('/data-manager/product/add',async (req, res) => {
    const {product} = req.body;
    const workspaceId = 2;
    //delete and insert product of that id, all variant of that order
    const response = await update(PRODUCT_TABLE_NAME, productColumns, product, workspaceId);
    res.status(200).send(response);
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
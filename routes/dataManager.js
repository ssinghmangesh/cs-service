const express = require('express')
const router = express.Router()
const { setupWorkspace } = require('../controller/DataManager/Setup')
const { update } = require("../controller/ShopifyManager/Webhooks/index");
const {
    CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME, 
    PRODUCT_TABLE_NAME,
    CART_TABLE_NAME,
    CARTLINEITEMS_TABLE_NAME,
    CHECKOUT_TABLE_NAME,
    CHECKOUTLINEITEMS_TABLE_NAME,
    EVENT_TABLE_NAME
} = require("../controller/DataManager/helper");
const Dashboard  = require("../controller/AnalyticsManager/index"); 

const customerColumns = require("../controller/DataManager/Setup/customerColumns.json");
const orderColumns = require("../controller/DataManager/Setup/orderColumns.json");
const productColumns = require("../controller/DataManager/Setup/productColumns.json");
const cartColumns = require("../controller/DataManager/Setup/cartColumns.json");
const cartLineItemsColumns = require("../controller/DataManager/Setup/cartLineItemColumns.json");
const checkoutColumns = require("../controller/DataManager/Setup/checkoutColumns.json");
const eventColumns = require("../controller/DataManager/Setup/eventColumns.json");
const checkoutLineItemsColumns = require("../controller/DataManager/Setup/checkoutLineItemsColumns.json");
const { default: axios } = require('axios');





router.get('/data-manager/customer/count', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    console.log(req.headers);
    const response = await Dashboard.Count({TABLE_NAME: CUSTOMER_TABLE_NAME, workspaceId, startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
    res.status(200).send( { status: true, message: "successful", data: response } );
})

router.post('/data-manager/setup', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await setupWorkspace(workspaceId)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/data-manager/customer/add',async (req, res) => {
    const { customer } = req.body;
    const { 'x-workspace-id': workspaceId } = req.headers
    const response = await update(CUSTOMER_TABLE_NAME, customerColumns, [customer], workspaceId);
    //delete and insert customer of that id
    res.status(200).send( { status: true, message: "successful", data: response } );
})


router.post('/data-manager/order/add',async (req, res) => {
    const { order } = req.body;
    const { 'x-workspace-id': workspaceId } = req.headers
    //delete and insert order of that id, all lineitems of that order, all fufilment of that order
    const response = await update(ORDER_TABLE_NAME, orderColumns, [order], workspaceId);
    res.status(200).send( { status: true, message: "successful", data: response } );
})

router.post('/data-manager/product/add',async (req, res) => {
    const { product } = req.body;
    const { 'x-workspace-id': workspaceId } = req.headers
    //delete and insert product of that id, all variant of that order
    const response = await update(PRODUCT_TABLE_NAME, productColumns, [product], workspaceId);
    res.status(200).send( { status: true, message: "successful", data: response } );
})





router.post('/data-manager/cart/add',async (req, res) => {
    const { cart } = req.body;
    const { 'x-workspace-id': workspaceId } = req.headers
    //delete and insert product of that id, all variant of that order
    const response = await update(CART_TABLE_NAME, cartColumns, [cart], workspaceId);

    console.log("cart done");

    await update(CARTLINEITEMS_TABLE_NAME, cartLineItemsColumns, cart.line_items, workspaceId);

    console.log("carlineitems done");

    res.status(200).send("")
})

router.post('/data-manager/checkout/add',async (req, res) => {
    const { checkout } = req.body;
    const { 'x-workspace-id': workspaceId } = req.headers
    //delete and insert product of that id, all variant of that order
    const response = await update(CHECKOUT_TABLE_NAME, checkoutColumns, [checkout], workspaceId);

    // await update(CHECKOUTLINEITEMS_TABLE_NAME, checkoutLineItemsColumns, checkout.line_items, workspaceId);

    res.status(200).send("")
})

router.post('/data-manager/event/add',async (req, res) => {
    const { event } = req.body;
    const { 'x-workspace-id': workspaceId } = req.headers
    console.log(event);
    // const response = await update(EVENT_TABLE_NAME, eventColumns, [event], workspaceId);

    console.log("event done");
    res.status(200).send({ message: "working" })
})

router.get('/data-manager/cart/delete',async (req, res) => {
    res.status(200).send("")
})

router.get('/data-manager/checkout/delete',async (req, res) => {
    res.status(200).send("")
})

router.post('/webhooks/:workspaceId/:event/:type',async (req, res) => {
    await update(req.params, req.body);
    res.status(200).send("done")
})

module.exports = router
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
    CHECKOUTLINEITEMS_TABLE_NAME
} = require("../controller/DataManager/helper");

const customerColumns = require("../controller/DataManager/Setup/customerColumns.json");
const orderColumns = require("../controller/DataManager/Setup/orderColumns.json");
const productColumns = require("../controller/DataManager/Setup/productColumns.json");
const cartColumns = require("../controller/DataManager/Setup/cartColumns.json");
const cartLineItemsColumns = require("../controller/DataManager/Setup/cartLineItemColumns.json");
const checkoutColumns = require("../controller/DataManager/Setup/checkoutColumns.json");
const checkoutLineItemsColumns = require("../controller/DataManager/Setup/checkoutLineItemsColumns.json");


router.post('/data-manager/setup', async (req, res) => {
    const { workspaceId } = req.body
    let response = await setupWorkspace(workspaceId)
    res.status(200).send(response)
})

router.post('/data-manager/customer/add',async (req, res) => {
    const {customer, workspaceId} = req.body;
    console.log(req);
    const response = await update(CUSTOMER_TABLE_NAME, customerColumns, [customer], workspaceId);
    //delete and insert customer of that id
    res.status(200).send(response);
})


router.post('/data-manager/order/add',async (req, res) => {
    const {order, workspaceId} = req.body;
    //delete and insert order of that id, all lineitems of that order, all fufilment of that order
    const response = await update(ORDER_TABLE_NAME, orderColumns, [order], workspaceId);
    res.status(200).send(response);
})

router.post('/data-manager/product/add',async (req, res) => {
    const {product, workspaceId} = req.body;
    //delete and insert product of that id, all variant of that order
    const response = await update(PRODUCT_TABLE_NAME, productColumns, [product], workspaceId);
    res.status(200).send(response);
})





router.post('/data-manager/cart/add',async (req, res) => {
    const { cart, workspaceId } = req.body;
    //delete and insert product of that id, all variant of that order
    const response = await update(CART_TABLE_NAME, cartColumns, [cart], workspaceId);

    console.log("cart done");

    await update(CARTLINEITEMS_TABLE_NAME, cartLineItemsColumns, cart.line_items, workspaceId);

    console.log("carlineitems done");

    res.status(200).send("")
})

router.post('/data-manager/checkout/add',async (req, res) => {
    const { checkout, workspaceId } = req.body;
    //delete and insert product of that id, all variant of that order
    const response = await update(CHECKOUT_TABLE_NAME, checkoutColumns, [checkout], workspaceId);

    // await update(CHECKOUTLINEITEMS_TABLE_NAME, checkoutLineItemsColumns, checkout.line_items, workspaceId);

    res.status(200).send("")
})
router.get('/data-manager/cart/delete',async (req, res) => {
    res.status(200).send("")
})

router.get('/data-manager/checkout/delete',async (req, res) => {
    res.status(200).send("")
})

module.exports = router
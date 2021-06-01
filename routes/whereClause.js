const express = require('express')
const router = express.Router()
const { whereClause } = require('../filters.js')
const PostgresqlDb = require('../db')
// const { setupWorkspace } = require('../controller/DataManager/Setup')
// const { update } = require("../controller/ShopifyManager/Webhooks/index");
// const {CUSTOMER_TABLE_NAME, ORDER_TABLE_NAME} = require("../controller/DataManager/helper");
// const customerColumns = require("../controller/DataManager/Setup/customerColumns.json");
// const orderColumns = require("../controller/DataManager/Setup/orderColumns.json");
// const productColumns = require("../controller/DataManager/Setup/productColumns.json");

router.post('/whereClause', async (req, res) => {
    const details = req.body
    response = whereClause(details.filters, '')
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router;

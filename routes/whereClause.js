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
    // const { 'x-workspace-id': workspaceId } = req.headers
    let query = `SELECT * FROM ${details.tableName}333 WHERE `
    query += `${whereClause()};`
    console.log(query)
    const response = await PostgresqlDb.query(query)
    console.log(response)
    res.status(200).send( { status: true, message: "successful"} )
})

module.exports = router
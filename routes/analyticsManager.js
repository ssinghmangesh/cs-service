const express = require('express')
const router = express.Router()
const Dashboard = require('../controller/AnalyticsManager/index')
// const { setupWorkspace } = require('../controller/DataManager/Setup')
// const { update } = require("../controller/ShopifyManager/Webhooks/index");
const {CUSTOMER_TABLE_NAME, ORDER_TABLE_NAME} = require("../controller/DataManager/helper");
// const customerColumns = require("../controller/DataManager/Setup/customerColumns.json");
// const orderColumns = require("../controller/DataManager/Setup/orderColumns.json");
// const productColumns = require("../controller/DataManager/Setup/productColumns.json");

router.post('/analytics-manager/count', async (req, res) => {
    const details = req.body
    let table = `${details.table}${details.workspaceId}`
    let response = await Dashboard.count({TABLE_NAME: table, startdate: details.startdate, enddate: details.enddate})
    console.log(response)
    res.status(200).send(response)
})

router.post('/analytics-manager/sum', async (req, res) => {
    const details = req.body
    let table = `${details.table}${details.workspaceId}`
    let response = await Dashboard.sum({TABLE_NAME: table, columnname: details.columnname, workspaceId: details.workspaceId, startdate: details.startdate, enddate: details.enddate})
    console.log(response)
    res.status(200).send(response)
})

router.post('/analytics-manager/lineGraph', async (req, res) => {
    const details = req.body
    let table = `${details.table}${details.workspaceId}`
    let response = await Dashboard.lineGraph({TABLE_NAME: table, columnname: details.columnname, groupBykey: details.groupBykey, workspaceId: details.workspaceId, startdate: details.startdate, enddate: details.enddate})
    console.log(response)
    res.status(200).send(response)
})

router.post('/analytics-manager/barGraph', async (req, res) => {
    const details = req.body
    let table = `${details.table}${details.workspaceId}`
    let response = await Dashboard.barGraph({TABLE_NAME: table, columnname: details.columnname, groupBykey: details.groupBykey, groupBykey2: details.groupBykey2, workspaceId: details.workspaceId, startdate: details.startdate, enddate: details.enddate})
    console.log(response)
    res.status(200).send(response)
})

router.post('/analytics-manager/pieChart', async (req, res) => {
    const details = req.body
    let table = `${details.table}${details.workspaceId}`
    let response = await Dashboard.pieChart({TABLE_NAME: table, columnname: details.columnname, workspaceId: details.workspaceId, startdate: details.startdate, enddate: details.enddate})
    console.log(response)
    res.status(200).send(response)
})

router.post('/analytics-manager/table', async (req, res) => {
    const details = req.body
    let table = `${details.table}${details.workspaceId}`
    let response = await Dashboard.table({TABLE_NAME: table, workspaceId: details.workspaceId, orderBykey: details.orderBykey, limit: details.limit, skipRowby: details.skipRrowby})
    console.log(response)
    res.status(200).send(response)
})

module.exports = router
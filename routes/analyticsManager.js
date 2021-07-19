const express = require('express')
const router = express.Router()
const Dashboard = require('../controller/AnalyticsManager/index')
const { download } = require('../controller/AnalyticsManager/helper')
// const { setupWorkspace } = require('../controller/DataManager/Setup')
// const { update } = require("../controller/ShopifyManager/Webhooks/index");
// const {CUSTOMER_TABLE_NAME, ORDER_TABLE_NAME} = require("../controller/DataManager/helper");
// const customerColumns = require("../controller/DataManager/Setup/customerColumns.json");
// const orderColumns = require("../controller/DataManager/Setup/orderColumns.json");
// const productColumns = require("../controller/DataManager/Setup/productColumns.json");

router.post('/analytics-manager/count', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.count({table: details.table, workspaceId: workspaceId, filters: details.filters })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/sum', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.sum({table: details.table, workspaceId: workspaceId, columnname: details.columnname, startdate: details.startdate, enddate: details.enddate, filters: details.filters })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/line-graph', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    // console.log(statsDefinition)
    let response = await Dashboard.lineGraph({table: details.table, workspaceId: workspaceId, groupBykey: details.groupBykey, startdate: details.startdate, enddate: details.enddate, statsDefinition: details.statsDefinition, prevstartdate: details.prevstartdate, prevenddate: details.prevenddate, filters: details.filters })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/bar-graph', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.barGraph({table: details.table, workspaceId: workspaceId, columnname: details.columnname, groupBykey: details.groupBykey, groupBykey2: details.groupBykey2, startdate: details.startdate, enddate: details.enddate, statsDefinition: details.statsDefinition, prevstartdate: details.prevstartdate, prevenddate: details.prevenddate, filters: details.filters })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/pie-chart', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.pieChart({ ...details, workspaceId })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/table-groupby', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.tableGroupBy({table: details.table, workspaceId: workspaceId, groupBykey: details.groupBykey, statsDefinition: details.statsDefinition, limit: details.limit, skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/table', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.table({table: details.table, workspaceId: workspaceId, orderBykey: details.orderBykey, orderByDirection: details.orderByDirection, limit: details.limit, skipRowby: details.skipRowby, filters: details.filters })
    // console.log(response)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/stats', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.stats({table: details.table, workspaceId: workspaceId, limit: details.limit, skipRowby: details.skipRowby, statsDefinition: details.statsDefinition, filters: details.filters })
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/timeline', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.timeline({workspaceId: workspaceId, filters: details.filters })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/download/csv', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.table({table: details.table, workspaceId: workspaceId, filters: details.filters })
    const csvData = download(response)
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.status(200).send(csvData);
})

module.exports = router
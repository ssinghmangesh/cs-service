const express = require('express')
const router = express.Router()
const Dashboard = require('../controller/AnalyticsManager/index')
// const { setupWorkspace } = require('../controller/DataManager/Setup')
// const { update } = require("../controller/ShopifyManager/Webhooks/index");
// const {CUSTOMER_TABLE_NAME, ORDER_TABLE_NAME} = require("../controller/DataManager/helper");
// const customerColumns = require("../controller/DataManager/Setup/customerColumns.json");
// const orderColumns = require("../controller/DataManager/Setup/orderColumns.json");
// const productColumns = require("../controller/DataManager/Setup/productColumns.json");

router.post('/analytics-manager/count', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `${details.table}${workspaceId}`
    let response = await Dashboard.count({TABLE_NAME: table, filters: details.filters })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/sum', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `${details.table}${workspaceId}`
    let response = await Dashboard.sum({TABLE_NAME: table, columnname: details.columnname, startdate: details.startdate, enddate: details.enddate})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/line-graph', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `${details.table}${workspaceId}`
    let response = await Dashboard.lineGraph({TABLE_NAME: table, groupBykey: details.groupBykey, startdate: details.startdate, enddate: details.enddate, statsDefinition: details.statsDefinition, prevstartdate: details.prevstartdate, prevenddate: details.prevenddate})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/bar-graph', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `${details.table}${workspaceId}`
    let response = await Dashboard.barGraph({TABLE_NAME: table, columnname: details.columnname, groupBykey: details.groupBykey, groupBykey2: details.groupBykey2, startdate: details.startdate, enddate: details.enddate, statsDefinition: details.statsDefinition, prevstartdate: details.prevstartdate, prevenddate: details.prevenddate})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/pie-chart', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `${details.table}${workspaceId}`
    let response = await Dashboard.pieChart({TABLE_NAME: table, columnname: details.columnname, startdate: details.startdate, enddate: details.enddate, statsDefinition: details.statsDefinition, orderByDirection: details.orderByDirection})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/table-groupby', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `${details.table}${workspaceId}`
    let response = await Dashboard.tableGroupBy({TABLE_NAME: table, groupBykey: details.groupBykey, statsDefinition: details.statsDefinition, limit: details.limit, skipRowby: details.skipRowby})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/table', async (req, res) => {
    const details = req.body
    // console.log(details.filters);
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `${details.table}${workspaceId}`
    let response = await Dashboard.table({TABLE_NAME: table, orderBykey: details.orderBykey, orderByDirection: details.orderByDirection, limit: details.limit, skipRowby: details.skipRowby, filters: details.filters })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/stats', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `${details.table}${workspaceId}`
    let response = await Dashboard.stats({TABLE_NAME: table, limit: details.limit, skipRowby: details.skipRowby, statsDefinition: details.statsDefinition})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/analytics-manager/timeline', async (req, res) => {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await Dashboard.timeline({workspaceId: workspaceId, customerId: details.customerId})
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
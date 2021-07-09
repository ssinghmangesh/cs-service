const express = require('express')
const { fetchNotification, getWorkspace } = require('../controller/NotificationManager/index')
const { addNotificationHelper, fetchNotificationHelper } = require('../controller/NotificationManager/helper')
const { del, insert } = require('../controller/DataManager/index')
const router = express.Router()
const Dashboard = require('../controller/AnalyticsManager/index')

router.post('/notifications/email/insert', async function (req, res) {
    const { 'x-workspace-id': workspaceId, 'x-workspace-name': workspaceName } = req.headers
    let response = await addNotificationHelper(req.body.selected, workspaceId, workspaceName)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/notifications/workspace/fetch', async (req, res) => {
    try{
        const response = await getWorkspace(req.body);
        res.status(200).send(response);
    }catch(err){
        res.sendStatus(500);
    }
})

router.post('/notifications/email/fetch', async function (req, res) {
    const { 'x-workspace-name': workspaceName } = req.headers
    const selected = await fetchNotificationHelper(workspaceName)
    res.status(200).send( { status: true, message: "successful", data: selected } )
})

router.post('/sentEmail/insert', async function (req, res) {
    const { 'x-workspace-id': workspaceId } = req.headers
    const details = req.body
    let response = await addsentEmail(details)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/sentEmail/fetch', async function (req, res) {
    const details = req.body
    // console.log(details.filters);
    const { 'x-workspace-id': workspaceId } = req.headers
    let table = `sentemail${workspaceId}`
    let response = await Dashboard.table({TABLE_NAME: table, orderBykey: details.orderBykey, orderByDirection: details.orderByDirection, limit: details.limit, skipRowby: details.skipRowby, filters: details.filters })
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
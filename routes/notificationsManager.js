const express = require('express')
const { fetchNotification } = require('../controller/NotificationManager/index')
const { addNotificationHelper, fetchNotificationHelper } = require('../controller/NotificationManager/helper')
const router = express.Router()

router.post('/notifications/email/insert', async function (req, res) {
    const { 'x-workspace-id': workspaceId, 'x-workspace-name': workspaceName } = req.headers
    let response = await addNotificationHelper(req.body.selected, workspaceId, workspaceName)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/notifications/email/fetch', async function (req, res) {
    const { 'x-workspace-name': workspaceName } = req.headers
    const selected = await fetchNotificationHelper(workspaceName)
    res.status(200).send( { status: true, message: "successful", data: selected } )
})

module.exports = router
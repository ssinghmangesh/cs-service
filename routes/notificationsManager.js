const express = require('express')
const { fetchNotification } = require('../controller/NotificationManager/index')
const { addNotificationHelper, fetchNotificationHelper } = require('../controller/NotificationManager/helper')
const { del, insert } = require('../controller/DataManager/index')
const { SENTEMAIL_TABLE_NAME } = require('../controller/DataManager/helper')
const sentEmailColumns = require('../controller/DataManager/Setup/sentEmailColumns.json')
const router = express.Router()
const {v4 : uuidv4} = require('uuid')
const Dashboard = require('../controller/AnalyticsManager/index')

router.post('/notifications/email/insert', async function (req, res) {
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await addNotificationHelper(req.body.selected, workspaceId)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/notifications/email/fetch', async function (req, res) {
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await fetchNotification({workspace_id: Number(workspaceId)})
    let selected = []
    if(response) {
        selected = fetchNotificationHelper(response.Item)
    }
    res.status(200).send( { status: true, message: "successful", data: selected } )
})

router.post('/sentEmail/insert', async function (req, res) {
    const { 'x-workspace-id': workspaceId } = req.headers
    const details = req.body
    let emailId = ''
    if(details.emailId) {
        emailId = details.emailId
    } else {
        emailId = uuidv4()
    }
    const data = [{
        email_type: details.emailType,
        sender: details.from,
        receiver: details.to,
        html_body: details.htmlBody,
        subject: details.subject,
        attachments_url: details.attachmentsUrl,
        sent_time: "2021-05-13 11:49:40.765997+05:30",
        email_id: emailId,
        status: details.status
    }]
    if(details.emailId) {
        del(SENTEMAIL_TABLE_NAME, data, workspaceId, 'email_id')
    }
    // console.log(data)
    const response = await insert(SENTEMAIL_TABLE_NAME, sentEmailColumns, data, workspaceId)
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
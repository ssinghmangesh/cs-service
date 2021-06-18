const express = require('express')
const router = express.Router()
const { sendcsv } = require("../controller/MailManager/sendcsv");
const { sendtemplate } = require("../controller/MailManager/sendTemplate");
const { fetchAllTemplates } = require('../controller/TemplateManager/index')

router.post('/export/email/csv', async function (req, res) {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers;
    const table = `${details.table}${workspaceId}`
    let response = await sendcsv({ to: details.to, from: details.from, table: table, workspaceId: workspaceId, text: details.text, filters: details.filters })
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/export/email/template', async function (req, res) {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    const table = `${details.table}${workspaceId}`
    let response = await sendtemplate({ subject: details.subject, table: table, templateId: details.template.template_id, workspaceId: workspaceId, filters: details.filters, html_path: details.template.html_path })
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
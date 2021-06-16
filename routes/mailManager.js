const express = require('express')
const router = express.Router()
const { sendcsv } = require("../controller/MailManager/sendcsv");

router.post('/export/email/csv', async function (req, res) {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers;
    const table = `${details.table}${workspaceId}`
    let response = await sendcsv({ to: details.to, from: details.from, table: table, workspaceId: workspaceId })
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
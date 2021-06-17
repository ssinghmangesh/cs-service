const express = require('express')
const { addTemplate, fetchAllTemplates } = require('../controller/TemplateManager/index')
const { getHtmlCode } = require('../controller/TemplateManager/helper')
const router = express.Router()

router.post('/template/insert', async function (req, res) {
    const details = req.body
    // const { 'x-workspace-id': workspaceId } = req.headers
    const data = {
        template_id: details.templateId,
        workspace_list: details.workspaceList,
        html_path: details.src,
        default_subject: details.subject ? details.subject : "Hello from Custom Segment!"
    }
    let response = await addTemplate(data)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/template/fetch-all', async function (req, res) {
    const details = req.body
    const { 'x-workspace-id': workspaceId } = req.headers
    let response = await fetchAllTemplates(workspaceId)
    // console.log(response)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
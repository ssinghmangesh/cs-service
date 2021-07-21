const express = require('express')
const router = express.Router()
const { updateWorkspace } = require('../controller/UserManager/workspace')

router.post('/mailchimp-manager/workspace/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        mailchimpData: {
            accessToken: req.body.accessToken,
            server: req.body.server
        }
    }
    const response = await updateWorkspace(data, 'mailchimpData')
    res.status(200).send({ status: 200, message: "Added", data: response })
})

router.post('/mailchimp-manager/workspace/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        mailchimpData: {}
    }
    const response = await updateWorkspace(data, 'mailchimpData')
    res.status(200).send({ status: 200, message: "deleted", data: response })
})

module.exports = router
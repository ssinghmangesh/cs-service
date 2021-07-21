const express = require('express')
const router = express.Router()
const { updateWorkspace } = require('../controller/UserManager/workspace')
const { addMailChimpSegmentHelper, fetchMailChimpSegmentHelper } = require('../controller/MailChimpManager/helper')
const { deleteMailChimpSegment, fetchAllMailChimpSegment } = require('../controller/MailChimpManager/index')

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

router.post('/mailchimp-manager/mailchimp/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await addMailChimpSegmentHelper(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "Added", data: response })
})

router.post('/mailchimp-manager/mailchimp/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await deleteMailChimpSegment(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "deleted", data: response })
})

router.post('/mailchimp-manager/mailchimp/fetch', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await fetchMailChimpSegmentHelper(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "fetched", data: response })
})

router.post('/mailchimp-manager/mailchimp/fetch-all', async (req, res) => {
    const response = await fetchAllMailChimpSegment()
    res.status(200).send({ status: 200, message: "fetched", data: response })
})

module.exports = router
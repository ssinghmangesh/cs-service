const express = require('express')
const router = express.Router()
const { updateWorkspace } = require('../controller/UserManager/workspace')

router.post('/klaviyo-manager/workspace/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        klaviyoData: {
            publicKey: req.body.publicKey,
            privateKey: req.body.privateKey
        }
    }
    updateWorkspace(data)
    res.status(200).send({ status: 200, message: "Added" })
})

router.post('/klaviyo-manager/workspace/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        klaviyoData: {}
    }
    updateWorkspace(data)
    res.status(200).send({ status: 200, message: "Added", message: "deleted" })
})

module.exports = router
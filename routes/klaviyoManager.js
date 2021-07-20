const express = require('express')
const router = express.Router()
const { updateWorkspace } = require('../controller/UserManager/workspace')
const { addKlaviyoSegmentHelper, fetchKlaviyoSegmentHelper } = require('../controller/KlaviyoManager/helper')
const { deleteKlaviyoSegment, fetchAllKlaviyoSegment } = require('../controller/KlaviyoManager/index')

router.post('/klaviyo-manager/workspace/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        klaviyoData: {
            publicKey: req.body.publicKey,
            privateKey: req.body.privateKey
        }
    }
    const response = await updateWorkspace(data)
    res.status(200).send({ status: 200, message: "Added", data: response })
})

router.post('/klaviyo-manager/workspace/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        klaviyoData: {}
    }
    const response = await updateWorkspace(data)
    res.status(200).send({ status: 200, message: "deleted", data: response })
})

router.post('/klaviyo-manager/klaviyo/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await addKlaviyoSegmentHelper(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "Added", data: response })
})

router.post('/klaviyo-manager/klaviyo/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await deleteKlaviyoSegment(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "deleted", data: response })
})

router.post('/klaviyo-manager/klaviyo/fetch', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await fetchKlaviyoSegmentHelper(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "fetched", data: response })
})

router.post('/klaviyo-manager/klaviyo/fetch-all', async (req, res) => {
    const response = await fetchAllKlaviyoSegment()
    res.status(200).send({ status: 200, message: "fetched", data: response })
})

// router.post('/klaviyo/sync', async(req, res) => {

// })

module.exports = router
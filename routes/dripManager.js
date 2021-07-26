const express = require('express')
const router = express.Router()
const { updateWorkspace } = require('../controller/UserManager/workspace')
const { deleteDripSegment, fetchAllDripSegment } = require('../controller/DripManager/index')
const { addDripSegmentHelper, fetchDripSegmentHelper } = require('../controller/DripManager/helper')

router.post('/drip-manager/workspace/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        dripData: {
            accessKey: req.body.accessKey,
            url: req.body.url
        }
    }
    const response = await updateWorkspace(data, 'dripData')
    res.status(200).send({ status: 200, message: "Added", data: response })
})

router.post('/drip-manager/workspace/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        dripData: {}
    }
    const response = await updateWorkspace(data, 'dripData')
    res.status(200).send({ status: 200, message: "deleted", data: response })
})

router.post('/drip-manager/drip/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await addDripSegmentHelper(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "Added", data: response })
})

router.post('/drip-manager/drip/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await deleteDripSegment(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "deleted", data: response })
})

router.post('/drip-manager/drip/fetch', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await fetchDripSegmentHelper(req.body, Number(workspaceId))
    res.status(200).send({ status: 200, message: "fetched", data: response })
})

router.post('/drip-manager/drip/fetch-all', async (req, res) => {
    const response = await fetchAllDripSegment()
    res.status(200).send({ status: 200, message: "fetched", data: response })
})

module.exports = router
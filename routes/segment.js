const express = require('express')
const router = express.Router()
const { addSegment, getSegments, deleteSegment } = require('../controller/segment');

router.post('/segment/add', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    const response = await addSegment(workspaceId, req.body)
    res.status(200).send( { status: true, message: "successful" } )
})

router.get('/segment/get', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    const response = await getSegments(workspaceId)
    res.status(200).send( { status: true, message: "successful", segments: response.Items } )
})

router.post('/segment/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    await deleteSegment(workspaceId, req.body.segmentId)
    res.status(200).send( { status: true, message: "successful" } )
})

module.exports = router
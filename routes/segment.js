const express = require('express')
const router = express.Router()
const { addSegment, getSegments, deleteSegment } = require('../controller/segment');

router.post('/segment/add', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    try{
        const response = await addSegment(workspaceId, req.body)
        res.status(200).send( { status: true, message: "successful", segment: response } )
    }catch(err){
        res.status(400).send({status: false, message: 'Not able to add Segment!'})
    }
})

router.get('/segment/get', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    const response = await getSegments(workspaceId)
    res.status(200).send( { status: true, message: "successful", segments: response.Items } )
})

router.post('/segment/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    try{
        const response = await deleteSegment(workspaceId, req.body.segmentId)
        res.status(200).send( { status: true, message: "successful" } )
    }catch(err){
        res.status(400).send({status: false, message: 'Not able to delete Segment!'})
    }
})

module.exports = router
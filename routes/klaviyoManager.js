const express = require('express')
const router = express.Router()
const { updateWorkspace } = require('../controller/UserManager/workspace')
const { addKlaviyoSegmentHelper, fetchKlaviyoSegmentHelper } = require('../controller/KlaviyoManager/helper')
const { deleteKlaviyoSegment, fetchAllKlaviyoSegment } = require('../controller/KlaviyoManager/index')
const { sync } = require('../controller/KlaviyoManager/Klaviyo')
const { verify } = require('../controller/AuthManager/helper')

router.use(async (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    }
    const flag = await verify(req, res);
    if(flag){
        next();
    }else{
        res.sendStatus(403)
    }
})


router.post('/klaviyo-manager/workspace/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        klaviyoData: {
            publicKey: req.body.publicKey,
            privateKey: req.body.privateKey
        }
    }
    const response = await updateWorkspace(data, 'klaviyoData')
    res.status(200).send({ status: 200, message: "Added", data: response })
})

router.post('/klaviyo-manager/workspace/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        klaviyoData: {}
    }
    const response = await updateWorkspace(data, 'klaviyoData')
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

router.post('/klaviyo-manager/sync', async(req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    try{
        await sync(Number(workspaceId), req.body.segment);
        res.sendStatus(200);
    }catch{
        res.sendStatus(500);
    }
})

module.exports = router
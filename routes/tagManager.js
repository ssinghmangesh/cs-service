const express = require('express')
const router = new express.Router()
const { verify } = require('../controller/AuthManager/helper');
const { addTag, getTags, deleteTag, applyTags } = require('../controller/TagManager');

router.use(async (req, res, next) => {
    // console.log(req.path);
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


router.post('/tag-manager/add', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    try{
        const response = await addTag(Number(workspaceId), req.body)
        res.status(200).send( { status: true, message: "successful", tag: response } )
    }catch(err){
        res.status(400).send({status: false, message: 'Not able to add Tag!'})
    }
})

router.post('/tag-manager/get', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    try{
        const response = await getTags(Number(workspaceId), req.body)
        res.status(200).send( { status: true, message: "successful", tags: response } )
    }catch(err){
        res.status(400).send({status: false, message: 'Not able to fetch Tags!'})
    }
})

router.post('/tag-manager/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    try{
        const response = await deleteTag(Number(workspaceId), req.body)
        res.status(200).send( { status: true, message: "successful" } )
    }catch(err){
        res.status(400).send({status: false, message: 'Not able to delete Tag!'})
    }
})

router.post('/tag-manager/apply', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers
    try{
        const response = await applyTags(Number(workspaceId), req.body)
        res.status(200).send( { status: true, message: "successful" } )
    }catch(err){
        console.log(err);
        res.status(400).send({status: false, message: 'Not able to delete Tag!'})
    }
})

module.exports = router
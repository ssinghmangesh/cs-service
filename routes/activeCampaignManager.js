const express = require('express')
const router = express.Router()
const { updateWorkspace } = require('../controller/UserManager/workspace')
const { verify } = require('../controller/AuthManager/helper')

router.use(async (req, res, next) => {
    const flag = await verify(req, res);
    if(flag){
        next();
    }else{
        res.sendStatus(403)
    }
})

router.post('/active-campaign-manager/workspace/insert', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        activeCampaignData: {
            apiUrl: req.body.apiUrl,
            apiKey: req.body.apiKey
        }
    }
    const response = await updateWorkspace(data, 'activeCampaignData')
    res.status(200).send({ status: 200, message: "Added", data: response })
})

router.post('/active-campaign-manager/workspace/delete', async (req, res) => {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const data = {
        workspaceId: Number(workspaceId),
        activeCampaignData: {}
    }
    const response = await updateWorkspace(data, 'activeCampaignData')
    res.status(200).send({ status: 200, message: "deleted", data: response })
})

module.exports = router
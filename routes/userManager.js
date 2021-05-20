const express = require('express')
const { insert, del, fetch, fetchAll } = require('../aws/index.js')
const router = express.Router()

/***** ADD *****/
router.post('/user-manager/user/add', async function (req, res) {
    let { name, email, password } = req.body
    let params = {
        TableName: "User",
        Item: {
            name,
            email,
            password,
            user_id: Date.now()+''
        }
    }
    let response = await insert(params)
    // let response = await insert("User", req.body)
    return res.status(200).send(response)
})

router.post('/user-manager/user-to-workspace/add', async function (req, res) {
    let { user_id, workspace_id } = req.body
    let params = {
        TableName: "UserToWorkspace",
        Item: {
            id: Date.now(),
            user_id,
            workspace_id
        }
    }
    let response = await insert(params)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/add', async function (req, res) {
    let { workspace_name } = req.body
    let params = {
        TableName: "Workspace",
        Item: {
            workspace_id: Date.now(),
            workspace_name
        }
    }
    let response = await insert(params)
    res.status(200).send(response)
})

/***** DELETE *****/
router.post('/user-manager/user/delete', async function (req, res) {
    // console.log(req.body)
    let { user_id } = req.body
    let params = {
        TableName: "User",
        Key: {
            user_id
        }
    }
    console.log(params)
    let response = await del(params)
    // let response = await del("User", req.body)
    res.status(200).send(response)
})

router.post('/user-manager/user-to-workspace/delete', async function (req, res) {
    let { id } = req.body
    let params = {
        TableName: "UserToWorkspace",
        Key: {
            id
        }
    }
    console.log(params)
    let response = await del(params)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/delete', async function (req, res) {
    let { workspace_id } = req.body
    let params = {
        TableName: "Workspace",
        Key: {
            workspace_id
        }
    }
    console.log(params)
    let response = await del(params)
    res.status(200).send(response)
})

/***** FETCH *****/
router.post('/user-manager/user/fetch', async function (req, res) {
    let { user_id, name, email, password } = req.body
    let params = {
        TableName: "User",
        Item: {
            user_id,
            name,
            email,
            password
        }
    }
    console.log(params)
    let response = await fetch(params)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/fetch', async function (req, res) {
    let { workspace_id, workspace_name } = req.body
    let params = {
        TableName: "Workspace",
        Item: {
            workspace_id,
            workspace_name
        }
    }
    console.log(params)
    let response = await fetch(params)
    res.status(200).send(response)
})

/***** FETCHALL *****/
router.post('/user-manager/user/fetchAll',async  function (req, res) {
    let params = {
        TableName: "User"
    }
    console.log(params)
    let response = await fetchAll(params)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/fetchAll',async  function (req, res) {
    let params = {
        TableName: "Workspace",
        Key: {
            workspace_id
        }
    }
    console.log(params)
    let response = await fetchAll(params)
    res.status(200).send(response)
})

module.exports = router
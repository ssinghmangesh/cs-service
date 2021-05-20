const express = require('express')
// const { insert, del } = require('../aws/index.js')
const { insert } = require('../aws/insert.js')
const { del } = require('../aws/del.js')
const router = express.Router()


router.post('/user-manager/user/add', async function (req, res) {
    // let { name, email, password } = req.body
    // let params = {
    //     TableName: "User",
    //     Item: {
    //         name,
    //         email,
    //         password,
    //         user_id: Date.now()+''
    //     }
    // }
    // let response = await insert(params)
    let response = await insert("User", req.body)
    return res.status(200).send(response)
})

router.post('/user-manager/user-to-workspace/add', async function (req, res) {
    res.status(200).send("/user-manager/")
})

router.post('/user-manager/workspace/add', function (req, res) {
    res.status(200).send("/user-manager/login")
})

router.post('/user-manager/user/delete', async function (req, res) {
    // console.log(req.body)
    // let { user_id } = req.body
    // let params = {
    //     TableName: "User",
    //     Key: {
    //         user_id
    //     }
    // }
    // console.log(params)
    // let response = await del(params)
    let response = await del("User", req.body)
    res.status(200).send(response)
})

router.post('/user-manager/user-to-workspace/delete', function (req, res) {
    res.status(200).send("/user-manager/refresh-token")
})

router.post('/user-manager/workspace/delete', function (req, res) {
    res.status(200).send("/user-manager/refresh-token")
})

module.exports = router
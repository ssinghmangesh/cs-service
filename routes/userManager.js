const express = require('express')
const { insert } = require('../aws/index.js')
const router = express.Router()


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
    return res.status(200).send(response)
})

router.get('/user-manager/update', function (req, res) {
    res.status(200).send("/user-manager/update")
})

router.get('/user-manager/login', function (req, res) {
    res.status(200).send("/user-manager/login")
})

router.get('/user-manager/refresh-token', function (req, res) {
    res.status(200).send("/user-manager/refresh-token")
})

module.exports = router
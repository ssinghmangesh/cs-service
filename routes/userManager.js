const express = require('express')
const router = express.Router()


router.get('/user-manager/create', function (req, res) {
    res.status(200).send("/user-manager/create")
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
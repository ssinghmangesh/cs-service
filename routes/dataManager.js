const express = require('express')
const router = express.Router()


router.post('/data-manager/customer/add', function (req, res) {
    const { } = req.body
    res.status(200).send("/user-manager/create")
})

router.get('/data-manager/order/add', function (req, res) {
    res.status(200).send("/user-manager/update")
})

router.get('/data-manager/product/add', function (req, res) {
    res.status(200).send("/user-manager/login")
})

router.get('/data-manager/cart/add', function (req, res) {
    res.status(200).send("/user-manager/refresh-token")
})

router.get('/data-manager/checkout/add', function (req, res) {
    res.status(200).send("/user-manager/refresh-token")
})
router.get('/data-manager/cart/delete', function (req, res) {
    res.status(200).send("/user-manager/refresh-token")
})

router.get('/data-manager/checkout/delete', function (req, res) {
    res.status(200).send("/user-manager/refresh-token")
})

module.exports = router
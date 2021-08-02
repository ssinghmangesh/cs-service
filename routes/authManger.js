const express = require('express')
const router = express.Router()
const nonce = require('nonce')();
const axios = require("axios");
const { updateUser, fetchUser, addUser } = require("../controller/UserManager/index");
const { register, login, logout } = require('../controller/AuthManager');
const { refresh, verifyEmail } = require('../controller/AuthManager/helper');

router.post('/auth-manager/check-for-register', async (req, res) => {
    register(req, res);
    //step 1: check if the email of user already exists
    //login
    //step 2: check if the workspace already exists
    // 
    // res.redirect()
})

router.post('/auth-manager/user/add', async (req, res) => {
    const { email, password, firstName, lasttName } = req.body 

    //addUser

    res.status(200).send(response)
})

router.post('/auth-manager/workspace/add', async (req, res) => {
    const { workspaceName, userId, accesstoken } = req.body 

    //addWorkSpace
    //userToWorkspace
    
    res.status(200).send(response)
})

router.post('/auth-manager/set-password', async (req, res) => {
    const { userId, password } = req.body
    const data = {
        Key:{
            "user_id": userId
        },
        UpdateExpression: "set password = :password",
        ExpressionAttributeValues:{
            ":password": password
        }
    }
    res.status(200).send();
})

router.post('/auth-manager/login', async (req, res) => {
    login(req, res);
})

router.post('/refresh', async (req, res) => {
    refresh(req, res);
})

router.post('/auth-manager/verify', async (req, res) => {
    const response = verifyEmail(req)
    if(response){
        res.status(200).send(response)
    }else{
        res.sendStatus(400)
    }
})

router.post('/auth-manager/logout', async (req, res) => {
    logout(req, res);
})

module.exports = router
const express = require('express')
const router = express.Router()
const nonce = require('nonce')();
const axios = require("axios");
const { updateUser, fetchUser, addUser } = require("../controller/UserManager/index")

router.post('/auth-manager/check-for-register', async (req, res) => {
    const { userId, password } = req.body 
    // return res.status(200).send(`http://localhost:3000/install?shop=${shopName}`);
    const fetchedUser = await fetchUser({ user_id: userId })
    if(Object.keys(fetchedUser).length !== 0){
        res.status(400).send('email already exists!');
    } else {
        const user = {
            user_id: userId,
            password: password,
            created_at: Date.now(),
            updated_at: Date.now()
        }
        await addUser(user);
        res.status(200).send('User Registered');
    }
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
            ":password": password,
        }
    }
    await updateUser(data);
    res.status(200).send();
})

router.post('/auth-manager/login', async (req, res) => {
    const { userId, password } = req.body
    const data = {
        "user_id": userId
    }
    const { Item: user } = await fetchUser(data);
    if(!user) {
        res.status(404).send('Email not Found')
        return;
    }
    if (user.password === password){
        delete user.password
        res.status(200).send(user);
    } else {
        res.status(403).send('Incorrect Password');
    }
})

module.exports = router
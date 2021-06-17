const express = require('express')
const router = express.Router()
const nonce = require('nonce')();
const axios = require("axios");
const { updateUser, fetchUser, addUser } = require("../controller/UserManager/index")

const shopifyApiPublicKey = 'eb6b044f4a8cf434a8100f85cac58205';
const shopifyApiSecretKey = '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';
const scopes = 'read_products, read_product_listings, read_customers, read_orders, read_script_tags, write_script_tags, read_checkouts, read_draft_orders, read_price_rules, read_fulfillments, read_assigned_fulfillment_orders, read_content'

const buildInstallUrl = (shop, state, redirectUri) => `https://${shop}/admin/oauth/authorize?client_id=${shopifyApiPublicKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;


router.post('/auth-manager/check-for-register', async (req, res) => {
    const { userId, password, shopName } = req.body 
    const fetchedUser = await fetchUser({ user_id: userId })
    if(Object.keys(fetchedUser).length !== 0){
        if(!fetchedUser.Item.password) {
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
            res.status(200).send('user created');
        } else {
            res.status(200).send('email already exists!');
        }
    } else {
        const user = {
            user_id: userId,
            password: password,
            created_at: Date.now(),
            updated_at: Date.now()
        }
        await addUser(user);
        
        const state = nonce();  
        const installShopUrl = buildInstallUrl(shopName, state, 'http://localhost:3000/callback')
        // console.log(await axios.get(installShopUrl))
        res.status(200).send(installShopUrl);
        // res.redirect('/install?shop='+shopName);
    }
    //step 1: check if the email of user already exists
    //login
    //step 2: check if the workspace already exists
    // 
    // res.redirect()

    return {
        alreadyExists: {
            user: true,
            workspace: true 
        }
    }
    
    res.status(200).send(response)
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
    if (user.password === password){
        delete user.password
        res.status(200).send(user);
    } else {
        res.status(403).send();
    }
})

module.exports = router
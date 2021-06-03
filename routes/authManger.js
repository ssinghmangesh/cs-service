const express = require('express')
const router = express.Router()

router.post('/auth-manager/check-for-register', async (req, res) => {
    const { email, password, workspaceName } = req.body 
    //step 1: check if the email of user already exists
    //step 2: check if the workspace already exists



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


module.exports = router
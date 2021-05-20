const express = require('express')
const {
    createUser, 
    createWorkspace, 
    createUserToWorkspce,

    addUser,
    addWorkspace,
    addUserToWorkspace,


    deleteUser,
    deleteWorkspace,
    deleteUserToWorkspace,

    fetchUser, 
    fetchWorkspace,
    fetchAllUsers,   //params workspaceid
    fetchAllWorkspaces //parms user id 
} = require('../controller/UserManager/index.js')

const router = express.Router()

/***** ADD *****/
router.post('/user-manager/user/add', async function (req, res) {
    let response = await addUser(params)
    // let response = await insert("User", req.body)
    return res.status(200).send(response)
})

router.post('/user-manager/user-to-workspace/add', async function (req, res) {
    let response = await addUserToWorkspace(params)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/add', function (req, res) {
    let response = await addWorkspace(params)
    res.status(200).send(response)
})

/***** DELETE *****/
router.post('/user-manager/user/delete', async function (req, res) {
    let response = await deleteUser(params)
    res.status(200).send(response)
})

router.post('/user-manager/user-to-workspace/delete', function (req, res) {
    let response = await deleteUserToWorkspace(params)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/delete', function (req, res) {
    let response = await deleteWorkspace(params)
    res.status(200).send(response)
})

/***** FETCH *****/
router.post('/user-manager/user/fetch', function (req, res) {
    let response = await fetchUser(params)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/fetch', function (req, res) {
    let response = await fetchWorkspace(params)
    res.status(200).send(response)
})

/***** FETCHALL *****/
router.post('/user-manager/user/fetchAll', function (req, res) {
    let response = await fetchAllUsers(params)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/fetchAll', function (req, res) {
    let response = await fetchAllWorkspaces(params)
    res.status(200).send(response)
})

module.exports = router
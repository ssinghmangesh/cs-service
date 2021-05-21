const express = require('express')
const {
    // createUser, 
    // createWorkspace, 
    // createUserToWorkspce,

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
    let response = await addUser(req.body)
    // let response = await insert("User", req.body)
    return res.status(200).send(response)
})

router.post('/user-manager/user-to-workspace/add', async function (req, res) {
    let response = await addUserToWorkspace(req.body)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/add', async function (req, res) {
    let response = await addWorkspace(req.body)
    res.status(200).send(response)
})

/***** DELETE *****/
router.post('/user-manager/user/delete', async function (req, res) {
    let response = await deleteUser(req.body)
    res.status(200).send(response)
})

router.post('/user-manager/user-to-workspace/delete', async function (req, res) {
    let response = await deleteUserToWorkspace(req.body)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/delete', async function (req, res) {
    let response = await deleteWorkspace(req.body)
    res.status(200).send(response)
})

/***** FETCH *****/
router.post('/user-manager/user/fetch', async function (req, res) {
    let response = await fetchUser(req.body)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/fetch', async function (req, res) {
    let response = await fetchWorkspace(req.body)
    res.status(200).send(response)
})

/***** FETCH-ALL *****/
router.post('/user-manager/user/fetchAll', async function (req, res) {
    let response = await fetchAllUsers(req.body)
    res.status(200).send(response)
})

router.post('/user-manager/workspace/fetchAll', async function (req, res) {
    let response = await fetchAllWorkspaces(req.body)
    res.status(200).send(response)
})

module.exports = router
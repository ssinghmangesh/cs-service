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
    fetchAllWorkspaces, //parms user id 
    fetchAllUserToWorkspaces
} = require('../controller/UserManager/index.js')
const { editUser } = require('../controller/UserManager/helper')
const Multer = require('multer');
const upload = require('../aws/upload');

const router = express.Router()

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
  });

/***** ADD *****/
router.post('/user-manager/user/add', async function (req, res) {
    let response = await addUser(req.body)
    // let response = await insert("User", req.body)
    return res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/user-manager/user-to-workspace/add', async function (req, res) {
    let response = await addUserToWorkspace(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/user-manager/workspace/add', async function (req, res) {
    let response = await addWorkspace(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

/***** DELETE *****/
router.post('/user-manager/user/delete', async function (req, res) {
    let response = await deleteUser(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/user-manager/user-to-workspace/delete', async function (req, res) {
    let response = await deleteUserToWorkspace(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/user-manager/workspace/delete', async function (req, res) {
    let response = await deleteWorkspace(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

/***** FETCH *****/
router.post('/user-manager/user/fetch', async function (req, res) {
    let { Item: user } = await fetchUser(req.body)
    delete user.password
    res.status(200).send( { status: true, message: "successful", data: user } )
})

router.post('/user-manager/workspace/fetch', async function (req, res) {
    let response = await fetchWorkspace(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

/***** FETCH-ALL *****/
router.post('/user-manager/user/fetch-all', async function (req, res) {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const users = []
    const { Items } = await fetchAllUserToWorkspaces(workspaceId);
    for( const item of Items ){
        const { Item: user } = await fetchUser({ user_id: item.user_id })
        delete user.password;
        users.push(user);
    }
    res.status(200).send( { status: true, message: "successful", data: users} )
})

router.post('/user-manager/user/edit', multer.single('file'), async function (req, res) {
    // let response = await fetchAllWorkspaces(req.body)
    // console.log(req.file, req.body)
    console.log(req.file);
    const response = await editUser(req.file, req.body)
    console.log(response);

    res.status(200).send( { status: true, message: "successful"} )
})

router.post('/user-manager/workspace/fetchAll', async function (req, res) {
    let response = await fetchAllWorkspaces(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
const express = require('express')
const { sendMail } = require('../controller/MailManager/index');
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
    fetchAllUserToWorkspaces,
    getUserToWorkspace,

} = require('../controller/UserManager/index.js')
const { editUser, getAllWorkspaces, getAllUserToWorkspaces, setCurrentWorkspace } = require('../controller/UserManager/helper')
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
    let response = await fetchUser({ user_id: req.body.user_id })
    const flag = (response.Item && response.Item.password) ? true : false
    if(!response.Item){
        response = await addUser({user_id: req.body.user_id, status: 'pending', created_at: Date.now(), updated_at: Date.now()})
    }
    response = await addUserToWorkspace({workspace_id: req.body.workspace_id, user_id: req.body.user_id, company: req.body.company, role: req.body.role})
    if(!flag){
        sendMail({ from: 'lionelthegoatmessi@gmail.com', to: req.body.user_id, subject: 'Set Password for Custom Segment' ,html: '<p>Click <a href="https://app.customsegment.com/pages/authentication/reset-password-v1?user_id=' + encodeURIComponent(req.body.user_id) + '">here</a> to set your password</p>'})
    }
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
    const { 'x-workspace-id': workspaceId } = req.headers;
    let { Item: user } = await fetchUser(req.body)
    delete user.password
    const { Item } = await getUserToWorkspace(Number(workspaceId), user.user_id)
    res.status(200).send( { status: true, message: "successful", data: { ...user, ...Item } } )
})

router.post('/user-manager/workspace/current', async (req, res) => {
    try {
        const response = await setCurrentWorkspace(req.body);
        res.status(200).send('current workspace changed')
    } catch {
        res.status(500).send("Something went wrong!")
    }
})

router.post('/user-manager/workspace/fetch', async function (req, res) {
    const { 'x-workspace-id': workspaceId } = req.headers;
    let response = await fetchWorkspace({ workspace_id: Number(workspaceId) })
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/user-manager/workspace/fetch-all', async function (req, res) {
    let response = await getAllWorkspaces(req.body)
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
        users.push({ ...user, ...item });
    }
    res.status(200).send( { status: true, message: "successful", data: users} )
})

router.post('/user-manager/user/edit', multer.single('file'), async function (req, res) {
    const { 'x-workspace-id': workspaceId } = req.headers;
    const response = await editUser(req.file, req.body, workspaceId)
    res.status(200).send( { status: true, message: "successful"} )
})

router.post('/user-manager/user-to-workspace/fetch-all', async function (req, res) {
    const response = await getAllUserToWorkspaces(req.body.userId)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

module.exports = router
const express = require('express')
const { sendMail } = require('../controller/MailManager/index');
const {
    // createUser, 
    // createWorkspace, 
    // createUserToWorkspce,

    addUser,
    addWorkspace,
    addUserToWorkspace,

    updateWorkspace,

    deleteUser,
    deleteWorkspace,
    deleteUserToWorkspace,

    fetchUser, 
    fetchWorkspace,
    fetchAllUsers,   //params workspaceid
    fetchAllWorkspaces, //parms user id 
    fetchAllUserToWorkspaces,
    getUserToWorkspace,
    updateUserToWorkpace,

} = require('../controller/UserManager/index.js')
const { editUser, getAllWorkspaces, getAllUserToWorkspaces, setCurrentWorkspace, PermissionsDataConverter } = require('../controller/UserManager/helper')
const nodemailer = require('nodemailer')
const Multer = require('multer');
const CryptoJS = require("crypto-js");
const upload = require('../aws/upload');

const router = express.Router()

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
  });


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'customsegment@gmail.com',
        pass: 'cs#@123456'
    }
});

/***** ADD *****/
router.post('/user-manager/user/add', async function (req, res) {
    try{

        let response = await getUserToWorkspace(req.body.workspace_id, req.body.user_id);
        // console.log(response);
        if(response.Item && response.Item.status !== 'pending'){
            return res.status(400).send({message: 'User already exists'});
        }
        response = await fetchUser({ user_id: req.body.user_id })
        // const flag = (response.Item) ? true : false
        if(!response.Item){
            response = await addUser({user_id: req.body.user_id, status: 'pending', created_at: Date.now(), updated_at: Date.now()})
        }
        response = await addUserToWorkspace({workspace_id: req.body.workspace_id, user_id: req.body.user_id, company: req.body.company, role: req.body.role, status: 'pending'})
        const code = CryptoJS.AES.encrypt(JSON.stringify({ workspaceId: req.body.workspace_id, userId: req.body.user_id }), 'password').toString();
        // console.log(code);
        const mailOptions = {
            from: 'customsegment@gmai.com',
            to: req.body.user_id,
            subject: 'Invitation',
            html: '<p>You have been invited to custom segment. Click <a href="http://localhost:8080/join?code='+encodeURIComponent(code)+'">here</a> to accept invitation</p>'
        }
        await transporter.sendMail(mailOptions);
        return res.status(200).send( { status: true, message: "successful", data: response } )
    }catch(err){
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error'})
    }
})

router.post('/user-manager/user-to-workspace/add', async function (req, res) {
    let response = await addUserToWorkspace(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/user-manager/workspace/add', async function (req, res) {
    let response = await addWorkspace(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/user-manager/workspace/permissions/add', async function (req, res) {
    const { 'x-workspace-id': workspaceId } = req.headers
    const data = {
        workspaceId: Number(workspaceId),
        userPermissions: PermissionsDataConverter(req.body.userPermissions)
    }
    const response = await updateWorkspace(data, 'userPermissions')
    res.status(200).send( { status: true, message: "successful", data: response } )
})

/***** DELETE *****/
router.post('/user-manager/user/delete', async function (req, res) {
    let response = await deleteUser(req.body)
    res.status(200).send( { status: true, message: "successful", data: response } )
})

router.post('/user-manager/user-to-workspace/delete', async function (req, res) {
    console.log(req.body.workspaceId, req.body.userId);
    let response = await deleteUserToWorkspace(req.body.workspaceId, req.body.userId)
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

router.post('/user-manager/decrypt', async (req, res) => {
    try{
        const { code } = req.body;
        var bytes  = CryptoJS.AES.decrypt(code, 'password');
        // console.log(bytes.toString(CryptoJS.enc.Utf8));
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));  
        // console.log(decryptedData);
        const data = { ...decryptedData }
        let user = await fetchUser({ user_id: decryptedData.userId });
        if(user.Item && user.Item.status !== 'pending'){
            data.userExists = true;
        }
        let workspace = await fetchWorkspace({ workspace_id: decryptedData.workspaceId });
        data.shopName = workspace.Item.shop_name; 
        res.status(200).send(data);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/user-manager/user-to-workspace/activate', async function (req, res) {
    const data = {
        Key:{
            "user_id": req.body.userId,
            "workspace_id": req.body.workspaceId
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":status": "active"
        }
    }
    let response = await updateUserToWorkpace(data);
    res.status(200).send( { status: true, message: "successful" } )
})

module.exports = router
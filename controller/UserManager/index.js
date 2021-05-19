const { addUser, deleteUser } = require("./user")
const { addWorkspace, deleteWorkspace } = require("./workspace")
const { addUserToWorkspace, deleteUserToWorkspace } = require("./userToWorkspace");

module.exports = {
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
    fetchAllUser,   //params workspaceid
    fetchAllWorkspace //parms user id 
}
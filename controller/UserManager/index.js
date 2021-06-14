const { addUser, deleteUser, fetchUser, fetchAllUsers, updateUser } = require("./user")
const { addWorkspace, deleteWorkspace, fetchWorkspace, fetchAllWorkspaces } = require("./workspace")
const { addUserToWorkspace, deleteUserToWorkspace } = require("./userToWorkspace");

module.exports = {
    // createUser, 
    // createWorkspace, 
    // createUserToWorkspce,

    addUser,
    addWorkspace,
    addUserToWorkspace,
    updateUser,


    deleteUser,
    deleteWorkspace,
    deleteUserToWorkspace,

    fetchUser, 
    fetchWorkspace,
    fetchAllUsers,   //params workspaceid
    fetchAllWorkspaces //parms user id 
}
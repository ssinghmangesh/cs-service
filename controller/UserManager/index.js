const { addUser, deleteUser, fetchUser, fetchAllUsers, updateUser } = require("./user")
const { addWorkspace, deleteWorkspace, fetchWorkspace, fetchAllWorkspaces, updateWorkspace } = require("./workspace")
const { addUserToWorkspace, updateUserToWorkpace, deleteUserToWorkspace, getUserToWorkspace, fetchAllUserToWorkspaces } = require("./userToWorkspace");

module.exports = {
    // createUser, 
    // createWorkspace, 
    // createUserToWorkspce,

    addUser,
    addWorkspace,
    addUserToWorkspace,

    updateUser,
    updateUserToWorkpace,
    updateWorkspace,

    deleteUser,
    deleteWorkspace,
    deleteUserToWorkspace,

    fetchUser, 
    fetchWorkspace,
    fetchAllUsers,   //params workspaceid
    fetchAllWorkspaces, //parms user id 
    fetchAllUserToWorkspaces,
    getUserToWorkspace
}
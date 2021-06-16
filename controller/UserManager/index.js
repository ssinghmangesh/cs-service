const { addUser, deleteUser, fetchUser, fetchAllUsers, updateUser } = require("./user")
const { addWorkspace, deleteWorkspace, fetchWorkspace, fetchAllWorkspaces } = require("./workspace")
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
const { insert, del, fetchAll, fetch, update } = require("../../aws/index");

const addUserToWorkspace = async (data) => {
    const params = {
            TableName: "UserToWorkspace",
            Item:{
                ...data
            }
    }
    await insert(params);
}

// data = {
//     id: 6,
//     userId: "3",
//     workspaceId: "1"
// }

// addUserToWorkspace(data);

const deleteUserToWorkspace = async (workspaceId, userId) => {
    var params = {
            TableName: 'UserToWorkspace',
            Key:{
                "workspace_id": workspaceId,
                "user_id": userId
            }
        }
    await del(params)
}

const getUserToWorkspace = async (workspaceId, userId) => {
    var params = {
            TableName: 'UserToWorkspace',
            Key:{
                "workspace_id": workspaceId,
                "user_id": userId
            }
        }
    return await fetch(params);
}

const updateUserToWorkpace = async (val) => {
    const params = {
        TableName: 'UserToWorkspace',
        ...val,
    }
    return await update(params);
}

const fetchAllUserToWorkspaces = async (workspaceId) => {
    const params = {
        TableName: "UserToWorkspace",
        FilterExpression: "workspace_id = :workspaceId",
        ExpressionAttributeValues: { ":workspaceId": Number(workspaceId) }
    }
    // console.log(params);
    return await fetchAll(params)
}

module.exports = {
    addUserToWorkspace,
    deleteUserToWorkspace,
    getUserToWorkspace,
    fetchAllUserToWorkspaces,
    updateUserToWorkpace,
}
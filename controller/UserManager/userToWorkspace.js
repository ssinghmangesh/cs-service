const { insert, del, fetchAll } = require("../../aws/index");

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

const deleteUserToWorkspace = async (data) => {
    var params = {
            TableName: 'User',
            Key:{
                "id": data.id
            }
        }
    await del(params)
}

// const getUserToWorkspace = async (data) => {
//     var params = {
//             TableName: 'UserToWorkspace',
//             Key:{
//                 "id": data.id
//             }
//         }
//     await fetch(params);
// }

const fetchAllUserToWorkspaces = async (workspaceId) => {
    const params = {
        TableName: "UserToWorkspace",
        FilterExpression: "workspace_id = :workspaceId",
        ExpressionAttributeValues: { ":workspaceId": Number(workspaceId) }
    }
    return await fetchAll(params)
}

module.exports = {
    addUserToWorkspace,
    deleteUserToWorkspace,
    fetchAllUserToWorkspaces
    // getUserToWorkspace
}
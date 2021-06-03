const { insert, del } = require("../../aws/index");

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

module.exports = {
    addUserToWorkspace,
    deleteUserToWorkspace,
    // getUserToWorkspace
}
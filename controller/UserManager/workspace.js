const { insert, del } = require("../../aws/index");

const addWorkspace = async (data) => {
    const params = {
            TableName: "Workspace",
            Item:{
                "workspace_id": data.workspaceId,
                "workspace_name": data.workspaceName
            }
    }
    await insert(params);
}

// data = {
//     workspaceId: "3",
//     workspaceName: "ebay"
// }

// addWorkspace(data);

const deleteWorkspace = async (data) => {
    var params = {
            TableName: 'Workspace',
            Key:{
                "workspace_id": data.workspaceId
            }
        }
    await del(params)
}



module.exports = {
    addWorkspace,
    deleteWorkspace
}
const { insert, del, fetch, fetchAll } = require("../../aws/index");

const addWorkspace = async (data) => {
    const params = {
            TableName: "Workspace",
            Item:{
                "workspace_id": data.workspaceId,
                "workspace_name": data.workspaceName
            }
    }
    return await insert(params);
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
    return await del(params)
}

const fetchWorkspace = async (data) => {
    var params = {
            TableName: 'Workspace',
            Key:{
                "workspace_id": data.id
            }
        }
    return await fetch(params);
}

const fetchAllWorkspaces = async (data) => {
    const params = {
        TableName: "Workspace"
    }
    return await fetchAll(params)
}


module.exports = {
    addWorkspace,
    deleteWorkspace,
    fetchWorkspace,
    fetchAllWorkspaces
}
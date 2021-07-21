const { insert, del, fetch, fetchAll, update } = require("../../aws/index");

const addWorkspace = async (data) => {
    const params = {
            TableName: "Workspace",
            Item:{
                ...data
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

const updateWorkspace = async (data, columnName) => {
    var params = {
            TableName:'Workspace',
            Key:{
                "workspace_id": data.workspaceId
            },
            UpdateExpression: "set ",
            ExpressionAttributeValues: {
            }
        }
    if(columnName === 'klaviyoData') {
        params.UpdateExpression += 'klaviyoData = :klaviyoData'
        params.ExpressionAttributeValues = { ":klaviyoData": data.klaviyoData }
    }
    if(columnName === 'mailchimpData') {
        params.UpdateExpression += 'mailchimpData = :mailchimpData'
        params.ExpressionAttributeValues = { ":mailchimpData": data.mailchimpData }
    }
    if(columnName === 'activeCampaignData') {
        params.UpdateExpression += 'activeCampaignData = :activeCampaignData'
        params.ExpressionAttributeValues = { ":activeCampaignData": data.activeCampaignData }
    }
    return await update(params)
}

const fetchWorkspace = async (data) => {
    var params = {
        TableName: 'Workspace',
        Key: {
            ...data
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
    updateWorkspace,
    fetchWorkspace,
    fetchAllWorkspaces
}
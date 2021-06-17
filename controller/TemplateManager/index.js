const { insert, del, fetch, fetchAll, update } = require("../../aws/index");

const addTemplate = async (data) => {
    const params = {
        TableName: "EmailTemplate",
        Item:{
            ...data
        }
    }
    return await insert(params);
}

const updateTemplate = async (data) => {
    const params = {
        TableName: 'EmailTemplate',
        ...data,
    }
    return await update(params);
}

const deleteTemplate = async (data) => {
    var params = {
        TableName: 'EmailTemplate',
        Key:{
            "workspace_id": data.workspaceId
        }
    }
    return await del(params)
}

const fetchTemplate = async (data) => {
    var params = {
        TableName: 'EmailTemplate',
        Key: {
            ...data
        }
    }
    return await fetch(params)
}

const fetchAllTemplates = async (workspaceId) => {
    const params = {
        TableName: "EmailTemplate",
        FilterExpression: "contains (#workspaceList, :workspaceId)",
        ExpressionAttributeNames: {
            "#workspaceList": "workspace_list",
        },
        ExpressionAttributeValues: {
            ":workspaceId": Number(workspaceId)
        }
    }
    let response = await fetchAll(params)
    return response.Items
    // console.log('#', response)
    // if(response.Items.length) {
    //     let i = 0
    //     for(; i < response.Items.length; i++) {
    //         if(templateId === response.Items[i].template_id) {
    //             break;
    //         }
    //     }
    //     return response.Items[i]
    // }
    // return await fetchTemplate({templateId: templateId})
}

module.exports = {
    addTemplate,
    updateTemplate,
    deleteTemplate,
    fetchTemplate,
    fetchAllTemplates,
}
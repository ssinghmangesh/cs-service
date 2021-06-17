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
        TableName: "EmailTemplate"
    }
    let response = await fetchAll(params)

    const templates = []
    response.Items.forEach((template) => {
        if(template.workspace_list) {
            if(template.workspace_list.includes(Number(workspaceId))) {
                templates.push(template)
            }
        } else {
            templates.push(template)
        }
    })
    return templates
}

module.exports = {
    addTemplate,
    updateTemplate,
    deleteTemplate,
    fetchTemplate,
    fetchAllTemplates,
}
const { insert, del, fetch, fetchAll, update } = require("../../aws/index");

const addNotification = async (data) => {
    const params = {
        TableName: "Notification",
        Item:{
            ...data
        }
    }
    return await insert(params);
}

const updateNotification = async (data, workspaceId) => {
    // console.log(workspaceId, data.notificationType);
    var params = {
        TableName:'Notification',
        Key:{
            "workspaceId": workspaceId,
            "notificationType": data.notificationType
        },
        UpdateExpression: "set",
    };
    if(data.value !== undefined){
        params.UpdateExpression += ' #value = :value'
        params.ExpressionAttributeNames = { ...params.ExpressionAttributeNames, "#value": 'value' }
        params.ExpressionAttributeValues = { ...params.ExpressionAttributeValues, ":value": data.value }
    }
    if(data.templateId !== undefined){
        params.UpdateExpression += ' templateId = :templateId'
        params.ExpressionAttributeValues = { ...params.ExpressionAttributeValues, ":templateId": data.templateId }
    }
    return await update(params);
}

const deleteNotification = async (data) => {
    var params = {
        TableName: 'Notification',
        Key:{
            "workspace_id": data.workspaceId
        }
    }
    return await del(params)
}

const fetchNotification = async (data) => {
    var params = {
        TableName: 'Notification',
        Key: {
            ...data
        }
    }
    return await fetch(params)
}

const fetchAllNotifications = async (workspaceId) => {
    const params = {
        TableName: "Notification"
    }
    return await fetchAll(params)
}

module.exports = {
    addNotification,
    updateNotification,
    deleteNotification,
    fetchNotification,
    fetchAllNotifications,
}
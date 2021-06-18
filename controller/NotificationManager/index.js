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

const updateNotification = async (data) => {
    const params = {
        TableName: 'Notification',
        ...data,
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
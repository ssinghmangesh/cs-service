const { addNotification, updateNotification } = require('./index')
const { query } = require('../../aws/index');

const addNotificationHelper = async (data, workspaceId, workspaceName) => {
    for(let item of data){
        await updateNotification(item, Number(workspaceId), workspaceName);
    }
}

const fetchNotificationHelper = async (workspaceName) => {
    const params = {
        TableName:'Notification',
        KeyConditionExpression: "workspaceName = :workspaceName",
        ExpressionAttributeValues: {
            ":workspaceName": workspaceName
        }
    };
    const res = await query(params);
    let selected = []
    res.Items.forEach((item) => {
        if(item.value) selected.push(item.notificationType)
    })
    return selected
}

module.exports = {
    addNotificationHelper,
    fetchNotificationHelper,
}
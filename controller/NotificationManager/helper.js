const { addNotification, updateNotification } = require('./index')
const { query } = require('../../aws/index');

const addNotificationHelper = async (data, workspaceId) => {
    console.log(data);
    for(let item of data){
        await updateNotification(item, Number(workspaceId));
    }
}

const fetchNotificationHelper = async (workspaceId) => {
    const params = {
        TableName:'Notification',
        KeyConditionExpression: "workspaceId = :workspaceId",
        ExpressionAttributeValues: {
            ":workspaceId": workspaceId
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
    fetchNotificationHelper
}
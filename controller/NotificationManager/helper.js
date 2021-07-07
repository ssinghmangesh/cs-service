const { addNotification, updateNotification } = require('./index')
const { query } = require('../../aws/index');
const { SENTEMAIL_TABLE_NAME } = require('../DataManager/helper')
const sentEmailColumns = require('../DataManager/Setup/sentEmailColumns.json')
const { del, insert } = require('../DataManager/index')

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

const addsentEmail = async (details, workspaceId) => {
    // console.log('inside addsentEmail')
    await del(SENTEMAIL_TABLE_NAME, [details], workspaceId, 'email_id')
    // console.log(details)
    const response = await insert(SENTEMAIL_TABLE_NAME, sentEmailColumns, [details], workspaceId)
    return response
}

module.exports = {
    addNotificationHelper,
    fetchNotificationHelper,
    addsentEmail,
}
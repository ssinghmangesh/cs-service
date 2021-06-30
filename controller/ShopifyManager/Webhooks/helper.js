const {del, insert} = require("../../DataManager/index");
const { EVENT_TABLE_NAME } = require("../../DataManager/helper");
const eventColumn = require("../../DataManager/Setup/eventColumns.json");

const updateEvent = async (data, workspaceId) => {
    await del(EVENT_TABLE_NAME, [data], workspaceId)
    await insert(EVENT_TABLE_NAME, eventColumn, [data], workspaceId)
}

const updateTable = async (TABLE_NAME, column, data, workspaceId, type, id = 'id') => {
    switch(type) {
        case 'create':
            await del(TABLE_NAME, data, workspaceId, id)
            await insert(TABLE_NAME, column, data, workspaceId)
            break
        case 'update':
            await del(TABLE_NAME, data, workspaceId, id)
            await insert(TABLE_NAME, column, data, workspaceId)
            break
        case 'delete':
            await del(TABLE_NAME, data, workspaceId, id)
            break
        default:
            await del(TABLE_NAME, data, workspaceId, id)
            await insert(TABLE_NAME, column, data, workspaceId)
            break
    }
}

module.exports = {updateTable, updateEvent};
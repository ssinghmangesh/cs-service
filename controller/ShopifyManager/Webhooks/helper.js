const {del, insert} = require("../../DataManager/index");
const { EVENT_TABLE_NAME } = require("../../DataManager/helper");
const eventColumn = require("../../DataManager/Setup/eventColumns.json");

const updateEvent = async (data, workspaceId) => {
    await del(EVENT_TABLE_NAME, [data], workspaceId)
    await insert(EVENT_TABLE_NAME, eventColumn, [data], workspaceId)
}

const updateTable = async (TABLE_NAME, column, data, workspaceId, type) => {
    switch(type) {
        case 'create':
            await insert(TABLE_NAME, column, [data], workspaceId)
            break
        case 'update':
            await del(TABLE_NAME, [data], workspaceId)
            await insert(TABLE_NAME, column, [data], workspaceId)
            break
        case 'delete':
            await del(TABLE_NAME, [data], workspaceId)
            break
        default:
            await del(TABLE_NAME, [data], workspaceId)
            await insert(TABLE_NAME, column, [data], workspaceId)
            break
    }
}

module.exports = {updateTable, updateEvent};
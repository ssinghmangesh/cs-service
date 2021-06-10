const {del, insert} = require("../../DataManager/index");

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

module.exports = updateTable;
const {del, insert} = require("../../DataManager/index");

const update = async (TABLE_NAME, column, data, workspaceId) => {
    await del(TABLE_NAME, [data], workspaceId)
    await insert(TABLE_NAME, column, [data], workspaceId)
    return {status: 200, message: "Update Successful"}
}


module.exports = {
    update
}
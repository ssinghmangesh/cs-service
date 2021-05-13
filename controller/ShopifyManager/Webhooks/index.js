const {del, insert} = require("../../DataManager/index");

const update = async (TABLE_NAME, column, customer, workspaceId) => {
    await del(TABLE_NAME, [customer], workspaceId)
    await insert(TABLE_NAME, column, [customer], workspaceId)
    return {status: 200, message: "Update Successful"}
}


module.exports = {
    update
}
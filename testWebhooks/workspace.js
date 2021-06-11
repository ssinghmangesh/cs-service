const { deleteTable } = require('../')

const deleteWorkspace = async (workspaceId) => {
    await deleteTable(workspaceId)

    return {
        status: true,
        message: "Successful"
    }
}
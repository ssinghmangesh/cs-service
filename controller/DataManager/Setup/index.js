
const { createCustomerTable, createOrderTable, createProductTable } = require('./helper')

const setupWorkspace = async(workspaceId) => {

    await createCustomerTable(workspaceId)

    await createOrderTable(workspaceId)

    await createProductTable(workspaceId)

    return {
        status: true,
        message: "Successful"
    }

}








module.exports = {
    setupWorkspace
}


/**
 * 
 * 1. Install postgrsql in local
 * 2. add your cred in db.js
 * 3. then test createCustomerTable function verify the output in postgresql db
 * 4. try to insert a row in that table
 * 
 * 
 */



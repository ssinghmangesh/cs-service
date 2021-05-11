
const { createCustomerTable, createOrderTable, createProductTable, createDiscountTable } = require('./helper')

const setupWorkspace = async(workspaceId) => {

    await createCustomerTable(workspaceId)

    await createOrderTable(workspaceId)

    await createProductTable(workspaceId)

    await createDiscountTable(workspaceId)

    return {
        status: true,
        message: "Successful"
    }

}


createDiscountTable(111)
.then(console.log)
.catch(console.log)





module.exports = {
    setupWorkspace
}


/**
 * 
 * 1. Install postgrsql in local  DONE
 * 2. add your cred in db.js DONE
 * 3. then test createCustomerTable function verify the output in postgresql db (insert)
 * 4. try to insert a row in that table
 * 
 * 
 */



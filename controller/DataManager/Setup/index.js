const PostresqlDb = require('./../../../db')
const orderColumns = require('./orderColumns')
const ORDER_TABLE_NAME = (workspaceId) => {
    return `order${workspaceId}`
}
const CUSTOMER_TABLE_NAME = (workspaceId) => {
    return `customer${workspaceId}`
}
const PRODUCT_TABLE_NAME = (workspaceId) => {
    return `product${workspaceId}`
}

const setupWorkspace = async(workspaceId) => {

    await createCustomerTable()


    await createOrderTable()

    await createProductTable()

}


const createCustomerTable = (worksoaceId) => {

    let columnsQuery  = getColumnQuery(orderColumns)
    let query = `
        CREATE TABLE "${CUSTOMER_TABLE_NAME(worksoaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostresqlDb.query(query)
    return res 
}

const getColumnQuery = (orderColumns) => {
    return orderColumns.map(col => {
        return `"${col.columnName}" ${col.dataType}`
    }).join(", ")
}





module.exports = {
    setupWorkspace
}


/**
 * 
 * 1. Install postgrsql in local
 * 2. add your cred in db.js
 * 3. then test createCustomerTable function verify the output in postgresql db
 * 4. try to insert a row in that tabe
 * 
 * 
 */



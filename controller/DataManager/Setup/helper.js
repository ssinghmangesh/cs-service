const PostresqlDb = require('./../../../db')
const orderColumns = require('./orderColumns')
const customerColumns = require('./customerColumns')
const productColumns = require('./productColumns')






// customer section
const CUSTOMER_TABLE_NAME = (workspaceId) => {
    return `customer${workspaceId}`
}


const createCustomerTable = async (workspaceId) => {

    let columnsQuery  = getColumnQuery(customerColumns)
    let query = `
        CREATE TABLE "${CUSTOMER_TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostresqlDb.query(query)
    return res 
}


// order section
const ORDER_TABLE_NAME = (workspaceId) => {
    return `order${workspaceId}`
}

const createOrderTable = async (workspaceId) => {

    let columnsQuery  = getColumnQuery(orderColumns)
    let query = `
        CREATE TABLE "${ORDER_TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostresqlDb.query(query)
    return res 

}


// product section
const PRODUCT_TABLE_NAME = (workspaceId) => {
    return `product${workspaceId}`
}

const createProductTable = async (workspaceId) => {
    let columnsQuery  = getColumnQuery(productColumns)
    let query = `
        CREATE TABLE "${PRODUCT_TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostresqlDb.query(query)
    return res 
}



//common
const getColumnQuery = (orderColumns) => {
    return orderColumns.map(col => {
        return `"${col.columnName}" ${col.dataType}`
    }).join(",")
}


// createProductTable("12345");

module.exports = {
    createCustomerTable, 
    createOrderTable, 
    createProductTable
}
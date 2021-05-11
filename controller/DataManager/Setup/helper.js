const PostresqlDb = require('./../../../db')
const orderColumns = require('./orderColumns')
const customerColumns = require('./customerColumns')
const productColumns = require('./productColumns')
const discountColumns = require('./discountColumns')
const fulfillmentsColumns = require('./fulfillmentsColumns')
const lineItemsColumns = require('./lineItemsColumns')
const refundedColumns = require('./refundedColumns')
const variantColumns = require('./variantColumns')






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


// discount section
const DISCOUNT_TABLE_NAME = (workspaceId) => {
    return `discount${workspaceId}`
}

const createDiscountTable = async (workspaceId) => {
    let columnsQuery  = getColumnQuery(discountColumns)
    let query = `
        CREATE TABLE "${DISCOUNT_TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostresqlDb.query(query)
    return res 
}

// fulfillment
const FULFILLMENT_TABLE_NAME = (workspaceId) => {
    return `fulfillment${workspaceId}`
}

const createFulfillmentTable = async (workspaceId) => {
    let columnsQuery  = getColumnQuery(fulfillmentsColumns)
    let query = `
        CREATE TABLE "${FULFILLMENT_TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostresqlDb.query(query)
    return res 
}


const LINEITEMS_TABLE_NAME = (workspaceId) => {
    return `lineitems${workspaceId}`
}

const createLineItemsTable = async (workspaceId) => {
    let columnsQuery  = getColumnQuery(lineItemsColumns)
    let query = `
        CREATE TABLE "${LINEITEMS_TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostresqlDb.query(query)
    return res 
}

const REFUNDED_TABLE_NAME = (workspaceId) => {
    return `refunded${workspaceId}`
}

const createRefundedTable = async (workspaceId) => {
    let columnsQuery  = getColumnQuery(refundedColumns)
    let query = `
        CREATE TABLE "${REFUNDED_TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostresqlDb.query(query)
    return res 
}

const VARIANT_TABLE_NAME = (workspaceId) => {
    return `variant${workspaceId}`
}

const createVariantTable = async (workspaceId) => {
    let columnsQuery  = getColumnQuery(variantColumns)
    let query = `
        CREATE TABLE "${VARIANT_TABLE_NAME(workspaceId)}"(
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
    }).join(", ")
}


// createProductTable("12345");

module.exports = {
    createCustomerTable, 
    createOrderTable, 
    createProductTable,
    createDiscountTable,
    createFulfillmentTable,
    createLineItemsTable,
    createRefundedTable,
    createVariantTable
}
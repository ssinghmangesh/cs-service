const PostgresqlDb = require('./../../../db')
const orderColumns = require('./orderColumns')
const customerColumns = require('./customerColumns')
const productColumns = require('./productColumns')
const discountColumns = require('./discountColumns')
const fulfillmentsColumns = require('./fulfillmentsColumns')
const lineItemsColumns = require('./lineItemsColumns')
const refundedColumns = require('./refundedColumns')
const variantColumns = require('./variantColumns')
const {getCreateQuery, 
    CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    DISCOUNT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    VARIANT_TABLE_NAME
} = require("../helper");


// customer section

const createCustomerTable = async (workspaceId) => {
    const query = getCreateQuery(customerColumns, CUSTOMER_TABLE_NAME, workspaceId);
    let res = await PostgresqlDb.query(query)
    return res 
}

// order section

const createOrderTable = async (workspaceId) => {
    const query = getCreateQuery(orderColumns, ORDER_TABLE_NAME, workspaceId);
    let res = await PostgresqlDb.query(query)
    return res 

}


// product section

const createProductTable = async (workspaceId) => {
    const query = getCreateQuery(productColumns, PRODUCT_TABLE_NAME, workspaceId);
    let res = await PostgresqlDb.query(query)
    return res 
}


// discount section


const createDiscountTable = async (workspaceId) => {
    const query = getCreateQuery(discountColumns, DISCOUNT_TABLE_NAME, workspaceId);
    let res = await PostgresqlDb.query(query)
    return res 
}

// fulfillment section


const createFulfillmentTable = async (workspaceId) => {
    const query = getCreateQuery(fulfillmentsColumns, FULFILLMENT_TABLE_NAME, workspaceId);
    let res = await PostgresqlDb.query(query)
    return res 
}

// line_items section


const createLineItemsTable = async (workspaceId) => {
    const query = getCreateQuery(lineItemsColumns, LINEITEMS_TABLE_NAME, workspaceId);
    let res = await PostgresqlDb.query(query)
    return res 
}

// refunded section


const createRefundedTable = async (workspaceId) => {
    const query = getCreateQuery(refundedColumns, REFUNDED_TABLE_NAME, workspaceId);
    let res = await PostgresqlDb.query(query)
    return res 
}

// variant section


const createVariantTable = async (workspaceId) => {
    const query = getCreateQuery(variantColumns, VARIANT_TABLE_NAME, workspaceId);
    let res = await PostgresqlDb.query(query)
    return res 
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
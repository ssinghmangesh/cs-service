const PostgresqlDb = require('../../../db')

// // customer section

const createTable = async (columns, TABLE_NAME, workspaceId) => {
    const columnsQuery  = columns.map(col => {
        return `"${col.columnName}" ${col.dataType}`
    }).join(", ")

    const query = `
        CREATE TABLE "${TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostgresqlDb.query(query)
    return res 
}

// // order section

// const createOrderTable = async (workspaceId) => {
//     const query = getCreateQuery(orderColumns, ORDER_TABLE_NAME, workspaceId);
//     let res = await PostgresqlDb.query(query)
//     return res 

// }


// // product section

// const createProductTable = async (workspaceId) => {
//     const query = getCreateQuery(productColumns, PRODUCT_TABLE_NAME, workspaceId);
//     let res = await PostgresqlDb.query(query)
//     return res 
// }


// // discount section


// const createDiscountTable = async (workspaceId) => {
//     const query = getCreateQuery(discountColumns, DISCOUNT_TABLE_NAME, workspaceId);
//     let res = await PostgresqlDb.query(query)
//     return res 
// }

// // fulfillment section


// const createFulfillmentTable = async (workspaceId) => {
//     const query = getCreateQuery(fulfillmentsColumns, FULFILLMENT_TABLE_NAME, workspaceId);
//     let res = await PostgresqlDb.query(query)
//     return res 
// }

// // line_items section


// const createLineItemsTable = async (workspaceId) => {
//     const query = getCreateQuery(lineItemsColumns, LINEITEMS_TABLE_NAME, workspaceId);
//     let res = await PostgresqlDb.query(query)
//     return res 
// }

// // refunded section


// const createRefundedTable = async (workspaceId) => {
//     const query = getCreateQuery(refundedColumns, REFUNDED_TABLE_NAME, workspaceId);
//     let res = await PostgresqlDb.query(query)
//     return res 
// }

// // variant section


// const createVariantTable = async (workspaceId) => {
//     const query = getCreateQuery(variantColumns, VARIANT_TABLE_NAME, workspaceId);
//     let res = await PostgresqlDb.query(query)
//     return res 
// }


// // createProductTable("12345");

module.exports = {
    createTable
}
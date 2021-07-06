const PostgresqlDb = require('../../../db')

const {
    CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    DISCOUNT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    VARIANT_TABLE_NAME,
    CART_TABLE_NAME,
    CARTLINEITEMS_TABLE_NAME,
    CHECKOUT_TABLE_NAME,
    EVENT_TABLE_NAME,
    CHECKOUTLINEITEMS_TABLE_NAME,
    CUSTOMERAGGREGATE_TABLE_NAME,
    DRAFTORDER_TABLE_NAME,
    INVENTORYITEM_TABLE_NAME,
    INVENTORYLEVEL_TABLE_NAME,
    LOCATION_TABLE_NAME,
    DRAFTORDERLINEITEMS_TABLE_NAME,
    TAX_TABLE_NAME,
    DISCOUNTAPPLICATION_TABLE_NAME,
    VISITOR_TABLE_NAME,
    SENTEMAIL_TABLE_NAME,
    PRODUCTRECOMMENDATIONS_TABLE_NAME
} = require("../helper");

// // customer section

const createTable = async (columns, TABLE_NAME, workspaceId) => {
    const columnsQuery  = columns.map(col => {
        return `"${col.columnName}" ${col.dataType}`
    }).join(", ")

    const query = `
        CREATE TABLE IF NOT EXISTS "${TABLE_NAME(workspaceId)}"(
            ${columnsQuery}
        );
    `
    let res = await PostgresqlDb.query(query)
    return res 
}

const deleteTable = async (workspaceId) => {
    const tableQuery = `${CUSTOMER_TABLE_NAME(workspaceId)}, 
            ${ORDER_TABLE_NAME(workspaceId)}, 
            ${PRODUCT_TABLE_NAME(workspaceId)}, 
            ${DISCOUNT_TABLE_NAME(workspaceId)}, 
            ${FULFILLMENT_TABLE_NAME(workspaceId)}, 
            ${LINEITEMS_TABLE_NAME(workspaceId)}, 
            ${REFUNDED_TABLE_NAME(workspaceId)}, 
            ${VARIANT_TABLE_NAME(workspaceId)}, 
            ${CART_TABLE_NAME(workspaceId)}, 
            ${CARTLINEITEMS_TABLE_NAME(workspaceId)}, 
            ${CHECKOUT_TABLE_NAME(workspaceId)}, 
            ${EVENT_TABLE_NAME(workspaceId)}, 
            ${CHECKOUTLINEITEMS_TABLE_NAME(workspaceId)},
            ${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)},
            ${DRAFTORDER_TABLE_NAME(workspaceId)},
            ${INVENTORYITEM_TABLE_NAME(workspaceId)},
            ${INVENTORYLEVEL_TABLE_NAME(workspaceId)},
            ${LOCATION_TABLE_NAME(workspaceId)},
            ${DRAFTORDERLINEITEMS_TABLE_NAME(workspaceId)},
            ${TAX_TABLE_NAME(workspaceId)},
            ${DISCOUNTAPPLICATION_TABLE_NAME(workspaceId)},
            ${VISITOR_TABLE_NAME(workspaceId)},
            ${SENTEMAIL_TABLE_NAME(workspaceId)},
            ${PRODUCTRECOMMENDATIONS_TABLE_NAME(workspaceId)}`

    const query = `DROP TABLE IF EXISTS ${tableQuery};`

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
    createTable,
    deleteTable
}
const orderColumns = require('./Setup/orderColumns')
const customerColumns = require('./Setup/customerColumns')
const productColumns = require('./Setup/productColumns')
const discountColumns = require('./Setup/discountColumns')
const fulfillmentsColumns = require('./Setup/fulfillmentsColumns')
const lineItemsColumns = require('./Setup/lineItemsColumns')
const refundedColumns = require('./Setup/refundedColumns')
const variantColumns = require('./Setup/variantColumns')
const cartColumns = require('./Setup/cartColumns.json')
const cartLineItemsColumns = require('./Setup/cartLineItemColumns.json')
const checkoutColumns = require('./Setup/checkoutColumns.json')
const eventColumns = require('./Setup/eventColumns.json')
const checkoutLineItemsColumns = require("./Setup/checkoutLineItemsColumns.json");
const customerAggregateColumns = require("./Setup/customerAggregateColumns.json");
const draftOrderColumns = require("./Setup/draftOrderColumns.json");
const inventoryitemColumns = require("./Setup/inventoryItemColumns.json");
const inventorylevelColumns = require("./Setup/inventoryLevelColumns.json");
const locationColumns = require("./Setup/locationColumns.json");
const draftOrderLineItemsColumns = require("./Setup/draftOrderLineItemsColumns.json");
const taxColumns = require("./Setup/taxColumns.json");
const discountApplicationsColumns = require("./Setup/discountApplicationsColumns.json");
const visitorColumns = require("./Setup/visitorColumns.json");
const sentEmailColumns = require("./Setup/sentEmailColumns.json");

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
    SENTEMAIL_TABLE_NAME
} = require("./helper");

const { createTable } = require('./Setup/helper')
const PostgresqlDb = require('../../db')
const { deleteRow } = require('../SyncStatusManager/index')

const deleteRowHelper = async (workspaceId, objectType) => {
    const data = {
        Key:{
            "workspace_id": Number(workspaceId),
            "object_type": objectType
        },
    }
    await deleteRow(data)
}

const clearData = async (type, workspaceId) => {
    let query = ''
    switch (type) {
        case 'order':
            query = `DROP TABLE IF EXISTS ${ORDER_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(orderColumns, ORDER_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${TAX_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(taxColumns, TAX_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${LINEITEMS_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(lineItemsColumns, LINEITEMS_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${REFUNDED_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(refundedColumns, REFUNDED_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${DISCOUNTAPPLICATION_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(discountApplicationsColumns, DISCOUNTAPPLICATION_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${FULFILLMENT_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(fulfillmentsColumns, FULFILLMENT_TABLE_NAME, workspaceId)
            break;
        case 'product':
            query = `DROP TABLE IF EXISTS ${PRODUCT_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(productColumns, PRODUCT_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${VARIANT_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(variantColumns, VARIANT_TABLE_NAME, workspaceId)
            break;
        case 'cart':
            query = `DROP TABLE IF EXISTS ${CART_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(cartColumns, CART_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${CARTLINEITEMS_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(cartLineItemsColumns, CARTLINEITEMS_TABLE_NAME, workspaceId)
            break;
        case 'customer':
            query = `DROP TABLE IF EXISTS ${CUSTOMER_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(customerColumns, CUSTOMER_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(customerAggregateColumns, CUSTOMERAGGREGATE_TABLE_NAME, workspaceId)
            break;
        case 'discount':
            query = `DROP TABLE IF EXISTS ${DISCOUNT_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(discountColumns, DISCOUNT_TABLE_NAME, workspaceId)
            break;
        case 'draftorder':
            query = `DROP TABLE IF EXISTS ${DRAFTORDER_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(draftOrderColumns, DRAFTORDER_TABLE_NAME, workspaceId)
            query = `DROP TABLE IF EXISTS ${DRAFTORDERLINEITEMS_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(draftOrderLineItemsColumns, DRAFTORDERLINEITEMS_TABLE_NAME, workspaceId)
            break;
        case 'location':
            query = `DROP TABLE IF EXISTS ${LOCATION_TABLE_NAME(workspaceId)};`
            await PostgresqlDb.query(query)
            await createTable(locationColumns, LOCATION_TABLE_NAME, workspaceId)
            break;
        default:
            break;
    }
    await deleteRowHelper(workspaceId, type);
    return true
}

module.exports = clearData;
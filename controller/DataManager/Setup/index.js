const orderColumns = require('./orderColumns')
const customerColumns = require('./customerColumns')
const productColumns = require('./productColumns')
const discountColumns = require('./discountColumns')
const fulfillmentsColumns = require('./fulfillmentsColumns')
const lineItemsColumns = require('./lineItemsColumns')
const refundedColumns = require('./refundedColumns')
const variantColumns = require('./variantColumns')
const cartColumns = require('./cartColumns.json')
const cartLineItemsColumns = require('./cartLineItemColumns.json')
const checkoutColumns = require('./checkoutColumns.json')
const eventColumns = require('./eventColumns.json')
const checkoutLineItemsColumns = require("./checkoutLineItemsColumns.json");
const customerAggregateColumns = require("./customerAggregateColumns.json");
const draftOrderColumns = require("./draftOrderColumns.json");
const inventoryitemColumns = require("./inventoryItemColumns.json");
const inventorylevelColumns = require("./inventoryLevelColumns.json");
const locationColumns = require("./locationColumns.json");
const draftOrderLineItemsColumns = require("./draftOrderLineItemsColumns.json");
const taxColumns = require("./taxColumns.json");
const discountApplicationsColumns = require("./discountApplicationsColumns.json");

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
    DISCOUNTAPPLICATION_TABLE_NAME
} = require("../helper");


const { createTable, deleteTable } = require('./helper')

const setupWorkspace = async(workspaceId) => {

    await createTable(customerColumns, CUSTOMER_TABLE_NAME, workspaceId)

    await createTable(orderColumns, ORDER_TABLE_NAME, workspaceId)

    await createTable(productColumns, PRODUCT_TABLE_NAME, workspaceId)

    await createTable(discountColumns, DISCOUNT_TABLE_NAME, workspaceId)

    await createTable(fulfillmentsColumns, FULFILLMENT_TABLE_NAME, workspaceId)

    await createTable(lineItemsColumns, LINEITEMS_TABLE_NAME, workspaceId)

    await createTable(refundedColumns, REFUNDED_TABLE_NAME, workspaceId)

    await createTable(variantColumns, VARIANT_TABLE_NAME, workspaceId)

    await createTable(cartColumns, CART_TABLE_NAME, workspaceId)

    await createTable(cartLineItemsColumns, CARTLINEITEMS_TABLE_NAME, workspaceId)

    await createTable(checkoutColumns, CHECKOUT_TABLE_NAME, workspaceId)

    await createTable(eventColumns, EVENT_TABLE_NAME, workspaceId)

    // await createTable(checkoutLineItemsColumns, CHECKOUTLINEITEMS_TABLE_NAME, workspaceId)

    await createTable(customerAggregateColumns, CUSTOMERAGGREGATE_TABLE_NAME, workspaceId)

    await createTable(draftOrderColumns, DRAFTORDER_TABLE_NAME, workspaceId)

    await createTable(inventoryitemColumns, INVENTORYITEM_TABLE_NAME, workspaceId)

    await createTable(inventorylevelColumns, INVENTORYLEVEL_TABLE_NAME, workspaceId)

    await createTable(locationColumns, LOCATION_TABLE_NAME, workspaceId)

    await createTable(draftOrderLineItemsColumns, DRAFTORDERLINEITEMS_TABLE_NAME, workspaceId)

    await createTable(taxColumns, TAX_TABLE_NAME, workspaceId)

    await createTable(discountApplicationsColumns, DISCOUNTAPPLICATION_TABLE_NAME, workspaceId)

    return {
        status: true,
        message: "Successful"
    }
}

const deleteWorkspace = async (workspaceId) => {
    await deleteTable(workspaceId)

    return {
        status: true,
        message: "Successful"
    }
}

// deleteWorkspace(333)
// .then(console.log)
// .catch(console.log)

// setupWorkspace(333)
// .then(console.log)
// .catch(console.log)



module.exports = {
    setupWorkspace,
    deleteWorkspace
}

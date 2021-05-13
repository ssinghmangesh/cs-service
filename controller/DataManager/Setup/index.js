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
const checkoutLineItemsColumns = require("./checkoutLineItemsColumns.json");

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
    CHECKOUTLINEITEMS_TABLE_NAME
} = require("../helper");


const { createTable } = require('./helper')

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

    await createTable(checkoutLineItemsColumns, CHECKOUTLINEITEMS_TABLE_NAME, workspaceId)

    return {
        status: true,
        message: "Successful"
    }

}


// createOrderTable(222)
// .then(console.log)
// .catch(console.log)





module.exports = {
    setupWorkspace
}

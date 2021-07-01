const axios = require("axios")
const webhooks = require('./webhooks.json');
const { updateTable } = require('./helper');
const { del, aggregate } = require('../../DataManager/index')

const orderColumns = require('../../DataManager/Setup/orderColumns.json')
const customerColumns = require('../../DataManager/Setup/customerColumns')
const productColumns = require('../../DataManager/Setup/productColumns')
const fulfillmentsColumns = require('../../DataManager/Setup/fulfillmentsColumns')
const refundedColumns = require('../../DataManager/Setup/refundedColumns')
const cartColumns = require('../../DataManager/Setup/cartColumns.json')
const cartLineItemsColumns = require('../../DataManager/Setup/cartLineItemColumns.json')
const checkoutColumns = require('../../DataManager/Setup/checkoutColumns.json')
const draftOrderColumns = require("../../DataManager/Setup/draftOrderColumns.json");
const draftOrderLineItemsColumns = require("../../DataManager/Setup/draftOrderLineItemsColumns.json");
const discountApplicationsColumns = require("../../DataManager/Setup/discountApplicationsColumns.json");
const lineItemsColumns = require("../../DataManager/Setup/lineItemsColumns.json");
const taxColumns = require("../../DataManager/Setup/taxColumns.json");
const variantsColumns = require("../../DataManager/Setup/variantColumns.json");
const customerAggregateColumns = require("../../DataManager/Setup/customerAggregateColumns.json");

const {
    CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    CART_TABLE_NAME,
    CARTLINEITEMS_TABLE_NAME,
    CHECKOUT_TABLE_NAME,
    DRAFTORDER_TABLE_NAME,
    DRAFTORDERLINEITEMS_TABLE_NAME,
    DISCOUNTAPPLICATION_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    TAX_TABLE_NAME,
    VARIANT_TABLE_NAME,
    CUSTOMERAGGREGATE_TABLE_NAME
} = require("../../DataManager/helper");

const createWebhooks = async (shopName, accessToken, workspaceId) => {
    // console.log(webhooks.length);
    for(let i=0;i<webhooks.length;i++) {
        const { event, type } = webhooks[i];
        try{
            const res = await axios({
              method: 'POST',
              url: `https://${shopName}/admin/api/2021-04/webhooks.json`,
              headers:  {
                  'X-Shopify-Access-Token': accessToken,
              },
              data: {
                  "webhook": {
                      "topic": `${event}/${type}`,
                      "address": `https://custom-segment-service.herokuapp.com/webhooks/${workspaceId}/${event}/${type}`,
                      "format": "json"
                  }
              }
          })
        //   console.log(i);
        }catch(err){
          console.log(err)
        }
    }
}

const update = async ({ workspaceId, event, type}, data) => {
    // console.log(workspaceId, event, type);
    switch(event){
        case 'carts':
            await updateTable(CART_TABLE_NAME, cartColumns, [data], workspaceId, type);
            await updateTable(CARTLINEITEMS_TABLE_NAME, cartLineItemsColumns, data.line_items, workspaceId, type);
            break
        case 'checkouts':
            await updateTable(CHECKOUT_TABLE_NAME, checkoutColumns, [data], workspaceId, type);
            break
        case 'customers':
            // console.log('customers data: ', data)
            customers = []
            if(type != 'delete') {
                customers.push({
                    ...data,
                    state: data.default_address.province,
                    country: data.default_address.country,
                })
            } else {
                customers.push(data)
            }
            // console.log('customers data: ', customers)
            await updateTable(CUSTOMER_TABLE_NAME, customerColumns, [data], workspaceId, type);
            let customeragg = []
            if(type != 'delete') {
                customeragg.push({
                    ...data['default_address'],
                    ...data,
                })
            } else {
                customeragg.push(data)
            }
            // console.log('customer aggregate data: ', customeragg)
            await del(CUSTOMERAGGREGATE_TABLE_NAME, customeragg, workspaceId, 'customer_id', 'id')
            customeragg.map(async (customer) => {
                await aggregate(workspaceId, customer.id)
            })
            break
        case 'draft_orders':
            // console.log('draft orders: ', data)
            let draft_orders = []
            if(type != 'delete') {
                const { customer } = data
                draft_orders.push({
                    ...data, 
                    shipping_country: data.shipping_address && data.shipping_address.country,
                    shipping_state: data.shipping_address && data.shipping_address.state,
                    shipping_city: data.shipping_address && data.shipping_address.city,
                    shipping_province: data.shipping_address && data.shipping_address.province,
                    shipping_zip: data.shipping_address && data.shipping_address.zip,
                    shipping_latitude: data.shipping_address && data.shipping_address.latitude,
                    shipping_longitude: data.shipping_address && data.shipping_address.longitude,
                    customer_id: customer ? customer.id : null 
                })
            } else {
                draft_orders.push(data)
            }       
            await updateTable(DRAFTORDER_TABLE_NAME, draftOrderColumns, draft_orders, workspaceId, type);

            let draft_order_line_items = []
            if(type != 'delete') {
                const { customer } = data
                data.line_items.map(line_item => {
                    draft_order_line_items.push({
                        ...line_item,
                        order_id: data.id,
                        customer_id: customer ? customer.id : null,
                        created_at: data.created_at,
                    })
                })
            } else {
                draft_order_line_items.push(data)
            }
            await updateTable(DRAFTORDERLINEITEMS_TABLE_NAME, draftOrderLineItemsColumns, draft_order_line_items, workspaceId, type);
            break
        case 'fulfillments':
            await updateTable(FULFILLMENT_TABLE_NAME, fulfillmentsColumns, [data], workspaceId, type);
            break
        case 'orders':
            // console.log('orders data: ', data)
            let orders = []
            if(type != 'delete') {
                const { customer } = data
                orders.push({
                    shipping_country: data.shipping_address && data.shipping_address.country,
                    shipping_state: data.shipping_address && data.shipping_address.state,
                    shipping_city: data.shipping_address && data.shipping_address.city,
                    shipping_province: data.shipping_address && data.shipping_address.province,
                    shipping_zip: data.shipping_address && data.shipping_address.zip,
                    shipping_latitude: data.shipping_address && data.shipping_address.latitude,
                    shipping_longitude: data.shipping_address && data.shipping_address.longitude,
                    ...data,
                    order_id: data.id,
                    order_name: data.name,
                    customer_id: customer ? customer.id : null 
                })
            } else {
                orders.push(data)
            }
            await updateTable(ORDER_TABLE_NAME, orderColumns, orders, workspaceId, type);

            let fulfillments = []
            if(type != 'delete') {
                const { customer } = data
                data.fulfillments.map((fulfillment) => {
                    fulfillments.push({
                        ...fulfillment,
                        order_id: data.id,
                        order_name: data.name,
                        customer_id: customer ? customer.id : null 
                    })
                })
            } else {
                fulfillments.push(data)
            }
            await updateTable(FULFILLMENT_TABLE_NAME, fulfillmentsColumns, fulfillments, workspaceId, type);

            let refunds = []
            if(type != 'delete') {
                const { customer } = data
                data.refunds.map((refund) => {
                    refunds.push({
                        ...refund,
                        order_id: data.id,
                        order_name: data.name,
                        customer_id: customer ? customer.id : null 
                    })
                })
                
            } else {
                refunds.push(data)
            }
            await updateTable(REFUNDED_TABLE_NAME, refundedColumns, refunds, workspaceId, type);

            let discount_applications = []
            if(type != 'delete') {
                const { customer } = data
                data.discount_applications.map((discount_application) => {
                    discount_applications.push({
                        ...discount_application,
                        current_total_discounts: data.current_total_discounts,
                        order_id: data.id,
                        order_name: data.name,
                        customer_id: customer ? customer.id : null,
                        financial_status: data.financial_status,
                        created_at: data.created_at
                    })
                })
            } else {
                discount_applications.push(data)
            }
            // console.log('discount data: ', discount_applications)
            await updateTable(DISCOUNTAPPLICATION_TABLE_NAME, discountApplicationsColumns, discount_applications, workspaceId, type, 'order_id');

            let line_items = []
            if(type != 'delete') {
                const { customer } = data
                data.line_items.map((line_item) => {
                    line_items.push({
                        ...line_item,
                        order_id: data.id,
                        order_name: data.name,
                        customer_id: customer ? customer.id : null 
                    })
                })
            } else {
                line_items.push(data)
            }
            await updateTable(LINEITEMS_TABLE_NAME, lineItemsColumns, line_items, workspaceId, type);

            let taxes = []
            if(type != 'delete') {
                const { customer } = data
                data.tax_lines.map((tax_line) => {
                    taxes.push({
                        ...tax_line,
                        current_total_tax: data.current_total_tax,
                        order_id: data.id,
                        order_name: data.name,
                        customer_id: customer ? customer.id : null,
                        financial_status: data.financial_status,
                        created_at: data.created_at
                    })
                })
            } else {
                taxes.push(data)
            }
            // console.log('taxes data: ', taxes)
            await updateTable(TAX_TABLE_NAME, taxColumns, taxes, workspaceId, type, 'order_id');
            break
        case 'products':
            console.log('products data: ', data)
            let products = []
            if(type != 'delete') {
                products.push({
                    ...data,
                    inventory_item_id: data.variants[0].inventory_item_id,
                    inventory_quantity: data.variants[0].inventory_quantity,
                })
            } else {
                products.push(data)
            }
            await updateTable(PRODUCT_TABLE_NAME, productColumns, products, workspaceId, type);

            let variants = [];
            if(type != 'delete') {
                data.variants.map((variant) => {
                    variants.push({
                        ...variant,
                    })
                })
            } else {
                variants.push(data)
            }
            await updateTable(VARIANT_TABLE_NAME, variantsColumns, variants, workspaceId, type);
            break
        case 'refunds':
            await updateTable(REFUNDED_TABLE_NAME, refundedColumns, [data], workspaceId, type);
            break
        default:
            break
    }
    return {statusCode: 200, message: "Update Successful"}
}

// createWebhooks('indian-dress-cart.myshopify.com', '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', 56788582584)
// .then(console.log)

module.exports = {
    update,
    createWebhooks
}
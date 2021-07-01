const axios = require("axios")
const webhooks = require('./webhooks.json');
const { updateTable } = require('./helper');
const { aggregate } = require('../../DataManager/index')

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

const getImageUrl = (image_id, images) => {
    if(!images){
        return ''
    }
    let image = images.find(image => image.id === image_id);
    if(image){
        return image.src;
    }else{
        return null;
    }
}

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
    console.log(workspaceId, event, type);
    switch(event){
        case 'carts':
            await updateTable(CART_TABLE_NAME, cartColumns, [data], workspaceId, type);
            await updateTable(CARTLINEITEMS_TABLE_NAME, cartLineItemsColumns, data.line_items, workspaceId, type);
            break
        case 'checkouts':
            await updateTable(CHECKOUT_TABLE_NAME, checkoutColumns, [data], workspaceId, type);
            break
        case 'customers':
            console.log('customers data: ', data)
            await updateTable(CUSTOMER_TABLE_NAME, customerColumns, [data], workspaceId, type);
            let customers = data.map((customer) => {
                return {
                    ...customer['default_address'],
                    ...customer,
                }
            })
            await del(CUSTOMERAGGREGATE_TABLE_NAME, customers, workspaceId, 'customer_id', 'id')
            customers.map(async (customer) => {
                await aggregate(workspaceId, customer.id)
            })
            break
        case 'draft_orders':
            await updateTable(DRAFTORDER_TABLE_NAME, draftOrderColumns, [data], workspaceId, type);
            await updateTable(DRAFTORDERLINEITEMS_TABLE_NAME, draftOrderLineItemsColumns, data.line_items, workspaceId, type);
            break
        case 'fulfillments':
            await updateTable(FULFILLMENT_TABLE_NAME, fulfillmentsColumns, [data], workspaceId, type);
            break
        case 'orders':
            console.log('orders data: ', data)
            let orders = []
            data.map(order => {
                const { customer } = order
                orders.push({
                    shipping_country: order.shipping_address && order.shipping_address.country,
                    shipping_state: order.shipping_address && order.shipping_address.state,
                    shipping_city: order.shipping_address && order.shipping_address.city,
                    shipping_province: order.shipping_address && order.shipping_address.province,
                    shipping_zip: order.shipping_address && order.shipping_address.zip,
                    shipping_latitude: order.shipping_address && order.shipping_address.latitude,
                    shipping_longitude: order.shipping_address && order.shipping_address.longitude,
                    ...order,
                    order_id: order.id,
                    order_name: order.name,
                    customer_id: customer ? customer.id : null 
                })
            })
            await updateTable(ORDER_TABLE_NAME, orderColumns, orders, workspaceId, type);
            let fulfillments = []
            data.map(order => {
                const { customer } = order
                order.line_items.map(fulfillment => {
                    fulfillments.push({
                        ...fulfillment,
                        order_id: order.id,
                        order_name: order.name,
                        customer_id: customer ? customer.id : null 
                    })
                }) 
            })
            await updateTable(FULFILLMENT_TABLE_NAME, fulfillmentsColumns, fulfillments, workspaceId, type);
            let refunds = []
            data.map(order => {
                const { customer } = order
                order.refunds.map(refund => {
                    refunds.push({
                        ...refund,
                        order_id: order.id,
                        order_name: order.name,
                        customer_id: customer ? customer.id : null 
                    })
                }) 
            })
            await updateTable(REFUNDED_TABLE_NAME, refundedColumns, refunds, workspaceId, type);
            let discount_applications = []
            data.map(order => {
                const { customer } = order
                order.discount_applications.map(discount_application => {
                    discount_applications.push({
                        ...discount_application,
                        current_total_discounts: order.current_total_discounts,
                        order_id: order.id,
                        order_name: order.name,
                        customer_id: customer ? customer.id : null,
                        financial_status: order.financial_status,
                        created_at: order.created_at
                    })
                }) 
            })
            await updateTable(DISCOUNTAPPLICATION_TABLE_NAME, discountApplicationsColumns, discount_applications, workspaceId, type, 'order_id');
            let line_items = []
            data.map(order => {
                const { customer } = order
                order.line_items.map(line_item => {
                    line_items.push({
                        ...line_item,
                        order_id: order.id,
                        order_name: order.name,
                        customer_id: customer ? customer.id : null 
                    })
                }) 
            })
            await updateTable(LINEITEMS_TABLE_NAME, lineItemsColumns, line_items, workspaceId, type);
            let taxes = []
            data.map(order => {
                const { customer } = order
                order.tax_lines.map(tax_line => {
                    taxes.push({
                        ...tax_line,
                        current_total_tax: order.current_total_tax,
                        order_id: order.id,
                        order_name: order.name,
                        customer_id: customer ? customer.id : null,
                        financial_status: order.financial_status,
                        created_at: order.created_at
                    })
                }) 
            })
            await updateTable(TAX_TABLE_NAME, taxColumns, taxes, workspaceId, type, 'order_id');
            break
        case 'products':
            console.log('products data: ', data)
            await updateTable(PRODUCT_TABLE_NAME, productColumns, [data], workspaceId, type);
            let variants = [];
            data.map(product => {
                product.variants.map(variant => {
                    variants.push({
                        ...variant,
                        image_url: getImageUrl(variant.image_id, product.images)
                    })
                })
            })
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
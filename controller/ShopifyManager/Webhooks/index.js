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
const inventoryItemColumns = require("../../DataManager/Setup/inventoryItemColumns.json");
const inventoryLevelColumns = require("../../DataManager/Setup/inventoryLevelColumns.json");

const getId = (array, column) => {
    let ids = []
    array.map(item => {
        ids.push(item[column])
    })
    return ids
}

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
    CUSTOMERAGGREGATE_TABLE_NAME,
    INVENTORYLEVEL_TABLE_NAME,
    INVENTORYITEM_TABLE_NAME
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
            console.log('cart data: ', data)
            let carts = []
            if(type != 'delete') {
                const { customer } = data
                carts.push({
                    id: data.id,
                    customer_id: customer ? customer.id : null,
                    token: data.token,
                    note: data.note,
                    updated_at: data.updated_at,
                    created_at: data.created_at,
                    product_id: getId(data.line_items, "product_id"),
                    variant_id: getId(data.line_items, "variant_id"),
                })
            } else {
                carts.push(data)
            }
            await updateTable(CART_TABLE_NAME, cartColumns, carts, workspaceId, type);

            let cartLineItems = []
            if(type != 'delete') {
                data.line_items.map(line_item => {
                    const { customer } = data
                    cartLineItems.push({
                        id: line_item.id,
                        customer_id: customer ? customer.id : null,
                        quantity: line_item.quantity,
                        variant_id: line_item.variant_id,
                        key: line_item.key,
                        discounted_price: data.total_price,
                        properties: line_item.properties,
                        discounts: line_item.applied_discounts,
                        gift_card: line_item.gift_card,
                        grams: line_item.grams,
                        line_price: line_item.line_price,
                        original_line_price: data.total_line_items_price,
                        original_price: 0,
                        price: line_item.price,
                        product_id: line_item.product_id,
                        sku: line_item.sku,
                        taxable: line_item.taxable,
                        title: line_item.title,
                        total_discount: data.total_discounts,
                        vendor: line_item.vendor
                    }) 
                })
            } else {
                cartLineItems.push(data)
            }
            await updateTable(CARTLINEITEMS_TABLE_NAME, cartLineItemsColumns, cartLineItems, workspaceId, type);
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
                    state: data.default_address && data.default_address.province,
                    country: data.default_address && data.default_address.country,
                    city: data.default_address && data.default_address.city,
                })
                // console.log('data to be inserted in customer table: ', customers)
            } else {
                customers.push(data)
            }
            // console.log('customers data: ', customers)
            await updateTable(CUSTOMER_TABLE_NAME, customerColumns, customers, workspaceId, type);
            let customeragg = []
            if(type != 'delete') {
                customeragg.push({
                    ...data['default_address'],
                    ...data,
                })
                await del(CUSTOMERAGGREGATE_TABLE_NAME, customeragg, workspaceId, 'customer_id', 'id')
                customeragg.map(async (customer) => {
                    await aggregate(workspaceId, customer.id)
                })
            } else {
                customeragg.push(data)
                await del(CUSTOMERAGGREGATE_TABLE_NAME, customeragg, workspaceId, 'customer_id', 'id')
            }
            // console.log('customer aggregate data: ', customeragg)
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
                    customer_id: customer ? customer.id : null,
                    fulfillment_status: data.fulfillment_status || 'unfulfilled'
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
                        customer_id: customer ? customer.id : null,
                        fulfillment_status: data.fulfillment_status || 'unfulfilled'
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
                        customer_id: customer ? customer.id : null,
                        fulfillment_status: data.fulfillment_status || 'unfulfilled'
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
            // console.log('products data: ', data)
            let products = []
            if(type != 'delete') {
                let quantity = 0
                data.variants.map((variant) => {
                    quantity += variant.inventory_quantity
                })
                products.push({
                    ...data,
                    inventory_quantity: quantity
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
            await updateTable(VARIANT_TABLE_NAME, variantsColumns, variants, workspaceId, type, 'product_id', 'id');
            break
        case 'inventory_items':
            console.log('inventory_items: ', data)
            await updateTable(INVENTORYITEM_TABLE_NAME, inventoryItemColumns, [data], type)
        case 'inventory_levels':
            console.log('inventory_levels: ', data)
            await updateTable(INVENTORYLEVEL_TABLE_NAME, inventoryItemColumns, [data], type, 'inventory_item_id')
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
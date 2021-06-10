const axios = require("axios")
const webhooks = require('./webhooks.json');
const updateTable = require('./helper');

const orderColumns = require('../../DataManager/Setup/orderColumns.json')
const customerColumns = require('../../DataManager/Setup/customerColumns')
const productColumns = require('../../DataManager/Setup/productColumns')
const fulfillmentsColumns = require('../../DataManager/Setup/fulfillmentsColumns')
const refundedColumns = require('../../DataManager/Setup/refundedColumns')
const cartColumns = require('../../DataManager/Setup/cartColumns.json')
const checkoutColumns = require('../../DataManager/Setup/checkoutColumns.json')
const draftOrderColumns = require("../../DataManager/Setup/draftOrderColumns.json");

const {
    CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    CART_TABLE_NAME,
    CHECKOUT_TABLE_NAME,
    DRAFTORDER_TABLE_NAME,
} = require("../../DataManager/helper");

const createWebhooks = async (shopName, accessToken, workspaceId) => {
    console.log(webhooks.length);
    for(let i=0;i<webhooks.length;i++) {
        const event = webhooks[i].event;
        const type = webhooks[i].type;
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
          console.log(i);
        }catch(err){
          console.log(err)
        }
    }
}

const update = async ({ workspaceId, event, type}, data) => {
    console.log(data);
    switch(event){
        case 'carts':
            await updateTable(CART_TABLE_NAME, cartColumns, data, workspaceId, type);
            break
        case 'checkouts':
            await updateTable(CHECKOUT_TABLE_NAME, checkoutColumns, data, workspaceId, type);
            break
        case 'customer':
            await updateTable(CUSTOMER_TABLE_NAME, customerColumns, data, workspaceId, type);
            break
        case 'draft_orders':
            await updateTable(DRAFTORDER_TABLE_NAME, draftOrderColumns, data, workspaceId, type);
            break
        case 'fulfillments':
            await updateTable(FULFILLMENT_TABLE_NAME, fulfillmentsColumns, data, workspaceId, type);
            break
        case 'orders':
            await updateTable(ORDER_TABLE_NAME, orderColumns, data, workspaceId, type);
            break
        case 'products':
            await updateTable(PRODUCT_TABLE_NAME, productColumns, data, workspaceId, type);
            break
        case 'refunds':
            await updateTable(REFUNDED_TABLE_NAME, refundedColumns, data, workspaceId, type);
            break
        default:
            break
    }
    return {status: 200, message: "Update Successful"}
}


module.exports = {
    update,
    createWebhooks
}
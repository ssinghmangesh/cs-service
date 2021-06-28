const axios = require("axios")
const webhooks = require('./webhooks.json');
const { updateTable, getCustomer } = require('./helper');

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
} = require("../../DataManager/helper");

const createWebhooks = async (shopName, accessToken, storeHash, workspaceId) => {
    // console.log(webhooks.length);
    for(let i=0;i<webhooks.length;i++) {
        const { scope } = webhooks[i];
        console.log(scope)
        let array = scope.split('/')
        let destination = ``;
        if(array.length === 3) {
          destination = `https://custom-segment-service.herokuapp.com/bg-webhooks/${workspaceId}/${scope}`
        } else {
          destination = `https://custom-segment-service.herokuapp.com/bg1-webhooks/${workspaceId}/${scope}`
        }
        try{
            const res = await axios({
              method: 'POST',
              url: `https://${shopName}/stores/${storeHash}/v3/hooks`,
              headers:  {
                  'X-Auth-Token': accessToken,
              },
              data: {
                "scope": scope,
                "destination": destination,
                "is_active": true
              }
            })
            // console.log(res)
        }catch(err){
          console.log(err.response.data)
        }
    }
}

const bgUpdate = async (params, body) => {
    switch(params.event) {
        // case 'cart':
        //     if(params["subevent"]) {
        //       await updateTable(CARTLINEITEMS_TABLE_NAME, cartLineItemsColumns, data.line_items, workspaceId, params.type);
        //     } else {
        //       await updateTable(CART_TABLE_NAME, cartColumns, [data], workspaceId, params.type);
        //     }
        //     break
        case 'customer':
            let data = {}
            if(params.type === "deleted") {
              data = {
                id: body.data.id
              }
            }
            else {
              data = await getCustomer(params, body)
            }
            if(data) {
              await updateTable(CUSTOMER_TABLE_NAME, customerColumns, [data], Number(body.store_id), params.type);
            }
            break
        // case 'order':
        //     if(params["subevent"]) {
        //       await updateTable(REFUNDED_TABLE_NAME, refundedColumns, data.refunds, workspaceId, params.type);
        //     } else {
        //       await updateTable(ORDER_TABLE_NAME, orderColumns, [data], workspaceId, params.type);
        //     }
        //     // await updateTable(FULFILLMENT_TABLE_NAME, fulfillmentsColumns, data.fulfillments, workspaceId, params.type);
        //     // await updateTable(DISCOUNTAPPLICATION_TABLE_NAME, discountApplicationsColumns, data.discount_applications, workspaceId, params.type);
        //     // await updateTable(LINEITEMS_TABLE_NAME, lineItemsColumns, data.line_items, workspaceId, params.type);
        //     // await updateTable(TAX_TABLE_NAME, taxColumns, data.tax_lines, workspaceId, params.type);
        //     // await updateTable(REFUNDED_TABLE_NAME, refundedColumns, [data], workspaceId, params.type);
        //     break
        // case 'product':
        //     await updateTable(PRODUCT_TABLE_NAME, productColumns, [data], workspaceId, params.type);
        //     await updateTable(VARIANT_TABLE_NAME, variantsColumns, data.variants, workspaceId, params.type);
        //     break
        default:
            break
    }
    return {status: 200, message: "Update Successful"}
}

// createWebhooks("api.bigcommerce.com", "774vc7resdvtz4zoqrnp3rmhrvqd2e6", "vodskxqu9", 56788582584)

module.exports = {
    bgUpdate,
    createWebhooks
}
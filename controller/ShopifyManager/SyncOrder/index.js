const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {ORDER_TABLE_NAME, LINEITEMS_TABLE_NAME, REFUNDED_TABLE_NAME, FULFILLMENT_TABLE_NAME} = require("../../DataManager/helper")
const orderColumns = require("../../DataManager/Setup/orderColumns.json");
const fulfillmentColumns = require("../../DataManager/Setup/fulfillmentsColumns.json");
const lineitemsColumns = require("../../DataManager/Setup/lineItemsColumns.json");
const refundedColumns = require("../../DataManager/Setup/refundedColumns.json");


const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0 , workspaceId}) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchOrder(shopName, accessToken, { since_id: sinceId, limit })
    // console.log(response.data.orders.length)


    let line_items = []
    response.data.orders.map(order => {
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


    let fulfillments = []
    response.data.orders.map(order => {
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

    let refunds = []
    response.data.orders.map(order => {
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

    //insert
    if(response.data.orders.length){
        await del(ORDER_TABLE_NAME, response.data.orders, workspaceId);
        await insert(ORDER_TABLE_NAME, orderColumns, response.data.orders, workspaceId);
        
        await del(LINEITEMS_TABLE_NAME, line_items, workspaceId);
        await insert(LINEITEMS_TABLE_NAME, lineitemsColumns, line_items, workspaceId);
        
        await del(FULFILLMENT_TABLE_NAME, fulfillments, workspaceId);
        await insert(FULFILLMENT_TABLE_NAME, fulfillmentColumns, fulfillments, workspaceId);
        
        await del(REFUNDED_TABLE_NAME, refunds, workspaceId);
        await insert(REFUNDED_TABLE_NAME, refundedColumns, refunds, workspaceId);
    }
    
    //call next batch
    if(response.data.orders.length < limit) {
        console.log("SYNC complete..")
    } else {
        //call next since id
        let nextSinceId = response.data.orders[response.data.orders.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId})
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 2 })
// .then(console.log)
// .catch(console.log)
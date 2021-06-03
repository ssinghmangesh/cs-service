const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {ORDER_TABLE_NAME, LINEITEMS_TABLE_NAME, REFUNDED_TABLE_NAME, FULFILLMENT_TABLE_NAME} = require("../../DataManager/helper")
const orderColumns = require("../../DataManager/Setup/orderColumns.json");
const fulfillmentColumns = require("../../DataManager/Setup/fulfillmentsColumns.json");
const lineitemsColumns = require("../../DataManager/Setup/lineItemsColumns.json");
const refundedColumns = require("../../DataManager/Setup/refundedColumns.json");
const { socket } = require("../../../socket");


const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0 , workspaceId, count, progress = 0}) => {
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

    // console.log(refunds.length);

    //insert
    if(response.data.orders.length){
        await del(ORDER_TABLE_NAME, response.data.orders, workspaceId);
        await insert(ORDER_TABLE_NAME, orderColumns, response.data.orders, workspaceId);
        // console.log("order complete");
        await del(LINEITEMS_TABLE_NAME, line_items, workspaceId);
        await insert(LINEITEMS_TABLE_NAME, lineitemsColumns, line_items, workspaceId);
        // console.log("lineitems complete");
        await del(FULFILLMENT_TABLE_NAME, fulfillments, workspaceId);
        await insert(FULFILLMENT_TABLE_NAME, fulfillmentColumns, fulfillments, workspaceId);
        // console.log("fullfillment complete");
        await del(REFUNDED_TABLE_NAME, refunds, workspaceId);
        await insert(REFUNDED_TABLE_NAME, refundedColumns, refunds, workspaceId);
        // console.log("refunded complete");
    }
    
    //call next batch
    if(response.data.orders.length < limit) {
        progress += response.data.orders.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
    } else {
        //call next since id
        progress += response.data.orders.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
        let nextSinceId = response.data.orders[response.data.orders.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 1 })
// .then(console.log)
// .catch(console.log)
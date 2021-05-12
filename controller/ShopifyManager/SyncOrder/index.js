const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/Order/index");
const {insert: insertLineItems, del: deleteLineItems} = require("../../DataManager/LineItems/index");
const {insert: insertFulfillments, del: deleteFulfillments} = require("../../DataManager/Fulfilments/index");
const {insert: insertRefunds, del: deleteRefunds} = require("../../DataManager/Refunded/index");

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
        await del(response.data.orders, workspaceId);
        await insert(response.data.orders, workspaceId);
        await deleteLineItems(line_items, workspaceId);
        await insertLineItems(line_items, workspaceId);
        await deleteFulfillments(fulfillments, workspaceId);
        await insertFulfillments(fulfillments, workspaceId);
        await deleteRefunds(refunds, workspaceId);
        await insertRefunds(refunds, workspaceId);
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

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 12345 })
// .then(console.log)
// .catch(console.log)
const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {DRAFTORDER_TABLE_NAME, DRAFTORDERLINEITEMS_TABLE_NAME} = require("../../DataManager/helper")
const draftOrderColumns = require('../../DataManager/Setup/draftOrderColumns.json');
const draftOrderLineItemsColumns = require('../../DataManager/Setup/draftOrderLineItemsColumns.json');
const { socket } = require("../../../socket");

// console.log(socket);

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchDraftOrder(shopName, accessToken, { since_id: sinceId, limit })
    // console.log('@@@@@@@', response.data.draft_orders[0])

    let draft_order_line_items = []
    response.data.draft_orders.map(draft_order => {
        const { customer } = draft_order
        draft_order.line_items.map(line_item => {
            draft_order_line_items.push({
                ...line_item,
                order_id: draft_order.order_id,
                customer_id: customer ? customer.id : null,
                created_at: draft_order.created_at,
            })
        })
    })

    let draft_orders = []
    response.data.draft_orders.map(order => {
        const { customer } = order
        draft_orders.push({
            ...order, 
            shipping_country: order.shipping_address && order.shipping_address.country,
            shipping_state: order.shipping_address && order.shipping_address.state,
            shipping_city: order.shipping_address && order.shipping_address.city,
            shipping_province: order.shipping_address && order.shipping_address.province,
            shipping_zip: order.shipping_address && order.shipping_address.zip,
            shipping_latitude: order.shipping_address && order.shipping_address.latitude,
            shipping_longitude: order.shipping_address && order.shipping_address.longitude,
            customer_id: customer ? customer.id : null 
        })
    })
    //insert
    if(response.data.draft_orders.length){
        await del(DRAFTORDER_TABLE_NAME, draft_orders, workspaceId)
        await insert(DRAFTORDER_TABLE_NAME, draftOrderColumns, draft_orders, workspaceId)  

        await del(DRAFTORDERLINEITEMS_TABLE_NAME, draft_order_line_items, workspaceId);
        await insert(DRAFTORDERLINEITEMS_TABLE_NAME, draftOrderLineItemsColumns, draft_order_line_items, workspaceId);
    }

    //call next batch
    if(response.data.draft_orders.length < limit) {
        progress += response.data.draft_orders.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
        if(response.data.draft_orders.length) {
            return response.data.draft_orders[response.data.draft_orders.length - 1].id
        }
    } else {
        //call next since id
        progress += response.data.draft_orders.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
        let nextSinceId = response.data.draft_orders[response.data.draft_orders.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        const lastObjectId = await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
        if(typeof lastObjectId === 'undefined') {
            return response.data.draft_orders[response.data.draft_orders.length - 1].id
        } else {
            return lastObjectId
        }
    }
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 333 })
// .then(console.log)
// .catch(console.log)
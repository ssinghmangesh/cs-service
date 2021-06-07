const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {INVENTORYITEM_TABLE_NAME} = require("../../DataManager/helper")
const inventoryItemColumns = require('../../DataManager/Setup/inventoryItemColumns.json');
const { socket } = require("../../../socket");

// console.log(socket);

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchInventoryItem(shopName, accessToken, { since_id: sinceId, limit })
    console.log('@@@@@@@', response.data)
    
    //insert
    // if(response.data.draft_orders.length){
    //     await del(INVENTORYITEM_TABLE_NAME, response.data.draft_orders, workspaceId)
    //     await insert(INVENTORYITEM_TABLE_NAME, inventoryItemColumns, response.data.draft_orders, workspaceId)  
    // }

    // //call next batch
    // if(response.data.draft_orders.length < limit) {
    //     progress += response.data.draft_orders.length
    //     socket.emit("sync", `${progress} of ${count} done`)
    //     console.log(`${progress} of ${count} done`);
    // } else {
    //     //call next since id
    //     progress += response.data.draft_orders.length
    //     socket.emit("sync", `${progress} of ${count} done`)
    //     console.log(`${progress} of ${count} done`);
    //     let nextSinceId = response.data.draft_orders[response.data.draft_orders.length - 1].id;
    //     // console.log("nextSinceId", nextSinceId)
    //     await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
    // }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 333 })
// .then(console.log)
// .catch(console.log)
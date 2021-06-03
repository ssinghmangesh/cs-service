const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {CART_TABLE_NAME} = require("../../DataManager/helper")
const cartColumns = require('../../DataManager/Setup/cartColumns.json');
const { socket } = require("../../../socket");

// console.log(socket);

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch

    let response = await Shopify.fetchCart(shopName, accessToken, { since_id: sinceId, limit })
    // console.log('@@@@@@@', response.data)

    // let carts = response.data.checkouts.map((customer) => {
    //     return {
    //         ...checkout,
    //     }
    // })
    
    //insert
    if(response.data.checkouts.length){
        await del(CART_TABLE_NAME, carts, workspaceId)
        await insert(CART_TABLE_NAME, cartColumns, carts, workspaceId)
    }
    //call next batch
    if(response.data.checkouts.length < limit) {
        progress += response.data.checkouts.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
    } else {
        //call next since id
        progress += response.data.checkouts.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
        let nextSinceId = response.data.checkouts[response.data.checkouts.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 2 })
// .then(console.log)
// .catch(console.log)
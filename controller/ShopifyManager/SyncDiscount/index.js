const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {DISCOUNT_TABLE_NAME} = require("../../DataManager/helper")
const discountColumns = require("../../DataManager/Setup/discountColumns.json");
const { io } = require("../../../index");

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchDiscount(shopName, accessToken, { since_id: sinceId, limit })
    // console.log(response.data.price_rules.length)

    //insert
    if(response.data.price_rules.length){
        await del(DISCOUNT_TABLE_NAME, response.data.price_rules, workspaceId)
        await insert(DISCOUNT_TABLE_NAME, discountColumns, response.data.price_rules, workspaceId)
        
    }
    
    //call next batch
    if(response.data.price_rules.length < limit) {
        progress += response.data.price_rules.length
        io.on('connection', (socket) => {
            console.log(socket.id);
            socket.emit('workspace', `${progress} of ${count} done`)
        })
        console.log(`${progress} of ${count} done`);
    } else {
        //call next since id
        progress += response.data.price_rules.length
        console.log(`${progress} of ${count} done`);
        let nextSinceId = response.data.price_rules[response.data.price_rules.length - 1].id;
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
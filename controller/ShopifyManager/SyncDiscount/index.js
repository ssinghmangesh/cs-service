const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/Discount/index");


const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchDiscount(shopName, accessToken, { since_id: sinceId, limit })
    // console.log(response.data.price_rules.length)

    //insert
    if(response.data.price_rules.length){
        await del(response.data.price_rules, workspaceId)
        await insert(response.data.price_rules, workspaceId)
    }
    
    //call next batch
    if(response.data.price_rules.length < limit) {
        console.log("SYNC complete..")
    } else {
        //call next since id
        let nextSinceId = response.data.price_rules[response.data.price_rules.length - 1].id;
        console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId})
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 1, workspaceId: 12345 })
// .then(console.log)
// .catch(console.log)
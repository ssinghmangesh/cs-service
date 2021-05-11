const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/Order/index");


const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchProduct(shopName, accessToken, { since_id: sinceId, limit })
    console.log(response.data.products.length)

    //insert
    if(response.data.products.length){
        
        await insert(response.data.products, workspaceId)
        await insert(response.data.products, workspaceId)
    }
    
    
    //call next batch
    if(response.data.products.length < limit) {
        console.log("SYNC complete..")
    } else {
        //call next since id
        let nextSinceId = response.data.products[response.data.products.length - 1].id;
        console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId})
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 2, workspaceId: 12345 })
// .then(console.log)
// .catch(console.log)
const Shopify = require('../Shopify')

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0 }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchOrder(shopName, accessToken, { since_id: sinceId, limit })
    console.log(response.data.orders.length)

    //save the data




    
    //call next batch
    if(response.data.orders.length < limit) {
        console.log("SYNC complete..")
    } else {
        //cal nect since id
        let nextSinceId = response.data.orders[response.data.orders.length - 1].id;
        console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit})
    }
    retrun {}
}



module.exports = {
    SYNC
}

SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50 })
.then(console.log)
.catch(console.log)
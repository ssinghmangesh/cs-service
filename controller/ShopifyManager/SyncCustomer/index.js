const Shopify = require('../Shopify')

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0 }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchCustomer(shopName, accessToken, { since_id: sinceId, limit })
    console.log(response.data.customers.length)

    //save the data




    
    //call next batch
    if(response.data.customers.length < limit) {
        console.log("SYNC complete..")
    } else {
        //cal nect since id
        let nextSinceId = response.data.customers[response.data.customers.length - 1].id;
        console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit})
    }
    return;
}



module.exports = {
    SYNC
}

SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 5 })
.then(console.log)
.catch(console.log)
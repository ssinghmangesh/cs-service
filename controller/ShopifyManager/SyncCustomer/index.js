const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {CUSTOMER_TABLE_NAME} = require("../../DataManager/helper")
const customerColumn = require('../../DataManager/Setup/customerColumns.json');


const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId }) => {
    //call to shopify fetch one batch

    let response = await Shopify.fetchCustomer(shopName, accessToken, { since_id: sinceId, limit })
    // console.log(response.data.customers.length)

    //insert
    if(response.data.customers.length){
        await del(CUSTOMER_TABLE_NAME, response.data.customers, workspaceId)
        await insert(CUSTOMER_TABLE_NAME, customerColumn, response.data.customers, workspaceId)
    }
    //call next batch
    if(response.data.customers.length < limit) {
        console.log("SYNC complete..")
    } else {
        //call next since id
        let nextSinceId = response.data.customers[response.data.customers.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId})
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 2 })
// .then(console.log)
// .catch(console.log)
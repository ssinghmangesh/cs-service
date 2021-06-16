const Shopify = require('../Shopify')
const {insert, del, aggregate} = require("../../DataManager/index");
const {CUSTOMER_TABLE_NAME, CUSTOMERAGGREGATE_TABLE_NAME} = require("../../DataManager/helper")
const customerColumn = require('../../DataManager/Setup/customerColumns.json');
const { socket } = require("../../../socket");

// console.log(socket);

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch

    let response = await Shopify.fetchCustomer(shopName, accessToken, { since_id: sinceId, limit })
    // console.log(response.data.customers.length)

    let customers = response.data.customers.map((customer) => {
        return {
            ...customer['default_address'],
            ...customer,
        }
    })
    
    //insert
    if(response.data.customers.length){
        await del(CUSTOMER_TABLE_NAME, customers, workspaceId)
        await insert(CUSTOMER_TABLE_NAME, customerColumn, customers, workspaceId)

        // console.log('!!', customers)
        await del(CUSTOMERAGGREGATE_TABLE_NAME, customers, workspaceId, 'customer_id', 'id')
        customers.map(async (customer) => {
            await aggregate(workspaceId, customer.id)
        })
    }
    //call next batch
    if(response.data.customers.length < limit) {
        progress += response.data.customers.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
    } else {
        //call next since id
        progress += response.data.customers.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
        let nextSinceId = response.data.customers[response.data.customers.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 333 })
// .then(console.log)
// .catch(console.log)
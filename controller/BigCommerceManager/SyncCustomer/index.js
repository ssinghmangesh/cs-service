const BigCommerce = require("../BigCommerce");
const {insert, del, aggregate} = require("../../DataManager/index");
const {CUSTOMER_TABLE_NAME, CUSTOMERAGGREGATE_TABLE_NAME} = require("../../DataManager/helper")
const customerColumn = require('../../DataManager/Setup/customerColumns.json');
const { socket } = require("../../../socket");

// console.log(socket);

const SYNC = async ({ shopName, accessToken, storeHash, lastPage = 1, limit = 0, workspaceId, progress = 0 }) => {
    //call to BigCommerce fetch one batch

    let response = await BigCommerce.fetchCustomer(shopName, accessToken, storeHash, { page: lastPage, limit: limit })
    // console.log(response.data.data.length)

    let customers = response.data.data.map((customer) => {
        return {
            id: customer.id,
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
            note: customer.notes,
            phone: customer.phone,
            created_at: customer.date_created,
            updated_at: customer.date_modified
        }
    })
    
    // //insert
    if(response.data.data.length){
        await del(CUSTOMER_TABLE_NAME, customers, workspaceId)
        await insert(CUSTOMER_TABLE_NAME, customerColumn, customers, workspaceId)

        // console.log('!!', customers)
        await del(CUSTOMERAGGREGATE_TABLE_NAME, customers, workspaceId, 'customer_id', 'id')
        customers.map(async (customer) => {
            await aggregate(workspaceId, customer.id)
        })
    }
    //call next batch
    if(response.data.data.length < limit) {
        progress += response.data.data.length
        // socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} done`);
        return { lastPage: lastPage, progress: progress }
    } else {
        //call next page
        progress += response.data.data.length
        // socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} done`);
        return await SYNC({ shopName, accessToken, storeHash, lastPage: lastPage + 1, limit, workspaceId, progress })
    }
}



module.exports = {
    SYNC
}
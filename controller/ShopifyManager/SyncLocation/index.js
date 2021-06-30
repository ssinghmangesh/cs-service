const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {LOCATION_TABLE_NAME} = require("../../DataManager/helper")
const locationColumns = require("../../DataManager/Setup/locationColumns.json");
const { socket } = require("../../../socket");

const SYNC = async ({ shopName, accessToken, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchLocation(shopName, accessToken)
    // console.log('@@@@@@@@', response.data.locations)

    //insert
    if(response.data.locations.length){
        await del(LOCATION_TABLE_NAME, response.data.locations, workspaceId)
        await insert(LOCATION_TABLE_NAME, locationColumns, response.data.locations, workspaceId)
    }
    
    //call next batch
    progress += response.data.locations.length
    socket.emit("sync", workspaceId, 'locations', `${progress} of ${count} done`)
    console.log(`${progress} of ${count} done`);
    return response.data.locations[response.data.locations.length - 1].id
    
    // if(response.data.locations.length < limit) {
        // progress += response.data.locations.length
        // socket.emit("sync", `${progress} of ${count} done`)
        // console.log(`${progress} of ${count} done`);
    // } else {
    //     //call next since id
    //     progress += response.data.locations.length
    //     socket.emit("sync", `${progress} of ${count} done`)
    //     console.log(`${progress} of ${count} done`);
    //     let nextSinceId = response.data.locations[response.data.locations.length - 1].id;
    //     // console.log("nextSinceId", nextSinceId)
    //     await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
    // }
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 333 })
// .then(console.log)
// .catch(console.log)
const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {INVENTORYLEVEL_TABLE_NAME, INVENTORYITEM_TABLE_NAME, LOCATION_TABLE_NAME} = require("../../DataManager/helper")
const inventoryLevelColumns = require("../../DataManager/Setup/inventoryLevelColumns.json");
const { socket } = require("../../../socket");
const PostgresqlDb = require('../../../db')

const SYNC = async ({ shopName, accessToken, updatedAtMin = '2019-03-19T01:21:44-04:00', limit = 0, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch
    let data = await PostgresqlDb.query(`SELECT id FROM ${INVENTORYITEM_TABLE_NAME(workspaceId)};`)
    let inventoryItemIds = data.rows
    inventoryItemIds = [808950810,39072856,457924702]

    data = await PostgresqlDb.query(`SELECT id FROM ${LOCATION_TABLE_NAME(workspaceId)};`)
    const locationIds = []
    for(i = 0; i < data.rows.length; i++) {
        locationIds.push(Number(data.rows[i].id))
    }

    let response = await Shopify.fetchInventoryLevel(shopName, accessToken, { location_ids: locationIds })

    //insert
    // if(response.data.locations.length){
    //     await del(LOCATION_TABLE_NAME, response.data.locations, workspaceId)
    //     await insert(LOCATION_TABLE_NAME, locationColumns, response.data.locations, workspaceId)
    // }
    
    // //call next batch
    // if(response.data.locations.length < limit) {
    //     progress += response.data.locations.length
    //     socket.emit("sync", `${progress} of ${count} done`)
    //     console.log(`${progress} of ${count} done`);
    // } else {
    //     //call next since id
    //     progress += response.data.locations.length
    //     socket.emit("sync", `${progress} of ${count} done`)
    //     console.log(`${progress} of ${count} done`);
    //     let nextSinceId = response.data.locations[response.data.locations.length - 1].id;
    //     // console.log("nextSinceId", nextSinceId)
    //     await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
    // }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 333 })
// .then(console.log)
// .catch(console.log)
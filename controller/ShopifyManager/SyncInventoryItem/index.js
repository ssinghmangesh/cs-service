const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {INVENTORYITEM_TABLE_NAME} = require("../../DataManager/helper")
const inventoryItemColumns = require('../../DataManager/Setup/inventoryItemColumns.json');
const { socket } = require("../../../socket")
const PostgresqlDb = require('../../../db')

// console.log(socket);

const SYNC = async ({ shopName, accessToken, workspaceId}) => {

    let query = `SELECT inventory_item_id FROM variant${workspaceId};`
    let queryresponse = await PostgresqlDb.query(query)
    // console.log(queryresponse.rows)

    for(let i = 0; i < queryresponse.rows.length; i += 50) {
        let string = ''
        for(let j = i, c = 50; j < queryresponse.rows.length && c; j++, c--) {
            if(string.length) {
                string += ','
            }
            string += queryresponse.rows[i].inventory_item_id
        }
        let response = await Shopify.fetchInventoryItem(shopName, accessToken, string)

        // console.log('!', response.data.inventory_items)
        if(response.data.inventory_items.length) {
            await del(INVENTORYITEM_TABLE_NAME, response.data.inventory_items, workspaceId)
            await insert(INVENTORYITEM_TABLE_NAME, inventoryItemColumns, response.data.inventory_items, workspaceId)  
        }
    }
    return;
}

module.exports = {
    SYNC
}

// SYNC({ shopName: 'indian-dress-cart.myshopify.com', accessToken: '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', workspaceId: 56788582584 })
// .then(console.log)
// .catch(console.log)
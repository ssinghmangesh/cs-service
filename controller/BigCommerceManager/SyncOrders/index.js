const BigCommerce = require('../BigCommerce');
const { transformOrder } = require('../helper');
const {insert, del} = require("../../DataManager/index");

const {ORDER_TABLE_NAME, 
    LINEITEMS_TABLE_NAME, 
    REFUNDED_TABLE_NAME, 
    FULFILLMENT_TABLE_NAME, 
    TAX_TABLE_NAME, 
    DISCOUNTAPPLICATION_TABLE_NAME } = require("../../DataManager/helper")

const orderColumns = require("../../DataManager/Setup/orderColumns.json");
const fulfillmentColumns = require("../../DataManager/Setup/fulfillmentsColumns.json");
const lineitemsColumns = require("../../DataManager/Setup/lineItemsColumns.json");
const refundedColumns = require("../../DataManager/Setup/refundedColumns.json");
const taxColumns = require("../../DataManager/Setup/taxColumns.json");
const discountApplicationsColumns = require("../../DataManager/Setup/discountApplicationsColumns.json");

const SYNC = async ({accessToken, storeHash, lastPage = 1, limit = 50, workspaceId, progress = 0 }) => {
    //orders sync
    const response = await BigCommerce.fetchOrder(storeHash, accessToken, { page: lastPage })
    const orders = response.data.map(order => transformOrder(order))
    
    await del(ORDER_TABLE_NAME, orders, workspaceId);
    await insert(ORDER_TABLE_NAME, orderColumns, orders, workspaceId);

    //line_items sync
    let promises = []
    orders.map(order => promises.push(BigCommerce.fetchLineItems(storeHash, accessToken, {order_id: order.id})))
    const responses = await Promise.all(promises);
    let line_items = []
    responses.map(res => {
        line_items = line_items.concat(res.data)
    })
    
    await del(LINEITEMS_TABLE_NAME, line_items, workspaceId);
    await insert(LINEITEMS_TABLE_NAME, lineitemsColumns, line_items, workspaceId);

    if(response.data.length < limit) {
        progress += response.data.length
        // socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} done`);
        return { lastPage: lastPage, progress: progress }
    } else {
        //call next page
        progress += response.data.length
        // socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} done`);
        return await SYNC({accessToken, storeHash, lastPage: lastPage + 1, limit, workspaceId, progress })
    }
}

SYNC({storeHash: 'vodskxqu9',accessToken: '4ifdvpxr27ue5zdd8bbyt7q7xj7o780', workspaceId: 1001887130})
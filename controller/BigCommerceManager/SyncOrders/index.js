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

const SyncOrders = async (storeHash, accessToken, workspaceId, page=1) => {
    const res = await BigCommerce.fetchOrder(storeHash, accessToken, { page: page })
    const orders = res.data.map(order => transformOrder(order))
    // console.log(orders);
    await del(ORDER_TABLE_NAME, orders, workspaceId);
    await insert(ORDER_TABLE_NAME, orderColumns, orders, workspaceId);
    if(orders.length === 50){
        await SyncOrders(storeHash, accessToken, workspaceId, page + 1);
    }
}

SyncOrders('vodskxqu9', '4ifdvpxr27ue5zdd8bbyt7q7xj7o780', 56788582584)
const {SYNC: customerSync} = require("./SyncCustomer/index")
const {SYNC: orderSync} = require("./SyncOrder/index")
const {SYNC: productSync} = require("./SyncProduct/index")
const {SYNC: discountSync} = require("./SyncDiscount/index")
const {SYNC: cartSync} = require("./SyncCart/index")
const {SYNC: draftOrderSync} = require("./SyncDraftOrder/index")
const {SYNC: inventoryItemSync} = require("./SyncInventoryItem/index")
const {SYNC: inventoryLevelSync} = require("./SyncInventoryLevel/index")
const {SYNC: locationSync} = require("./SyncLocation/index")
const Shopify = require("./Shopify");
const { addRow, updateRow, deleteRow, fetchRow, fetchAllRows } = require("../SyncStatusManager/index")

const addRowHelper = async (workspaceId, objectType, totalCount) => {
    data = {
        workspace_id: workspaceId,
        object_type: objectType,
        last_object_id: 0,
        total_count: totalCount,
        created_at: Date.now(),
        updated_at: Date.now()
    }
    await addRow(data)
}

const updateRowHelper = async (workspaceId, objectType, lastObjectId) => {
    const data = {
        Key:{
            "workspace_id": workspaceId,
            "object_type": objectType
        },
        UpdateExpression: "set last_object_id = :lastObjectId, updated_at = :updatedAt",
        ExpressionAttributeValues:{
            ":lastObjectId": lastObjectId,
            ":updatedAt": Date.now(),
        }
    }
    await updateRow(data)
}


const syncAll = async ({ shopName, accessToken, limit = 50, workspaceId, table = null }) => {

    console.log("Order")
    const { data: { count: TotalOrderCount } } = await Shopify.fetchOrderCount(shopName, accessToken);
    if(TotalOrderCount && (!table || table === 'order')) {
        let orderSinceId = 0
        let response = await fetchRow({workspace_id: workspaceId, object_type: 'order'})
        if(Object.entries(response).length === 0) {
            console.log('first time')
            addRowHelper(workspaceId, 'order', TotalOrderCount)            
        } else {
            console.log('after first time')
            orderSinceId = response.Item.last_object_id;
        }
        const { data: { count: orderCount } } = await Shopify.fetchOrderCount(shopName, accessToken, orderSinceId);
        let lastObjectId = await orderSync({ shopName, accessToken, sinceId: orderSinceId, limit, workspaceId, count: orderCount })
        if(lastObjectId) {
            updateRowHelper(workspaceId, 'order', lastObjectId)
        }
    }

    console.log("product")
    const { data: {count: TotalProductCount } } = await Shopify.fetchProductCount(shopName, accessToken);
    if(TotalProductCount && (!table || table === 'product')) {
        let productSinceId = 0
        let response = await fetchRow({workspace_id: workspaceId, object_type: 'product'})
        if(Object.entries(response).length === 0) {
            console.log('first time')
            addRowHelper(workspaceId, 'product', TotalProductCount)            
        } else {
            console.log('after first time')
            productSinceId = response.Item.last_object_id;
        }
        const { data: {count: productCount } } = await Shopify.fetchProductCount(shopName, accessToken, productSinceId);
        let lastObjectId = await productSync({ shopName, accessToken, sinceId: productSinceId, limit, workspaceId, count: productCount })
        if(lastObjectId) {
            updateRowHelper(workspaceId, 'product', lastObjectId)
        }
    }
    
    console.log("discount")
    const { data: { count: totalDiscountCount } } = await Shopify.fetchDiscountCount(shopName, accessToken);
    if(totalDiscountCount && (!table || table === 'discount')) {
        let discountSinceId = 0
        let response = await fetchRow({workspace_id: workspaceId, object_type: 'discount'})
        if(Object.entries(response).length === 0) {
            console.log('first time')
            addRowHelper(workspaceId, 'discount', totalDiscountCount)            
        } else {
            console.log('after first time')
            discountSinceId = response.Item.last_object_id;
        }
        const { data: { count: discountCount } } = await Shopify.fetchDiscountCount(shopName, accessToken, discountSinceId);
        let lastObjectId = await discountSync({ shopName, accessToken, sinceId: discountSinceId, limit, workspaceId, count: discountCount })
        if(lastObjectId) {
            updateRowHelper(workspaceId, 'discount', lastObjectId)
        }
    }

    console.log("cart")
    const { data: { count: totalCartCount } } = await Shopify.fetchCartCount(shopName, accessToken);
    if(totalCartCount && (!table || table === 'cart')) {
        let cartSinceId = 0
        let response = await fetchRow({workspace_id: workspaceId, object_type: 'cart'})
        if(Object.entries(response).length === 0) {
            console.log('first time')
            addRowHelper(workspaceId, 'cart', totalCartCount)            
        } else {
            console.log('after first time')
            cartSinceId = response.Item.last_object_id;
        }
        const { data: { count: cartCount } } = await Shopify.fetchCartCount(shopName, accessToken, cartSinceId);
        let lastObjectId = await cartSync({ shopName, accessToken, sinceId: cartSinceId, limit, workspaceId, count: cartCount })
        if(lastObjectId) {
            updateRowHelper(workspaceId, 'cart', lastObjectId)
        }
    }

    console.log("draftOrder")
    const { data: { count: totalDraftOrderCount } } = await Shopify.fetchDraftOrderCount(shopName, accessToken);
    if(totalDraftOrderCount && (!table || table === 'draftorder')) {
        let draftOrderSinceId = 0
        let response = await fetchRow({workspace_id: workspaceId, object_type: 'draftorder'})
        if(Object.entries(response).length === 0) {
            console.log('first time')
            addRowHelper(workspaceId, 'draftorder', totalDraftOrderCount)            
        } else {
            console.log('after first time')
            draftOrderSinceId = response.Item.last_object_id;
        }
        const { data: { count: draftOrderCount } } = await Shopify.fetchDraftOrderCount(shopName, accessToken, draftOrderSinceId);
        let lastObjectId = await draftOrderSync({ shopName, accessToken, sinceId: draftOrderSinceId, limit, workspaceId, count: draftOrderCount })
        if(lastObjectId) {
            updateRowHelper(workspaceId, 'draftorder', lastObjectId)
        }
    }

    // // console.log("inventoryItem")
    // // // const { data: { count: inventoryItemCount } } = await Shopify.fetchinventoryItemCount(shopName, accessToken);
    // // // console.log('!!!!!!!!!!!', inventoryItemCount)
    // // await inventoryItemSync({ shopName, accessToken, limit, workspaceId, count: 0 });

    // // console.log("inventoryLevel")
    // // // const { data: { count: inventoryLevelCount } } = await Shopify.fetchinventoryLevelCount(shopName, accessToken);
    // // // console.log('!!!!!!!!!!!', inventoryLevelCount)
    // // await inventoryLevelSync({ shopName, accessToken, limit, workspaceId, count: 0 });

    console.log("location")
    /****************** sinceId not used in location ****************/
    const { data: { count: locationCount } } = await Shopify.fetchLocationCount(shopName, accessToken);
    if(locationCount && (!table || table === 'location')) {
        let locationSinceId = 0
        let response = await fetchRow({workspace_id: workspaceId, object_type: 'location'})
        if(Object.entries(response).length === 0) {
            console.log('first time')
            addRowHelper(workspaceId, 'location', locationCount)            
        } else {
            console.log('after first time')
            locationSinceId = response.Item.last_object_id;
        }
        let lastObjectId = await locationSync({ shopName, accessToken, sinceId: locationSinceId, limit, workspaceId, count: locationCount })
        if(lastObjectId) {
            updateRowHelper(workspaceId, 'location', lastObjectId)
        }
    }

    console.log("Customer");
    const { data: { count: totalCustomerCount } } = await Shopify.fetchCustomerCount(shopName, accessToken);
    if(totalCustomerCount && (!table || table === 'customer')) {
        let customerSinceId = 0
        let response = await fetchRow({workspace_id: workspaceId, object_type: 'customer'})
        if(Object.entries(response).length === 0) {
            console.log('first time')
            addRowHelper(workspaceId, 'customer', totalCustomerCount)            
        } else {
            console.log('after first time')
            customerSinceId = response.Item.last_object_id;
        }
        const { data: { count: customerCount } } = await Shopify.fetchCustomerCount(shopName, accessToken, customerSinceId);
        let lastObjectId = await customerSync({ shopName, accessToken, sinceId: customerSinceId, limit, workspaceId, count: customerCount })
        if(lastObjectId) {
            updateRowHelper(workspaceId, 'customer', lastObjectId)
        }
    }
    
    return {status: 200, message: "Successful"};
}

module.exports={
    syncAll
}

// syncAll({ shopName: 'indian-dress-cart.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 56788582584 })
// .then(console.log)
// .catch(console.log)
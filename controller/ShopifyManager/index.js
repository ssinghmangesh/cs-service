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

const syncAll = async ({ shopName, accessToken, limit, workspaceId }) => {
    console.log("Order")
    const { data: { count: orderCount } } = await Shopify.fetchOrderCount(shopName, accessToken);
    await orderSync({ shopName, accessToken, limit, workspaceId, count: orderCount });

    console.log("product")
    const { data: {count: productCount } } = await Shopify.fetchProductCount(shopName, accessToken);
    await productSync({ shopName, accessToken, limit, workspaceId, count: productCount });
    
    console.log("discount")
    const { data: { count: discountCount } } = await Shopify.fetchDiscountCount(shopName, accessToken);
    await discountSync({ shopName, accessToken, limit, workspaceId, count: discountCount });

    console.log("cart")
    const { data: { count: cartCount } } = await Shopify.fetchCartCount(shopName, accessToken);
    await cartSync({ shopName, accessToken, limit, workspaceId, count: cartCount });

    console.log("draftOrder")
    const { data: { count: draftOrderCount } } = await Shopify.fetchDraftOrderCount(shopName, accessToken);
    await draftOrderSync({ shopName, accessToken, limit, workspaceId, count: draftOrderCount });

    // console.log("inventoryItem")
    // // const { data: { count: inventoryItemCount } } = await Shopify.fetchinventoryItemCount(shopName, accessToken);
    // // console.log('!!!!!!!!!!!', inventoryItemCount)
    // await inventoryItemSync({ shopName, accessToken, limit, workspaceId, count: 0 });

    // console.log("inventoryLevel")
    // // const { data: { count: inventoryLevelCount } } = await Shopify.fetchinventoryLevelCount(shopName, accessToken);
    // // console.log('!!!!!!!!!!!', inventoryLevelCount)
    // await inventoryLevelSync({ shopName, accessToken, limit, workspaceId, count: 0 });

    console.log("location")
    const { data: { count: locationCount } } = await Shopify.fetchLocationCount(shopName, accessToken);
    await locationSync({ shopName, accessToken, limit, workspaceId, count: locationCount });

    console.log("Customer");
    const { data: { count: customerCount } } = await Shopify.fetchCustomerCount(shopName, accessToken);
    await customerSync({ shopName, accessToken, limit, workspaceId, count: customerCount });
    
    return {status: 200, message: "Successful"};
}

module.exports={
    syncAll
}

// syncAll({ shopName: 'indian-dress-cart.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 333 })
// .then(console.log)
// .catch(console.log)
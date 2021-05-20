const {SYNC: customerSync} = require("./SyncCustomer/index")
const {SYNC: orderSync} = require("./SyncOrder/index")
const {SYNC: productSync} = require("./SyncProduct/index")
const {SYNC: discountSync} = require("./SyncDiscount/index")
const Shopify = require("./Shopify");

const syncAll = async ({ shopName, accessToken, limit,workspaceId }) => {
    console.log("Customer");
    const { data: { count: customerCount } } = await Shopify.fetchCustomerCount(shopName, accessToken);
    await customerSync({ shopName, accessToken, limit, workspaceId, count: customerCount });

    console.log("Order")
    const { data: { count: orderCount } } = await Shopify.fetchOrderCount(shopName, accessToken);
    await orderSync({ shopName, accessToken, limit, workspaceId, count: orderCount });

    console.log("product")
    const { data: {count: productCount } } = await Shopify.fetchProductCount(shopName, accessToken);
    await productSync({ shopName, accessToken, limit, workspaceId, count: productCount });
    
    console.log("discount")
    const { data: { count: discountCount } } = await Shopify.fetchDiscountCount(shopName, accessToken);
    await discountSync({ shopName, accessToken, limit, workspaceId, count: discountCount });
    
    return {status: 200, message: "Successful"};
}

module.exports={
    syncAll
}
syncAll({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 1 })
.then(console.log)
.catch(console.log)
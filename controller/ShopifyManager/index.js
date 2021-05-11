const {SYNC: customerSync} = require("./SyncCustomer/index")
const {SYNC: orderSync} = require("./SyncOrder/index")
const {SYNC: productSync} = require("./SyncProduct/index")
const {SYNC: discountSync} = require("./SyncDiscount/index")

const syncAll = async ({ shopName, accessToken, limit,workspaceId }) => {
    console.log("Customer");
    await customerSync({ shopName, accessToken, limit, workspaceId });
    console.log("Order")
    await orderSync({ shopName, accessToken, limit, workspaceId });
    console.log("product")
    await productSync({ shopName, accessToken, limit, workspaceId });
    console.log("discount")
    await discountSync({ shopName, accessToken, limit, workspaceId });
    return {status: true, message: "Successful"};
}

module.exports={
    syncAll
}

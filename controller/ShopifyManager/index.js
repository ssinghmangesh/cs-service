const {SYNC: customerSync} = require("./SyncCustomer/index")
const {SYNC: orderSync} = require("./SyncOrder/index")
const {SYNC: productSync} = require("./SyncProduct/index")
const {SYNC: discountSync} = require("./SyncDiscount/index")

const syncAll = async ({ shopName, accessToken, limit,workspaceId }) => {
    await customerSync({ shopName, accessToken, limit, workspaceId });
    await orderSync({ shopName, accessToken, limit, workspaceId });
    await productSync({ shopName, accessToken, limit, workspaceId });
    await discountSync({ shopName, accessToken, limit, workspaceId });
    return {status: true, message: "Successful"};
}

module.exports={
    syncAll
}

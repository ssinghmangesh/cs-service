const {SYNC: customerSync} = require("./SyncCustomer/index")
const { addRow, updateRow, fetchRow } = require("../SyncStatusManager/index")

const addRowHelper = async (workspaceId, objectType, totalCount) => {
    data = {
        workspace_id: workspaceId,
        object_type: objectType,
        last_page: 1,
        total_count: totalCount,
        created_at: Date.now(),
        updated_at: Date.now(),
        progress: 0
    }
    await addRow(data)
}

const updateRowHelper = async (workspaceId, objectType, lastPage, progress) => {
    const data = {
        Key:{
            "workspace_id": workspaceId,
            "object_type": objectType
        },
        UpdateExpression: "set last_page = :lastPage, updated_at = :updatedAt, total_count = :progress",
        ExpressionAttributeValues:{
            ":lastPage": lastPage,
            ":updatedAt": Date.now(),
            ":progress": (lastPage - 1) * 50 + progress,
        }
    }
    await updateRow(data)
}

const syncAll = async ({ shopName, accessToken, storeHash, limit, workspaceId }) => {

    console.log("Customer");
    // const { data: { count: customerCount } } = await BigCommerce.fetchCustomerCount(shopName, accessToken);
    let lastPage = 1
    let response = await fetchRow({workspace_id: workspaceId, object_type: 'customer'})
    if(Object.entries(response).length === 0) {
        console.log('first time')
        addRowHelper(workspaceId, 'customer', 0)            
    } else {
        console.log('after first time')
        lastPage = response.Item.last_page;
    }

    let data = await customerSync({ shopName, accessToken, storeHash, lastPage, limit, workspaceId })
    if(data.lastPage) {
        updateRowHelper(workspaceId, 'customer', data.lastPage, data.progress)
    }
    
    return {status: 200, message: "Successful"};
}

module.exports={
    syncAll
}

// syncAll({ shopName: 'api.bigcommerce.com', accessToken: '774vc7resdvtz4zoqrnp3rmhrvqd2e6', storeHash: 'vodskxqu9', limit: 50, workspaceId: 56788582584 })
// .then(console.log)
// .catch(console.log)
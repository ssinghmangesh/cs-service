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

const updateRowHelper = async (workspaceId, objectType, lastPage, flag, progress) => {
    let totalCount = 0;
    if(flag) {
        totalCount = progress
    } else {
        totalCount = (lastPage - 1) * 50 + progress
    }
    const data = {
        Key:{
            "workspace_id": workspaceId,
            "object_type": objectType
        },
        UpdateExpression: "set last_page = :lastPage, updated_at = :updatedAt, total_count = :totalCount",
        ExpressionAttributeValues:{
            ":lastPage": lastPage,
            ":updatedAt": Date.now(),
            ":totalCount": totalCount,
        }
    }
    await updateRow(data)
}

const syncAll = async ({ shopName, accessToken, storeHash, limit, workspaceId }) => {

    console.log("Customer");
    let lastPage = 1, flag = 0
    let response = await fetchRow({workspace_id: workspaceId, object_type: 'customer'})
    if(Object.entries(response).length === 0) {
        flag = 1
        console.log('first time')
        addRowHelper(workspaceId, 'customer', 0)            
    } else {
        console.log('after first time')
        lastPage = response.Item.last_page;
    }

    let data = await customerSync({ shopName, accessToken, storeHash, lastPage, limit, workspaceId })
        updateRowHelper(workspaceId, 'customer', data.lastPage, flag, data.progress)
    
    return {status: 200, message: "Successful"};
}

module.exports={
    syncAll
}

// syncAll({ shopName: 'api.bigcommerce.com', accessToken: '774vc7resdvtz4zoqrnp3rmhrvqd2e6', storeHash: 'vodskxqu9', limit: 50, workspaceId: 1001887130 })
// .then(console.log)
// .catch(console.log)
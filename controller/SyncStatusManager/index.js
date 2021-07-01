const { insert, del, fetch, fetchAll, update } = require("../../aws/index");

const addRow = async (data) => {
    const params = {
        TableName: "SyncStatus",
        Item:{
            ...data
        }
    }
    return await insert(params);
}

// const data = {
//     workspace_id: 333,
//     table_name: "order333",
//     last_object_id: 0,
//     created_at: Date.now(),
//     updated_at: Date.now()
// }

// addRow(data)
// .then(console.log)
// .catch(console.log)

const updateRow = async (data) => {
    const params = {
        TableName: 'SyncStatus',
        ...data,
    }
    return await update(params);
}

const deleteRow = async (data) => {
    var params = {
        TableName: 'SyncStatus',
        ...data,
    }
    return await del(params)
}

const fetchRow = async (data) => {
    var params = {
        TableName: 'SyncStatus',
        Key: {
            ...data
        }
    }
    return await fetch(params)
}

const fetchAllRows = async (data) => {
    const params = {
        TableName: "SyncStatus"
    }
    return await fetchAll(params)
}

module.exports = {
    addRow,
    updateRow,
    deleteRow,
    fetchRow,
    fetchAllRows,
}
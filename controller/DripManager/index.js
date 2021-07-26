const { insert, del, fetch, fetchAll, update, query } = require("../../aws/index");
const { fetchWorkspace } = require("../UserManager");

const addDripSegment = async (data) => {
    const params = {
        TableName: "DripSegment",
        Item:{
            ...data
        }
    }
    return await insert(params);
}

const deleteDripSegment = async (data, workspaceId) => {
    var params = {
        TableName: 'DripSegment',
        Key:{
            // "workspace_id": workspaceId,
            // "cs_segment_id": data.csSegmentId
        }
    }
    return await del(params)
}

const fetchDripSegment = async (data) => {
    var params = {
        TableName: 'DripSegment',
        Key: {
            ...data
        }
    }
    return await fetch(params)
}

const fetchAllDripSegment = async () => {
    const params = {
        TableName: "DripSegment"
    }
    return await fetchAll(params)
}


module.exports = {
    addDripSegment,
    deleteDripSegment,
    fetchDripSegment,
    fetchAllDripSegment,
}
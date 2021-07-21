const { insert, del, fetch, fetchAll, update, query } = require("../../aws/index");

const addKlaviyoSegment = async (data) => {
    const params = {
        TableName: "KlaviyoSegment",
        Item:{
            ...data
        }
    }
    return await insert(params);
}

const deleteKlaviyoSegment = async (data, workspaceId) => {
    var params = {
        TableName: 'KlaviyoSegment',
        Key:{
            "workspace_id": workspaceId,
            "cs_segment_id": data.csSegmentId
        }
    }
    return await del(params)
}

const fetchKlaviyoSegment = async (data) => {
    var params = {
        TableName: 'KlaviyoSegment',
        Key: {
            ...data
        }
    }
    return await fetch(params)
}

const fetchAllKlaviyoSegment = async () => {
    const params = {
        TableName: "KlaviyoSegment"
    }
    return await fetchAll(params)
}

module.exports = {
    addKlaviyoSegment,
    deleteKlaviyoSegment,
    fetchKlaviyoSegment,
    fetchAllKlaviyoSegment,
}
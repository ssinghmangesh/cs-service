const { insert, del, fetch, fetchAll, update, query } = require("../../aws/index");

const addMailChimpSegment = async (data) => {
    const params = {
        TableName: "MailChimpSegment",
        Item:{
            ...data
        }
    }
    return await insert(params);
}

const deleteMailChimpSegment = async (data, workspaceId) => {
    var params = {
        TableName: 'MailChimpSegment',
        Key:{
            "workspace_id": workspaceId,
            "cs_segment_id": data.csSegmentId
        }
    }
    return await del(params)
}

const fetchMailChimpSegment = async (data) => {
    var params = {
        TableName: 'MailChimpSegment',
        Key: {
            ...data
        }
    }
    return await fetch(params)
}

const fetchAllMailChimpSegment = async () => {
    const params = {
        TableName: "MailChimpSegment"
    }
    return await fetchAll(params)
}

module.exports = {
    addMailChimpSegment,
    deleteMailChimpSegment,
    fetchMailChimpSegment,
    fetchAllMailChimpSegment,
}
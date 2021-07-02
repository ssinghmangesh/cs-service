const { insert, query, del } = require('../../aws/index')

const addSegment = async (workspaceId, data) => {
    const params = {
        TableName: 'Segment',
        Item: {
            'workspace_id': Number(workspaceId),
            'segment_id': Date.now(),
            'title': data.title,
            'filters': data.filters,
            'desc': data.desc,
            'type': data.type,
            'created_at': Date.now(),
            'updated_at': Date.now(),
        }
    }
    return await insert(params);
}

const deleteSegment = async (workspaceId, segmentId) => {
    const params = {
        TableName : "Segment",
        Key: {
            workspace_id: Number(workspaceId),
            segment_id: segmentId
        },
    }
    return await del(params);
}

const getSegments = async (workspaceId) => {
    const params = {
        TableName : "Segment",
        KeyConditionExpression: "workspace_id = :workspace_id",
        ExpressionAttributeValues: {
            ":workspace_id": Number(workspaceId)
        }
    }
    return await query(params)
}

module.exports = {
    addSegment,
    getSegments,
    deleteSegment,
}
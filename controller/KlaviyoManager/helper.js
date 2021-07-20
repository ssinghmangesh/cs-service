const { addKlaviyoSegment, fetchKlaviyoSegment } = require('./index')

const addKlaviyoSegmentHelper = async (details, workspaceId) => {
    const data = {
        workspace_id: workspaceId,
        cs_segment_id: details.csSegmentId,
        klviyo_segment_id: details.klviyoSegmentId,
        last_time_sync: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
    }
    return await addKlaviyoSegment(data)
}

const fetchKlaviyoSegmentHelper = async (details, workspaceId) => {
    const data = {
        workspace_id: workspaceId,
        cs_segment_id: details.csSegmentId
    }
    return await fetchKlaviyoSegment(data)
}

module.exports = {
    addKlaviyoSegmentHelper,
    fetchKlaviyoSegmentHelper,
}
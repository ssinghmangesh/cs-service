const { addDripSegment, fetchDripSegment } = require('./index')
const { fetchWorkspace } = require("../UserManager");

const addDripSegmentHelper = async (details, workspaceId) => {
    const data = {
        // workspace_id: workspaceId,
        // cs_segment_id: details.csSegmentId,
        // mailchimp_audience_id: details.mailChimpAudienceId,
        // mailchimp_segment_id: details.mailChimpSegmentId,
        // last_time_sync: Date.now(),
        // created_at: Date.now(),
        // updated_at: Date.now()
    }
    return await addDripSegment(data)
}

const fetchDripSegmentHelper = async (details, workspaceId) => {
    const data = {
        // workspace_id: workspaceId,
        // cs_segment_id: details.csSegmentId
    }
    return await fetchDripSegment(data)
}

module.exports = {
    addDripSegmentHelper,
    fetchDripSegmentHelper,
}
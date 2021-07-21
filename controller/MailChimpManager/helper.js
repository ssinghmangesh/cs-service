const { addMailChimpSegment, fetchMailChimpSegment } = require('./index')

const addMailChimpSegmentHelper = async (details, workspaceId) => {
    const data = {
        workspace_id: workspaceId,
        cs_segment_id: details.csSegmentId,
        mailchimp_audience_id: details.mailChimpAudienceId,
        mailchimp_segment_id: details.mailChimpSegmentId,
        last_time_sync: Date.now(),
        created_at: Date.now(),
        updated_at: Date.now()
    }
    return await addMailChimpSegment(data)
}

const fetchMailChimpSegmentHelper = async (details, workspaceId) => {
    const data = {
        workspace_id: workspaceId,
        cs_segment_id: details.csSegmentId
    }
    return await fetchMailChimpSegment(data)
}

module.exports = {
    addMailChimpSegmentHelper,
    fetchMailChimpSegmentHelper,
}
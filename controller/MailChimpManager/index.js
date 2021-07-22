const { insert, del, fetch, fetchAll, update, query } = require("../../aws/index");
const { fetchWorkspace } = require("../UserManager");
const client = require("@mailchimp/mailchimp_marketing");

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

const fetchAllMailChimpAudience = async (workspaceId) => {
    const {Item: workspace} = await fetchWorkspace({ "workspace_id": workspaceId });
    client.setConfig({
        apiKey: workspace.mailchimpData.accessToken,
        server: workspace.mailchimpData.server,
    });
    const response = await client.lists.getAllLists();
    const data = response.lists.map(list => ({
        text: list.name,
        value: list.id
    }))
    return data
}


module.exports = {
    addMailChimpSegment,
    deleteMailChimpSegment,
    fetchMailChimpSegment,
    fetchAllMailChimpSegment,
    fetchAllMailChimpAudience
}
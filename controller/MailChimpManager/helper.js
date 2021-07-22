const { addMailChimpSegment, fetchMailChimpSegment } = require('./index')
const { table } = require("../KlaviyoManager/helper");
const { fetchWorkspace } = require("../UserManager");
const client = require("@mailchimp/mailchimp_marketing");

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


const sync = async(workspaceId, segment, audienceId) => {
    try{ 
        // console.log('sync');
        const {Item: workspace} = await fetchWorkspace({ "workspace_id": workspaceId });
        client.setConfig({
            apiKey: workspace.mailchimpData.accessToken,
            server: workspace.mailchimpData.server,
        });
        const { Item } = await fetchMailChimpSegmentHelper({csSegmentId: segment.segment_id}, workspaceId)
        if(Item){
            await client.lists.deleteSegment(audienceId, Item.mailchimp_segment_id);
        }
        let res = await table({table: 'customeraggregate', workspaceId, filters: segment.filters})
        // console.log(res);
        let promises = res.map((item) => {
            return new Promise(async (resolve, reject) => {
                try{
                    await client.lists.addListMember(audienceId, {
                        email_address: item.email,
                        status: "unsubscribed",
                    });
                    resolve();
                }catch(err){
                    // console.log(err.response.error);
                    resolve();
                }
            })
        })
        await Promise.all(promises)
        const mailchimpSegment = await client.lists.createSegment(audienceId, { 
            name: segment.title,
            static_segment: []
        });
        // console.log(mailchimpSegment);
        promises = res.map((item) => {
            return new Promise(async (resolve, reject) => {
                try{
                    await client.lists.createSegmentMember(audienceId, mailchimpSegment.id, {
                        email_address: item.email,
                    });
                    resolve();
                }catch(err){
                    // console.log(err.response);
                    resolve();
                }
            })
        })
        await Promise.all(promises)
        // console.log(typeof addMailChimpSegmentHelper);
        await addMailChimpSegmentHelper({ csSegmentId: segment.segment_id, mailChimpAudienceId: audienceId, mailChimpSegmentId: mailchimpSegment.id}, workspaceId)
        // console.log(mailchimpSegment.id);
    }catch(err){
        console.log(err);
        throw err;
    }
}

// const segment = {
//     "title": "Active Monthly",
//     "segment_id": 133566,
//     "default": true,
//     "filters": {
//       "relation": "AND",
//       "conditions": [
//         {
//           "columnName": "last_seen",
//           "dataType": "timestamptz",
//           "filterType": "greater_than",
//           "title": "Last Seen",
//           "type": "timestamptz",
//           "values": [30, ""]
//         }
//       ]
//     }
//   }

// sync(56788582584, segment, '0b1119ffac');

module.exports = {
    addMailChimpSegmentHelper,
    fetchMailChimpSegmentHelper,
    sync,
}
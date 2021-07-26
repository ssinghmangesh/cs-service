const drip = require('drip-nodejs')
const { addDripSegment, fetchDripSegment } = require('./index')
const { fetchWorkspace } = require("../UserManager");
const { table } = require('../KlaviyoManager/helper');

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

const addSubscribers = (client, batch) => {
    return new Promise((resolve, reject) => {
        client.updateBatchSubscribers(batch,async (errors, responses, bodies) => {
            // Do stuff
            if(errors){
                reject();
            }
            resolve()
        })
    })
}

const sync = async (workspaceId, segment) => {
    try{
        const {Item: workspace} = await fetchWorkspace({ "workspace_id": workspaceId });
        const client = drip(workspace.dripData);
        let page = 1
        while(true) {
            const res = await table({table: 'customeraggregate', workspaceId, filters: segment.filters, limit: 1000, skipRowby: (page-1)*1000})
            const batch = {
                "batches": [{
                "subscribers": res.map(item => ({
                    "email": item.email,
                    "tags": `[Custom Segment] ${segment.title}`
                }))
                }]
            };
            await addSubscribers(client, batch)
            if(res.length < 1000){
                break;
            }
            page += 1
        }
        return true;
    }catch(err){
        console.log(err);
        throw(err);
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

// sync(56788582584, segment);

module.exports = {
    addDripSegmentHelper,
    fetchDripSegmentHelper,
    sync,
}
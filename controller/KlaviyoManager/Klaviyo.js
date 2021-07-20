const Klaviyo = require('node-klaviyo');
const { deleteKlaviyoSegment } = require('.');
const { fetchWorkspace } = require('../UserManager')
const { fetchKlaviyoSegmentHelper, addKlaviyoSegmentHelper, table } = require('./helper')

const sync = async (workspaceId, segment) => {
  try{
    const {Item: workspace} = await fetchWorkspace({ "workspace_id": workspaceId });
    const KlaviyoClient = new Klaviyo({
      publicToken: workspace.klaviyoData.publicKey,
      privateToken: workspace.klaviyoData.privateKey
    });
    const { Item } = await fetchKlaviyoSegmentHelper({csSegmentId: segment.segment_id}, workspaceId)
    if(Item){
      await KlaviyoClient.lists.deleteList(Item.klaviyo_list_id);
      await deleteKlaviyoSegment({csSegmentId: segment.segment_id}, workspaceId);
    }
    let res = await table({table: 'customeraggregate', workspaceId, filters: segment.filters})
    const { list_id } = await KlaviyoClient.lists.createList(segment.title);
    if(res.length){
      await KlaviyoClient.lists.addMembersToList({
        listId: list_id,
        profiles: res
      });
    }
    res  = await addKlaviyoSegmentHelper({csSegmentId: segment.segment_id, klaviyoListId: list_id}, workspaceId)
  }catch(err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  sync,
}

// const segment = {
//   "title": "Discount Lover",
//   "default": true,
//   "segment_id": 13356,
//   "filters": {
//     "relation": "AND",
//     "conditions": [
//       {
//         "columnName": "discount_lover",
//         "dataType": "numeric",
//         "filterType": "greater_than",
//         "title": "Discount Lover",
//         "type": "number",
//         "values": ["80", ""]
//       }
//     ]
//   }
// }

// sync(56788582584, segment);
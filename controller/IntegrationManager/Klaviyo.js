const Klaviyo = require('node-klaviyo');
const { fetchWorkspace } = require('../UserManager')

const sync = async (workspaceId) => {
    const {Item: workspace} = await fetchWorkspace({ "workspace_id": workspaceId });
    // console.log(res);
    const KlaviyoClient = new Klaviyo({
        publicToken: workspace.klaviyoData.publicKey,
        privateToken: 'pk_5a9cc515df4d80e877c9e96b2a0cfc72ea'
    });
    // const list = await KlaviyoClient.lists.createList('My New List');
    // console.log(list);
    // const lists = await KlaviyoClient.lists.getLists()
    // console.log(lists);
}

sync(56788582584);
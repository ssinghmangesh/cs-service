const { insert, query, del } = require("../../aws")
const { fetchWorkspace } = require("../UserManager")
const { table, updateCustomer, updateOrder, updateProduct, updateDraftOrder } = require("./helper")

const addTag = async (workspaceId, data) => {
    try{
        data.workspace_id = workspaceId
        const params = {
            TableName: 'Tags',
            Item: {
                ...data
            }
        }
        await insert(params)
    }catch(err){
        console.log(err);
        throw err;
    }
}

const getTags = async (workspaceId, {type}) => {
    try{
        const params = {
            TableName: 'Tags',
            KeyConditionExpression: '#workspaceId = :workspaceId',
            ExpressionAttributeNames: {
                '#workspaceId': 'workspace_id',
            },
            ExpressionAttributeValues: {
                ':workspaceId': workspaceId,
            }
        }

        const res = await query(params)
        // console.log(res);
        return res.Items.filter(item => item.type === type);
    }catch(err){
        console.log(err);
        throw err
    }
}

const deleteTag = async (workspaceId, { tag_id }) => {
    const params = {
        TableName : "Tags",
        Key: {
            workspace_id: workspaceId,
            tag_id
        },
    }
    return await del(params);
}

const customerTags = async (tags, Item, workspaceId) => {
    const customers = {}
    for( let i=0; i<tags.length; i++){
        const res = await table({table: 'customeraggregate', workspaceId, filters: tags[i].filters})
        res.forEach(customer => {
            customers[customer.id] = customers[customer.id] ? customers[customer.id]+', '+tags[i].then : tags[i].then;
        })
        // console.log(res);
    }
    // console.log(customers);
    // console.log(tags);
    const promises = Object.keys(customers).map(key => updateCustomer(Item.shop_name, Item.access_token, key, customers[key]))
    await Promise.all(promises)
    return true
}

const orderTags = async (tags, Item, workspaceId) => {
    const orders = {}
    for( let i=0; i<tags.length; i++){
        const res = await table({table: 'order', workspaceId, filters: tags[i].filters})
        res.forEach(order => {
            orders[order.id] = orders[order.id] ? orders[order.id]+', '+tags[i].then : tags[i].then;
        })
        // console.log(res);
    }
    const promises = Object.keys(orders).map(key => updateOrder(Item.shop_name, Item.access_token, key, orders[key]))
    await Promise.all(promises)
    return true;
}

const productTags = async (tags, Item, workspaceId) => {
    const products = {}
    for( let i=0; i<tags.length; i++){
        const res = await table({table: 'product', workspaceId, filters: tags[i].filters})
        // console.log(res);
        res.forEach(product => {
            products[product.id] = products[product.id] ? products[product.id]+', '+tags[i].then : tags[i].then;
        })
        // console.log(res);
    }
    const promises = Object.keys(products).map(key => updateProduct(Item.shop_name, Item.access_token, key, products[key]))
    await Promise.all(promises)
    return true;
}

draftOrderTags = async (tags, Item, workspaceId) => {
    const draftOrders = {}
    for( let i=0; i<tags.length; i++){
        const res = await table({table: 'draftOrder', workspaceId, filters: tags[i].filters})
        // console.log(res);
        res.forEach(draftOrder => {
            draftOrders[draftOrder.id] = draftOrders[draftOrder.id] ? draftOrders[draftOrder.id]+', '+tags[i].then : tags[i].then;
        })
        // console.log(res);
    }
    const promises = Object.keys(draftOrders).map(key => updateDraftOrder(Item.shop_name, Item.access_token, key, draftOrders[key]))
    await Promise.all(promises)
    return true;
}

const applyTags = async (workspaceId, {type, trigger}) => {
    const params = {
        TableName: 'Tags',
        KeyConditionExpression: '#workspaceId = :workspaceId',
        ExpressionAttributeNames: {
            '#workspaceId': 'workspace_id',
        },
        ExpressionAttributeValues: {
            ':workspaceId': workspaceId,
        }
    }
    const { Item } = await fetchWorkspace({workspace_id: workspaceId})
    // console.log(Item);
    const res = await query(params)
    const tags = res.Items.filter(item => (item.type === type && item.trigger_points.includes(trigger)));
    switch(type) {
        case 'customers':
            await customerTags(tags, Item, workspaceId);
            break;
        case 'orders':
            await orderTags(tags, Item, workspaceId);
            break;
        case 'product':
            await productTags(tags, Item, workspaceId);
            break;
        case 'product':
            await draftOrderTags(tags, Item, workspaceId);
            break
        default:
            break;
    }
    console.log('done');
}

applyTags(56788582584, { type: 'product', trigger: 'orderRefunded' });

module.exports = {
    addTag,
    getTags,
    deleteTag,
    applyTags,
}
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

const customerTags = async (tags, Item, workspaceId, filters) => {
    const customers = {}
    for( let i=0; i<tags.length; i++){
        const res = await table({table: 'customeraggregate', workspaceId, filters: {relation: tags[i].filters.relation, conditions: [ ...tags[i].filters.conditions, ...filters.conditions ]}})
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

const orderTags = async (tags, Item, workspaceId, filters) => {
    const orders = {}
    for( let i=0; i<tags.length; i++){
        const res = await table({table: 'order', workspaceId, filters: {relation: tags[i].filters.relation, conditions: [ ...tags[i].filters.conditions, ...filters.conditions ]}})
        res.forEach(order => {
            orders[order.id] = orders[order.id] ? orders[order.id]+', '+tags[i].then : tags[i].then;
        })
        // console.log(res);
    }
    const promises = Object.keys(orders).map(key => updateOrder(Item.shop_name, Item.access_token, key, orders[key]))
    await Promise.all(promises)
    return true;
}

const productTags = async (tags, Item, workspaceId, filters) => {
    const products = {}
    for( let i=0; i<tags.length; i++){
        const res = await table({table: 'product', workspaceId, filters: {relation: tags[i].filters.relation, conditions: [ ...tags[i].filters.conditions, ...filters.conditions ]}})
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

const draftOrderTags = async (tags, Item, workspaceId, filters) => {
    const draftOrders = {}
    for( let i=0; i<tags.length; i++){
        const res = await table({table: 'draftOrder', workspaceId, filters: {relation: tags[i].filters.relation, conditions: [ ...tags[i].filters.conditions, ...filters.conditions ]}})
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

const applyTags = async (workspaceId, {type, trigger, filters}) => {
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
    let tags = res.Items.filter(item => item.type === type);
    if(trigger) {
        tags = tags.filter(item => item.trigger_points.includes(trigger))
    }
    switch(type) {
        case 'customers':
            await customerTags(tags, Item, workspaceId, filters);
            break;
        case 'orders':
            await orderTags(tags, Item, workspaceId, filters);
            break;
        case 'product':
            await productTags(tags, Item, workspaceId, filters);
            break;
        case 'draftorders':
            await draftOrderTags(tags, Item, workspaceId, filters);
            break
        default:
            break;
    }
    console.log('done');
}

// const filters = {
//     conditions: [{
//         columnName: 'id',
//         dataType: 'numeric',
//         filterType: 'equal_to',
//         values: [5307973697720]
//     }]
// }

// applyTags(56788582584, { type: 'customers', filters });

module.exports = {
    addTag,
    getTags,
    deleteTag,
    applyTags,
}
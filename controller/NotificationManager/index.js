const { insert, del, fetch, fetchAll, update, query } = require("../../aws/index");
const PostgresqlDb = require('../../db')

const addNotification = async (data) => {
    const params = {
        TableName: "Notification",
        Item:{
            ...data
        }
    }
    return await insert(params);
}

const updateNotification = async (data, workspaceId, workspaceName) => {
    // console.log(workspaceId, data.notificationType);
    var params = {
        TableName:'Notification',
        Key:{
            "workspaceName": workspaceName,
            "notificationType": data.notificationType
        },
        UpdateExpression: "set workspaceId = :workspaceId",
        ExpressionAttributeValues: {
            ":workspaceId": workspaceId
        }
    };
    if(data.value !== undefined){
        params.UpdateExpression += ', #value = :value'
        params.ExpressionAttributeNames = { ...params.ExpressionAttributeNames, "#value": 'value' }
        params.ExpressionAttributeValues = { ...params.ExpressionAttributeValues, ":value": data.value }
    }
    if(data.templateId !== undefined){
        params.UpdateExpression += ' templateId = :templateId'
        params.ExpressionAttributeValues = { ...params.ExpressionAttributeValues, ":templateId": data.templateId }
    }
    return await update(params);
}

const deleteNotification = async (data) => {
    var params = {
        TableName: 'Notification',
        Key:{
            "workspace_id": data.workspaceId
        }
    }
    return await del(params)
}

const fetchNotification = async (data) => {
    var params = {
        TableName: 'Notification',
        Key: {
            ...data
        }
    }
    return await fetch(params)
}

const fetchAllNotifications = async (workspaceId) => {
    const params = {
        TableName: "Notification"
    }
    return await fetchAll(params)
}

const getWorkspace = async ({shopName, notificationType}) => {
    try{

        let params = { 
            TableName: 'Workspace',
            IndexName: 'shop-index',
            KeyConditionExpression: 'shop_name = :shop_name',
            ExpressionAttributeValues: { ':shop_name': shopName } 
        }
        let res = await query(params);
        const workspace = {
            workspaceId: res.Items[0].workspace_id,
            domain: res.Items[0].shop.domain,
            moneyFormat: res.Items[0].shop.money_with_currency_in_emails_format,
            owner: res.Items[0].shop.customer_email,
            name: res.Items[0].shop.name
        }
        params = {
            TableName: 'Notification',
            Key: {
                workspaceName: shopName,
                notificationType
            }
        }
        res = await fetch(params)
        if(res.Item && res.Item.value) {
            return {status: true, workspace}
        }
        return {status: false}
    } catch(err) {
        console.log(err);
        throw err
    }
}

const getProductImages = async(workspaceId, data) => {
    try{
        const promises = data.products.map(({product_id, variant_id}) => {
            return new Promise(async (resolve, reject) => {
                const query = `SELECT images FROM product${workspaceId} where id = ${product_id}`
                const res = await PostgresqlDb.query(query);
                const response = { variant_id }
                res.rows[0].images.map((image, index) => {
                    if(index == 0){
                        response.image_url = image.src
                    }
                    if (image.variant_ids.includes(variant_id)) {
                        response.image_url = image.src
                    }
                })
                resolve(response);
            })
        })
        const res = await Promise.all(promises);
        return res;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

// getProductImages(56788582584, [
//     {
//         product_id: 6718142251192,
//         variant_id: 39859538821304
//     },
//     {
//         product_id: 6718142251192,
//         variant_id: 39859538755768
//     },
//     {
//         product_id: 6718142251192,
//         variant_id: 39859538788536
//     },
// ]);

// getWorkspace('indian-dress-cart.myshopify.com', 'orderCreated')
// .then(console.log)

module.exports = {
    addNotification,
    updateNotification,
    deleteNotification,
    fetchNotification,
    fetchAllNotifications,
    getWorkspace,
    getProductImages,
}
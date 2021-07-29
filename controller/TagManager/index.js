const { insert, query, del } = require("../../aws")

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

module.exports = {
    addTag,
    getTags,
    deleteTag,
}
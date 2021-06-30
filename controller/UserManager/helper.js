const upload = require("../../aws/upload");
const { updateUser } = require("./user");
const { updateUserToWorkpace } = require("./userToWorkspace");
const { insert, del, fetchAll, fetch, update } = require("../../aws/index");

const getAllWorkspaces = async ({ userId }) => {
    let params = {
        TableName: "UserToWorkspace",
        FilterExpression: "user_id = :userId",
        ExpressionAttributeValues: { ":userId": userId }
    }
    const res = await fetchAll(params)
    const workspaces = []
    for(let i=0; i<res.Items.length;i++){
        params = {
            TableName: "Workspace",
            Key: {
                workspace_id: res.Items[i].workspace_id
            },
            ProjectionExpression: "workspace_id, shop_name"
        }
        const {Item: workspace} = await fetch(params)
        workspaces.push(workspace);
    }
    return workspaces
}


const editUser = async (file, data, workspaceId) => {
    const { Location } = await upload(file);
    let value = {
        Key:{
            "user_id": data.user_id
        },
        UpdateExpression: `set #name = :name, #status = :status, #username = :username,${Location ? 'src = :src,' : ''} updated_at = :updated_at`,
        ExpressionAttributeNames: {
            "#name": "name",
            "#status": "status",
            "#username": "username"
        },
        ExpressionAttributeValues:{
            ":name": data.name,
            ":status": data.status,
            ":username": data.username,
            ":updated_at": Date.now()
        }
    }
    if (Location) {
        value.ExpressionAttributeValues[':src'] = Location
    }
    await updateUser(value)
    value = {
        Key:{
            "user_id": data.user_id,
            "workspace_id": Number(workspaceId)
        },
        UpdateExpression: `set #role = :role, #company = :company`,
        ExpressionAttributeNames: {
            "#role": "role",
            "#company": "company"
        },
        ExpressionAttributeValues:{
            ":role": data.role,
            ":company": data.company,
        }
    }
    return await updateUserToWorkpace(value);
}

module.exports = {
    editUser,
    getAllWorkspaces
}
const upload = require("../../aws/upload");
const { updateUser } = require("./user");
const { updateUserToWorkpace } = require("./userToWorkspace");

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
    editUser
}
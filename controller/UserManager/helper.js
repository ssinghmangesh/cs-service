const upload = require("../../aws/upload");
const { updateUser } = require("./user");

const editUser = async (file, data) => {
    const { Location } = await upload(file);
    const value = {
        Key:{
            "user_id": data.user_id
        },
        UpdateExpression: `set #name = :name, #role = :role, #status = :status, #company = :company, #username = :username,${Location ? 'src = :src,' : ''} updated_at = :updated_at`,
        ExpressionAttributeNames: {
            "#name": "name",
            "#role": "role",
            "#status": "status",
            "#company": "company",
            "#username": "username"
        },
        ExpressionAttributeValues:{
            ":name": data.name,
            ":role": data.role,
            ":status": data.status,
            ":company": data.company,
            ":username": data.username,
            ":src": Location,
            ":updated_at": Date.now()
        }
    }
    return await updateUser(value)
}

module.exports = {
    editUser
}
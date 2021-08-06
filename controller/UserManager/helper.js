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
            ProjectionExpression: "workspace_id, shop_name, shop"
        }
        let {Item: workspace} = await fetch(params)
        workspace = { 
            ...workspace, 
            timezone: workspace.shop.timezone, 
            currency: workspace.shop.money_format, 
            currencies: workspace.shop.enabled_presentment_currencies 
        }
        delete workspace.shop;
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
        },
        ReturnValues:"ALL_NEW"
    }
    if (Location) {
        value.ExpressionAttributeValues[':src'] = Location
    }
    const response = await updateUser(value)
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
    await updateUserToWorkpace(value);
    return response;
}

const getAllUserToWorkspaces = async (userId) => {
    let params = {
        TableName: "UserToWorkspace",
        FilterExpression: "user_id = :userId and #role = :role",
        ExpressionAttributeNames: {
            "#role": "role"
        },
        ExpressionAttributeValues: { ":userId": userId, ":role": "admin" },
        ProjectionExpression: "workspace_id"
    }
    const { Items } = await fetchAll(params)
    // return Items;
    const promises = []
    Items.forEach(item => {
        params = {
            TableName: "Workspace",
            Key: {
                workspace_id: item.workspace_id
            },
            ProjectionExpression: "workspace_id, shop_name"
        }
        promises.push(fetch(params))
    })
    const res = await Promise.all(promises);
    return res.map(item => item.Item)
}

const setCurrentWorkspace = async ({userId, workspace}) => {
    try {
        const params = {
            TableName: 'User',
            Key:{
                "user_id": userId,
            },
            UpdateExpression: "set current_workspace = :workspaceId",
            ExpressionAttributeValues:{
                ":workspaceId": workspace,
            },
        };
        await update(params);
    } catch(err) {
        console.log(err);
        throw err;
    }
}

// const data = [
//     {
//       module: 'read',
//       Admin: true,
//       Author: false,
//       Editor: false,
//       Maintainer: false,
//       Subscriber: false,
//       Staff: false
//     },
//     {
//       module: 'write',
//       Admin: false,
//       Author: true,
//       Editor: false,
//       Maintainer: false,
//       Subscriber: false,
//       Staff: false
//     },
//     {
//       module: 'create',
//       Admin: false,
//       Author: false,
//       Editor: true,
//       Maintainer: false,
//       Subscriber: false,
//       Staff: false
//     },
//     {
//       module: 'delete',
//       Admin: false,
//       Author: false,
//       Editor: false,
//       Maintainer: true,
//       Subscriber: false,
//       Staff: false
//     },
//   ]

const PermissionsDataConverter = (data) => {
    console.log('data received', data)
    const array = ['Admin', 'Author', 'Editor', 'Staff', 'Subscriber', 'Maintainer']
    let perData = {
        Admin: {},
        Author: {},
        Editor: {},
        Staff: {},
        Subscriber: {},
        Maintainer: {}
    }
    array.forEach((role) => {
        let obj = {
            read: false,
            write: false,
            create: false,
            delete: false
        }
        data.forEach((item) => {
            obj[item.module] = item[role]
        })
        perData[role] = obj
    })
    console.log(perData)
    return perData
}

module.exports = {
    editUser,
    getAllWorkspaces,
    getAllUserToWorkspaces,
    setCurrentWorkspace,
    PermissionsDataConverter,
}
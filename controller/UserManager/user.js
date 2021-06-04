const { insert, del, fetch, fetchAll, update } = require("../../aws/index");

const addUser = async (data) => {
    const params = {
            TableName: "User",
            Item:{
                ...data
        }
    }
    return await insert(params);
}

// const data = {
//     userId: "3",
//     name: "Nimish",
//     password: "123456",
//     email: "nimish@gmail.com"
// }

// addUser(data);
const updateUser = async (data) => {
    const params = {
        TableName: 'User',
        ...data,
    }
    return await update(params);
}

const deleteUser = async (data) => {
    var params = {
            TableName: 'User',
            Key:{
                "user_id": data.userId
            }
        }
    return await del(params)
}

const fetchUser = async (data) => {
    var params = {
        TableName: 'User',
        Key: {
            ...data
        }
    }
    return await fetch(params)
}

const fetchAllUsers = async (data) => {
    const params = {
        TableName: "User"
    }
    return await fetchAll(params)
}

module.exports = {
    addUser,
    deleteUser,
    fetchUser,
    fetchAllUsers,
    updateUser,
}
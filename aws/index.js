var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();


const insert = async (params) => {
    try{
        return await docClient.put(params).promise()
    }
    catch(err){
        return err.message
    }
}

const update = async (params) => {
    try{
        return await docClient.update(params).promise();
    }
    catch(err){
        console.log(err.message);
        return err.message
    }
}

// var params = {
//     TableName: "User",
    // Item:{
    //     "user_id": string,
    //     "name": string,
    //     "password": string,
    //     "email": string
    // }
// }

const del = async (params) => {
    try{
        return await docClient.delete(params).promise()
    }
    catch(err){
        return err.message
    }
}


// var params = {
//     TableName: string,
//     Key:{
//         "user_id": string
//     }
// }


const fetch = async (params) => {
    try{
        return await docClient.get(params).promise()
    }
    catch(err){
        return err.message
    }
}

const query = async (params) => {
    try{
        return await docClient.query(params).promise()
    }
    catch(err){
        return err.message
    }
}
// var params = {
//     TableName: "User",
//     Item:{
//         "user_id": "1",
//         "name": "Devashish",
//         "password": "123456",
//         "email": "dev@gmail.com"    
//     }
// }

const fetchAll = async (params) => {
    return await docClient.scan(params).promise();
}

// var params = {
//     TableName: "User",
// };

// fetchAll(params).then(console.log).catch(console.log)


module.exports = {
    insert,
    del,
    fetch,
    fetchAll,
    update,
    query,
}
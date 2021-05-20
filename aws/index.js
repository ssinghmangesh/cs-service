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
        // , function(err, data) {
    //     if (err) {
    //         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    //     } else {
    //         console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            
    //         return "kl";
    //     }
    // });
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

// insert(params).then(console.log).catch(console.log)


module.exports = {
    insert,
    del,
    fetch
}
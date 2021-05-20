var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();


const insert = async (params) => {
<<<<<<< HEAD
    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
=======
    try{
        return await docClient.put(params).promise()
    }
    catch(err){
        return err.message
    }
>>>>>>> 3cc1bfcc4cbedde5238b7a78e0030c4897bbefd3
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
<<<<<<< HEAD
    console.log("deleting item...")
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
=======
    try{
        return await docClient.delete(params).promise()
    }
    catch(err){
        return err.message
    }
>>>>>>> 3cc1bfcc4cbedde5238b7a78e0030c4897bbefd3
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
    console.log("Scanning Movies table.");
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
    fetchAll
}
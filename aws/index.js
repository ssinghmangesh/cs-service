var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Adding a new item...");


const insert = async (params) => {
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
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
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}

// var params = {
//     TableName: string,
//     Key:{
//         "user_id": string
//     }
// }

// insert(params).then(console.log).catch(console.log)

module.exports = {
    insert,
    del
}
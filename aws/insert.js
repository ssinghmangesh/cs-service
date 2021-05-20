var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

const insert = (table, parameters) => {
    console.log(table)
    console.log(parameters)
    var params = {
        TableName: "User",
        Item: {
            "user_id": "5",
            "name": "name1",
            "email": "email1",
            "password": "password1"
        }
        // TableName: table,
        // Item: {
        //     "id": parameters.id,
            // "name": parameters.name,
            // "email": parameters.email,
            // "password": parameters.password,
        //     "workspaceId": parameters.workspaceId
        // }
    }
    let name = parameters.name
    let email = parameters.email
    let password = parameters.password
    var params = {
        TableName: table,
        Item: {
            name,
            email,
            password,
            user_id: "7"
        }
    }
    console.log(params)
    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
}


module.exports = {
    insert
}
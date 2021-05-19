var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var params = {}

const insert = (table, parameters) => {
    console.log(table)
    console.log(parameters)
    params = {
        TableName: `${table}`,
        Item: {
            "userId": parameters.id,
            "name": parameters.name,
            "email": parameters.email,
            "password": parameters.password,
            "workspaceId": parameters.workspaceId
        }
    }
}

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});

insert("User", {id: 1, name: "name1", email: "email1", password: "password1", workspaceId: [1, 2]})
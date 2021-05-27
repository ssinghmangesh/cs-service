var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

const del = (table, parameters) => {
    console.log(table)
    console.log(parameters)
    let user_id = parameters.user_id
    var params = {
        TableName: table,
        Key: {
           user_id 
        }
    }
    console.log(params)
    console.log("Deleting item...");
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted item:", JSON.stringify(data, null, 2));
        }
    });
}


module.exports = {
    del
}
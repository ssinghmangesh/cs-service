
var AWS = require("aws-sdk");
const userParams = require("./createTable/user.js");
const workspaceParams = require("./createTable/workspace.js");
const userToWorkspaceParams = require("./createTable/userToWorkspace.js");


AWS.config.update({
  region: "ap-south-1"
});

var dynamodb = new AWS.DynamoDB();



dynamodb.createTable(userParams, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

dynamodb.createTable(workspaceParams, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
dynamodb.createTable(userToWorkspaceParams, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
module.exports = {
    TableName : "Workspace",
    KeySchema: [       
        { AttributeName: "workspaceId", KeyType: "HASH"},
        // { AttributeName: "name", KeyType: "RANGE" }
        // { AttributeName: "password", KeyType: "RANGE" } //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "workspaceId", AttributeType: "N" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 100, 
        WriteCapacityUnits: 100
    }
};

module.exports = {
    TableName : "Workspace",
    KeySchema: [       
        { AttributeName: "workspace_id", KeyType: "HASH"},
        // { AttributeName: "name", KeyType: "RANGE" }
        // { AttributeName: "password", KeyType: "RANGE" } //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "workspace_id", AttributeType: "N" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 100, 
        WriteCapacityUnits: 100
    }
};


module.exports = {
    TableName : "SyncStatus",
    KeySchema: [       
        { AttributeName: "workspace_id", KeyType: "HASH"}
    ],
    AttributeDefinitions: [       
        { AttributeName: "workspace_id", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 100, 
        WriteCapacityUnits: 100
    }
};


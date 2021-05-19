module.exports = {
    TableName : "UserToWorkspace",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"}
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 100, 
        WriteCapacityUnits: 100
    }
};


module.exports = {
    TableName : "User",
    KeySchema: [       
        { AttributeName: "userId", KeyType: "HASH"}
    ],
    AttributeDefinitions: [       
        { AttributeName: "userId", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 100, 
        WriteCapacityUnits: 100
    }
};


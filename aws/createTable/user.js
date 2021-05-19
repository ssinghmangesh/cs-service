
module.exports = {
    TableName : "User",
    KeySchema: [       
        { AttributeName: "user_id", KeyType: "HASH"}
    ],
    AttributeDefinitions: [       
        { AttributeName: "user_id", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 100, 
        WriteCapacityUnits: 100
    }
};


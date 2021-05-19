const { CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    DISCOUNT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    VARIANT_TABLE_NAME } =  require("../DataManager/helper")

const Dashboard = require('./index.js')

// Dashboard.count({TABLE_NAME: CUSTOMER_TABLE_NAME, workspaceId: 333, 
//                 startdate: '2021-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
// .then(console.log)
// .catch(console.log)

// Dashboard.sum({TABLE_NAME: ORDER_TABLE_NAME, columnname: 'total_price', workspaceId: 333, 
//     startdate: '2021-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
// .then(console.log)
// .catch(console.log)

// Dashboard.barGraph({TABLE_NAME: ORDER_TABLE_NAME, columnname: 'total_price', groupBykey: 'YEAR', workspaceId: 333, 
//     startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
// .then(console.log)
// .catch(console.log)

// Dashboard.pieChart({TABLE_NAME: ORDER_TABLE_NAME, columnname: 'cancel_reason', workspaceId: 333, 
//     startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
// .then(console.log)
// .catch(console.log)

let filters = {
    "relation": "AND",  //AND  OR
    conditions: [
        {
            "relation": "AND",  //AND  OR
            conditions: [{
                type: "CUSTOMER", //CUSTOMER. ORDER, Cart
                columnName: "created_at",
                filterType: "between",  // >, <,=, not 
                dataType: "timestamptz[]",
                values: ['2020-05-13 11:49:40.765997+05:30', '2021-05-13 11:49:40.765997+05:30']
            },
            {
                type: "CUSTOMER", //CUSTOMER. ORDER, Cart
                columnName: "accepts_marketing",
                filterType: "equal_to",  // >, <,=, not 
                dataType: "boolean",
                values: 'FALSE'
            }]
        },
        {
            "relation": "OR",  //AND  OR
            conditions: [{
                realtion: "AND",
                conditions: [
                    {
                        "relation": "OR",  //AND  OR
                        conditions: [{
                            type: "CUSTOMER", //CUSTOMER. ORDER, Cart
                            columnName: "name",
                            filterType: "in",  // >, <,=, not 
                            dataType: "varchar[]",
                            values: ['hello', 'world', 'number', '1']
                        },
                        {
                            type: "CUSTOMER", //CUSTOMER. ORDER, Cart
                            columnName: "amount",
                            filterType: "in",  // >, <,=, not 
                            dataType: "numeric[]",
                            values: [10, 20, 30]
                        }]
                    }
                ]
            },
            {
                type: "CUSTOMER", //CUSTOMER. ORDER, Cart
                columnName: "amount",
                filterType: "in",  // >, <,=, not 
                dataType: "numeric[]",
                values: [10, 20, 30]
            }]
        }
    ]


}

Dashboard.table({TABLE_NAME: CUSTOMER_TABLE_NAME, workspaceId: 333, orderBykey: 'created_at', limit: 5, skipRowby: 3, filters})
.then(console.log)
.catch(console.log)


/*
    1. x-axis = datetime, y-axis = revenue
    2. pichart

*/
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

Dashboard.barGraph({TABLE_NAME: ORDER_TABLE_NAME, columnname: 'total_price', groupBykey: 'YEAR', workspaceId: 333, 
    startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
.then(console.log)
.catch(console.log)

// Dashboard.pieChart({TABLE_NAME: ORDER_TABLE_NAME, columnname: 'cancel_reason', workspaceId: 333, 
//     startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
// .then(console.log)
// .catch(console.log)

// Dashboard.table({TABLE_NAME: CUSTOMER_TABLE_NAME, workspaceId: 333, orderBykey: 'created_at', limit: 5, skipRowby: 3})
// .then(console.log)
// .catch(console.log)


/*
    1. x-axis = datetime, y-axis = revenue
    2. pichart

*/
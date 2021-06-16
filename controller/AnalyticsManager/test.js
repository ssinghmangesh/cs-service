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

// Dashboard.lineGraph({TABLE_NAME: 'order333', columnname: 'total_price',
//     dates: [{startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'},
//     {startdate: '2019-01-01 11:49:40.765997+05:30', enddate: '2021-01-01 11:49:40.765997+05:30'}],
//     statsDefinition: {"aggregate": "count", "columnname": "id"}})
// .then(console.log)
// .catch(console.log)

// Dashboard.barGraph({TABLE_NAME: 'order333', columnname: 'total_price', groupBykey2: 'fulfillment_status',
//     startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30',
//     prevstartdate: '2019-01-01 11:49:40.765997+05:30', prevenddate: '2021-01-01 11:49:40.765997+05:30',
//     statsDefinition: {"aggregate": "count", "columnname": "id"}})
// .then(console.log)
// .catch(console.log)

// Dashboard.pieChart({TABLE_NAME: ORDER_TABLE_NAME, columnname: 'cancel_reason', workspaceId: 333, 
//     startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
// .then(console.log)
// .catch(console.log)

// Dashboard.table({TABLE_NAME: CUSTOMER_TABLE_NAME, workspaceId: 333, orderBykey: 'created_at', limit: 5, skipRowby: 3, filters})
// .then(console.log)
// .catch(console.log)

// statsDefinition = [
//     {
//         aggregate: 'sum',
//         columnname: 'total_price',
//         alias: 'Total'
//     },
//     {
//         aggregate: 'count',
//         columnname: 'total_price',
//         alias: 'Total_Count'
//     },
//     {
//         aggregate: '',
//         columnname: 'email',
//         alias: 'Email'
//     },
//     {
//         aggregate: 'avg',
//         columnname: 'total_price',
//         alias: 'Average'
//     },
//     {
//         aggregate: 'max',
//         columnname: 'total_price',
//         alias: 'Maximum'
//     },
//     {
//         aggregate: 'min',
//         columnname: 'total_price',
//         alias: 'Minimum'
//     },
//     {
//         aggregate: '',
//         columnname: 'id',
//         alias: 'ID'
//     }
// ]

// Dashboard.tableGroupBy({groupBykey: ['fulfillment_status', 'buyer_accepts_marketing'], statsDefinition: statsDefinition})
// .then(console.log)
// .catch(console.log)

// Dashboard.stats({TABLE_NAME: 'order333', workspaceId: 333, limit: 5, skipRowby: 0, statsDefinition: statsDefinition})
// .then(console.log)
// .catch(console.log)

// Dashboard.timeline({workspaceId: 333, customerId: 0})
// .then(console.log)
// .catch(console.log)

/*
    1. x-axis = datetime, y-axis = revenue
    2. pichart

*/
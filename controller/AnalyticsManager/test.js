const { CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    DISCOUNT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    VARIANT_TABLE_NAME } =  require("../DataManager/helper")

const Dashboard = require('./index.js')

// let filters1 = {
//     relation: 'AND',
//     conditions:
//      [ { columnName: 'status',
//          type: 'text',
//          dataType: 'varchar',
//          title: 'Status',
//          filterType: 'not_in',
//          values: ["completed"] } ]
// }

// statsDefinition = [
//     {
//         aggregate: 'sum',
//         columnname: 'total_price',
//         alias: 'Revenue',
//     },
//     {
//         aggregate: 'sum',
//         columnname: 'fulfillment_status',
//         alias: 'Status',
//         operator: '=',
//         value: ['fulfilled', 'partial']
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

// Dashboard.count({table: 'order', workspaceId: 56788582584, 
//                 startdate: '2021-01-01 11:49:40.765997+05:30', enddate: '2021-07-16 11:49:40.765997+05:30', filters: filters1})
// .then(console.log)
// .catch(console.log)

// Dashboard.sum({table: 'order', columnname: 'total_price', workspaceId: 56788582584})
// .then(console.log)
// .catch(console.log)

// Dashboard.lineGraph({TABLE_NAME: 'order56788582584', columnname: 'total_price',
//     dates: [{startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-07-16 11:49:40.765997+05:30'},
//     {startdate: '2019-01-01 11:49:40.765997+05:30', enddate: '2021-01-01 11:49:40.765997+05:30'}],
//     statsDefinition: {"aggregate": "count", "columnname": "id"}})
// .then(console.log)
// .catch(console.log)

// Dashboard.barGraph({TABLE_NAME: 'order56788582584', columnname: 'total_price', groupBykey2: 'fulfillment_status',
//     startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-07-16 11:49:40.765997+05:30',
//     prevstartdate: '2019-01-01 11:49:40.765997+05:30', prevenddate: '2021-01-01 11:49:40.765997+05:30',
//     statsDefinition: {"aggregate": "count", "columnname": "id"}})
// .then(console.log)
// .catch(console.log)

// Dashboard.pieChart({table: 'order', columnname: 'cancel_reason', workspaceId: 56788582584, statsDefinition: { aggregate: 'sum', columnname: 'total_price', alias: 'Revenue' },
//     startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-07-16 11:49:40.765997+05:30'})
// .then(console.log)
// .catch(console.log)

// Dashboard.table({TABLE_NAME: CUSTOMER_TABLE_NAME, workspaceId: 56788582584, orderBykey: 'created_at', limit: 5, skipRowby: 3, filters})
// .then(console.log)
// .catch(console.log)

// Dashboard.stats({table: 'draftorder', workspaceId: 56788582584, statsDefinition: statsDefinition, filters: filters1})
// .then(console.log)
// .catch(console.log)

// Dashboard.tableGroupBy({groupBykey: ['fulfillment_status', 'buyer_accepts_marketing'], statsDefinition: statsDefinition})
// .then(console.log)
// .catch(console.log)

// Dashboard.stats({TABLE_NAME: 'order56788582584', workspaceId: 56788582584, limit: 5, skipRowby: 0, statsDefinition: statsDefinition})
// .then(console.log)
// .catch(console.log)

// Dashboard.timeline({workspaceId: 56788582584, customerId: 0})
// .then(console.log)
// .catch(console.log)

/*
    1. x-axis = datetime, y-axis = revenue
    2. pichart

*/
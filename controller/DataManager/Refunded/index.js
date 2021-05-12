const PostgresqlDb = require('./../../../db')
const { REFUNDED_TABLE_NAME, getInsertQuery, getDelQuery  } =  require("../helper")
const refundedColumn = require('./../Setup/refundedColumns')

const del = async (data, workspaceId) => {
    let query = getDelQuery(REFUNDED_TABLE_NAME, data, workspaceId);
    // console.log(query);
    let response =  await PostgresqlDb.query(query);
    // console.log(response);
}



const insert = async(data, workspaceId) => {

    
    let query = getInsertQuery(REFUNDED_TABLE_NAME, refundedColumn, data, workspaceId)
    // console.log(query);
    await PostgresqlDb.query(query);
}

// const order = require('../Order/order.json')
// insert([ order ], 111)
// .then(console.log)
// .catch(console.log)

module.exports = {
    insert,
    del
}
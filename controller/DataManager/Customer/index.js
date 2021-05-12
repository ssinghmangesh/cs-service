const PostgresqlDb = require('./../../../db')

const { CUSTOMER_TABLE_NAME, getInsertQuery, getDelQuery } =  require("../helper")
const customerColumn = require('./../Setup/customerColumns')


const insert = async(data, workspaceId) => {

    let query = getInsertQuery(CUSTOMER_TABLE_NAME, customerColumn, data, workspaceId);
    // console.log(query)
    await PostgresqlDb.query(query)
}

const del = async (data, workspaceId) => {
    let query = getDelQuery(CUSTOMER_TABLE_NAME, data, workspaceId);
    // `DELETE FROM ${CUSTOMER_TABLE_NAME(workspaceId)} WHERE id IN ${getIds(data)}`
    // // console.log(query);
    let response =  await PostgresqlDb.query(query);
    // // console.log(response);
}

// const order = require('../Order/order.json')
// del([ order ], 12345)
// .then(console.log)
// .catch(console.log)


module.exports = {
    insert,
    del
}

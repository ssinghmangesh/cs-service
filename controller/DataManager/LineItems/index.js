const PostgresqlDb = require('./../../../db')
const { LINEITEMS_TABLE_NAME, getInsertQuery, getDelQuery  } =  require("../helper")
const lineitemsColumn = require('./../Setup/lineitemsColumns')

const del = async (data, workspaceId) => {
    let query = getDelQuery(LINEITEMS_TABLE_NAME, data, workspaceId);
    // console.log(query);
    let response =  await PostgresqlDb.query(query);
    // console.log(response);
}



const insert = async(data, workspaceId) => {

   
    let query = getInsertQuery(LINEITEMS_TABLE_NAME, lineitemsColumn, data, workspaceId)
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
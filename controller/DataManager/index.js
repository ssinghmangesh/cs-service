const PostgresqlDb = require('../../db');

const {getColumnName, getValues, getIds} =  require("./helper")



const insert = async(TABLE_NAME, column ,data, workspaceId) => {

    const query = `
        INSERT INTO ${TABLE_NAME(workspaceId)}
        ${getColumnName({ columnData: column })}
        VALUES ${getValues({ columnData: column, data })}
    `
    // console.log(query)
    await PostgresqlDb.query(query)
}

const del = async (TABLE_NAME, data, workspaceId) => {
    const query = `DELETE FROM ${TABLE_NAME(workspaceId)} WHERE id IN ${getIds(data)}`
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

const PostgresqlDb = require('./../../../db')
const { getIds, FULFILLMENT_TABLE_NAME } =  require("../helper")
const fulfillmentsColumn = require('./../Setup/fulfillmentsColumns.json')

const del = async (data, workspaceId) => {
    let query = getDelQuery(FULFILLMENT_TABLE_NAME, data, workspaceId);
    // console.log(query);
    let response =  await PostgresqlDb.query(query);
    // console.log(response);
}



const insert = async(data, workspaceId) => {

    let query = getInsertQuery(FULFILLMENT_TABLE_NAME, fulfillmentsColumn, data, workspaceId)

    // console.log(query);
    await PostgresqlDb.query(query);
}

const getColumnName = ({ columnData }) => {
    let query = `(${columnData.map(col => col.columnName).join(", ")})`

    return query
}

const getValues = ({ columnData, data }) => {

    let allRow = data.map(value => {

        let row = columnData.map(col => {

            if(col.dataType === 'varchar') {
                if(value[col.columnName]) {
                    return `'${value[col.columnName]}'`
                } else {
                    return `''`
                }
            } else if(col.dataType === 'numeric') {
                if(value[col.columnName]) {
                    return value[col.columnName]
                } else {
                    return `0`
                }
            } else if(col.dataType === 'boolean') {
                if(typeof value[col.columnName] === 'bool') {
                    return value[col.columnName]
                } else {
                    return false
                }
            } else if(col.dataType === 'timestamp' || col.dataType === 'timestamptz' ) {
                if(value[col.columnName]) {
                    return `'${value[col.columnName]}'`
                } else {
                    // return `'${Date()}'`
                    return `NULL`
                }
            } else if(col.dataType === 'jsonb') {
                if(value[col.columnName]) {
                    let details = JSON.stringify(value[col.columnName])
                    return `'${details}'`
                } else {
                    return `'{}'`
                }
            }
        }).join(", ")
        return `( ${row}) `
    }).join(", ")


    return allRow
}

// const order = require('../Order/order.json')
// insert([ order ], 111)
// .then(console.log)
// .catch(console.log)

module.exports = {
    insert,
    del
}
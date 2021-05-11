const PostresqlDb = require('./../../../db')
const CUSTOMER_TABLE_NAME = (workspaceId) => {
    return `customer${workspaceId}`
}

const costumerColumn = require('../Setup/customerColumns.json')
const insert = async (data, workspaceId) => {

// `
//     insert into product111 
//         (id, email, closed_at, created_at, updated_at, number, buyer_accepts_marketing, client_details, discount_codes) 
//     values 
//         (1, 'user1@gmail.com', '2021-05-10'::timestamp, '2021-05-01'::timestamp, '2021-05-02'::timestamp, 1234567890, true, '{ "customer": "user1", "items": { "product": "bulb","qty": 24 } }', '{ "code": "discount30", "amount": "30.00", "type": "fixed_amount" }'), 
//         (1, 'user1@gmail.com', '2021-05-10'::timestamp, '2021-05-01'::timestamp, '2021-05-02'::timestamp, 1234567890, true, '{ "customer": "user1", "items": { "product": "bulb","qty": 24 } }', '{ "code": "discount30", "amount": "30.00", "type": "fixed_amount" }');
// `

    let query = `
        INSERT INTO ${CUSTOMER_TABLE_NAME(workspaceId)}
        ${getColumnName({ columnData: costumerColumn })}
        VALUES ${getValues({columnData: costumerColumn, data })}
    
    `


    console.log(query)

    await PostresqlDb.query(query)
}


module.exports = {
    insert
}

const getColumnName = ({ columnData }) => {
    let query = `(${columnData.map(col => col.columnName).join(", ")})`

    return query
}

getValues = ({ columnData, data }) => {

    /**
     * data: 
     * refer to ./Order/order.json
     * 
     */
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
                    return `'2008-01-10T11:00:00-05:00'`
                }
            } else if(col.dataType === 'jsonb') {
                return `'{}'`
            }
        }).join(", ")
        return `( ${row}) `
    }).join(",")


    return allRow

}

const order = require('../Order/order.json')
insert([ order ], 111)
.then(console.log)
.catch(console.log)



/****
 * 1. timestamp convert to timestamptz
 * 2. default value for timestamp
 * 3. handle jsonb and jsonb for array
 * 
 * /
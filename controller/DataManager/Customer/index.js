const PostresqlDb = require('./../../../db')


const costumerColumn = require
const insert = (data) => {

// `
//     insert into product111 
//         (id, email, closed_at, created_at, updated_at, number, buyer_accepts_marketing, client_details, discount_codes) 
//     values 
//         (1, 'user1@gmail.com', '2021-05-10'::timestamp, '2021-05-01'::timestamp, '2021-05-02'::timestamp, 1234567890, true, '{ "customer": "user1", "items": { "product": "bulb","qty": 24 } }', '{ "code": "discount30", "amount": "30.00", "type": "fixed_amount" }'), 
//         (1, 'user1@gmail.com', '2021-05-10'::timestamp, '2021-05-01'::timestamp, '2021-05-02'::timestamp, 1234567890, true, '{ "customer": "user1", "items": { "product": "bulb","qty": 24 } }', '{ "code": "discount30", "amount": "30.00", "type": "fixed_amount" }');
// `

    let query = `
        INSERT INTO ${TABLE_NAME}
        ${getColumnName({ columnData: costumerColumn })}
        VALUES ${getValues({columnData: costumerColumn, data })}
    
    `




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
    data.map(value => {

        let oneRowQuery = ''
        columnData.map(col => {
            if(col.dataType === 'varchar') {
                data[col.columnName]
            } else if(col.dataType === 'timestamp') {
                        
            } else if(col.dataType === 'jsonb') {

            }
        })
        
    
    })
    

}
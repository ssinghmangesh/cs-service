
const PostgresqlDb = require('../../../db')
const { ORDER_BY, LIMIT, abstractData } = require('../helper')
// const { whereClause } = require('./../../filters.js')

class Cart {
    static async cart({TABLE_NAME, cartId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE id = ${cartId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async product({TABLE_NAME, cartId, workspaceId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        console.log('product')
        let query = ``
        query = `SELECT product_id FROM ${TABLE_NAME} WHERE id = ${cartId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        let data = abstractData(await PostgresqlDb.query(query));
        console.log(data)
        let array = data[0].product_id
        let response = []
        for(let i = 0; i < array.length; i++) {
            query = `SELECT * FROM product${workspaceId} WHERE id = ${array[i]};`
            let product = abstractData(await PostgresqlDb.query(query));
            response.push(product)
        }
        return response
    }
}

module.exports = Cart
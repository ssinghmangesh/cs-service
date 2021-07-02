
const PostgresqlDb = require('../../../db')
const { ORDER_BY, LIMIT, abstractData } = require('../helper')
// const { whereClause } = require('./../../filters.js')

class DraftOrder {
    static async draftOrder({TABLE_NAME, draftOrderId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE id = ${draftOrderId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async product({TABLE_NAME, productId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE id = ${productId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }
}

module.exports = DraftOrder
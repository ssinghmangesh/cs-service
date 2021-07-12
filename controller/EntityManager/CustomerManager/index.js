
const PostgresqlDb = require('../../../db')
const { ORDER_BY, LIMIT, abstractData } = require('../helper')
// const { whereClause } = require('./../../filters.js')

class Customer {
    static async customer({TABLE_NAME, customerId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE id = ${customerId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async orders({TABLE_NAME, customerId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = ${customerId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async cart({TABLE_NAME, customerId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = ${customerId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async productPurchased({TABLE_NAME, customerId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        console.log(customerId)
        query = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = ${customerId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async productInCart({TABLE_NAME, customerId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT product_id FROM ${TABLE_NAME} WHERE customer_id = ${customerId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async event({TABLE_NAME, customerId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = ${customerId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async notification({TABLE_NAME, customerEmail, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE receiver = '${customerEmail}' ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }
    
}

module.exports = Customer

// Customer.aggregate({customerId: 2861387415684, workspaceId: 333, aggregateDefinition: aggregateDefinition})
// .then(console.log)
// .catch(console.log)

// static async aggregate({TABLE_NAME, customerId, workspaceId, aggregateDefinition}) {
//     if(typeof aggregateDefinition === 'undefined' || aggregateDefinition.length === 0) {
//         return
//     }
//     let queryAggregate = `SELECT `
//     let queryNonAggregate = `SELECT `
//     let f = 0, g = 0
//     for(let i = 0; i < aggregateDefinition.length; i++) {
//         if(aggregateDefinition[i].aggregate === '') {
//             if(f) {
//                 queryNonAggregate += `, `
//             }
//             queryNonAggregate += `${aggregateDefinition[i].columnname}`
//             queryNonAggregate += ` AS ${aggregateDefinition[i].alias}`
//             f = 1
//         } else {
//             if(g) {
//                 queryAggregate += `, `
//             }
//             queryAggregate += `${aggregateDefinition[i].aggregate}(${aggregateDefinition[i].columnname})`
//             queryAggregate += ` AS ${aggregateDefinition[i].alias}`
//             g = 1
//         }
//     }
//     queryAggregate += ` FROM ${TABLE_NAME} ${WHERE_CLAUSE({customerId})};`
//     queryNonAggregate += ` FROM ${TABLE_NAME} ${WHERE_CLAUSE({customerId})};`
//     let dataAggregate = [], dataNonAggregate = []
//     if(g) dataNonAggregate = abstractData(await PostgresqlDb.query(queryNonAggregate));
//     if(f) dataAggregate = abstractData(await PostgresqlDb.query(queryAggregate));
//     const data = [...dataAggregate, ...dataNonAggregate]
//     return data
// }
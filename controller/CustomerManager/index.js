
const PostgresqlDb = require('./../../db')
// const { whereClause } = require('./../../filters.js')


const WHERE_CLAUSE = ({startdate, enddate, customerId}) => {
    let query = `WHERE customer_id = ${customerId}`
    if(startdate && enddate) {
        query += ` AND created_at >= '${startdate}' AND created_at <= '${enddate}'`
    }
    return query
}

const abstractData = (response, type) => {
    //extract only rows
    let res = null
    if(type === "single") {
        res = response.rows[0]
    } else {
        res = response.rows
    }
    return res
}

class Customer {
    static async orders({TABLE_NAME, startdate, enddate, customerId, orderBykey = 'created_at', orderByDirection = 'asc', limit = 1, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate, customerId})} ORDER BY ${orderBykey} ${orderByDirection} LIMIT ${limit} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async cart({TABLE_NAME, startdate, enddate, customerId, orderBykey = 'created_at', orderByDirection = 'asc', limit = 5, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate, customerId})} ORDER BY ${orderBykey} ${orderByDirection} LIMIT ${limit} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async pageViewed({TABLE_NAME, customerId, orderBykey = 'page_id', orderByDirection = 'asc', limit = 5, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} ${WHERE_CLAUSE({customerId})} ORDER BY ${orderBykey} ${orderByDirection} LIMIT ${limit} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async aggregate({customerId, workspaceId, aggregateDefinition}) {
        let queryAggregate = `SELECT `
        let queryNonAggregate = `SELECT `
        let f = 0, g = 0
        for(let i = 0; i < aggregateDefinition.length; i++) {
            if(aggregateDefinition[i].aggregate === '') {
                if(f) {
                    queryNonAggregate += `, `
                }
                queryNonAggregate += `${aggregateDefinition[i].columnname}`
                queryNonAggregate += ` AS ${aggregateDefinition[i].alias}`
                f = 1
            } else {
                if(g) {
                    queryAggregate += `, `
                }
                queryAggregate += `${aggregateDefinition[i].aggregate}(${aggregateDefinition[i].columnname})`
                queryAggregate += ` AS ${aggregateDefinition[i].alias}`
                g = 1
            }
        }
        queryAggregate += ` FROM customeraggregate${workspaceId} ${WHERE_CLAUSE({customerId})};`
        queryNonAggregate += ` FROM customeraggregate${workspaceId} ${WHERE_CLAUSE({customerId})};`
        // console.log('!!!!!', queryAggregate)
        // console.log('@@@@@', queryNonAggregate)
        let dataAggregate = [], dataNonAggregate = []
        if(g) dataNonAggregate = abstractData(await PostgresqlDb.query(queryNonAggregate));
        if(f) dataAggregate = abstractData(await PostgresqlDb.query(queryAggregate));
        // console.log('!!!!!!!!!!!!!!', dataNonAggregate)
        // console.log('@@@@@@@@@@@@@@', dataAggregate)
        const data = [...dataAggregate, ...dataNonAggregate]
        return data
    }
}

module.exports = Customer

// Customer.aggregate({customerId: 2861387415684, workspaceId: 333, aggregateDefinition: aggregateDefinition})
// .then(console.log)
// .catch(console.log)
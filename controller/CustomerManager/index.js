
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
        console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async cart({TABLE_NAME, startdate, enddate, customerId, orderBykey = 'created_at', orderByDirection = 'asc', limit = 5, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate, customerId})} ORDER BY ${orderBykey} ${orderByDirection} LIMIT ${limit} OFFSET ${skipRowby};`
        console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async pageViewed({TABLE_NAME, customerId, orderBykey = 'page_id', orderByDirection = 'asc', limit = 5, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} ${WHERE_CLAUSE({customerId})} ORDER BY ${orderBykey} ${orderByDirection} LIMIT ${limit} OFFSET ${skipRowby};`
        console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }
}

module.exports = Customer

// Customer.orders({TABLE_NAME: 'order333', startdate: '2021-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30', customerId: 0})
// .then(console.log)
// .catch(console.log)
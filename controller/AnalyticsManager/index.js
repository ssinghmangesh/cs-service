
const PostgresqlDb = require('./../../db')
const { whereClause } = require('./../../filters.js')


const WHERE_CLAUSE = ({startdate, enddate}) => {
    return ` WHERE created_at >= '${startdate}' AND created_at <= '${enddate}'`
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

class Dashboard {
    static async count({TABLE_NAME, workspaceId, startdate, enddate}) {
        let query = ``

        query = `SELECT COUNT(*) FROM ${TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async sum({TABLE_NAME, columnname, workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT SUM(${columnname}) FROM ${TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async barGraph({TABLE_NAME, columnname, groupBykey = 'MONTH', workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT EXTRACT(${groupBykey} FROM created_at) AS Period, SUM(${columnname}) AS Revenue FROM ${TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY Period ORDER BY Period;`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async pieChart({TABLE_NAME, columnname, workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT ${columnname}, COUNT(${columnname}) AS Count FROM ${TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY ${columnname};`
        return abstractData(await PostgresqlDb.query(query));
    }

    static async table({TABLE_NAME, workspaceId, orderBykey, limit = 10, skipRowby = 0, filters = {}}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME(workspaceId)} ${whereClause(filters)} ORDER BY ${orderBykey} LIMIT ${limit} OFFSET ${skipRowby};`
        // console.log(query)
        return abstractData(await PostgresqlDb.query(query));
    }
}

module.exports = Dashboard


// Dashboard.Ordertaxamount({workspaceId: 333, startdate: '2021-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
// .then(console.log)
// .catch(console.log)



/*
Dashboard API
1. Total number of customer in a workspace
2. Total number of order in a workspace 
3. Total number of itemItem in a workspace (product sold)
4. Total number of product in a workspace
5. Total number of variant in a workspace
6. Total amount of all orders
7. Total tax paid by all orders
8. Order placed based on a date range, what was the total amount of all orders.

*/



/*

(condtion)
startdate = 
enddate = 
let WHERE_CLAUSE = ''
if(startdate  &&  enddat) {
    WHERE_CLAUSE = ``
}
let query = `
    SLECT COUNT(*) FROM ${TABLE_NAME} ${WHERE_CLAUSE};` 
*/

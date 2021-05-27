
const PostgresqlDb = require('./../../db')
// const { whereClause } = require('./../../filters.js')


const WHERE_CLAUSE = ({startdate, enddate}) => {
    if(startdate && enddate) {
        return ` WHERE created_at >= '${startdate}' AND created_at <= '${enddate}'`
    }
    else return ''
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
    static async count({TABLE_NAME, startdate, enddate}) {
        let query = ``
        query = `SELECT COUNT(*) FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})};`
        console.log(query);
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async sum({TABLE_NAME, columnname, startdate, enddate}) {
        let query = ``
        query = `SELECT SUM(${columnname}) FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})};`
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async lineGraph({TABLE_NAME, columnname, groupBykey = 'MONTH', startdate, enddate, x = 'x', y = 'y'}) {
        let query = ``
        query = `SELECT EXTRACT(${groupBykey} FROM created_at) AS ${x}, SUM(${columnname}) AS ${y} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY ${x} ORDER BY ${x};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async barGraph({TABLE_NAME, columnname, groupBykey = 'MONTH', groupBykey2 = 'os', startdate, enddate}) {
        let query = ``
        query = `SELECT EXTRACT(${groupBykey} FROM created_at) AS Period, ${groupBykey2}, SUM(${columnname}) AS Revenue FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY Period, ${groupBykey2} ORDER BY Period, ${groupBykey2};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }

    static async pieChart({TABLE_NAME, columnname, startdate, enddate}) {
        let query = ``
        query = `SELECT ${columnname}, COUNT(${columnname}) AS Count FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY ${columnname};`
        return abstractData(await PostgresqlDb.query(query));
    }

    static async table({TABLE_NAME = 'order', orderBykey, orderByDirection, limit = 10, skipRowby = 0, filters = {}}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} ORDER BY ${orderBykey} ${orderByDirection} LIMIT ${limit} OFFSET ${skipRowby};`
        console.log(query)
        return abstractData(await PostgresqlDb.query(query));
    }

    static async stats({TABLE_NAME = 'order333', limit = 10, skipRowby = 0, filters = {}, statsDefinition} = []) {
        let query = `SELECT `
        for(let i = 0; i < statsDefinition.length; i++) {
            query += `${statsDefinition[i].aggregate}(${statsDefinition[i].columnname}) AS ${statsDefinition[i].alias}`
            if(i < statsDefinition.length - 1) {
                query += `, `
            }
        }
        query += ` FROM ${TABLE_NAME} LIMIT ${limit} OFFSET ${skipRowby};`
        console.log(query)
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async timeline({workspaceId, customerId}) {
        let query1 = ``
        query1 = `SELECT * FROM order${workspaceId} WHERE customer_id = ${customerId} limit 10;`
        let query2 = ``
        query2 = `SELECT * FROM pageviewed${workspaceId} WHERE customer_id = ${customerId};`
        // console.log(query1)
        // console.log(query2)
        const data1 = abstractData(await PostgresqlDb.query(query1));
        const data2 = abstractData(await PostgresqlDb.query(query2));
        data1.concat(data2)
        return data1
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

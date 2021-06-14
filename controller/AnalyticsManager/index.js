const { whereClause } = require("../../filters")
const PostgresqlDb = require('./../../db')
// const { whereClause } = require('./../../filters.js')


const WHERE_CLAUSE = ({startdate, enddate}) => {
    if(startdate && enddate) {
        return ` WHERE created_at >= '${startdate}' AND created_at <= '${enddate}'`
    }
    else return ''
}

const ORDER_BY = (orderBykey, orderByDirection) => {
    if(orderBykey) {
        if(orderByDirection) {
            return `ORDER BY ${orderBykey} ${orderByDirection}`
        } else {
            return `ORDER BY ${orderBykey} asc`
        }
    } else {
        return ''
    }
}

const GROUP_BY = (groupBykey) => {
    let query = ''
    if(groupBykey.length) {
        query = 'GROUP BY '
        query += groupBykey.map((key) => {
            return key
        }).join(", ")
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

class Dashboard {
    static async count({TABLE_NAME, filters = {}}) {
        let query = ``
        let wc = whereClause(filters);
        query = `SELECT COUNT(*) FROM ${TABLE_NAME} ${wc ? 'WHERE '+wc : ''};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async sum({TABLE_NAME, columnname, startdate, enddate}) {
        let query = ``
        query = `SELECT SUM(${columnname}) FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})};`
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    // static async lineGraph({TABLE_NAME, groupBykey = 'MONTH', dates = [], x = 'x', y = 'y', statsDefinition = {}}) {
    //     let query = ``
    //     let response = []
    //     for(let i = 0; i < dates.length; i++) {
    //         query = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate: dates[i].startdate, enddate: dates[i].enddate})} GROUP BY ${x} ORDER BY ${x};`
    //         let data = abstractData(await PostgresqlDb.query(query))
    //         response.push(data)
    //     }
    //     return response
    // }

    static async lineGraph({TABLE_NAME, groupBykey = 'MONTH', startdate, enddate, x = 'x', y = 'y', statsDefinition = {}, prevstartdate, prevenddate}) {
        let query = ``
        if(prevstartdate && prevenddate) {
            query = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY ${x} ORDER BY ${x};`
            let query1 = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate: prevstartdate, enddate: prevenddate})} GROUP BY ${x} ORDER BY ${x};`
            let response = {
                current: abstractData(await PostgresqlDb.query(query)),
                previous: abstractData(await PostgresqlDb.query(query1))
            }
            return response
        } else {
            query = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY ${x} ORDER BY ${x};`
            let response = {
                current: abstractData(await PostgresqlDb.query(query))
            }
            return response
        }
    }

    static async barGraph({TABLE_NAME, groupBykey = 'MONTH', groupBykey2 = 'os', x = 'x', y = 'y', startdate, enddate, prevstartdate, prevenddate, statsDefinition = {}}) {
        let query = ``
        if(prevstartdate && prevenddate) {
            query = `SELECT EXTRACT(${groupBykey} FROM created_at) AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            let query1 = `SELECT EXTRACT(${groupBykey} FROM created_at) AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate: prevstartdate, enddate: prevenddate})} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            let response = {
                current: abstractData(await PostgresqlDb.query(query)),
                previous: abstractData(await PostgresqlDb.query(query1))
            }
            return response
        } else {
            query = `SELECT EXTRACT(${groupBykey} FROM created_at) AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            let response = {
                current: abstractData(await PostgresqlDb.query(query))
            }
            return response
        }
    }

    static async pieChart({TABLE_NAME, columnname, startdate, enddate, statsDefinition = {}, orderByDirection = 'asc'}) {
        let query = ``
        query = `SELECT ${columnname}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${statsDefinition["aggregate"]} FROM ${TABLE_NAME} ${WHERE_CLAUSE({startdate, enddate})} GROUP BY ${columnname} ORDER BY ${statsDefinition["aggregate"]} ${orderByDirection};`
        // console.log(query)
        return abstractData(await PostgresqlDb.query(query));
    }

    static async tableGroupBy({TABLE_NAME = 'order333', groupBykey, statsDefinition = [], limit = 10, skipRowby = 0}) {
        let query = `SELECT `
        if(statsDefinition) {
            for(let i = 0; i < statsDefinition.length; i++) {
                if(statsDefinition[i].aggregate === '') {
                    query += `${statsDefinition[i].columnname}`
                    groupBykey.push(statsDefinition[i].columnname)
                } else {
                    query += `${statsDefinition[i].aggregate}(${statsDefinition[i].columnname})`
                }
                query += ` AS ${statsDefinition[i].alias}`
                if(i < statsDefinition.length - 1) query += ', '
            }
            query += ` FROM ${TABLE_NAME} ${GROUP_BY(groupBykey)} LIMIT ${limit} OFFSET ${skipRowby};`
            // console.log(query)
            return abstractData(await PostgresqlDb.query(query));
        }
        return
    }

    static async table({TABLE_NAME = 'order333', orderBykey, orderByDirection, limit = 10, skipRowby = 0, filters = {}}) {
        let wc = whereClause(filters);
        let query = ``
        query = `
            SELECT * FROM ${TABLE_NAME}
            ${wc ? 'WHERE '+wc : ''}
            ${ORDER_BY(orderBykey, orderByDirection)}
            LIMIT ${limit} OFFSET ${skipRowby};`
        console.log(query)
        return abstractData(await PostgresqlDb.query(query));
    }

    static async stats({TABLE_NAME = 'order333', limit = 10, skipRowby = 0, filters = {}, statsDefinition = []}) {
        let query = `SELECT `
        for(let i = 0; i < statsDefinition.length; i++) {
            query += `${statsDefinition[i].aggregate}(${statsDefinition[i].columnname}) AS ${statsDefinition[i].alias}`
            if(i < statsDefinition.length - 1) {
                query += `, `
            }
        }
        query += ` FROM ${TABLE_NAME} LIMIT ${limit} OFFSET ${skipRowby};`
        // console.log(query)
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async timeline({workspaceId, customerId}) {
        let query1 = ``
        query1 = `SELECT * FROM order${workspaceId} WHERE customer_id = ${customerId};`
        let query2 = ``
        query2 = `SELECT * FROM event${workspaceId} WHERE customer_id = ${customerId};`
        const data1 = abstractData(await PostgresqlDb.query(query1));
        const data2 = abstractData(await PostgresqlDb.query(query2));
        const data = [...data1, ...data2]
        // console.log('!!!!!!!!!', data)
        return data
    }
}

module.exports = Dashboard

// Dashboard.barGraph({TABLE_NAME: 'order333', columnname: 'total_price', groupBykey: 'YEAR', groupBykey2: 'fulfillment_status', workspaceId: 333, 
//     startdate: '2000-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
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

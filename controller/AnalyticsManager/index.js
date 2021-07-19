const { whereClause } = require("../../filters")
const PostgresqlDb = require('./../../db')
// const { whereClause } = require('./../../filters.js')


const WHERE_CLAUSE = (table, startdate, enddate) => {
    if(startdate && enddate) {
        let col = 'created_at'
        if(table === 'inventorylevel') {
            col = 'updated_at'
        } else if(table === 'sentemail') {
            col = 'sent_time'
        }
        return ` WHERE ${col} >= '${startdate}' AND ${col} <= '${enddate}'`
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

const LIMIT = (limit) => {
    if(limit){
        return `LIMIT ${limit}`
    } else {
        return ''
    }
}

const getwc = (datequery, wc1) => {
    if(datequery) {
        if(wc1) {
            return datequery + ' AND ' + wc1 + ' '
        } else {
            return datequery
        }
    } else if(wc1) {
        return 'WHERE ' + wc1
    } else {
        return ''
    }
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
    static async count({table, workspaceId, startdate, enddate, filters = {}}) {
        let query = ``
        let wc = ``
        if(Object.entries(filters).length) {
            wc = whereClause(filters, table, workspaceId);
        }
        let datequery = WHERE_CLAUSE(table, startdate, enddate)
        wc = getwc(datequery, wc)
        query = `SELECT COUNT(*) FROM ${table}${workspaceId} ${wc};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async sum({table, workspaceId, columnname, startdate, enddate, filters = {}}) {
        let query = ``
        let wc = ``
        if(Object.entries(filters).length) {
            wc = whereClause(filters, table, workspaceId);
        }
        let datequery = WHERE_CLAUSE(table, startdate, enddate)
        wc = getwc(datequery, wc)
        query = `SELECT SUM(${columnname}) FROM ${table}${workspaceId} ${wc};`
        // console.log(query)
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    // static async lineGraph({table, workspaceId, groupBykey = 'MONTH', dates = [], x = 'x', y = 'y', statsDefinition = {}}) {
    //     let query = ``
    //     let response = []
    //     for(let i = 0; i < dates.length; i++) {
    //         query = `SELECT created_at::${groupBykey} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${WHERE_CLAUSE(table, {startdate: dates[i].startdate, enddate: dates[i].enddate})} GROUP BY ${x} ORDER BY ${x};`
    //         let data = abstractData(await PostgresqlDb.query(query))
    //         response.push(data)
    //     }
    //     return response
    // }

    static async lineGraph({table, workspaceId, groupBykey = 'MONTH', startdate, enddate, x = 'x', y = 'y', statsDefinition = {}, prevstartdate, prevenddate, filters = {}}) {
        let query = ``, query1 = ``
        let wc1 = ``
        if(Object.entries(filters).length) {
            wc1 = whereClause(filters, table, workspaceId);
        }
        let wc = ``
        if(prevstartdate && prevenddate) {
            let datequery = WHERE_CLAUSE(table, startdate, enddate)
            wc = getwc(datequery, wc1)
            if(groupBykey === 'date') {
                query = `SELECT created_at::${groupBykey} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x} ORDER BY ${x};`
            } else {
                query = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x} ORDER BY ${x};`
            }
            datequery = WHERE_CLAUSE(table, prevstartdate, prevenddate)
            wc = getwc(datequery, wc1)
            if(groupBykey === 'date') {
                query1 = `SELECT created_at::${groupBykey} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x} ORDER BY ${x};`
            } else {
                query1 = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x} ORDER BY ${x};`
            }
            let response = {
                current: abstractData(await PostgresqlDb.query(query)),
                previous: abstractData(await PostgresqlDb.query(query1))
            }
            return response
        } else {
            let datequery = WHERE_CLAUSE(table, startdate, enddate)
            wc = getwc(datequery, wc1)
            if(groupBykey === 'date') {
                query = `SELECT created_at::${groupBykey} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x} ORDER BY ${x};`
            } else {
                query = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x} ORDER BY ${x};`
            }
            let response = {
                current: abstractData(await PostgresqlDb.query(query))
            }
            return response
        }
    }

    static async lineGraphSpecific({table, workspaceId, columnname, idArray, groupBykey = 'date', startdate, enddate, x = 'x', y = 'y', statsDefinition = {}, prevstartdate, prevenddate, filters = {}}) {
        let wc1 = ``
        if(Object.entries(filters).length) {
            wc1 = whereClause(filters, table, workspaceId);
        }
        if(prevstartdate && prevenddate) {
            let previousdatequery = WHERE_CLAUSE(table, prevstartdate, prevenddate)
            let wc2 = getwc(previousdatequery, wc1)
            let currentdatequery = WHERE_CLAUSE(table, startdate, enddate)
            wc1 = getwc(currentdatequery, wc1)
            let current = [], previous = [], currentquery = ``, previousquery = ``

            for(let i = 0; idArray && i < idArray.length; i++) {
                let wcc = wc1, wcp = wc2;
                if(wc1) {
                    wcc += ` AND ${columnname} = ${idArray[i].id}`
                } else {
                    wcc = `WHERE ${columnname} = ${idArray[i].id}`
                }
                if(wc2) {
                    wcp += ` AND ${columnname} = ${idArray[i].id}`
                } else {
                    wcp = `WHERE ${columnname} = ${idArray[i].id}`
                }
                if(groupBykey === 'date') {
                    currentquery = `SELECT created_at::${groupBykey} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wcc} GROUP BY ${x} ORDER BY ${x};`
                    previousquery = `SELECT created_at::${groupBykey} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wcp} GROUP BY ${x} ORDER BY ${x};`
                } else {
                    currentquery = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wcc} GROUP BY ${x} ORDER BY ${x};`
                    previousquery = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wcp} GROUP BY ${x} ORDER BY ${x};`
                }
                let response = abstractData(await PostgresqlDb.query(currentquery))
                if(response) {
                    let array = []
                    response.map((item) => {
                        if(item.x) {
                            array.push(item)
                        }
                    })
                    current.push({
                        id: idArray[i],
                        data: array
                    })
                }
                response = abstractData(await PostgresqlDb.query(previousquery))
                if(response) {
                    let array = []
                    response.map((item) => {
                        if(item.x) {
                            array.push(item)
                        }
                    })
                    previous.push({
                        name: idArray[i].name,
                        id: idArray[i].id,
                        data: array
                    })
                }
            }
            let response = {
                current: current,
                previous: previous
            }
            return response
        } else {
            let datequery = WHERE_CLAUSE(table, startdate, enddate)
            let wc = getwc(datequery, wc1)
            let current = [], query = ``
            for(let i = 0; idArray && i < idArray.length; i++) {
                let wc1 = wc
                if(wc) {
                    wc1 += ` AND ${columnname} = ${idArray[i].id}`
                } else {
                    wc1 = `WHERE ${columnname} = ${idArray[i].id}`
                }
                if(groupBykey === 'date') {
                    query = `SELECT created_at::${groupBykey} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc1} GROUP BY ${x} ORDER BY ${x};`
                } else {
                    query = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc1} GROUP BY ${x} ORDER BY ${x};`
                }
                let response = abstractData(await PostgresqlDb.query(query))
                if(response) {
                    let array = []
                    response.map((item) => {
                        if(item.x) {
                            array.push(item)
                        }
                    })
                    current.push({
                        name: idArray[i].name,
                        id: idArray[i].id,
                        data: array,
                        startdate: startdate,
                        enddate: enddate
                    })
                }
            }
            let response = {
                current: current
            }
            return response
        }
    }

    static async barGraph({table, workspaceId, groupBykey = 'date', groupBykey2 = 'fulfillment_status', x = 'x', y = 'y', startdate, enddate, prevstartdate, prevenddate, statsDefinition = {}, filters = {}}) {
        let query = ``, query1 = ``
        let wc1 = ``
        if(Object.entries(filters).length) {
            wc1 = whereClause(filters, table, workspaceId);
        }
        let wc = ``
        if(prevstartdate && prevenddate) {
            let datequery = WHERE_CLAUSE(table, startdate, enddate)
            wc = getwc(datequery, wc1)
            if(groupBykey === 'date') {
                query = `SELECT created_at::${groupBykey} AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            } else {
                query = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            }
            datequery = WHERE_CLAUSE(table, prevstartdate, prevenddate)
            wc = getwc(datequery, wc1)
            if(groupBykey === 'date') {
                query1 = `SELECT created_at::${groupBykey} AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            } else {
                query1 = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            }
            let response = {
                current: abstractData(await PostgresqlDb.query(query)),
                previous: abstractData(await PostgresqlDb.query(query1))
            }
            return response
        } else {
            let datequery = WHERE_CLAUSE(table, startdate, enddate)
            wc = getwc(datequery, wc1)
            if(groupBykey === 'date') {
                query = `SELECT created_at::${groupBykey} AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            } else {
                query = `SELECT EXTRACT(${groupBykey} FROM created_at) ${groupBykey === 'dow' ? ' + 1' : ''} AS ${x}, ${groupBykey2}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${y} FROM ${table}${workspaceId} ${wc} GROUP BY ${x}, ${groupBykey2} ORDER BY ${x}, ${groupBykey2};`
            }
            let response = {
                current: abstractData(await PostgresqlDb.query(query))
            }
            return response
        }
    }

    static async pieChart({table, workspaceId, columnname, startdate, enddate, orderByDirection = 'asc', limit, statsDefinition = {}, filters = {}}) {
        let query = ``
        let wc = ``
        if(Object.entries(filters).length) {
            wc = whereClause(filters, table, workspaceId);
        }
        let datequery = WHERE_CLAUSE(table, startdate, enddate)
        wc = getwc(datequery, wc)
        query = `SELECT ${columnname}, ${statsDefinition["aggregate"]}(${statsDefinition["columnname"]}) AS ${statsDefinition["aggregate"]} FROM ${table}${workspaceId} ${wc} GROUP BY ${columnname} ORDER BY ${statsDefinition["aggregate"]} ${orderByDirection} ${LIMIT(limit)};`
        // console.log(query)
        return abstractData(await PostgresqlDb.query(query));
    }

    static async tableGroupBy({table, workspaceId, startdate, enddate, groupBykey, statsDefinition = [], limit = 10, skipRowby = 0, filters = {}}) {
        let query = `SELECT `
        let wc = ``
        if(Object.entries(filters).length) {
            wc = whereClause(filters, table, workspaceId);
        }
        let datequery = WHERE_CLAUSE(table, startdate, enddate)
        wc = getwc(datequery, wc)
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
            query += ` FROM ${table}${workspaceId} ${wc} ${GROUP_BY(groupBykey)} LIMIT ${limit} OFFSET ${skipRowby};`
            return abstractData(await PostgresqlDb.query(query));
        }
        return
    }

    static async table({table, workspaceId, startdate, enddate, orderBykey, orderByDirection, limit, skipRowby = 0, filters = {}}) {
        let wc = ``
        // console.log('table filters: ', filters)
        if(Object.entries(filters).length) {
            wc = whereClause(filters, table, workspaceId);
        }
        let datequery = WHERE_CLAUSE(table, startdate, enddate)
        wc = getwc(datequery, wc)
        let query = ``
        query = `
            SELECT * FROM ${table}${workspaceId}
            ${wc}
            ${ORDER_BY(orderBykey, orderByDirection)}
            ${LIMIT(limit)} 
            OFFSET ${skipRowby};`
        // console.log('@@@@@@@@@', query)
        return abstractData(await PostgresqlDb.query(query));
    }

    static async stats({table, workspaceId, startdate, enddate, limit = null, skipRowby = 0, filters = {}, statsDefinition = []}) {
        let wc = ``
        if(Object.entries(filters).length) {
            wc = whereClause(filters, table, workspaceId);
        }
        let datequery = WHERE_CLAUSE(table, startdate, enddate)
        wc = getwc(datequery, wc)
        let query = `SELECT `
        for(let i = 0; i < statsDefinition.length; i++) {
            if(statsDefinition[i].operator) {
                query += `COALESCE(${statsDefinition[i].aggregate}(case when `
                if(Array.isArray(statsDefinition[i].value)) {
                    for(let j = 0; j < statsDefinition[i].value.length; j++) {
                        query += `${statsDefinition[i].columnname} ${statsDefinition[i].operator} `
                        if(typeof statsDefinition[i].value[j] === 'number') {
                            query += `${statsDefinition[i].value[j]} `
                        } else {
                            query += `'${statsDefinition[i].value[j]}' `
                        }
                        if(j < statsDefinition[i].value.length - 1) {
                            query += `OR `
                        }
                    }
                    if(typeof statsDefinition[i].aggcolumnname === 'undefined' || !statsDefinition[i].aggcolumnname) {
                        query += `then true end)`
                    } else {
                        query += `then ${statsDefinition[i].aggcolumnname} else 0 end)`
                    }
                } else if(typeof statsDefinition[i].value === 'number' || statsDefinition[i].value === 'NULL' || statsDefinition[i].value === 'NULL') {
                    if(typeof statsDefinition[i].aggcolumnname === 'undefined' || !statsDefinition[i].aggcolumnname) {
                        query += `${statsDefinition[i].columnname} ${statsDefinition[i].operator} ${statsDefinition[i].value} then true end)`
                    } else {
                        query += `${statsDefinition[i].columnname} ${statsDefinition[i].operator} ${statsDefinition[i].value} then ${statsDefinition[i].aggcolumnname} else 0 end)`
                    }
                } else {
                    if(typeof statsDefinition[i].aggcolumnname === 'undefined' || !statsDefinition[i].aggcolumnname) {
                        query += `${statsDefinition[i].columnname} ${statsDefinition[i].operator} '${statsDefinition[i].value}' then true end)`
                    } else {
                        query += `${statsDefinition[i].columnname} ${statsDefinition[i].operator} '${statsDefinition[i].value}' then ${statsDefinition[i].aggcolumnname} else 0 end)`
                    }
                }
                query += `, 0) AS ${statsDefinition[i].alias}`
            } else {
                query += `COALESCE(${statsDefinition[i].aggregate}(${statsDefinition[i].columnname}), 0) AS ${statsDefinition[i].alias}`
            }
            if(i < statsDefinition.length - 1) {
                query += `, `
            }
        }
        query += ` FROM ${table}${workspaceId} ${wc} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query)
        return abstractData(await PostgresqlDb.query(query), "single");
    }

    static async timeline({table, workspaceId, startdate, enddate, limit, filters = {}}) {
        let query1 = ``
        let wc = ``
        if(Object.entries(filters).length) {
            wc = whereClause(filters, table, workspaceId);
        }
        let datequery = WHERE_CLAUSE(table, startdate, enddate)
        wc = getwc(datequery, wc)
        query1 = `SELECT * FROM order${workspaceId} ${wc} ${LIMIT(limit)};`
        let query2 = ``
        query2 = `SELECT * FROM event${workspaceId} ${wc} ${LIMIT(limit)};`
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
// input: product_id (array) or variant_id (array), startdate, enddate
// output: daywise sold quantity for products or variants

// average customer lifetime value: avg total spent of all customers
// average order value: avg order value
*/

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
    SLECT COUNT(*) FROM ${table}${workspaceId} ${WHERE_CLAUSE};` 
*/

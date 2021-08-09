const { default: axios } = require("axios")
const { whereClause } = require("../../filters")
const PostgresqlDb = require('./../../db')

const LIMIT = (limit) => {
    if(limit){
        return `LIMIT ${limit}`
    } else {
        return ''
    }
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

async function table({table, workspaceId, startdate, enddate, orderBykey, orderByDirection, limit, skipRowby = 0, filters = {}}) {
    let wc = ``
    // console.log('table filters: ', filters)
    if(Object.entries(filters).length) {
        wc = whereClause(filters, table, workspaceId);
    }
    let datequery = WHERE_CLAUSE(table, startdate, enddate)
    wc = getwc(datequery, wc)
    let query = ``
    query = `
        SELECT id FROM ${table}${workspaceId}
        ${wc}
        ${ORDER_BY(orderBykey, orderByDirection)}
        ${LIMIT(limit)} 
        OFFSET ${skipRowby};`
    // console.log('@@@@@@@@@', query)
    return abstractData(await PostgresqlDb.query(query));
}

const updateCustomer =  (shopName, accessToken, id, tags) => {
    return axios.put(`https://${shopName}/admin/api/2021-07/customers/${id}.json`,{
        customer: { id, tags }
    }, {
        headers: {
            'X-Shopify-Access-Token': accessToken,
        }
    })
}

const updateOrder = (shopName, accessToken, id, tags) => {
    return axios.put(`https://${shopName}/admin/api/2021-07/orders/${id}.json`,{
        order: { id, tags }
    }, {
        headers: {
            'X-Shopify-Access-Token': accessToken,
        }
    })
}

const updateProduct = (shopName, accessToken, id, tags) => {
    return axios.put(`https://${shopName}/admin/api/2021-07/products/${id}.json`,{
        product: { id, tags }
    }, {
        headers: {
            'X-Shopify-Access-Token': accessToken,
        }
    })
}

const updateDraftOrder = (shopName, accessToken, id, tags) => {
    return axios.put(`https://${shopName}/admin/api/2021-07/draft_orders/${id}.json`,{
        draft_order: { id, tags }
    }, {
        headers: {
            'X-Shopify-Access-Token': accessToken,
        }
    })
}

module.exports = {
    table,
    updateCustomer,
    updateOrder,
    updateProduct,
    updateDraftOrder,
}
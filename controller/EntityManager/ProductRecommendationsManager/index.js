
const PostgresqlDb = require('../../../db')
const { ORDER_BY, LIMIT, abstractData } = require('../helper')
const { getIds, PRODUCTRECOMMENDATIONS_TABLE_NAME } = require('../../DataManager/helper')
const { insert } = require('../../DataManager/index')
const productRecommendationsColumns = require('../../DataManager/Setup/productRecommendationsColumns.json')
const { response } = require('express')

const cart_recommendations = {
    not_purchased_in_last_n_days: 10,
    valid_till: 20
}

const history_recommendations = {
    not_purchased_in_last_n_days: 10,
    valid_till: 100
}

class productRecommendations {
    static async recommendations({TABLE_NAME, customerId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = ${customerId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }
}

const historyBased = async ({workspaceId, customerId}) => {
    let lineitemquery = `SELECT product_id FROM lineitems${workspaceId} WHERE customer_id = ${customerId};`;
    let lineitemresponse = abstractData(await PostgresqlDb.query(lineitemquery));
    // console.log(lineitemquery, lineitemresponse)
    let string = ``
    for(let i = 0; i < lineitemresponse.length; i++) {
        string += `${Number(lineitemresponse[i].product_id)}`
        if(i < lineitemresponse.length - 1) string += `, `
    }
    let eventquery = `SELECT * FROM event${workspaceId} WHERE customer_id = ${customerId} AND product_id NOT IN (${string});`;
    let eventresponse = abstractData(await PostgresqlDb.query(eventquery));
    // console.log(eventquery, eventresponse)
    if(eventresponse.length) {
        let data = [{
            customer_id: eventresponse.customer_id,
            recommendation_type: 'HISTORY_BASED_RECOMMENDATION',
            product_id: eventresponse.product_id,
            variant_id: eventresponse.variant_id,
            score: 1,
            created_at: new Date(),
            valid_till: new Date(new Date().getTime()+(history_recommendations.valid_till*24*60*60*1000))
        }]
        // console.log(data)
        // insert(PRODUCTRECOMMENDATIONS_TABLE_NAME, productRecommendationsColumns, data, workspaceId)
        return data
    }
}

const cartBased = async ({workspaceId, customerId}) => {
    let lineitemquery = `SELECT product_id, created_at FROM lineitems${workspaceId} WHERE customer_id = ${customerId};`;
    let lineitemresponse = abstractData(await PostgresqlDb.query(lineitemquery));
    // console.log(lineitemquery, lineitemresponse)
    let cartquery = `SELECT product_id FROM cart${workspaceId} WHERE customer_id = ${customerId};`;
    let cartresponse = abstractData(await PostgresqlDb.query(cartquery));
    // console.log(cartquery, cartresponse)
    let products = ``
    for(let i = 0, flag = 0; cartresponse && i < cartresponse.length; i++) {
        for(let j = 0; cartresponse[i].product_id && j < cartresponse[i].product_id.length; j++, flag = 0) {
            for(let k = 0; lineitemresponse && k < lineitemresponse.length && !flag; k++) {
                let date1 = lineitemresponse[k].created_at
                let date2 = new Date(new Date().getTime()-(cart_recommendations.not_purchased_in_last_n_days*24*60*60*1000))
                if(cartresponse[i].product_id[j] === Number(lineitemresponse[k].product_id) && date1.getTime() > date2.getTime()) {
                    flag = 1
                }
            }
            if(!flag) {
                if(products.length) {
                    products += `, `
                }
                products += `${cartresponse[i].product_id[j]}`
            }
        }
    }

    if(products.length) {
        let query = `SELECT * FROM product${workspaceId} WHERE id IN (${products});`
        let response = abstractData(await PostgresqlDb.query(query));
        let data = []
        response.map((item) => {
            data.push({
                customer_id: customerId,
                recommendation_type: 'CART_BASED_RECOMMENDATION',
                product_id: Number(item.id),
                score: 1,
                created_at: new Date(),
                valid_till: new Date(new Date().getTime()+(cart_recommendations.valid_till*24*60*60*1000))
            })
            return data
        })
        console.log(data)
        // insert(PRODUCTRECOMMENDATIONS_TABLE_NAME, productRecommendationsColumns, data, workspaceId)
    }
}

module.exports = {
    productRecommendations,
    historyBased,
    cartBased,
}
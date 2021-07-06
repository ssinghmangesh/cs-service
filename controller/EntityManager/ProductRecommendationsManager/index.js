
const PostgresqlDb = require('../../../db')
const { ORDER_BY, LIMIT, abstractData } = require('../helper')
const { getIds, PRODUCTRECOMMENDATIONS_TABLE_NAME } = require('../../DataManager/helper')
const { insert } = require('../../DataManager/index')
const productRecommendationsColumns = require('../../DataManager/Setup/productRecommendationsColumns.json')

class productRecommendations {
    static async recommendations({TABLE_NAME, customerId, orderBykey, orderByDirection, limit, skipRowby = 0}) {
        let query = ``
        query = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = ${customerId} ${ORDER_BY(orderBykey, orderByDirection)} ${LIMIT(limit)} OFFSET ${skipRowby};`
        // console.log(query);
        return abstractData(await PostgresqlDb.query(query));
    }
}

const compute = async ({workspaceId, customerId}) => {
    let lineitemsquery = `SELECT product_id FROM lineitems${workspaceId} WHERE customer_id = ${customerId};`;
    let lineitemresponse = abstractData(await PostgresqlDb.query(lineitemsquery));
    let string = ``
    for(let i = 0; i < lineitemresponse.length; i++) {
        string += `${Number(lineitemresponse[i].product_id)}`
        if(i < lineitemresponse.length - 1) string += `, `
    }
    let eventquery = `SELECT * FROM event${workspaceId} WHERE customer_id = ${customerId} AND product_id NOT IN (${string});`;
    console.log(eventquery)
    let eventresponse = abstractData(await PostgresqlDb.query(eventquery));
    console.log(eventresponse)
    let data = [{
        customer_id: eventresponse.customer_id,
        recommendation_type: 'default',
        product_id: eventresponse.product_id,
        variant_id: eventresponse.variant_id,
        score: 0,
        created_at: Date.now(),
        valid_till: Date.now() + 10
    }]
    // insert(PRODUCTRECOMMENDATIONS_TABLE_NAME, productRecommendationsColumns, data, workspaceId)
    // return eventresponse
}

const addRecommendations = async (workspaceId, rawData) => {
    const data = rawData.recommendations.map((recommendation) => ({
        customer_id: rawData.customer_id,
        recommendation_type: 'default',
        product_id: recommendation.product_id,
        variant_id: recommendation.variant_id,
        score: 0,
        created_at: Date.now(),
        valid_till: Date.now() + 10
    }))
    return await insert(PRODUCTRECOMMENDATIONS_TABLE_NAME, productRecommendationsColumns, data, workspaceId)
}

module.exports = {
    productRecommendations,
    compute,
    addRecommendations
}
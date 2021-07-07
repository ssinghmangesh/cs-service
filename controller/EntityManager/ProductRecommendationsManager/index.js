
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
        recommendation_type: 'Added By Agent',
        product_id: recommendation.product_id,
        variant_id: recommendation.variant_id,
        score: 1,
        created_at: Date.now(),
        valid_till: Date.now() + 10
    }))
    return await insert(PRODUCTRECOMMENDATIONS_TABLE_NAME, productRecommendationsColumns, data, workspaceId)
}

const popularProducts = async (data, workspaceId) => {
    var date = new Date();
    date.setDate(date.getDate() - 10);
    let query = `SELECT product_id, COUNT(*) FROM lineitems${workspaceId} WHERE created_at >= '${date.toISOString().replace("T", " ")}' GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 3`
    let res = await PostgresqlDb.query(query);
    let response = [...res.rows];
    // console.log(response);
    const ids = response.map((item) => item.product_id)
    query = `SELECT id FROM customer${workspaceId}`
    res = await PostgresqlDb.query(query)
    const promises = res.rows.map(({id: customerId}) => {
        return new Promise(async (resolve, reject) => {
            query = `SELECT product_id FROM lineitems${workspaceId} WHERE customer_id = ${customerId} AND created_at >= '${date.toISOString().replace("T", " ")}' AND product_id IN (${ids}) GROUP BY product_id`
            // console.log(query);
            res = await PostgresqlDb.query(query);
            const purchasedProducts = res.rows.map(item => item.product_id);
            const productsToRecommend = ids.filter(obj => purchasedProducts.indexOf(obj) == -1);
            const recommendations = productsToRecommend.map((productId) => ({
                customer_id: customerId,
                recommendation_type: 'Popular Products',
                product_id: productId,
                score: 1,
                created_at: Date.now(),
                valid_till: Date.now() + 10
           }))
        //    console.log(recommendations);
           await insert(PRODUCTRECOMMENDATIONS_TABLE_NAME, productRecommendationsColumns, recommendations, workspaceId)
           resolve();
        })
    })
    return await Promise.all(promises)
    
}

// popularProducts({}, 56788582584)

module.exports = {
    productRecommendations,
    compute,
    addRecommendations
}
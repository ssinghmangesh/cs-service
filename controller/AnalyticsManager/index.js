
const PostgresqlDb = require('./../../db')


const axios = require("axios")
const { CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    DISCOUNT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    VARIANT_TABLE_NAME } =  require("../DataManager/helper")

const WHERE_CLAUSE = ({startdate, enddate}) => {
    return ` WHERE created_at >= '${startdate}' AND created_at <= '${enddate}'`
}

class Dashboard {
    static async CustomerCount({workspaceId, startdate, enddate}) {
        let query = ``

        query = `SELECT COUNT(*) FROM ${CUSTOMER_TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
    }

    static async OrderCount({workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT COUNT(*) FROM ${ORDER_TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
    }

    static async LineItemCount({workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT COUNT(*) FROM ${LINEITEMS_TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
    }

    static async ProductCount({workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT COUNT(*) FROM ${PRODUCT_TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
    }

    static async VariantCount({workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT COUNT(*) FROM ${VARIANT_TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
    }

    static async OrderAmount({workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT SUM(total_price) FROM ${ORDER_TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
    }

    static async Ordertaxamount({workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT SUM(total_tax) FROM ${ORDER_TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
    }
}

module.exports = Dashboard


Dashboard.Ordertaxamount({workspaceId: 333, startdate: '2021-01-01 11:49:40.765997+05:30', enddate: '2021-05-13 11:49:40.765997+05:30'})
.then(console.log)
.catch(console.log)



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

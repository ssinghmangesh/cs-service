
const PostgresqlDb = require('./../../db')


const WHERE_CLAUSE = ({startdate, enddate}) => {
    return ` WHERE created_at >= '${startdate}' AND created_at <= '${enddate}'`
}

class Dashboard {
    static async Count({TABLE_NAME, workspaceId, startdate, enddate}) {
        let query = ``

        query = `SELECT COUNT(*) FROM ${TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
    }

    static async Sum({TABLE_NAME, columnname, workspaceId, startdate, enddate}) {
        let query = ``
        query = `SELECT SUM(${columnname}) FROM ${TABLE_NAME(workspaceId)} ${WHERE_CLAUSE({startdate, enddate})};`
        return await PostgresqlDb.query(query);
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


const axios = require("axios")


class Dashboard {
    static orderCount(workspaceId, condition) {
        let query = ``
        let WHERE_CLAUES = ``

        //run
    }
}


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
if(startdate && enddat) {
    WHERE_CLAUSE = ``
}
let query = `
    SLECT COUNT(*) FROM ${TABLE_NAME} ${WHERE_CLAUSE};` 
*/

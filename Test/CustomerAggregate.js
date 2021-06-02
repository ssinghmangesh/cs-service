const PostgresqlDb = require('../db')
const { aggregate } = require('../controller/DataManager/index.js')
const { CUSTOMER_TABLE_NAME } = require("../controller/DataManager/helper");

const main = async (workspaceId) => {
    let data = await PostgresqlDb.query(`SELECT id FROM ${CUSTOMER_TABLE_NAME(workspaceId)};`)
    const customers = data.rows

    await customers.map(async customer => {
        await aggregate(workspaceId, customer.id)
    })

    return "successful"
}


// main(1)
// .then(console.log)
// .catch(console.log)
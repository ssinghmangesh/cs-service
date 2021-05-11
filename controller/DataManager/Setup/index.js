
const { createCustomerTable, createOrderTable, createProductTable, createDiscountTable, 
        createFulfillmentTable, createLineItemsTable, createRefundedTable, createVariantTable } = require('./helper')

const setupWorkspace = async(workspaceId) => {

    await createCustomerTable(workspaceId)

    await createOrderTable(workspaceId)

    await createProductTable(workspaceId)

    await createDiscountTable(workspaceId)

    await createFulfillmentTable(workspaceId)

    await createLineItemsTable(workspaceId)

    await createRefundedTable(workspaceId)

    await createVariantTable(workspaceId)

    return {
        status: true,
        message: "Successful"
    }

}


// createDiscountTable(111)
// .then(console.log)
// .catch(console.log)





module.exports = {
    setupWorkspace
}

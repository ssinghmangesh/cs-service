const ORDER_TABLE_NAME = (workspaceId) => {
    return `order${workspaceId}`
}
const CUSTOMER_TABLE_NAME = (workspaceId) => {
    return `customer${workspaceId}`
}
const PRODUCT_TABLE_NAME = (workspaceId) => {
    return `product${workspaceId}`
}

const setupWorkspace = async(workspaceId) => {

    await createCustomerTable()


    //https://shopify.dev/docs/admin-api/rest/reference/orders/order#index-2021-04
    await createOrderTable()

    await createProductTable()

}







module.exports = {
    setupWorkspace
}



const {insert: insertOrder, del: deleteOrder} = require("../../DataManager/Order/index");
const {insert: insertCustomer, del: deleteCustomer} = require("../../DataManager/Customer/index");
const {insert: insertProduct, del: deleteProduct} = require("../../DataManager/Product/index");

const updateCustomer = async (customer, workspaceId) => {
    await deleteCustomer([customer], workspaceId)
    await insertCustomer([customer], workspaceId)
    return {status: 200, message: "Update Successful"}
}

const updateOrder = async (order, workspaceId) => {
    await deleteOrder([order], workspaceId)
    await insertOrder([order], workspaceId)
    return {status: 200, message: "Update Successful"}
}

const updateProduct = async (product, workspaceId) => {
    await deleteProduct([product], workspaceId)
    await insertProduct([product], workspaceId)
    return {status: 200, message: "Update Successful"}
}


module.exports = {
    updateCustomer,
    updateOrder,
    updateProduct
}
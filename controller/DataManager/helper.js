const getIds = (data) => {
    return `(${data.map((value) => value.id).join(",")})`
}

const CUSTOMER_TABLE_NAME = (workspaceId) => {
    return `customer${workspaceId}`
}

const ORDER_TABLE_NAME = (workspaceId) => {
    return `order${workspaceId}`
}

const PRODUCT_TABLE_NAME = (workspaceId) => {
    return `product${workspaceId}`
}



module.exports={
    getIds,
    CUSTOMER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    ORDER_TABLE_NAME,
}
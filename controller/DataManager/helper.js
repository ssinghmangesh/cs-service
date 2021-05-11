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

const DISCOUNT_TABLE_NAME = (workspaceId) => {
    return `discount${workspaceId}`
}

const FULFILLMENT_TABLE_NAME = (workspaceId) => {
    return `discount${workspaceId}`
}

const LINEITEMS_TABLE_NAME = (workspaceId) => {
    return `discount${workspaceId}`
}

const REFUNDED_TABLE_NAME = (workspaceId) => {
    return `discount${workspaceId}`
}

const VARIANT_TABLE_NAME = (workspaceId) => {
    return `discount${workspaceId}`
}



module.exports={
    getIds,
    CUSTOMER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    ORDER_TABLE_NAME,
    DISCOUNT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    VARIANT_TABLE_NAME
}
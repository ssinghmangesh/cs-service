const getColumnName = ({ columnData }) => {
    let query = `(${columnData.map(col => col.columnName).join(", ")})`

    return query
}

const getValues = ({ columnData, data }) => {

    let allRow = data.map(value => {

        let row = columnData.map(col => {

            if(col.dataType === 'varchar') {
                if(value[col.columnName]) {
                    return `'${value[col.columnName]}'`
                } else {
                    return `''`
                }
            } else if(col.dataType === 'numeric') {
                if(value[col.columnName]) {
                    return value[col.columnName]
                } else {
                    return `0`
                }
            } else if(col.dataType === 'boolean') {
                if(typeof value[col.columnName] === 'bool') {
                    return value[col.columnName]
                } else {
                    return false
                }
            } else if(col.dataType === 'timestamp' || col.dataType === 'timestamptz' ) {
                if(value[col.columnName]) {
                    return `'${value[col.columnName]}'`
                } else {
                    return `NULL`
                }
            } else if(col.dataType === 'jsonb') {
                if(value[col.columnName]) {
                    let details = JSON.stringify(value[col.columnName])
                    return `'${details}'`
                } else {
                    return `'{}'`
                }
            }
        }).join(", ")
        return `( ${row}) `
    }).join(", ")


    return allRow
}


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
    return `fulfillment${workspaceId}`
}

const LINEITEMS_TABLE_NAME = (workspaceId) => {
    return `lineitems${workspaceId}`
}

const REFUNDED_TABLE_NAME = (workspaceId) => {
    return `refunded${workspaceId}`
}

const VARIANT_TABLE_NAME = (workspaceId) => {
    return `variant${workspaceId}`
}

const getInsertQuery = (TABLE_NAME, customerColumn, data, workspaceId) => {
    return `
        INSERT INTO ${TABLE_NAME(workspaceId)}
        ${getColumnName({ columnData: customerColumn })}
        VALUES ${getValues({ columnData: customerColumn, data })}
    `
}

const getDelQuery = (TABLE_NAME, data, workspaceId) => {
    let query = `DELETE FROM ${TABLE_NAME(workspaceId)} WHERE id IN ${getIds(data)}`
    return query;
}

module.exports={
    getDelQuery,
    getInsertQuery,
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

const getColumnName = ({ columnData }) => {
    const query = `(${columnData.map(col => col.columnName).join(", ")})`

    return query
}

const getDate = (date) => {
    return new Date(date).toISOString()
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
            } else if(col.dataType === 'varchar[]') {
                if(value[col.columnName] && value[col.columnName].length) {
                    let q = value[col.columnName].map(str => {
                        return `'${str}'`
                    }).join(", ")
                    return `array[${q}]`
                    // return value[col.columnName]
                } else {
                    return `NULL`
                }
            } else if(col.dataType === 'numeric') {
                if(value[col.columnName]) {
                    return value[col.columnName]
                } else {
                    return `0`
                }
            } else if(col.dataType === 'numeric[]') {
                if(value[col.columnName] && value[col.columnName].length) {
                    let q = value[col.columnName].map(num => {
                        return `${num}`
                    }).join(", ")
                    return `array[${q}]`
                    // return value[col.columnName]
                } else {
                    return `NULL`
                }
            } else if(col.dataType === 'boolean') {
                if(typeof value[col.columnName] === 'bool') {
                    return value[col.columnName]
                } else {
                    return false
                }
            } else if(col.dataType === 'timestamp' || col.dataType === 'timestamptz' ) {
                if(value[col.columnName]) {
                    return `'${getDate(value[col.columnName])}'`
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
            } else if(col.dataType === 'jsonb[]') {
                if(value[col.columnName] && value[col.columnName].length) {
                    let q = value[col.columnName].map(obj => {
                        let details = JSON.stringify(obj)
                        return `'${details}'`
                    }).join(", ")
                    return `array[${q}]::jsonb[]`
                    
                } else {
                    return `array[]::jsonb[]`
                }
            }
        }).join(", ")
        return `( ${row}) `
    }).join(", ")


    return allRow
}

const getIds = (data, name) => {
    return `(${data.map((value) => {
        if(typeof value[name] === 'string'){
            return `'${value.id}'`
        }
        // if(typeof value.id === '')
        return value[name]
    }).join(",")})`
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

const CART_TABLE_NAME = (workspaceId) => {
    return `cart${workspaceId}`
}

const CHECKOUT_TABLE_NAME = (workspaceId) => {
    return `checkout${workspaceId}`
}

const CARTLINEITEMS_TABLE_NAME = (workspaceId) => {
    return `cartlineitems${workspaceId}`
}

const CHECKOUTLINEITEMS_TABLE_NAME = (workspaceId) => {
    return `checkoutlineitems${workspaceId}`
}

const EVENT_TABLE_NAME = (workspaceId) => {
    return `event${workspaceId}`
}

const CUSTOMERAGGREGATE_TABLE_NAME = (workspaceId) => {
    return `customeraggregate${workspaceId}`
}

const DRAFTORDER_TABLE_NAME = (workspaceId) => {
    return `draftorder${workspaceId}`
}

const INVENTORYITEM_TABLE_NAME = (workspaceId) => {
    return `inventoryitem${workspaceId}`
}

const INVENTORYLEVEL_TABLE_NAME = (workspaceId) => {
    return `inventorylevel${workspaceId}`
}

const LOCATION_TABLE_NAME = (workspaceId) => {
    return `location${workspaceId}`
}

const DRAFTORDERLINEITEMS_TABLE_NAME = (workspaceId) => {
    return `draftorderlineitems${workspaceId}`
}

const TAX_TABLE_NAME = (workspaceId) => {
    return `tax${workspaceId}`
}

const DISCOUNTAPPLICATION_TABLE_NAME = (workspaceId) => {
    return `discountapplication${workspaceId}`
}

const VISITOR_TABLE_NAME = (workspaceId) => {
    return `visitor${workspaceId}`
}
// const
// getInsertQury(discount222, order)
// .then(console.log)
// .catch(console.log)

module.exports={
    getColumnName,
    getValues,
    getIds,
    CUSTOMER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
    ORDER_TABLE_NAME,
    DISCOUNT_TABLE_NAME,
    FULFILLMENT_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    VARIANT_TABLE_NAME,
    CART_TABLE_NAME,
    CARTLINEITEMS_TABLE_NAME,
    CHECKOUT_TABLE_NAME,
    CHECKOUTLINEITEMS_TABLE_NAME,
    EVENT_TABLE_NAME,
    CUSTOMERAGGREGATE_TABLE_NAME,
    DRAFTORDER_TABLE_NAME,
    INVENTORYITEM_TABLE_NAME,
    INVENTORYLEVEL_TABLE_NAME,
    LOCATION_TABLE_NAME,
    DRAFTORDERLINEITEMS_TABLE_NAME,
    TAX_TABLE_NAME,
    DISCOUNTAPPLICATION_TABLE_NAME,
    VISITOR_TABLE_NAME,
}
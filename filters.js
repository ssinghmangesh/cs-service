const {
    CUSTOMER_TABLE_NAME, 
    ORDER_TABLE_NAME,
    PRODUCT_TABLE_NAME,
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
    DISCOUNTAPPLICATION_TABLE_NAME
} = require("./controller/DataManager/helper.js");

// let filters1 = {
//     "relation": "AND",  //AND  OR
//     conditions: [
//         {
//             "relation": "AND",
//             'operator': 'Include/Exclude',  //AND  OR
//             conditions: [{
//                 type: "PRODUCT", //CUSTOMER. ORDER, Cart
//                 columnName: "created_at",
//                 filterType: "between",  // >, <,=, not 
//                 dataType: "timestamptz",
//                 values: [10, 20]
//             },
//             {
//                 type: "ORDER", //CUSTOMER. ORDER, Cart
//                 columnName: "buyer_accepts_marketing",
//                 filterType: "equal_to",  // >, <,=, not 
//                 dataType: "boolean",
//                 values: ['yes']
//             }]
//         },
//         {
//             "relation": "OR",  //AND  OR
//             conditions: [{
//                 realtion: "AND",
//                 conditions: [
//                     {
//                         "relation": "OR",  //AND  OR
//                         conditions: [{
//                             type: "CUSTOMER", //CUSTOMER. ORDER, Cart
//                             columnName: "name",
//                             filterType: "in",  // >, <,=, not 
//                             dataType: "varchar[]",
//                             values: ['hello', 'world', 'number', '1']
//                         },
//                         {
//                             type: "ORDER", //CUSTOMER. ORDER, Cart
//                             columnName: "total_price",
//                             filterType: "in",  // >, <,=, not 
//                             dataType: "numeric[]",
//                             values: [10, 20, 30]
//                         }]
//                     }
//                 ]
//             },
//             {
//                 type: "CUSTOMER", //CUSTOMER. ORDER, Cart
//                 columnName: "total_spent",
//                 filterType: "in",  // >, <,=, not 
//                 dataType: "numeric[]",
//                 values: [10, 20, 30]
//             }]
//         }
//     ]


// }

// let filters1 = {
//     relation: 'AND',
//     conditions: [{
//         type: "lineitems",
//         columnName: "product_id",
//         filterType: "in",
//         dataType: "numeric[]",
//         values: [6718142251192]
//     }]
// }

// RESULT
// (id IN (SELECT order_id FROM customer333 WHERE  (first_name like '%a%')) 
// AND 
// ( (fulfillment_status = 'pending') 
//     OR
//     (id IN (SELECT order_id FROM fulfillment333 WHERE  (status like '%a%'))
//         AND 
//         id IN (SELECT order_id FROM product333 WHERE  (product_type like '%a%')) ) 
//     OR 
//     id IN (SELECT order_id FROM customer333 WHERE  (email like '%a%')) ) 
// AND id IN (SELECT order_id FROM order333 WHERE  (DATE(created_at)  = CURRENT_DATE - 10)) 
// AND id IN (SELECT order_id FROM product333 WHERE  (title like '%a%')) )

let typeoptions = ['text', 'number', 'array', 'boolean', 'timestamptz', 'dropdown']

const whereClause = (filters, ptype, workspaceId) => {
    if(filters.conditions) {
        return `(${filters.conditions.map(filter => {
            return whereClause(filter, ptype, workspaceId)
        }).join(` ${ filters.relation } `)} )`
    } else {
        return typeBuild(ptype, workspaceId, filters)
    }
}

const typeBuild = (ptype, workspaceId, { columnName, filterType, dataType, values, type, tableName }) => {
    if(tableName && typeoptions.includes(type)) {
        type = tableName
    }
    let prefix = ''

    if(ptype === 'customer' || ptype === 'customeraggregate') {
        if(type === 'order') {
            prefix = `id IN (SELECT customer_id FROM ${ORDER_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'discountapplication') {
            prefix = `id IN (SELECT customer_id FROM ${DISCOUNTAPPLICATION_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'event') {
            prefix = `id IN (SELECT customer_id FROM ${EVENT_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'lineitems') {
            prefix = `id IN (SELECT customer_id FROM ${LINEITEMS_TABLE_NAME(workspaceId)} WHERE `
        }
    } else if(ptype === 'order') {
        if(type === 'customer' || type === 'customeraggregate') {
            prefix = `customer_id IN (SELECT id FROM ${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'discountapplication') {
            prefix = `id IN (SELECT order_id FROM ${DISCOUNTAPPLICATION_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'lineitems') {
            prefix = `id IN (SELECT order_id FROM ${LINEITEMS_TABLE_NAME(workspaceId)} WHERE `
        }
    } else if(ptype === 'discountapplication') {
        if(type === 'customer' || type === 'customeraggregate') {
            prefix = `customer_id IN (SELECT id FROM ${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'order') {
            prefix = `order_id IN (SELECT id FROM ${ORDER_TABLE_NAME(workspaceId)} WHERE `
        }
    } else if(ptype === 'tax') {
        if(type === 'customer' || type === 'customeraggregate') {
            prefix = `customer_id IN (SELECT id FROM ${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'order') {
            prefix = `order_id IN (SELECT id FROM ${ORDER_TABLE_NAME(workspaceId)} WHERE `
        }
    } else if(ptype === 'draftorder') {
        if(type === 'customer' || type === 'customeraggregate') {
            prefix = `customer_id IN (SELECT id FROM ${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'order') {
            prefix = `order_id IN (SELECT id FROM ${ORDER_TABLE_NAME(workspaceId)} WHERE `
        } else if(type === 'discountapplication') {
            prefix = `id IN (SELECT order_id FROM ${DISCOUNTAPPLICATION_TABLE_NAME(workspaceId)} WHERE `
        }
    } else if(ptype === 'cart') {
        if(type === 'customer' || type === 'customeraggregate') {
            prefix = `customer_id IN (SELECT id FROM ${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)} WHERE `
        }
    }

    let query = ''
    if (dataType === 'numeric') {
        if (filterType === 'equal_to') {
            query = `${prefix} (${columnName} = ${values[0]})`
        } else if (filterType === 'not_equal_to') {
            query = `${prefix} (${columnName} != ${values[0]})`
        } else if (filterType === 'less_than') {
            query = `${prefix} (${columnName} < ${values[0]})`
        } else if (filterType === 'less_than_equal_to') {
            query = `${prefix} (${columnName} <= ${values[0]})`
        } else if (filterType === 'greater_than') {
            query = `${prefix} (${columnName} > ${values[0]})`
        } else if (filterType === 'greater_than_equal_to') {
            query = `${prefix} (${columnName} >= ${values[0]})`
        } else if (filterType === 'between') {
            query = `${prefix} (${columnName} BETWEEN ${values[0]} AND ${values[1]})`
        }
    } else if (dataType === 'numeric[]') {
        if (filterType === 'in') {
            if(columnName === 'product_purchased' || columnName === 'variant_purchased') {
                query = `${prefix} (${columnName} && array[${values}]::numeric[])`
            } else {
                query = `${prefix} (${columnName} IN (${values}))`
            }
        } else if (filterType === 'not_in') {
            if(columnName === 'product_purchased' || columnName === 'variant_purchased') {
                query = `${prefix} (case when ${columnName} && array[${values}]::numeric[] then false else true end)`
            } else {
                query = `${prefix} (${columnName} IN (${values}))`
            }
        }
    } else if (dataType === 'varchar') {
        if (filterType === 'equal_to') {
            if(columnName === 'name' || columnName === 'event_name') {
                query = `${prefix} (${columnName} = '${values[0]}')`
            } else {
                query = `${prefix} (${columnName} = '${values[0]}')`
            }
        } else if (filterType === 'not_equal_to') {
            if(columnName === 'name' || columnName === 'event_name') {
                query = `${prefix} (${columnName} != '${values[0]}')`
            } else {
                query = `${prefix} (${columnName} != '${values[0]}')`
            }
        } else if (filterType === 'starts_with') {
            if(columnName === 'name' || columnName === 'event_name') {
                query = `${prefix} (${columnName} like '${values[0]}%')`
            } else {
                query = `${prefix} (${columnName} like '${values[0]}%')`
            }
        } else if (filterType === 'ends_with') {
            if(columnName === 'name' || columnName === 'event_name') {
                query = `${prefix} (${columnName} like '%${values[0]}')`
            } else {
                query = `${prefix} (${columnName} like '%${values[0]}')`
            }
        } else if (filterType === 'contains') {
            if(columnName === 'name' || columnName === 'event_name') {
                query = `${prefix} (${columnName} like '%${values[0]}%')`
            } else {
                query = `${prefix} (${columnName} like '%${values[0]}%')`
            }
        } else if (filterType === 'is_known' ) {
            if(columnName === 'name' || columnName === 'event_name') {
                query = `${prefix} (LENGTH(${columnName}) > 0)`
            } else {
                query = `${prefix} (LENGTH(${columnName}) > 0)`
            }
        } else if (filterType === 'is_unknown') {
            if(columnName === 'name' || columnName === 'event_name') {
                query = `${prefix} (LENGTH(${columnName}) = 0)`
            } else {
                query = `${prefix} (LENGTH(${columnName}) = 0)`
            }
        } else if (filterType === 'in') {
            let newvalues = values.map(str => {
                return `'${str}'`
            }).join(", ")
            query = `${prefix} (${columnName} IN (${newvalues}))`
        } else if (filterType === 'not_in') {
            let newvalues = values.map(str => {
                return `'${str}'`
            }).join(", ")
            query = `${prefix} (${columnName} NOT IN (${newvalues}))`
        }
    } else if (dataType === 'varchar[]') {
        if (filterType === 'in') {
            let newvalues = values.map(str => {
                return `'${str}'`
            }).join(", ")
            query = `${prefix} (${columnName} IN (${newvalues}))`
        } else if (filterType === 'not_in') {
            let newvalues = values.map(str => {
                return `'${str}'`
            }).join(", ")
            query = `${prefix} (${columnName} NOT IN (${newvalues}))`
        } else if (filterType === 'between') {
            query = `${prefix} (${columnName} BETWEEN '${values[0]}' AND '${values[1]}' )`
        } else if (filterType === 'not_between') {
            query = `${prefix} (${columnName} NOT BETWEEN '${values[0]}' AND '${values[1]}' )`
        }
    } else if (dataType === 'boolean') {
        query = `${prefix} (${columnName} = '${values[0]}'`
        if(values.length === 1 || values[1] === '') {
            query += ')'
        } else {
            query += ` OR ${columnName} = '${values[1]}')`
        }
    } else if (dataType === 'timestamptz') {
        query = `${prefix} (DATE(${columnName}) `
        if(values.length > 1 && values[1] != '') {
            query += `BETWEEN CURRENT_DATE - ${Math.max(...values)} AND CURRENT_DATE - ${Math.min(...values)})`
        } else {
            if (filterType === 'equal_to') {
                query += ` = CURRENT_DATE - ${values[0]})`
            } else if (filterType === 'not_equal_to') {
                query += ` != CURRENT_DATE - ${values[0]})`
            } else if (filterType === 'less_than') {
                query += `< CURRENT_DATE - ${values[0]})`
            } else if (filterType === 'less_than_equal_to') {
                query += `<= CURRENT_DATE - ${values[0]})`
            } else if (filterType === 'greater_than') {
                query += `> CURRENT_DATE - ${values[0]})`
            } else if (filterType === 'greater_than_equal_to') {
                query += `>= CURRENT_DATE - ${values[0]})`
            }
        }
    } else if (dataType === 'timestamptz[]') {
        if (filterType === 'between') {
            query = `${prefix} (DATE(${columnName}) BETWEEN CURRENT_DATE - ${Math.max(...values)} AND CURRENT_DATE - ${Math.min(...values)})`
        } else if (filterType === 'not_between') {
            query = `${prefix} (${prefix} DATE(${columnName}) NOT BETWEEN CURRENT_DATE - ${Math.max(...values)} AND CURRENT_DATE - ${Math.min(...values)})`
        }
    }
    if(prefix) {
        query += ')'
    }
    return query
}

// console.log(whereClause(filters1, 'order', 56788582584))

module.exports = {
    whereClause
}

// let table = ''
    // let f = 0
    // console.log(ptype, type)
    // if(typeof type === 'undefined' || typeoptions.includes(type)) {
    //     f = 1
    // }

// const columnDecider = (type) => {
//     if(type === 'customer' || type === 'customeraggregate') return 'customer_id'
//     else if(type === 'order') return 'order_id'
//     else if(type === 'product') return 'product_id'
//     else if(type === 'fulfillment') return 'fulfillment_id'
//     else if(type === 'discountapplication') return 'id'
//     else return 'id'
// }

    // if(type === 'customer') {
    //     table = `${CUSTOMER_TABLE_NAME(workspaceId)}`
    // } else if(type === 'order') {
    //     table = `${ORDER_TABLE_NAME(workspaceId)}`
    // } else if(type === 'product') {
    //     table = `${PRODUCT_TABLE_NAME(workspaceId)}`
    // } else if(type === 'fulfillment') {
    //     table = `${FULFILLMENT_TABLE_NAME(workspaceId)}`
    // } else if(type === 'discountapplication') {
    //     table = `${DISCOUNTAPPLICATION_TABLE_NAME(workspaceId)}`
    // } else if(type === 'customeraggregate') {
    //     table = `${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)}`
    // } else if(typeof type === 'undefined' || typeoptions.includes(type)) {
    //     f = 1
    // }

    // if(ptype === 'customer' && ptype != type) {
    //     let col = columnDecider(type), subcol = 'id'
    //     if(col === 'id') subcol = 'customer_id'
    //     if(f) {
    //         table = `${CUSTOMER_TABLE_NAME(workspaceId)}`
    //     }
    //     prefix = `${col} IN (SELECT ${subcol} FROM ${table} WHERE `
    // } else if(ptype === 'customeraggregate' && ptype != type) {
    //     let col = columnDecider(type), subcol = 'id'
    //     if(col === 'id') subcol = 'customer_id'
    //     if(f) {
    //         table = `${CUSTOMERAGGREGATE_TABLE_NAME(workspaceId)}`
    //     }
    //     prefix = `${col} IN (SELECT ${subcol} FROM ${table} WHERE `
    // }  else if(ptype === 'order' && ptype != type) {
    //     let col = columnDecider(type), subcol = 'id'
    //     if(col === 'id') subcol = 'order_id'
    //     if(f) {
    //         table = `${ORDER_TABLE_NAME(workspaceId)}`
    //     }
    //     prefix = `${col} IN (SELECT ${subcol} FROM ${table} WHERE `
    // } else if(ptype === 'product' && ptype != type) {
    //     let col = columnDecider(type), subcol = 'id'
    //     if(col === 'id') subcol = 'product_id'
    //     if(f) {
    //         table = `${PRODUCT_TABLE_NAME(workspaceId)}`
    //     }
    //     prefix = `${col} IN (SELECT ${subcol} FROM ${table} WHERE `
    // } else if(ptype === 'fulfillment' && ptype != type) {
    //     let col = columnDecider(type), subcol = 'id'
    //     if(col === 'id') subcol = 'fulfillment_id'
    //     if(f) {
    //         table = `${FULFILLMENT_TABLE_NAME(workspaceId)}`
    //     }
    //     prefix = `${col} IN (SELECT ${subcol} FROM ${table} WHERE `
    // }

    // console.log(prefix)
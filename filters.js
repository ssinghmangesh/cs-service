
let filters = {
    "relation": "AND",  //AND  OR
    conditions: [
        {
            "relation": "AND",  //AND  OR
            conditions: [{
                type: "PRODUCT", //CUSTOMER. ORDER, Cart
                columnName: "created_at",
                filterType: "between",  // >, <,=, not 
                dataType: "timestamptz[]",
                values: ['2020-05-13 11:49:40.765997+05:30', '2021-05-13 11:49:40.765997+05:30']
            },
            {
                type: "FULFILLMENT", //CUSTOMER. ORDER, Cart
                columnName: "accepts_marketing",
                filterType: "equal_to",  // >, <,=, not 
                dataType: "boolean",
                values: 'FALSE'
            }]
        },
        {
            "relation": "OR",  //AND  OR
            conditions: [{
                realtion: "AND",
                conditions: [
                    {
                        "relation": "OR",  //AND  OR
                        conditions: [{
                            type: "CUSTOMER", //CUSTOMER. ORDER, Cart
                            columnName: "name",
                            filterType: "in",  // >, <,=, not 
                            dataType: "varchar[]",
                            values: ['hello', 'world', 'number', '1']
                        },
                        {
                            type: "ORDER", //CUSTOMER. ORDER, Cart
                            columnName: "total_price",
                            filterType: "in",  // >, <,=, not 
                            dataType: "numeric[]",
                            values: [10, 20, 30]
                        }]
                    }
                ]
            },
            {
                type: "CUSTOMER", //CUSTOMER. ORDER, Cart
                columnName: "amount",
                filterType: "in",  // >, <,=, not 
                dataType: "numeric[]",
                values: [10, 20, 30]
            }]
        }
    ]


}

// (( (created_at between) AND (accepts_marketing equal_to)  ) AND ((name in) OR (amount in)))

// (( (created_at BETWEEN '2020-05-13 11:49:40.765997+05:30' AND '2021-05-13 11:49:40.765997+05:30') AND id IN (SELECT product_id FROM FULFILLMENT WHERE  (accepts_marketing = 'FALSE')) ) 
// AND 
// ((( (name IN ('hello', 'world', 'number', '1')) OR id IN (SELECT customer_id FROM ORDER WHERE  (total_price IN (10,20,30))) ) ) 
// OR  
// (amount IN (10,20,30)) ) )
// (
//     (
//         (created_at BETWEEN '2020-05-13 11:49:40.765997+05:30' AND '2021-05-13 11:49:40.765997+05:30') 
//         AND 
//         (accepts_marketing = 'FALSE') 
//     ) 
//     AND 
//     (
//         (name IN ('hello', 'world', 'number', '1')) 
//         OR 
//         (amount IN (10,20,30)) 
//     ) 
// )

// let filters = {
//     "relation": "AND",  //AND  OR
//     conditions: [{
//         type: "CUSTOMER", //CUSTOMER. ORDER, Cart
//         columnName: "name",
//         filterType: "contains",  // >, <,=, not 
//         dataType: "varchar",
//         values: "a"
//     },
//     {
//         type: "ORDER", //CUSTOMER. ORDER, Cart
//         columnName: "created_at",
//         filterType: "between",  // >, <,=, not 
//         dataType: "timestamptz[]",
//         values: ['2020-05-13 11:49:40.765997+05:30', '2021-05-13 11:49:40.765997+05:30']
//     }]
// }

// select name from customer
//    where name like '%a%' and id in (select customer_id from orders where created_at < '2020-05-13 11:49:40.765997+05:30')
//         (name like '%a%') AND id IN (SELECT customer_id FROM ORDER WHERE (created_at < '2020-05-13 11:49:40.765997+05:30'))

// "SELECT name FROM customers WHERE 
// id IN (SELECT cid FROM orders WHERE date < DATE_SUB(CURDATE(), INTERVAL 30 DAY) GROUP BY(cid) HAVING COUNT(*) > 5)";

const whereClause = (filters, ptype) => {
    if(filters.conditions) {
        return `(${filters.conditions.map((filter, index) => {
            // console.log('!!!')
            // console.log(filter.type)
            if(!index) ptype = filter.type
            return whereClause(filter, ptype)
        }).join(` ${ filters.relation } `)} )`
    } else {
        return typeBuild(ptype, filters)
    }
}

const typeBuild = (ptype, { columnName, filterType, dataType, values, type }) => {
    let prefix = ''
    console.log(ptype, type)
    if(ptype === 'CUSTOMER' && ptype != type) {
        prefix = `id IN (SELECT customer_id FROM ${type} WHERE `
    } else if(ptype === 'ORDER' && ptype != type) {
        prefix = `id IN (SELECT order_id FROM ${type} WHERE `
    } else if(ptype === 'FULFILLMENT' && ptype != type) {
        prefix = `id IN (SELECT fulfillment_id FROM ${type} WHERE `
    } else if(ptype === 'PRODUCT' && ptype != type) {
        prefix = `id IN (SELECT product_id FROM ${type} WHERE `
    } else if(typeof ptype === 'undefined') {
        prefix = `id IN (SELECT id FROM ${type} WHERE `
        // if(type === 'CUSTOMER') {
        //     prefix = `id IN (SELECT customer_id FROM ${type} WHERE `
        // } else if(type === 'ORDER') {
        //     prefix = `id IN (SELECT order_id FROM ${type} WHERE `
        // } else if(type === 'FULFILLMENT') {
        //     prefix = `id IN (SELECT fulfillment_id FROM ${type} WHERE `
        // } else if(type === 'PRODUCT') {
        //     prefix = `id IN (SELECT product_id FROM ${type} WHERE `
        // }
    }

    // if(type != 'CUSTOMER') {
    //     prefix = `id IN (SELECT customer_id FROM ${type} WHERE `
    // }
    let query = ''
    if (dataType === 'numeric') {
        if (filterType === 'equal_to') {
            query = `${prefix} (${columnName} = ${values})`
        } else if (filterType === 'not_equal_to') {
            query = `${prefix} (${columnName} != ${values})`
        } else if (filterType === 'less_than') {
            query = `${prefix} (${columnName} < ${values})`
        } else if (filterType === 'less_than_equal_to') {
            query = `${prefix} (${columnName} <= ${values})`
        } else if (filterType === 'greater_than') {
            query = `${prefix} (${columnName} > ${values})`
        } else if (filterType === 'greater_than_equal_to') {
            query = `${prefix} (${columnName} >= ${values})`
        }
    } else if (dataType === 'numeric[]') {
        if (filterType === 'in') {
            query = `${prefix} (${columnName} IN (${values}))`
        } else if (filterType === 'not_in') {
            query = `${prefix} (${columnName} NOT IN (${values}))`
        } else if (filterType === 'between') {
            query = `${prefix} (${columnName} BETWEEN ${values[0]} AND ${values[1]})`
        } else if (filterType === 'not_between') {
            query = `${prefix} (${columnName} NOT BETWEEN ${values[0]} AND ${values[1]})`
        }
    } else if (dataType === 'varchar') {
        if (filterType === 'equal_to') {
            query = `${prefix} (${columnName} = '${values}')`
        } else if (filterType === 'not_equal_to') {
            query = `${prefix} (${columnName} != '${values}')`
        } else if (filterType === 'less_than') {
            query = `${prefix} (${columnName} < '${values}')`
        } else if (filterType === 'less_than_equal_to') {
            query = `${prefix} (${columnName} <= '${values}')`
        } else if (filterType === 'greater_than') {
            query = `${prefix} (${columnName} > '${values}')`
        } else if (filterType === 'greater_than_equal_to') {
            query = `${prefix} (${columnName} >= '${values}')`
        } else if (filterType === 'starts_with') {
            query = `${prefix} (${columnName} like '%${values}')`
        } else if (filterType === 'ends_with') {
            query = `${prefix} (${columnName} like '${values}%')`
        } else if (filterType === 'contains') {
            query = `${prefix} (${columnName} like '%${values}%')`
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
        if (filterType === 'equal_to') {
            query = `${prefix} (${columnName} = '${values}')`
        } else if (filterType === 'not_equal_to') {
            query = `${prefix} (${columnName} = '${values}')`
        }
    } else if (dataType === 'timestamptz') {
        if (filterType === 'equal_to') {
            query = `${prefix} (${columnName} = '${values}')`
        } else if (filterType === 'not_equal_to') {
            query = `${prefix} (${columnName} != '${values}')`
        } else if (filterType === 'less_than') {
            query = `${prefix} (${columnName} < '${values}')`
        } else if (filterType === 'less_than_equal_to') {
            query = `${prefix} (${columnName} <= '${values}')`
        } else if (filterType === 'greater_than') {
            query = `${prefix} (${columnName} > '${values}')`
        } else if (filterType === 'greater_than_equal_to') {
            query = `${prefix} (${columnName} >= '${values}')`
        }
    } else if (dataType === 'timestamptz[]') {
        if (filterType === 'between') {
            query = `${prefix} (${columnName} BETWEEN '${values[0]}' AND '${values[1]}')`
        } else if (filterType === 'not_between') {
            query = `${prefix} (${prefix} ${columnName} NOT BETWEEN '${values[0]}' AND '${values[1]}')`
        }
    }

    if(prefix) {
        query += ')'
    }
    return query
}



// (created_at BETWEEN '2020-05-13 11:49:40.765997+05:30' AND '2021-05-13 11:49:40.765997+05:30') 
// AND (accepts_marketing = 'FALSE') 
// AND (name IN ('hello', 'world', 'number', '1')) 
// OR (amount IN (10,20,30))

console.log(whereClause(filters, ''))
module.exports = {
    whereClause
}
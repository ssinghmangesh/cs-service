
let filters = {
    "relation": "AND",  //AND  OR
    conditions: [{
        type: "CUSTOMER", //CUSTOMER. ORDER, Cart
        columnName: "name",
        filterType: "equal_to",  // >, <,=, not 
        dataType: "varchar",
        values:'hello'
    },
    {
        type: "CUSTOMER", //CUSTOMER. ORDER, Cart
        columnName: "amount",
        filterType: "between",  // >, <,=, not 
        dataType: "numeric",
        values:[10, 20]

    }]
}

const whereClause = (filters) => {
    let output = filters.conditions.map(typeBuild).join(` ${filters.relation} `)
    console.log(output);
    return output
}

const typeBuild = ({ columnName, filterType, dataType, values }) => {
    if(dataType === 'numeric') {
        if(filterType === 'equal_to') {
            return `(${columnName} = ${values})`
        } else if (filterType === 'not_equal_to'){
            return `(${columnName} != ${values})`
        } else if (filterType === 'less_than'){
            return `(${columnName} < ${values})`
        } else if (filterType === 'less_than_equal_to'){
            return `(${columnName} <= ${values})`
        } else if (filterType === 'greater_than'){
            return `(${columnName} > ${values})`
        } else if (filterType === 'greater_than_equal_to'){
            return `(${columnName} >= ${values})`
        } else if (filterType === 'between'){
            return `(${columnName} between ${values[0]} AND ${values[1]})`
        }
    } else if(dataType === 'varchar') {
        if(filterType === 'equal_to') {
            return `(${columnName} = '${values}')`
        } else if (filterType === 'not_equal_to'){
            return `(${columnName} != '${values}')`
        } else if (filterType === 'less_than'){
            return `(${columnName} < '${values}')`
        } else if (filterType === 'less_than_equal_to'){
            return `(${columnName} <= '${values}')`
        } else if (filterType === 'greater_than'){
            return `(${columnName} > '${values}')`
        } else if (filterType === 'greater_than_equal_to'){
            return `(${columnName} >= '${values}')`
        } else if (filterType === 'starts_with'){
            return `(${columnName} like '%${values}')`
        } else if (filterType === 'ends_with'){
            return `(${columnName} like '${values}%')`
        } else if (filterType === 'contains'){
            return `(${columnName} like '%${values}%')`
        }
    } 
}

whereClause(filters)
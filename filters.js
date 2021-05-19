
let filters = [
    {
        "relation": "AND",  //AND  OR
        conditions: [{
            type: "CUSTOMER", //CUSTOMER. ORDER, Cart
            columnName: "created_at",
            filterType: "between",  // >, <,=, not 
            dataType: "timestamptz[]",
            values:['2020-05-13 11:49:40.765997+05:30', '2021-05-13 11:49:40.765997+05:30']
        },
        {
            type: "CUSTOMER", //CUSTOMER. ORDER, Cart
            columnName: "accepts_marketing",
            filterType: "equal_to",  // >, <,=, not 
            dataType: "boolean",
            values:'FALSE'
        }]
    },
    {
        "relation": "OR",  //AND  OR
        conditions: [{
            type: "CUSTOMER", //CUSTOMER. ORDER, Cart
            columnName: "name",
            filterType: "in",  // >, <,=, not 
            dataType: "varchar[]",
            values:['hello', 'world', 'number', '1']
        },
        {
            type: "CUSTOMER", //CUSTOMER. ORDER, Cart
            columnName: "amount",
            filterType: "in",  // >, <,=, not 
            dataType: "numeric[]",
            values:[10,20,30]
        }]
    }
]

const whereClause = (filters) => {
    let whereQuery = filters.map(obj => {
        let output = obj.conditions.map(typeBuild).join(` ${obj.relation} `)
        return `(${output})`
    }).join(" AND ")
    console.log(whereQuery)
}

const typeBuild = ({ columnName, filterType, dataType, values }) => {
    if(dataType === 'numeric') {
        if(filterType === 'equal_to') {
            return `(${columnName} = ${values})`
        } else if(filterType === 'not_equal_to'){
            return `(${columnName} != ${values})`
        } else if(filterType === 'less_than'){
            return `(${columnName} < ${values})`
        } else if(filterType === 'less_than_equal_to'){
            return `(${columnName} <= ${values})`
        } else if(filterType === 'greater_than'){
            return `(${columnName} > ${values})`
        } else if(filterType === 'greater_than_equal_to'){
            return `(${columnName} >= ${values})`
        }
    } else if(dataType === 'numeric[]') {
        if(filterType === 'in') {
            return `(${columnName} IN (${values}))`
        } else if(filterType === 'not_in'){
            return `(${columnName} NOT IN (${values}))`
        } else if(filterType === 'between'){
            return `(${columnName} BETWEEN ${values[0]} AND ${values[1]})`
        } else if(filterType === 'not_between'){
            return `(${columnName} NOT BETWEEN ${values[0]} AND ${values[1]})`
        }
    } else if(dataType === 'varchar') {
        if(filterType === 'equal_to') {
            return `(${columnName} = '${values}')`
        } else if(filterType === 'not_equal_to'){
            return `(${columnName} != '${values}')`
        } else if(filterType === 'less_than'){
            return `(${columnName} < '${values}')`
        } else if(filterType === 'less_than_equal_to'){
            return `(${columnName} <= '${values}')`
        } else if(filterType === 'greater_than'){
            return `(${columnName} > '${values}')`
        } else if(filterType === 'greater_than_equal_to'){
            return `(${columnName} >= '${values}')`
        } else if(filterType === 'starts_with'){
            return `(${columnName} like '%${values}')`
        } else if(filterType === 'ends_with'){
            return `(${columnName} like '${values}%')`
        } else if(filterType === 'contains'){
            return `(${columnName} like '%${values}%')`
        }
    } else if(dataType === 'varchar[]') {
        if(filterType === 'in') {
            let newvalues = values.map(str => {
                return `'${str}'`
            }).join(", ")
            return `(${columnName} IN (${newvalues}))`
        } else if(filterType === 'not_in') {
            let newvalues = values.map(str => {
                return `'${str}'`
            }).join(", ")
            return `(${columnName} NOT IN (${newvalues}))`
        } else if(filterType === 'between') {
            return `(${columnName} BETWEEN '${values[0]}' AND '${values[1]}' )`
        } else if(filterType === 'not_between') {
            return `(${columnName} NOT BETWEEN '${values[0]}' AND '${values[1]}' )`
        }
    } else if(dataType === 'boolean') {
        if(filterType === 'equal_to') {
            return `(${columnName} = '${values}')`
        } else if(filterType === 'not_equal_to'){
            return `(${columnName} = '${values}')`
        }
    } else if(dataType === 'timestamptz') {
        if(filterType === 'equal_to') {
            return `(${columnName} = '${values}')`
        } else if(filterType === 'not_equal_to'){
            return `(${columnName} != '${values}')`
        } else if(filterType === 'less_than'){
            return `(${columnName} < '${values}')`
        } else if(filterType === 'less_than_equal_to'){
            return `(${columnName} <= '${values}')`
        } else if(filterType === 'greater_than'){
            return `(${columnName} > '${values}')`
        } else if(filterType === 'greater_than_equal_to'){
            return `(${columnName} >= '${values}')`
        }
    } else if(dataType === 'timestamptz[]') {
        if(filterType === 'between') {
            return `(${columnName} BETWEEN '${values[0]}' AND '${values[1]}')`
        } else if(filterType === 'not_between') {
            return `(${columnName} NOT BETWEEN '${values[0]}' AND '${values[1]}')`
        }
    }
}

whereClause(filters)
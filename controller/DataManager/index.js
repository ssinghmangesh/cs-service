const PostgresqlDb = require('../../db')
const customerAggregateColumn = require('./Setup/customerAggregateColumns.json')

const {getColumnName, getValues, getIds} =  require("./helper")
const {
    CUSTOMER_TABLE_NAME,
    ORDER_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    CART_TABLE_NAME,
    EVENT_TABLE_NAME,
    CUSTOMERAGGREGATE_TABLE_NAME
} = require("./helper.js");


const insert = async(TABLE_NAME, column, data, workspaceId) => {
    if(data.length == 0){
        return;
    }
    const query = `
        INSERT INTO ${TABLE_NAME(workspaceId)}
        ${getColumnName({ columnData: column })}
        VALUES ${getValues({ columnData: column, data })}
    `
    // console.log(query)
    return await PostgresqlDb.query(query)
}

const aggregate = async (workspaceId, customerId) => {
    // console.log('@@@@@@@@@@@')
    let data = await PostgresqlDb.query(`SELECT * FROM ${CUSTOMER_TABLE_NAME(workspaceId)} WHERE id = ${customerId};`)
    const customer = data.rows[0]
    data = await PostgresqlDb.query(`SELECT * FROM ${ORDER_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId} ORDER BY created_at;`)
    const orders = data.rows
    data = await PostgresqlDb.query(`SELECT * FROM ${LINEITEMS_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId};`)
    const lineitems = data.rows
    data = await PostgresqlDb.query(`SELECT * FROM ${REFUNDED_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId};`)
    const refunded = data.rows
    data = await PostgresqlDb.query(`SELECT * FROM ${CART_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId};`)
    const cart = data.rows
    data = await PostgresqlDb.query(`SELECT * FROM ${EVENT_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId} ORDER BY created_at DESC;`)
    const event = data.rows

    let tamount = 0, avgAmount = 0, cancelledOrder = 0, uncancelledOrder = 0, unfulfilledOrder = 0, unrefundedOrder = 0
    let firstOrderAt, lastOrderAt
    if(orders.length) {

        for(i = 0; i < orders.length; i++) {
            tamount += Number(orders[i].total_price)
            if(orders[i].cancelled_at != '') {
                cancelledOrder++
            }
            if(orders[i].cancelled_at === '') {
                uncancelledOrder++
            }
            if(orders[i].fulfillment_status === '') {
                unfulfilledOrder++
            }
            if(orders[i].financial_status != 'partially_refunded' && orders[i].financial_status != 'refunded') {
                unrefundedOrder++
            }
        }

        firstOrderAt = orders[0].created_at
        lastOrderAt = orders[orders.length - 1].created_at
        // console.log('!!!!!!!!', firstOrderAt)

        avgAmount = tamount / orders.length
    }

    let productPurchased = [], abandonedCart = false
    for(let i = 0; i < lineitems.length; i++) {
        productPurchased.push(Number(lineitems[i].variant_id))
    }
    if(cart.length) {
        abandonedCart = true
    }

    let productViewed = []
    for(let i = 0; i < event.length; i++) {
        productViewed.push(Number(event[i].page_id))
    }

    let Name = '', firstName = '', lastName = '', defaultAddress = {}, zipCode = 0, Email = '', Tags = ''
    if(customer) {
        if(customer.default_address) {
            Name = customer.default_address.name
            firstName = customer.default_address.first_name
            lastName = customer.default_address.last_name
            defaultAddress = customer.default_address
            zipCode = customer.default_address.zip
        }
        if(customer.email) {
            Email = customer.email
        }
        if(customer.tags) {
            Tags = customer.tags
        }
    }

    lastSeen = new Date()
    // if(event) {
    //     lastSeen = event[0].created_at
    // }

    // last_seen pending
    const customerData = [{
        customer_id: customerId,
        name: Name,
        first_name: firstName,
        last_name: lastName,
        email: Email,
        total_order_count: orders.length,
        total_amount_spent: tamount,
        avg_order_price: avgAmount,
        product_purchased: productPurchased,
        product_viewed: productViewed,
        refunded_order_count: refunded.length,
        cancelled_order_count: cancelledOrder,
        unfulfilled_order_count: unfulfilledOrder,
        unrefunded_order_count: unrefundedOrder,
        uncancelled_order_count: uncancelledOrder,
        abandoned_cart: abandonedCart,
        first_order_at: firstOrderAt,
        last_order_at: lastOrderAt,
        last_seen: lastSeen,
        tags: Tags,
        default_address: defaultAddress,
        zip_code: zipCode
    }]

    // console.log(customerData)

    await insert(CUSTOMERAGGREGATE_TABLE_NAME, customerAggregateColumn, customerData, workspaceId)
}

// INSERT INTO customeraggregate${workspaceId}
// ${getColumnName({ columnData: customerAggregateColumn })}
// VALUES (3, '{ "address": "line" }', 10, 11, 12, array[1, 2, 3], array[4, 5, 6], 13, 14, 15, 16, 17, true, '2021-05-13 11:49:40.765997+05:30', '2021-05-13 11:49:40.765997+05:30', '2021-05-13 11:49:40.765997+05:30', 'ttaaggss', '{ "default_address": "real_address" }', 324005);

const del = async (TABLE_NAME, data, workspaceId, id = 'id', id1) => {
    if(data.length == 0){
        return;
    }
    if(typeof id1 === 'undefined') {
        id1 = id
    }
    // console.log(id1, data)
    const query = `DELETE FROM ${TABLE_NAME(workspaceId)} WHERE ${id} IN ${getIds(data, id1)}`
    // console.log(query);
    let response =  await PostgresqlDb.query(query);
    // console.log(response);
}

// const order = require('../Order/order.json')
// del([ order ], 12345)
// .then(console.log)
// .catch(console.log)

// aggregate(333, 2861387415684)
// .then(console.log)
// .catch(console.log)

module.exports = {
    insert,
    del,
    aggregate,
}

const PostgresqlDb = require('../../db')
const customerAggregateColumn = require('./Setup/customerAggregateColumns.json')
const variantAggregateColumns = require('./Setup/variantAggregateColumns.json')

const {getColumnName, getValues, getIds} =  require("./helper")
const {
    CUSTOMER_TABLE_NAME,
    ORDER_TABLE_NAME,
    LINEITEMS_TABLE_NAME,
    REFUNDED_TABLE_NAME,
    CART_TABLE_NAME,
    EVENT_TABLE_NAME,
    CUSTOMERAGGREGATE_TABLE_NAME,
    VARIANT_TABLE_NAME,
    VARIANTAGGREGATE_TABLE_NAME,
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
    console.log(query)
    return await PostgresqlDb.query(query)
}

const variantAggregate = async (workspaceId, variantId) => {
    let data = await PostgresqlDb.query(`SELECT * FROM ${VARIANT_TABLE_NAME(workspaceId)} WHERE id = ${variantId};`)
    const variants = data.rows
    data = await PostgresqlDb.query(`SELECT * FROM ${LINEITEMS_TABLE_NAME(workspaceId)} WHERE variant_id = ${variantId};`)
    const lineitems = data.rows
    data = await PostgresqlDb.query(`SELECT variant_id FROM ${CART_TABLE_NAME(workspaceId)};`)
    const carts = data.rows
    // console.log(carts)

    let cartQuantity = 0
    for(let i = 0; carts && i < carts.length; i++) {
        for(let j = 0; carts[i].variant_id && j < carts[i].variant_id.length; j++) {
            if(carts[i].variant_id[j] === variantId) {
                cartQuantity++
            }
        }
    }
    variantData = variants.map((variant) => {
        return {
            ...variant,
            quantity_sold: lineitems.length,
            quantity_in_cart: cartQuantity,
        }
    })
    // console.log(variantData.length)

    await insert(VARIANTAGGREGATE_TABLE_NAME, variantAggregateColumns, variantData, workspaceId)
}

// variantAggregate(56788582584, 39859538788536)

const aggregate = async (workspaceId, customerId) => {
    // console.log('@@@@@@@@@@@')
    let data = await PostgresqlDb.query(`SELECT * FROM ${CUSTOMER_TABLE_NAME(workspaceId)} WHERE id = ${customerId};`)
    const customer = data.rows[0]
    data = await PostgresqlDb.query(`SELECT * FROM ${ORDER_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId} ORDER BY created_at;`)
    const orders = data.rows
    data = await PostgresqlDb.query(`SELECT DISTINCT(variant_id) FROM ${LINEITEMS_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId};`)
    const lineitems = data.rows
    data = await PostgresqlDb.query(`SELECT * FROM ${REFUNDED_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId};`)
    const refunded = data.rows
    data = await PostgresqlDb.query(`SELECT * FROM ${CART_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId};`)
    const cart = data.rows
    data = await PostgresqlDb.query(`SELECT * FROM ${EVENT_TABLE_NAME(workspaceId)} WHERE customer_id = ${customerId} ORDER BY created_at DESC;`)
    const event = data.rows

    let tamount = 0, avgAmount = 0, cancelledOrder = 0, refundedOrder = 0, paidOrders = 0, fulfilledOrder = 0
        uncancelledOrder = 0, unfulfilledOrder = 0, unrefundedOrder = 0, unpaidOrders = 0
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
            if(orders[i].fulfillment_status === '' || orders[i].fulfillment_status === 'null') {
                unfulfilledOrder++
            }
            if(orders[i].fulfillment_status === 'fulfilled') {
                fulfilledOrder++
            }

            if(orders[i].financial_status === 'partially_refunded' && orders[i].financial_status === 'refunded') {
                refundedOrder++
            } else if(orders[i].financial_status === 'paid') {
                paidOrders++
            } else if(orders[i].financial_status === 'pending') {
                unpaidOrders++
            } else {
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
        ...customer,
        id: customerId,
        name: Name,
        first_name: firstName,
        last_name: lastName,
        email: Email,
        total_order_count: orders.length,
        total_amount_spent: tamount,
        avg_order_price: avgAmount,
        product_purchased: productPurchased,
        product_viewed: productViewed,
        refunded_order_count: refundedOrder,
        cancelled_order_count: cancelledOrder,
        fulfilled_order_count: fulfilledOrder,
        unfulfilled_order_count: unfulfilledOrder,
        unrefunded_order_count: unrefundedOrder,
        uncancelled_order_count: uncancelledOrder,
        abandoned_cart: abandonedCart,
        first_order_at: firstOrderAt,
        last_order_at: lastOrderAt,
        last_seen: lastSeen,
        tags: Tags,
        default_address: defaultAddress,
        zip_code: zipCode,
        paid_order_count: paidOrders,
        unpaid_order_count: unpaidOrders
    }]

    // console.log(customerData)

    await insert(CUSTOMERAGGREGATE_TABLE_NAME, customerAggregateColumn, customerData, workspaceId)
}

const del = async (TABLE_NAME, data, workspaceId, id = 'id', id1) => {
    if(typeof data === 'undefined' || data.length == 0){
        return;
    }
    if(typeof id1 === 'undefined') {
        id1 = id
    }
    console.log('@@@@@@', id, id1)
    const query = `DELETE FROM ${TABLE_NAME(workspaceId)} WHERE ${id} IN ${getIds(data, id1)}`
    console.log(query);
    let response =  await PostgresqlDb.query(query);
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
    variantAggregate,
}

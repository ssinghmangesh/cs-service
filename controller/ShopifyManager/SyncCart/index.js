const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {CART_TABLE_NAME, CARTLINEITEMS_TABLE_NAME} = require("../../DataManager/helper")
const cartColumns = require('../../DataManager/Setup/cartColumns.json');
const cartLineItemColumns = require('../../DataManager/Setup/cartLineItemColumns.json');
const { socket } = require("../../../socket");

const getId = (array, column) => {
    let ids = []
    array.map(item => {
        ids.push(item[column])
    })
    return ids
}

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch

    let response = await Shopify.fetchCart(shopName, accessToken, { since_id: sinceId, limit })
    // console.log('@@@@@@@', response.data.checkouts)
    // console.log('!!!!!!!', response.data.checkouts[0].line_items[1].discount_allocations)

    let carts = []
    // console.log(response.data.checkouts[0].line_items)
    response.data.checkouts.map(checkout => {
        const { customer } = checkout
        carts.push({
            id: checkout.id,
            customer_id: customer ? customer.id : null,
            token: checkout.cart_token,
            note: checkout.note,
            updated_at: checkout.updated_at,
            created_at: checkout.created_at,
            product_id: getId(checkout.line_items, "product_id"),
            variant_id: getId(checkout.line_items, "variant_id"),
        }) 
    })

    let cartLineItems = []
    response.data.checkouts.map(checkout => {
        const { customer } = checkout.customer
        checkout.line_items.map(line_item => {
            cartLineItems.push({
                id: checkout.id,
                customer_id: customer ? customer.id : null,
                quantity: line_item.quantity,
                variant_id: line_item.variant_id,
                key: line_item.key,
                discounted_price: checkout.total_price,
                properties: line_item.properties,
                discounts: line_item.applied_discounts,
                gift_card: line_item.gift_card,
                grams: line_item.grams,
                line_price: line_item.line_price,
                original_line_price: checkout.total_line_items_price,
                original_price: 0,
                price: line_item.price,
                product_id: line_item.product_id,
                sku: line_item.sku,
                taxable: line_item.taxable,
                title: line_item.title,
                total_discount: checkout.total_discounts,
                vendor: line_item.vendor
            }) 
        })
    })

    //insert
    if(response.data.checkouts.length){
        await del(CART_TABLE_NAME, carts, workspaceId)
        await insert(CART_TABLE_NAME, cartColumns, carts, workspaceId)

        await del(CARTLINEITEMS_TABLE_NAME, cartLineItems, workspaceId)
        await insert(CARTLINEITEMS_TABLE_NAME, cartLineItemColumns, cartLineItems, workspaceId)
    }

    //call next batch
    if(response.data.checkouts.length < limit) {
        progress += response.data.checkouts.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
        if(response.data.checkouts.length) {
            return response.data.checkouts[response.data.checkouts.length - 1].id
        }
    } else {
        //call next since id
        progress += response.data.checkouts.length
        socket.emit("sync", `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
        let nextSinceId = response.data.checkouts[response.data.checkouts.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        const lastObjectId = await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
        if(typeof lastObjectId === 'undefined') {
            return response.data.checkouts[response.data.checkouts.length - 1].id
        } else {
            return lastObjectId
        }
    }
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'indian-dress-cart.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 56788582584 })
// .then(console.log)
// .catch(console.log)
const transformOrder = (data) => {
    const order = {
        id: data.id,
        updated_at: data.date_modified,
        date_shipped: data.date_shipped,
        cart_id: data.cart_id,
        fulfillment_status: data.status,
        created_at: data.date_created,
        current_total_tax: data.subtotal_tax,
        customer_id: data.customer_id,
    }
    return order
}

module.exports = {
    transformOrder,
}
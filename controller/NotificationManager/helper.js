const { addNotification } = require('./index')

const addNotificationHelper = (array, workspaceId) => {
    let selected = new Map()
    for(let i = 0; i < array.length; i++) {
        selected.set(array[i], true)
    }
    const data = {
        workspace_id: Number(workspaceId),
        Product_Back_in_Stock: selected.has("Product Back in Stock"),
        Cart_Created_or_Updated: selected.has("Cart Created or Updated"),
        Customer_Created: selected.has("Customer Created"),
        Customer_Updated: selected.has("Customer Updated"),
        Draft_order_Created_and_Updated: selected.has("Draft order Created and Updated"),
        Fulfillment_Event_Created: selected.has("Fulfillment Event Created"),
        If_Out_for_Delivery: selected.has("If Out for Delivery"),
        If_Delivered: selected.has("If Delivered"),
        Order_Cancelled: selected.has("Order Cancelled"),
        Order_Created: selected.has("Order Created"),
        Order_Fulfilled: selected.has("Order Fulfilled"),
        Order_Paid: selected.has("Order Paid"),
        Order_Partially_Fulfilled: selected.has("Order Partially Fulfilled"),
        Order_Updated: selected.has("Order Updated"),
        Transaction_Created: selected.has("Transaction Created"),
        Refund_Created: selected.has("Refund Created")
    }
    addNotification(data)
}

const fetchNotificationHelper = (data) => {
    let selected = []
    if(data) {
        for (const [key, value] of Object.entries(data)) {
            if(value === true) {
                let array = key.split("_")
                let string = array.map(str => {
                    return str
                }).join(" ")
                selected.push(string)
            }
        }
    }
    return selected
}

module.exports = {
    addNotificationHelper,
    fetchNotificationHelper
}
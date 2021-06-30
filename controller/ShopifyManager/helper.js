const Shopify = require('./Shopify')

const count = async (shopName, accessToken) => {
    const count = {}
    let res = await Shopify.fetchCustomerCount(shopName, accessToken)
    count.customers = res.data.count
    res = await Shopify.fetchOrderCount(shopName, accessToken)
    count.orders = res.data.count
    res = await Shopify.fetchProductCount(shopName, accessToken)
    count.products = res.data.count
    res = await Shopify.fetchDiscountCount(shopName, accessToken)
    count.discounts = res.data.count
    res = await Shopify.fetchDraftOrderCount(shopName, accessToken)
    count.draftOrders = res.data.count
    res = await Shopify.fetchLocationCount(shopName, accessToken)
    count.locations = res.data.count
    res = await Shopify.fetchCartCount(shopName, accessToken)
    count.carts = res.data.count
    return count;
}

module.exports = {
    count,
}
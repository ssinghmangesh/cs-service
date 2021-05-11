const axios = require("axios")
class Shopify {
    static fetchOrder(shopName, accessToken, option) {
        const { since_id, limit } = option
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/orders.json?status=any&since_id=${since_id}&limit=${limit}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchOrderCount(shopName, accessToken) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/orders/count.json?status=any`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchCustomer(shopName, accessToken, option) {
        const { since_id, limit } = option
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/customers.json?since_id=${since_id}&limit=${limit}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchCustomerCount(shopName, accessToken) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/customers/count.json`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchProduct(shopName, accessToken, option) {
        const { since_id, limit } = option
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/products.json?since_id=${since_id}&limit=${limit}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchProductCount(shopName, accessToken) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/products/count.json`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchDiscount(shopName, accessToken, option) {
        const { since_id, limit } = option
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/price_rules.json?since_id=${since_id}&limit=${limit}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchDiscountCount(shopName, accessToken) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/price_rules/count.json`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }
    

}



//test token == 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
// shopName = grofers-orders.myshopify.com

Shopify.fetchCustomerCount('grofers-orders.myshopify.com', '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', {since_id: 0, limit: 2})
.then(console.log)
.catch(console.log)




module.exports = Shopify
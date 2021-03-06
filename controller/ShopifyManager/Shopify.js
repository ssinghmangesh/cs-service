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

    static fetchOrderCount(shopName, accessToken, since_id = 0) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/orders/count.json?status=any&since_id=${since_id}`,
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

    static fetchCustomerCount(shopName, accessToken, since_id = 0) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/customers/count.json?since_id=${since_id}`,
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

    static fetchProductCount(shopName, accessToken, since_id = 0) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/products/count.json?since_id=${since_id}`,
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

    static fetchDiscountCount(shopName, accessToken, since_id = 0) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/price_rules/count.json?since_id=${since_id}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }
    
    static fetchCart(shopName, accessToken, option) {
        const { since_id, limit } = option
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/checkouts.json?since_id=${since_id}&limit=${limit}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchCartCount(shopName, accessToken, since_id = 0) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/checkouts/count.json?since_id=${since_id}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchDraftOrder(shopName, accessToken, option) {
        const { since_id, limit } = option
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/draft_orders.json?since_id=${since_id}&limit=${limit}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchDraftOrderCount(shopName, accessToken, since_id = 0) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/draft_orders/count.json?since_id=${since_id}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchInventoryItem(shopName, accessToken, inventoryItemIds) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/inventory_items.json?ids=${inventoryItemIds}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchInventoryLevel(shopName, accessToken, inventoryItemIds) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/inventory_levels.json?inventory_item_ids=${inventoryItemIds}`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchLocation(shopName, accessToken) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/locations.json`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchLocationCount(shopName, accessToken) {
        return axios({
            method: 'GET',
            url: `https://${shopName}/admin/api/2021-04/locations/count.json`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
            }
        })
    }

    static fetchTrackingScript(shopName, accessToken, workspaceId) {
        return axios({
            method: 'POST',
            url: `https://${shopName}/admin/api/2021-04/script_tags.json`,
            headers: {
                'X-Shopify-Access-Token': accessToken,
            },
            data: {
                "script_tag": {
                    "event": "onload",
                    "src": `https://cdn.jsdelivr.net/gh/ssinghmangesh/cs-service@latest/controller/tracking.js`
                }
            }
        })
    }

    static addSocket(shopName, accessToken) {
        return axios({
            method: 'POST',
            url: `https://${shopName}/admin/api/2021-04/script_tags.json`,
            headers: {
                'X-Shopify-Access-Token': accessToken,
            },
            data: {
                "script_tag": {
                    "event": "onload",
                    "src": "https://cdn.socket.io/4.1.1/socket.io.min.js"
                }
            }
        })
    }

    static addJquery(shopName, accessToken) {
        return axios({
            method: 'POST',
            url: `https://${shopName}/admin/api/2021-04/script_tags.json`,
            headers: {
                'X-Shopify-Access-Token': accessToken,
            },
            data: {
                "script_tag": {
                    "event": "onload",
                    "src": "https://code.jquery.com/jquery-3.6.0.min.js"
                }
            }
        })
    }
}



//test token == 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
// shopName = grofers-orders.myshopify.com

// Shopify.fetchTrackingScript('indian-dress-cart.myshopify.com', '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', 1)
// .then(console.log)
// .catch(console.log)




module.exports = Shopify
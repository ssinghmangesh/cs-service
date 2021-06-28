const axios = require("axios")
class BigCommerce {
    static fetchOrder(storeHash, accessToken, option) {
        const { page } = option
        return axios({
            method: 'GET',
            url: `https://api.bigcommerce.com/stores/${storeHash}/v2/orders?page=${page}`,
            headers:  {
                'X-Auth-Token': accessToken,
            }
        })
    }
}

module.exports = BigCommerce
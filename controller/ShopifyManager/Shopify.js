class Shopify {


    async static fetchOrder(shopName, accessToken) {
        return axios({
            method: 'GET',
            url: `${shopName}/admin/api/2021-04/orders.json?status=any`,
            headers:  {
                'X-Shopify-Access-Token': accessToken,
              }
        })
    }

}





module.exports = Shopify
const axios = require("axios")
class BigCommerce {
    static fetchCustomer(shopName, accessToken, storeHash, option) {
        const { page, limit } = option
        return axios({
            method: 'GET',
            url: `https://${shopName}/stores/${storeHash}/v3/customers?page=${page}&limit=${limit}`,
            headers:  {
                'X-Auth-Token': accessToken,
            }
        })
    }

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

    static fetchLineItems(storeHash, accessToken, option) {
        const { order_id } = option
        return axios({
            method: 'GET',
            url: `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${order_id}/products`,
            headers:  {
                'X-Auth-Token': accessToken,
            }
        })
    }

    static fetchTrackingScript(shopName, accessToken, storeHash, workspaceId) {
        return axios({
            method: 'POST',
            url: `https://${shopName}/stores/${storeHash}/v3/content/scripts`,
            headers: {
                'X-Auth-Token': accessToken,
            },
            data: {
                "name": "TrackingScript",
                "description": "Build responsive websites",
                "src": `https://cdn.jsdelivr.net/gh/ssinghmangesh/cs-service@latest/controller/tracking.js?workspaceid=${workspaceId}`,
                "auto_uninstall": true,
                "load_method": "default",
                "location": "footer",
                "visibility": "all_pages",
                "kind": "src",
                "consent_category": "essential"
            }
        })
    }

    // static addSocket(shopName, accessToken, storeHash) {
    //     return axios({
    //         method: 'POST',
    //         url: `https://${shopName}/stores/${storeHash}/v3/content/scripts`,
    //         headers: {
    //             'X-Auth-Token': accessToken,
    //         },
    //         data: {
    //             "name": "SocketScript",
    //             "description": "Build responsive websites",
    //             "src": "https://cdn.socket.io/4.1.1/socket.io.min.js",
    //             "auto_uninstall": true,
    //             "load_method": "default",
    //             "location": "footer",
    //             "visibility": "all_pages",
    //             "kind": "src",
    //             "consent_category": "essential"
    //         }
    //     })
    // }

    // static addJquery(shopName, accessToken, storeHash) {
    //     return axios({
    //         method: 'POST',
    //         url: `https://${shopName}/stores/${storeHash}/v3/content/scripts`,
    //         headers: {
    //             'X-Auth-Token': accessToken,
    //         },
    //         data: {
    //             "name": "JQueryScript",
    //             "description": "Build responsive websites",
    //             "src": "https://code.jquery.com/jquery-3.6.0.min.js",
    //             "auto_uninstall": true,
    //             "load_method": "default",
    //             "location": "footer",
    //             "visibility": "all_pages",
    //             "kind": "src",
    //             "consent_category": "essential"
    //         }
    //     })
    // }
}



// accessToken == 774vc7resdvtz4zoqrnp3rmhrvqd2e6
// shopName = api.bigcommerce.com
// store_hash = vodskxqu9

// ACCESS TOKEN: 4ifdvpxr27ue5zdd8bbyt7q7xj7o780
// CLIENT NAME: cs-test
// API PATH: https://api.bigcommerce.com/stores/vodskxqu9/v3/
// CLIENT ID: e447voerbi2xe7kr1xpbgbxap5ld71h
// CLIENT SECRET: 3a28661aca5d7ec8ed08b70ea991040adb8363eb958fe76a63a0b218b9a2fdad

module.exports = BigCommerce
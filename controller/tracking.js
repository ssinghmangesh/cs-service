const trackingScript = (appClientId, tenantId) => {

    let jsCode = `
        trackCS = async function(_tenantId, _appClientId) {
            let csData = {}
            csData.path = window.location.pathname
            csData.href = window.location.href
            csData.os = navigator.platform
            csData.previous_page = document.referrer


            function getEventName(path){
                if(path === '/'){
                    return "home_screen"
                }
                if(path.substring(1,5) === 'cart'){
                    return "cart_view";
                }
                if(path.substring(1,12) === 'collections'){
                    return "collection_view";
                }
                if(path.substring(1,9) === 'products'){
                    return "product_view";
                }
                if(path.substring(1,6) === 'blogs'){
                    return "blog_view";
                }
                return "page_view";
            }

            
            async function cartChanges() {
                const res = await jQuery.ajax({
                    url: "/cart.js",
                    type: "GET",
                    dataType: "json",
                    cache: 0
                })
                csData = {...csData, cart: res}
                
            }

            async function product(path){
                const url = path + ".js";
                const res = await jQuery.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    cache: 0
                })
                csData = {...csData, product: res}
            }
            
            if(ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.page && ShopifyAnalytics.meta.page.customerId) {
                csData.customer_id = ShopifyAnalytics.meta.page.customerId
            }
            if(ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.cart_event_id) {
                csData.cart_id = ShopifyAnalytics.meta.cart_event_id
            }
            if(ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.page_view_event_id) {
                csData.page_id = ShopifyAnalytics.meta.page_view_event_id
            }
            csData.event_name = getEventName(csData.path)
            if(csData.event_name === 'cart_view'){
                await cartChanges();
            }
            else if(csData.event_name === 'product_view'){
                await product(csData.path)
            }
            
            console.log("csData : ", csData)
            const res = await jQuery.ajax({
                url: "/cart.js",
                type: "GET",
                dataType: "json",
                cache: 0
            })
        }

        
        trackCS('${tenantId || ''}', '${appClientId || ''}')

    `

    return jsCode
}

module.exports = trackingScript

console.log(trackingScript())


// cartChanges = function() {
//     jq.ajax({
//         url: "/cart.js",
//         type: "GET",
//         dataType: "json",
//         cache: 0
//     }).done(function(e) {
        
//         csData = { ...csData, cart: e }
//         console.log(e)
//     })
// }



/*
step 1: on which page we are ? product_view, collection_view, article_view, blog_view, cart_view, checkout_view, home_screen
*/

// pageviewed(workspaceId)
// page_id:
// event_name: 
// path:
// href: 
// cart_id:
// customer_id: 
// cart: 
// product: 
// os
// previous_page
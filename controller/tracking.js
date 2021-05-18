const trackingScript = (appClientId, tenantId) => {

    let jsCode = `
        trackCS = function(_tenantId, _appClientId) {
            let csData = {}
            csData.path = window.location.pathname
            csData.href = window.location.href


            getEventName()


            
            if(ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.page && ShopifyAnalytics.meta.page.customerId) {
                csData.customerId = ShopifyAnalytics.meta.page.customerId
            }
            csData.eventName = getEventName(csData)

            
            console.log("csData : ", csData)
        }

        
        ()
        

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
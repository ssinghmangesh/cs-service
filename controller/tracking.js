
const trackingScript = (appClientId, tenantId) => {

    let jsCode = `
        trackCS = function(_tenantId, _appClientId) {
            let csData = {}
            csData.path = window.location.pathname
            csData.href = window.location.href
            
            if(ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.page && ShopifyAnalytics.meta.page.customerId) {
                csData.customerId = ShopifyAnalytics.meta.page.customerId
            }

            
            console.log("csData : ", csData)
        }

        trackCS('${tenantId || ''}', '${appClientId || ''}')

    `

    return jsCode
}

module.exports = trackingScript

console.log(trackingScript())

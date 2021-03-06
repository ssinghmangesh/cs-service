trackCS = async function() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    // const script = document.createElement('script');
    // script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    // document.getElementsByTagName('head')[0].appendChild(script);

    // const x = document.createElement("SCRIPT");
    // x.src = 'https://cdn.socket.io/4.1.1/socket.io.min.js';
    // document.getElementsByTagName('head')[0].appendChild(x);
    
    await sleep(500);
    const workspaceId = window.BOOMR.shopId
    const socket = io("https://custom-segment-socket.herokuapp.com/customer");

    let csData = {}

    csData.created_at = new Date()
    csData.path = window.location.pathname
    csData.href = window.location.href
    csData.os = navigator.platform
    csData.previous_page = document.referrer
    csData.cart_id = ShopifyAnalytics.lib.user().traits().uniqToken


    if(ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.page && ShopifyAnalytics.meta.page.customerId) {
        csData.customer_id = ShopifyAnalytics.meta.page.customerId
    }
    if(ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.page_view_event_id) {
        csData.page_id = ShopifyAnalytics.meta.page_view_event_id
    }

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
        return "event";
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
    

    csData.event_name = getEventName(csData.path)
    
    socket.emit("add-visitor", csData, workspaceId);

    if(csData.event_name === 'cart_view'){
        await cartChanges();
    }
    else if(csData.event_name === 'product_view'){
        await product(csData.path)
    }

    async function syncAPI(){
        return await jQuery.ajax({
                        url: "https://custom-segment-service.herokuapp.com/data-manager/event/add",
                        type: "POST",
                        dataType: "json",
                        cache: 0,
                        headers:{
                            'x-workspace-id': workspaceId
                        },
                        data: {
                            event: csData
                        }
                    })
    }
    
    $(document).ajaxSuccess(async function(_e, _t, _r) {
        if(_r.url.match(/cart\/(update|change|add).js/g)){
            // console.log(_t.responseJSON);
            csData = {...csData, cart: _t.responseJSON};
            delete csData.cart.attributes;
            delete csData.cart.cart_level_discount_applications;
            await syncAPI();
        }
    })
    const res = await syncAPI()
}


trackCS()

const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/Order/index");
const {insert: insertVariants, del: deleteVariants} = require("../../DataManager/Variants/index");

const getImageUrl = (image_id, images) => {
    let image = images.find(image => image.id === image_id);
    if(image){
        return image.src;
    }else{
        return null;
    }
}

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchProduct(shopName, accessToken, { since_id: sinceId, limit })
    console.log(response.data.products.length)

    //insert

    const variants = [];

    response.data.products.map(product => {
        product.variants.map(variant => {
            variants.push({
                ...variant,
                image_url: getImageUrl(variant.image_id, variant.images)
            })
        })
    })

    if(response.data.products.length){
        
        await del(response.data.products, workspaceId)
        await insert(response.data.products, workspaceId)
        await deleteVariants(variants, workspaceId)
        await insertVariants(variants, workspaceId)
    }
    
    
    //call next batch
    if(response.data.products.length < limit) {
        console.log("SYNC complete..")
    } else {
        //call next since id
        let nextSinceId = response.data.products[response.data.products.length - 1].id;
        console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId})
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 2, workspaceId: 12345 })
// .then(console.log)
// .catch(console.log)
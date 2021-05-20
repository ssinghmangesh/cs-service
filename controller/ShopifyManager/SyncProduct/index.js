const Shopify = require('../Shopify')
const {insert, del} = require("../../DataManager/index");
const {PRODUCT_TABLE_NAME, VARIANT_TABLE_NAME} = require("../../DataManager/helper");
const productColumns = require("../../DataManager/Setup/productColumns.json");
const variantColumns = require("../../DataManager/Setup/variantColumns.json");
const { io } = require("../../../index");


const getImageUrl = (image_id, images) => {
    if(!images){
        return ''
    }
    let image = images.find(image => image.id === image_id);
    if(image){
        return image.src;
    }else{
        return null;
    }
}

const SYNC = async ({ shopName, accessToken, sinceId = 0, limit = 0, workspaceId, count, progress = 0 }) => {
    //call to shopify fetch one batch
    let response = await Shopify.fetchProduct(shopName, accessToken, { since_id: sinceId, limit })
    // console.log(response.data.products.length)

    //insert

    const variants = [];

    response.data.products.map(product => {
        product.variants.map(variant => {
            variants.push({
                ...variant,
                image_url: getImageUrl(variant.image_id, product.images)
            })
        })
    })

    if(response.data.products.length){
        
        await del(PRODUCT_TABLE_NAME, response.data.products, workspaceId)
        await insert(PRODUCT_TABLE_NAME, productColumns, response.data.products, workspaceId)
        
        await del(VARIANT_TABLE_NAME, variants, workspaceId)
        await insert(VARIANT_TABLE_NAME, variantColumns, variants, workspaceId)
    }
    
    
    //call next batch
    if(response.data.products.length < limit) {
        progress += response.data.products.length
        io.on('connection', (socket) => {
            socket.emit('workspace', `${progress} of ${count} done`)
        })
        console.log(`${progress} of ${count} done`);
    } else {
        //call next since id
        progress += response.data.products.length
        console.log(`${progress} of ${count} done`);
        let nextSinceId = response.data.products[response.data.products.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
    }
    return;
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 2 })
// .then(console.log)
// .catch(console.log)
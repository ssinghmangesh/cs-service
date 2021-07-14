const Shopify = require('../Shopify')
const {insert, del, variantAggregate} = require("../../DataManager/index");
const {PRODUCT_TABLE_NAME, VARIANT_TABLE_NAME, VARIANTAGGREGATE_TABLE_NAME} = require("../../DataManager/helper");
const productColumns = require("../../DataManager/Setup/productColumns.json");
const variantColumns = require("../../DataManager/Setup/variantColumns.json");
const { socket } = require("../../../socket");
const {SYNC: inventoryItemSync} = require("../SyncInventoryItem/index")
const {SYNC: inventoryLevelSync} = require("../SyncInventoryLevel/index")

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

    let variants = [], quantity = 0;
    response.data.products.map(product => {
        product.variants.map(variant => {
            quantity += variant.inventory_quantity
            variants.push({
                product_title: product.title,
                tags: product.tags,
                vendor: product.vendor,
                ...variant,
                image_url: getImageUrl(variant.image_id, product.images)
            })
        })
    })

    let products = []
    response.data.products.map((product) => {
        products.push({
            ...product,
            inventory_quantity: quantity
        })
    })

    //insert
    if(response.data.products.length){
        await del(PRODUCT_TABLE_NAME, response.data.products, workspaceId)
        await insert(PRODUCT_TABLE_NAME, productColumns, response.data.products, workspaceId)
        
        await del(VARIANT_TABLE_NAME, variants, workspaceId)
        await insert(VARIANT_TABLE_NAME, variantColumns, variants, workspaceId)

        await del(VARIANTAGGREGATE_TABLE_NAME, variants, workspaceId)
        variants.map(async (variant) => {
            await variantAggregate(workspaceId, variant.id)
        })
    }
    
    //call next batch
    if(response.data.products.length < limit) {
        progress += response.data.products.length
        socket.emit("sync", workspaceId, 'products', `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);

        // sync inventory items
        console.log("inventoryItem")
        await inventoryItemSync({ shopName, accessToken, workspaceId });

        // sync inventory levels
        console.log("inventoryLevel")
        await inventoryLevelSync({ shopName, accessToken, workspaceId });

        if(response.data.products.length) {
            return response.data.products[response.data.products.length - 1].id
        }
    } else {
        //call next since id
        progress += response.data.products.length
        socket.emit("sync", workspaceId, 'products', `${progress} of ${count} done`)
        console.log(`${progress} of ${count} done`);
        let nextSinceId = response.data.products[response.data.products.length - 1].id;
        // console.log("nextSinceId", nextSinceId)
        const lastObjectId = await SYNC({ shopName, accessToken, sinceId: nextSinceId, limit, workspaceId, count, progress })
        if(typeof lastObjectId === 'undefined') {
            return response.data.products[response.data.products.length - 1].id
        } else {
            return lastObjectId
        }
    }
}



module.exports = {
    SYNC
}

// SYNC({ shopName: 'grofers-orders.myshopify.com', accessToken: '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',  limit: 50, workspaceId: 2 })
// .then(console.log)
// .catch(console.log)
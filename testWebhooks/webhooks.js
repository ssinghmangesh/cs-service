const axios = require('axios')

const deleteWebhooks = async () => {
    res = await axios({
        method: 'GET',
        url: 'https://indian-dress-cart.myshopify.com/admin/api/2021-04/webhooks.json',
        headers:  {
            'X-Shopify-Access-Token': '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',
        },
    })
    for(let i=0; i < res.data.webhooks.length; i++){
        const id = res.data.webhooks[i].id
        await axios({
            method: 'DELETE',
            url: `https://indian-dress-cart.myshopify.com/admin/api/2021-04/webhooks/${id}.json`,
            headers:  {
                'X-Shopify-Access-Token': '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',
            },
        })
    }
    return 'done'
}

deleteWebhooks()
.then(console.log)

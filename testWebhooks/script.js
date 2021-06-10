const axios = require('axios')

const deleteScripts = async () => {
    res = await axios({
        method: 'GET',
        url: 'https://indian-dress-cart.myshopify.com/admin/api/2021-04/script_tags.json',
        headers:  {
            'X-Shopify-Access-Token': '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',
        },
    })
    for(let i=0; i < res.data.script_tags.length; i++){
        const id = res.data.script_tags[i].id
        await axios({
            method: 'DELETE',
            url: `https://indian-dress-cart.myshopify.com/admin/api/2021-04/script_tags/${id}.json`,
            headers:  {
                'X-Shopify-Access-Token': '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',
            },
        })
    }
    return 'scripts deleted'
}

deleteScripts()
.then(console.log)


const axios = require('axios')
const run = () => {
    return axios({
        url: 'http://localhost:3000/shopify-manager/sync',
        method: 'post',
        data: {
            workspaceId: 9,
            iop: "backend"
        }
    })
}


run()
.then(console.log)
.catch(console.log)

const axios = require('axios')
const run = () => {
    return axios({
        url: 'http://localhost:3000/data-manager/setup',
        method: 'post',
        data: {
            workspaceId: 9
        }
    })
}


run()
.then(console.log)
.catch(console.log)
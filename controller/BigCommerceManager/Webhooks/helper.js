const {del, insert} = require("../../DataManager/index");
const { EVENT_TABLE_NAME } = require("../../DataManager/helper");
const eventColumn = require("../../DataManager/Setup/eventColumns.json");

const updateEvent = async (data, workspaceId) => {
    await del(EVENT_TABLE_NAME, [data], workspaceId)
    await insert(EVENT_TABLE_NAME, eventColumn, [data], workspaceId)
}

const updateTable = async (TABLE_NAME, column, data, workspaceId, type) => {
    switch(type) {
        case 'created':
            await del(TABLE_NAME, data, workspaceId)
            await insert(TABLE_NAME, column, data, workspaceId)
            break
        case 'updated':
            await del(TABLE_NAME, data, workspaceId)
            await insert(TABLE_NAME, column, data, workspaceId)
            break
        case 'deleted':
            await del(TABLE_NAME, data, workspaceId)
            break
        default:
            await del(TABLE_NAME, data, workspaceId)
            await insert(TABLE_NAME, column, data, workspaceId)
            break
    }
}

const getCustomer = async (id) => {
    // const fetchedWorkspace = await fetchWorkspace({ workspace_id: Number(options.workspaceId) })
    const fetchedWorkspace = {
        Item: {
          shop_name: "api.bigcommerce.com",
          store_hash: "vodskxqu9",
          access_token: "774vc7resdvtz4zoqrnp3rmhrvqd2e6"
        }
      }
      // console.log(fetchedWorkspace)
      let customers = [], page = 0, limit = 50
      while(1) {
        page++
        customers = axios({
                      method: 'GET',
                      url: `https://${fetchedWorkspace.Item.shop_name}/stores/${fetchedWorkspace.Item.store_hash}/v3/customers?page=${page}&limit=${limit}`,
                      headers:  {
                          'X-Auth-Token': fetchedWorkspace.Item.access_token,
                      }
                    })
        if(customers.length != 50) {
          break
        }
      }
      for(let i = 0; i < customers.length; i++) {
        if(customers.id === id) {
          return customers[i]
        }
      }
}

module.exports = {updateTable, updateEvent, getCustomer};
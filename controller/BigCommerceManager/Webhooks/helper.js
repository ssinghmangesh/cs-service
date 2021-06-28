const {del, insert} = require("../../DataManager/index");
const { EVENT_TABLE_NAME } = require("../../DataManager/helper");
const eventColumn = require("../../DataManager/Setup/eventColumns.json");
const { fetchWorkspace } = require('../../UserManager/workspace')
const axios = require('axios');

const updateEvent = async (data, workspaceId) => {
    await del(EVENT_TABLE_NAME, [data], workspaceId)
    await insert(EVENT_TABLE_NAME, eventColumn, [data], workspaceId)
}

const updateTable = async (TABLE_NAME, column, data, workspaceId, type) => {
    console.log('data: ', data)
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

const getCustomer = async (params, body) => {
    console.log(params)
    const fetchedWorkspace = await fetchWorkspace({ workspace_id: Number(params.workspaceId) })
    // console.log(fetchedWorkspace)
    let customers = [], page = 1, limit = 50
    while(1) {
        page += 1;
        let response = await axios({
            method: 'GET',
            url: `https://${fetchedWorkspace.Item.shop_name}/stores/${fetchedWorkspace.Item.store_hash}/v3/customers?page=${page}&limit=${limit}`,
            headers:  {
                'X-Auth-Token': fetchedWorkspace.Item.access_token,
            }
        })
        // console.log('%', response.data.data.length)
        customers = response.data.data
        if(typeof customers === 'undefined' || !customers.length) {
            break;
        }
        for(let i = 0; i < customers.length; i++) {
            if(customers[i].id === body.data.id) {
                return customers[i]
            }
        }
    }
}

module.exports = {updateTable, updateEvent, getCustomer};
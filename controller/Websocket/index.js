const visitorColumns = require("../DataManager/Setup/visitorColumns.json");
const { VISITOR_TABLE_NAME } = require("../DataManager/helper");
const { insert, del } = require("../DataManager/index");

const addVisitor = async (csData, workspaceId, id) => {
    const data = {
        id: id,
        customer_id: csData.customer_id,
        type: csData.customer_id ? 'customer' : 'visitor',
        first_page_viewed: csData.event_name,
        last_page_viewed: csData.previous_page,
        os: csData.os
    }
    await insert(VISITOR_TABLE_NAME, visitorColumns, [data], workspaceId);
    console.log('visitor added');
}

const deleteVisitor = async (workspaceId, id) => {
    const data = {
        id
    }
    await del(VISITOR_TABLE_NAME, [data], workspaceId);
    console.log('visitor deleted');
}

module.exports = {
    addVisitor,
    deleteVisitor
}
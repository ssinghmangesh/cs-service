const PostresqlDb = require('./../../../db')
const { getIds, PRODUCT_TABLE_NAME } =  require("../helper")


const del = async (data, workspaceId) => {
    let query = `DELETE FROM ${PRODUCT_TABLE_NAME(workspaceId)} WHERE id IN ${getIds(data)}`
    console.log(query);
    let response =  await PostresqlDb.query(query);
    console.log(response);
}

module.exports={
    del,
}
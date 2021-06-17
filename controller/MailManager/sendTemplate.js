const PostgresqlDb = require('./../../db')
const { sendMail } = require('./index')
const { whereClause } = require('../../filters')
const { fetchAllTemplates } = require('../TemplateManager/index')
const axios = require("axios")

const WHERE_CLAUSE = (details) => {
    if(Object.entries(details.filters).length) {
        return `WHERE ${whereClause(details.filters, details.workspaceId, details.table)}`
    }
    else return ''
}

const sendtemplate = async (details) => {
    const query = `SELECT email FROM ${details.table} ${WHERE_CLAUSE(details)};`
    let response = await PostgresqlDb.query(query)
    let to = []
    for(let i = 0; i < response.rows.length; i++) {
        to.push(response.rows[i].email)
    }
    // console.log('to: ', to)

    response = await axios({
                        method: 'GET',
                        url: details.src
                    })
    // console.log('html: ', typeof html.data)
    const html = response.data
    mailOptions = {
        from: details.from,
        to: 'nimish007gupta@gmail.com',
        subject: response.default_subject,
        html: html
    }
    // console.log('could have been sent!', mailOptions)
    sendMail(mailOptions, 0)
}

module.exports = {
    sendtemplate,
}
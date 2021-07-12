const PostgresqlDb = require('./../../db')
const { sendMail } = require('./index')
const { whereClause } = require('../../filters')
const { fetchAllTemplates } = require('../TemplateManager/index')
const axios = require("axios")
const { gmail } = require('googleapis/build/src/apis/gmail')

const WHERE_CLAUSE = (details) => {
    if(Object.entries(details.filters).length) {
        return `WHERE ${whereClause(details.filters, details.workspaceId, details.table)}`
    }
    else return ''
}

const sendtemplate = async (details) => {
    let to = []
    if(details.filters) {
        const query = `SELECT email FROM ${details.table} ${WHERE_CLAUSE(details)};`
        let response = await PostgresqlDb.query(query)
        for(let i = 0; i < response.rows.length; i++) {
            to.push(response.rows[i].email)
        }
    }
    if(!to.length) {
        to.push('nimish007gupta@gmail.com')
    }

    response = await axios({
                        method: 'GET',
                        url: details.html_path
                    })
    // console.log('html: ', typeof html.data)
    const html = response.data
    mailOptions = {
        from: 'lionelthegoatmessi@gmail.com',
        to: to,
        subject: details.subject ? details.subject : "Hello from Custom Segment!",
        html: html
    }
    // console.log('could have been sent!', mailOptions)
    sendMail({mailOptions: mailOptions, flag: 0, workspaceId: details.workspaceId, html_path: details.html_path})
}

module.exports = {
    sendtemplate,
}
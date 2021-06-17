const PostgresqlDb = require('./../../db')
const Json2csvParser = require("json2csv").Parser
const fs = require("fs")
const { sendMail } = require('./index')
const { whereClause } = require('../../filters')

const WHERE_CLAUSE = (details) => {
    if(Object.entries(details.filters).length) {
        return `WHERE ${whereClause(details.filters, details.workspaceId, details.table)}`
    }
    else return ''
}

const sendcsv = async (details) => {
    const query = `SELECT * FROM ${details.table} ${WHERE_CLAUSE(details)};`
    const response = await PostgresqlDb.query(query)

    const jsonData = JSON.parse(JSON.stringify(response.rows));

    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(jsonData);
    // console.log(csv)

    fs.writeFile("data.csv", csv, function(error) {
        if (error) throw error;
        console.log("Write to data.csv successfull!")
        const attachments = [{
            filename: 'data.csv',
            path: './data.csv' // stream this file
        }]
        mailOptions = {
            from: details.from,
            to: details.to,
            subject: 'Requested Data',
            text: details.text,
            attachments: attachments
        }
        sendMail(mailOptions, 1)
    });
}

module.exports = {
    sendcsv,
}
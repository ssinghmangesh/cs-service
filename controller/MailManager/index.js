const nodemailer = require('nodemailer')
const fs = require("fs")
const {v4 : uuidv4} = require('uuid')
const { SENTEMAIL_TABLE_NAME } = require('../DataManager/helper')
const sentEmailColumns = require('../DataManager/Setup/sentEmailColumns.json')
const { del, insert } = require('../DataManager/index')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lionelthegoatmessi@gmail.com',
        pass: 'messithegoat10'
    }
});

const addsentEmail = async (mailOptions, status, html_path, workspaceId) => {
    let details = {
        email_type: '',
        sender: mailOptions.from,
        receiver: mailOptions.to,
        html_body: html_path,
        subject: mailOptions.subject,
        attachments_url: mailOptions.attachments_url,
        sent_time: new Date(),
        email_id: uuidv4(),
        status: status
    }
    // console.log(details)
    await del(SENTEMAIL_TABLE_NAME, [details], workspaceId, 'email_id')
    // console.log(details)
    const response = await insert(SENTEMAIL_TABLE_NAME, sentEmailColumns, [details], workspaceId)
    return response
}

const sendMail = async ({mailOptions, flag, workspaceId, html_path}) => {
    let status = ''
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            status = 'SENDING_FAILED'
        } else {
            console.log('Email sent: ' + info.response);
            if(flag) {
                fs.unlink('./data.csv', (err) => {
                    if (err) {
                    console.error(err)
                    return
                    } else {
                        console.log('.csv file deleted')
                    }
                })
            }
            status = 'EMAIL_SENT'
        }
    });
    // console.log('details to be added: ', details)
    return await addsentEmail(mailOptions, status, html_path, workspaceId)
}

module.exports = {
    sendMail
}
const nodemailer = require('nodemailer')
const fs = require("fs")
const { addsentEmail } = require('../NotificationManager/helper')
const {v4 : uuidv4} = require('uuid')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lionelthegoatmessi@gmail.com',
        pass: 'messithegoat10'
    }
});

const sendMail = async (mailOptions, flag, workspaceId, html_path) => {
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
    let details = {
        sender: mailOptions.from,
        receiver: mailOptions.to,
        html_body: html_path,
        subject: mailOptions.subject,
        attachments_url: mailOptions.attachments_url,
        sent_time: new Date(),
        email_id: uuidv4(),
        status: status
    }
    console.log('details to be added: ', details)
    return await addsentEmail(details, workspaceId)
}
// mailOptions = {
//     from: 'lionelthegoatmessi@gmail.com',
//     to: to,
//     subject: details.subject ? details.subject : "Hello from Custom Segment!",
//     html: html
// }

//     email_type: details.emailType,
        // sender: details.from,
        // receiver: details.to,
        // html_body: details.htmlBody,
        // subject: details.subject,
        // attachments_url: details.attachmentsUrl,
        // sent_time: new Date(),//"2021-05-13 11:49:40.765997+05:30",
        // email_id: emailId,
        // status: details.status

module.exports = {
    sendMail
}
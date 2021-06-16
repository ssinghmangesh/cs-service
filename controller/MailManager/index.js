const nodemailer = require('nodemailer')
const fs = require("fs")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lionelthegoatmessi@gmail.com',
        pass: 'lionelthegoatmessi10'
    }
});

const sendMail = (details, attachments = []) => {
    // console.log(attachments)
    if(attachments.length) {
        mailOptions = {
            from: details.from,
            to: details.to,
            subject: 'Requested Data',
            text: 'Requested Data',
            attachments: attachments
        }
    } else {
        mailOptions = {
            from: details.from,
            to: details.to,
            subject: 'Requested Data',
            text: 'Requested Data',
        }
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            fs.unlink('./data.csv', (err) => {
                if (err) {
                  console.error(err)
                  return
                } else {
                    console.log('.csv file deleted')
                }
            })
        }
    });
}

module.exports = {
    sendMail
}
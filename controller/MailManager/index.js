const nodemailer = require('nodemailer')
const fs = require("fs")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lionelthegoatmessi@gmail.com',
        pass: 'messithegoat10'
    }
});

const sendMail = (mailOptions, flag) => {
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
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
        }
    });
}

module.exports = {
    sendMail,
}
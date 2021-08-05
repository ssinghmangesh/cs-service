const jwt = require("jsonwebtoken");
const { insert, fetch, del } = require("../../aws");
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const { addUser, fetchUser } = require("../UserManager");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'customsegment@gmail.com',
        pass: 'cs#@123456'
    }
});

ACCESS_TOKEN_SECRET = 'jkpouytefhgj'
REFRESH_TOKEN_SECRET = 'jhbnmgkliyoy'

const generateToken = async (email) => {
    const accessToken = jwt.sign({ email: email }, ACCESS_TOKEN_SECRET, { expiresIn: '3d' });
    const refreshToken = jwt.sign({ email: email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const params = {
        TableName: 'RefreshTokens',
        Item: {
            token: refreshToken
        }
    }
    await insert(params)
    return { accessToken, refreshToken };
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('access-token', accessToken, {
        maxAge: 1000*60*60*24*3,
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    res.cookie('refresh-token', refreshToken, {
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
}

const verify = async (req, res) => {
    try{
        const accessToken = req.cookies['access-token'];
        // console.log(accessToken);
        // const accessToken = null;
        const item = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        return true;
    }
    catch(err){
        return false;
    }
}

const refresh = async (req, res) => {
    try{
        
        const refreshToken = req.cookies['refresh-token'];
        // console.log(req.cookies['refresh-token']);
        const params = {
            TableName: 'RefreshTokens',
            Key: {
                token: refreshToken
            }
        }
        const {Item} = await fetch(params)
        // console.log(Item);
        if(Item){
            const item = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateToken(item.email)
            setCookies(res, newAccessToken, newRefreshToken)
            await del(params)
            res.sendStatus(200);
        }else{
            res.sendStatus(401)
        }
    }catch{
        res.sendStatus(401)
    }
}

const sendLink = async (email) => {
    const accessToken = jwt.sign({ email: email }, ACCESS_TOKEN_SECRET, { expiresIn: '3d' });
    const html = `<p>Click <a href="https://app.customsegment.com/pages/authentication/reset-password-v1?token=${accessToken}">here</a> to set your password</p>`
    const mailOptions = {
        from: 'customsegment@gmail.com',
        to: email,// to,
        subject: "Set your password",
        html: html,
    }
    await transporter.sendMail(mailOptions);
    console.log('success');
}

const sendOtp = async (req, res) => {
    const { userId } = req.body 
    // return res.status(200).send(`http://localhost:3000/install?shop=${shopName}`);
    const fetchedUser = await fetchUser({ user_id: userId })
    if(Object.keys(fetchedUser).length !== 0 && fetchedUser.Item.status !== 'pending'){
        return res.status(400).send('email already exists!');
    }
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    const user = {
        user_id: userId,
        status: 'pending',
        otp: otp
    }
    await addUser(user);
    const html = `<p>Your OTP is ${otp}</p>`
    const mailOptions = {
        from: 'customsegment@gmail.com',
        to: userId,// to,
        subject: "OTP",
        html: html,
    }
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
}

const verifyOtp = async (req, res) => {
    const { userId, otp } = req.body 
    const fetchedUser = await fetchUser({ user_id: userId })
    if(fetchedUser.Item.otp === otp){
        return res.sendStatus(200);
    }
    return res.sendStatus(400)
}

const verifyEmail = (req) => {
    try{
        const accessToken = req.body.token;
        // console.log(accessToken);
        // const accessToken = null;
        const item = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        return item;
    }
    catch(err){
        return false;
    }
}

// sendLink('deva.sahab.25@gmail.com')

module.exports = {
    generateToken,
    setCookies,
    verify,
    refresh,
    verifyEmail,
    sendLink,
    sendOtp,
    verifyOtp
}
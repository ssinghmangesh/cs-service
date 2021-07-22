const jwt = require("jsonwebtoken");
const { insert, fetch, del } = require("../../aws");

ACCESS_TOKEN_SECRET = 'jkpouytefhgj'
REFRESH_TOKEN_SECRET = 'jhbnmgkliyoy'

const generateToken = async (email) => {
    const accessToken = jwt.sign({ email: email }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
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
        maxAge: 1000*3600,
        httpOnly: true
    });
    res.cookie('refresh-token', refreshToken, {
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    })
}

const verify = async (req, res) => {
    try{
        const accessToken = req.cookies['access-token'];
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
        // console.log(req.cookies);
        const params = {
            TableName: 'RefreshTokens',
            Key: {
                token: refreshToken
            }
        }
        const {Item} = await fetch(params)
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

module.exports = {
    generateToken,
    setCookies,
    verify,
    refresh,
}
const { generateToken, setCookies } = require("./helper");
const { updateUser, fetchUser, addUser } = require("../UserManager");
const { del } = require("../../aws");

const register = async (req, res) => {
    const { userId, password } = req.body 
    // return res.status(200).send(`http://localhost:3000/install?shop=${shopName}`);
    const fetchedUser = await fetchUser({ user_id: userId })
    if(Object.keys(fetchedUser).length !== 0){
        res.status(400).send('email already exists!');
    } else {
        const user = {
            user_id: userId,
            password: password,
            created_at: Date.now(),
            updated_at: Date.now()
        }
        await addUser(user);
        const { accessToken, refreshToken} = await generateToken(userId);
        setCookies(res, accessToken, refreshToken);
        res.status(200).send('User Registered');
    }
}

const login = async (req, res) => {
    // console.log('login');
    const { userId, password } = req.body
    const data = {
        "user_id": userId
    }
    const { Item: user } = await fetchUser(data);
    if(!user) {
        res.status(404).send('Email not Found')
        return;
    }
    if (user.password === password){
        delete user.password
        const { accessToken, refreshToken} = await generateToken(userId);
        setCookies(res, accessToken, refreshToken);
        res.status(200).send(user);
    } else {
        res.status(403).send('Incorrect Password');
    }
}

const logout = async(req, res) => {
    const refreshToken = req.cookies['refresh-token'];
    const params = {
        TableName: 'RefreshTokens',
        Key: {
            token: refreshToken
        }
    }
    if(refreshToken) {
        await del(params)
    }
    res.clearCookie('zwiggy-access-token');
    res.clearCookie('zwiggy-refresh-token');
    res.sendStatus(200);
}




module.exports = {
    register,
    login,
    logout
}
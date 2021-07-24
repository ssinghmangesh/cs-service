const express = require('express');
const app = express()
const allRoutes = require('./routes');
const cors = require("cors");
const port = 3000;
const dotenv = require("dotenv").config();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
// app.use(cors({
//         credentials: true, 
//         origin: 'https://cs-service.herokuapp.com',
//         // origin: 'http://localhost:8080'
//     })
// );

// // app.options('*', cors());

app.use(function(req, res, next) {
    // console.log(req.headers.origin)
    const allowedOrigins = ['http://localhost:8080', 'https://app.customsegment.com']
    // console.log(allowedOrigins.includes(req.headers.origin))
    if(allowedOrigins.includes(req.headers.origin)){
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Credentials", true); 
    }
    // console.log(req.path)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-workspace-id, x-workspace-name');
    next();
  });

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

Object.keys(allRoutes).forEach(key => {
    let routes = allRoutes[key]
    app.use('/', routes);
})




app.listen(process.env.PORT || port, () => {
    console.log('App listening on port ', port);
});


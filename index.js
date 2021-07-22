const express = require('express');
const app = express()
const allRoutes = require('./routes');
const cors = require("cors");
const port = 3000;
const dotenv = require("dotenv").config();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors({
        credentials: true, 
        origin: 'https://cs-service.herokuapp.com',
        // origin: 'http://localhost:8080'
    })
);

// app.options('*', cors());

app.all('/*', function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*"); 
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
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


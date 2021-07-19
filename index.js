const express = require('express');
const app = express()
const allRoutes = require('./routes');
const cors = require("cors");
const port = 3000;
const dotenv = require("dotenv").config();

var corsOptions = {
    origin: 'https://app.customsegment.com',
    optionsSuccessStatus: 200 
  }
app.use(cors(corsOptions));

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


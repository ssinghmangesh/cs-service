const express = require('express');
const allRoutes = require('./routes');
const port = 3000
const app = express()

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

Object.keys(allRoutes).forEach(key => {
    let routes = allRoutes[key]
    app.use('/', routes);
})




app.listen(port, () => {
    console.log('App listening on port ', port);
});
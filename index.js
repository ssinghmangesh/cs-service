const app = require('express')();
const allRoutes = require('./routes');
const port = 3000


Object.keys(allRoutes).forEach(key => {
    let routes = allRoutes[key]
    app.use('/', routes);
})




app.listen(port, () => {
    console.log('App listening on port ', port);
});
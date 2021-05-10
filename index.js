const app = require('express')();

const allRoutes = require('./routes');
Object.keys(allRoutes).forEach(key => {
    let routes = allRoutes[key]
    app.use('/', routes);
})




app.listen(3000, () => {
    console.log('App listening on port 3000');
});
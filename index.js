const express = require('express');
const app = express()
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

exports.io = io;

const allRoutes = require('./routes');
const cors = require("cors");
const port = 4000;

io.on('connection', (socket) => {
    //export socket
    console.log("user connected");
});

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

Object.keys(allRoutes).forEach(key => {
    let routes = allRoutes[key]
    app.use('/', routes);
})




http.listen(port, () => {
    console.log('App listening on port ', port);
});


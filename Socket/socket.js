var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http,{
    cors: {
        origin: "http://localhost:3000"
    }
});

io.of("/workspace").on("connection", (socket) => {
    workspaceId = 1;
    console.log(socket.id);
    socket.join(workspaceId);
    socket.on("sync", (message) => {
        console.log(message);
    })
})

http.listen(3001, function() {
   console.log('listening on localhost:3001');
});
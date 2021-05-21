var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = 4000;

io.of("/workspace").on("connection", (socket) => {
    workspaceId = 1;
    console.log("user connected");
    socket.join(workspaceId);
    socket.on("sync", (message) => {
        console.log(message);
    })
})

http.listen(PORT, function() {
   console.log(`listening on localhost:${PORT}`);
});
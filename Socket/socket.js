var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

const PORT = 4000;

io.of("/workspace").on("connection", (socket) => {
    console.log("user connected");
    socket.on("workspaceId", (workspaceId) => {
        socket.join(workspaceId)
    })
    socket.on("sync", (workspaceId, message) => {
        io.to(workspaceId).emit(message);
    })
    socket.on('disconnect', () => {
        console.log("got disconnect");
    })
})

http.listen(PORT, function() {
   console.log(`listening on localhost:${PORT}`);
});
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

const PORT = 4000;

io.of("/workspace").on("connection", (socket) => {
    // console.log("user connected");
    socket.on("workspaceId", (workspaceId) => {
        socket.join(workspaceId)
    })
    socket.on("sync", (workspaceId, message) => {
        io.to(workspaceId).emit(message);
    })
    socket.on('disconnect', () => {
        // console.log("got disconnect");
    })
})

io.of("/customer").on("connection", (socket) => {
    // console.log("customer connected");
    let id = null;
    let workspaceId = null;
    socket.on("add-visitor", (csData, workspace_id) => {
        id = csData.cart_id;
        workspaceId = workspace_id;
        socket.broadcast.emit("add", csData, workspaceId, id);
    });
    
    socket.on('disconnect', () => {
        socket.broadcast.emit("delete", workspaceId, id);
        // console.log('disconnected');
    });
});

http.listen(PORT, function() {
   console.log(`listening on localhost:${PORT}`);
});
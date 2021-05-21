const io = require("socket.io-client");
const socket = io("http://localhost:4000/workspace");

socket.on("connect", () => {
    socket.emit("workspaceId","1", "connected")
    console.log("connected");
})

// socket.on("connect_error", (message) => {
//     console.log(message);
// })

module.exports = {
    socket
}
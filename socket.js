const io = require("socket.io-client");
const { addVisitor, deleteVisitor } = require("./controller/Websocket/index");
const socket = io("http://localhost:4000/workspace");
const customer = io("http://localhost:4000/customer");


socket.on("connect", () => {
    socket.emit("workspaceId","1", "connected")
    // console.log("connected");
})

customer.on('connect', () => {
    console.log('connected');
})

customer.on('add', addVisitor)

customer.on('delete', deleteVisitor)

// socket.on("connect_error", (message) => {
//     console.log(message);
// })

module.exports = {
    socket
}

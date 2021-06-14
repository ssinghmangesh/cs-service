const io = require("socket.io-client");
const { addVisitor, deleteVisitor } = require("./controller/Websocket/index");
const socket = io("https://custom-segment-socket.herokuapp.com/workspace");
const customer = io("https://custom-segment-socket.herokuapp.com/customer");


socket.on("connect", () => {
    console.log('workspace connected');
    // socket.emit("workspaceId", "1")
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

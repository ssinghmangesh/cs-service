const io = require("socket.io-client");
const socket = io("http://localhost:3001/workspace");

socket.on("connect", () => {
    console.log("connected", socket.id);
})

socket.on("connect_error", (message) => {
    console.log(message);
})

module.exports = {
    socket
}
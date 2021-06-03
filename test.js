
const io = require("socket.io-client");
const socket = io.connect("https://localhost:4000/");
function onError(message)
{
    console.log(message);
}
socket.on("connection", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

socket.on('connect_error', onError )
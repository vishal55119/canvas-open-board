const express = require("express");
const socket = require("socket.io");


const app = express();  // Initialized and Server Ready

app.use(express.static("frontEnd"));

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
    console.log("Listening to port, " + port);
})

let io = socket(server);

io.on("connection", (socket) => {
    console.log("Made Socket Connection");

    //Received data
    socket.on("beginPath", (data) => {
        //data ->> data from frontend 
        //Now transfering data to all connected computers
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })

    socket.on("undoRedoCanvas", (data) => {
        io.sockets.emit("undoRedoCanvas", data);
    })

    
})

  
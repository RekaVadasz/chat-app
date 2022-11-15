const express = require("express");
const app = express();
const http = require("http"); //we need this to build the server together with socket.io
const cors = require("cors"); //socket.io deals with a lot of CORS issues
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        //tells the server which server is gonna make the calls to our socket.io server (React server for now)
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// whenever someone connects, we call this callback function 
// there are built-in events in socket.io eg. "connection"

io.on("connection", (socket) => { // everything happens inside this callback
    console.log(`User connected: ${socket.id}`); //each user who connects has a unique id

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with id ${socket.id} joined room ${data}`)
    });

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data)
    });

    socket.on("disconnect", () => { // what to do when user disconnects
        console.log("user disconnected", socket.id)
    });
});










server.listen(3001, () => {
    console.log("Server running");
});

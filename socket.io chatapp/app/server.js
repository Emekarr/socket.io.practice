const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");

//socket modules
const {addUser, getUser} = require("./users");
const e = require("express");

//initialise the server
const app = express();

const server = http.createServer(app);

const io = socketio(server);

//path to the public directory
const pathToPublicDirectory = path.join(__dirname, "./public");

//enable express to use statics
app.use(express.static(pathToPublicDirectory));

io.on("connection", (socket) => {

    socket.on("join", ({username, room}, loginFailed) => {
        const {error, newUser} = addUser(socket.id, username, room)

        socket.join(room)

        if (error) return loginFailed()
        socket.broadcast.to(room).emit("new-user", username)
        socket.emit("welcome", room)
    })
  
});



server.listen(process.env.PORT || 3000);

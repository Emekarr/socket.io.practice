const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");

//socket modules
const {addUser, getUser, deleteUser} = require("./users");
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
        socket.broadcast.to(newUser.room).emit("new-user", newUser.username)
        socket.emit("welcome", newUser.room)

        socket.on("is-typing", () =>{
            socket.broadcast.to(newUser.room).emit("user-is-typing", newUser.username)
        })

        socket.on("stopped-typing", () =>{
            socket.broadcast.to(newUser.room).emit("user-is-not-typing", newUser.username)
        })
    })

    socket.on("disconnect", (socket)=> {
        const disconnectedUser = deleteUser(socket.id)
        
        // socket.emit("user-disconnected", disconnectedUser.username)
    })

});



server.listen(process.env.PORT || 3000);

const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");

//socket modules
const { addUser, deleteUser } = require("./users");
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

  socket.on("join", ({ username, room }, loginFailed) => {
    const { error, newUser } = addUser(socket.id, username, room);

    newUserData = newUser;
    socket.join(room);

    if (error) return loginFailed();
    socket.broadcast.to(newUser.room).emit("new-user", newUser.username);
    socket.emit("welcome", newUser.room);

    socket.on("is-typing", () => {
      socket.broadcast
        .to(newUser.room)
        .emit("user-is-typing", newUser.username);
    });

    socket.on("stopped-typing", () => {
      socket.broadcast
        .to(newUser.room)
        .emit("user-is-not-typing", newUser.username);
    });

    socket.on("disconnecting", () => {
      const disconnectedUser = deleteUser(socket.id);
      
      socket.broadcast.to(room).emit("user-disconnected", disconnectedUser.username)
    });

    socket.on("new-message", ({message})=> {
        socket.broadcast.to(room).emit("new-message-recieved", {message, username: newUser.username})
        
        socket.emit("new-message-sent", {message, username: newUser.username})
    })

  });

});

server.listen(process.env.PORT || 3000);

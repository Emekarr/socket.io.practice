const http = require("http");
const path = require("path");
const express = require("express");
const socket = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socket(server);

const pathToPublicDirectory = path.join(__dirname, "../public");

app.use(express.static(pathToPublicDirectory));

io.on("connection", (socket) => {
  
    socket.emit("welcome", "You are welcome!")
    io.emit("newUser", "new user joined")

  socket.on("message", (message) => {
      io.emit("newMessage", message)
  })

  socket.on("location", ({latitude, longitude}, acknow) => {
      
    io.emit("alocation", `https://google.com/maps?q=${latitude},${longitude}`)
    acknow()
  })
});

server.listen(process.env.PORT || 3000);

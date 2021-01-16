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
  console.log("new connection");

  socket.on("message", (message) => {
      io.emit("newMessage", message)
  })
});

server.listen(process.env.PORT || 3000);

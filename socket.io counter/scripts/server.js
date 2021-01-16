const http = require("http");
const path = require("path");
const express = require("express");
const socket = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socket(server);

const pathToPublicDirectory = path.join(__dirname, "../public");
app.use(express.static(pathToPublicDirectory));

let count = 0;

io.on("connection", (socket) => {
  socket.emit("newConnection", count);
  socket.on("increment", ()=> {
      count++
      io.emit("newConnection", count);
  })
});

server.listen(process.env.PORT || 3000);

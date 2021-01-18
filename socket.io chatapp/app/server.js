const http = require("http")
const path = require("path")
const express = require("express")
const socketio = require("socket.io")

//initialise the server
const app = express()

const server = http.createServer(app)

const io = socketio(server)

//path to the public directory
const pathToPublicDirectory = path.join(__dirname, "./public")

//enable express to use statics
app.use(express.static(pathToPublicDirectory))

io.on("connection", (socket)=>{
    console.log("connected")
})

server.listen(process.env.PORT || 3000)

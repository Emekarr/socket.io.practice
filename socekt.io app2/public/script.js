const socket = io()

document.querySelector(".app-form").addEventListener("submit", (event)=>{
    event.preventDefault()

    const data = document.querySelector(".data").value
    socket.emit("message", data)
})

socket.on("newMessage", (message)=> {
    const h = document.createElement("H1")
    const t = document.createTextNode(message)
    h.appendChild(t)

    document.body.appendChild(h)
})

const socket = io();

socket.on("newConnection", (count) => {
  document.querySelector(".count").innerHTML = `Current count = ${count}`
});

document.querySelector(".increment").addEventListener("click", () => {
    socket.emit("increment")
});

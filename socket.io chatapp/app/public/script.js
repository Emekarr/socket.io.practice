const socket = io();
const loginForm = document.querySelector(".login-form");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room }, () => {
    alert("Username in Room must be unique!");
    history.back()
  });

socket.on("new-user", (username) => {
  alert(username + "joined");
});

socket.on("welcome", (room) => {
    document.querySelector(".room-name").innerHTML = room
});

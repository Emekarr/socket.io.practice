const socket = io();
const loginForm = document.querySelector(".login-form");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room }, () => {
  alert("Username in Room must be unique!");
  history.back();
});

socket.on("new-user", (username) => {
  const h = document.createElement("H1");
  const t = document.createTextNode(`${username} has joined the chat!`);
  h.appendChild(t);
  const chatBox = document.querySelector(".chat-box");

  chatBox.appendChild(h);
  const style = h.style;
  style.fontSize = "70%";
  style.textAlign = "center";
  style.marginTop = "30px";
  style.fontWeight = "100";
});

socket.on("welcome", (room) => {
  document.querySelector(".room-name").innerHTML = room;
  const h = document.createElement("H1");
  const t = document.createTextNode(`Welcome ${username} to the chat!`);
  h.appendChild(t);
  const chatBox = document.querySelector(".chat-box");

  chatBox.appendChild(h);
  const style = h.style;
  style.fontSize = "70%";
  style.textAlign = "center";
  style.marginTop = "20px";
  style.fontWeight = "100";
});

const typeSpace = document.querySelector(".input-section > input");

const debounce = (callback, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, wait);
  };
};

typeSpace.addEventListener("keypress", () => {
  socket.emit("is-typing")
});

socket.on("user-is-typing", (username)=>{
    const isTyping = document.querySelector(".is-typing");
  isTyping.style.display = "block";
  isTyping.innerHTML = username + " is typing...";
})

typeSpace.addEventListener(
  "keyup",
  debounce(() => {
    socket.emit("stopped-typing")
  }, 2000)
);

socket.on("user-is-not-typing", (username)=> {
    const isTyping = document.querySelector(".is-typing");
    isTyping.style.display = "none";
})

socket.on("user-disconnected", (username)=>{
    const h = document.createElement("H1");
    const t = document.createTextNode(`${username} has left the chat!`);
    h.appendChild(t);
    const chatBox = document.querySelector(".chat-box");
  
    chatBox.appendChild(h);
    const style = h.style;
    style.fontSize = "70%";
    style.textAlign = "center";
    style.marginTop = "20px";
    style.fontWeight = "100";
})

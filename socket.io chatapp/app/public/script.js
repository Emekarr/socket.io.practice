const socket = io();
const loginForm = document.querySelector(".login-form");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });  

const scroll = () => {
  const chatBox = document.querySelector(".chat-box");
  chatBox.scrollTop = chatBox.scrollHeight;
};

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
  style.marginTop = "10px";
  style.fontWeight = "100";
  style.alignSelf = "center";

  scroll();
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
  style.marginTop = "10px";
  style.fontWeight = "100";
  style.alignSelf = "center";

  scroll();
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
  socket.emit("is-typing");
});

let userIsTyping;
socket.on("user-is-typing", (username) => {
    const exists = document.querySelector(".exists")
    if (exists) return

  userIsTyping = document.createElement("H1");
  const t = document.createTextNode(`${username} is typing...`);
  userIsTyping.appendChild(t);
  const chatBox = document.querySelector(".chat-box");

  chatBox.appendChild(userIsTyping);
  const style = userIsTyping.style;
  userIsTyping.classList = "exists"
  style.fontSize = "70%";
  style.textAlign = "center";
  style.marginTop = "10px";
  style.fontWeight = "600";
  style.alignSelf = "center";
});

typeSpace.addEventListener(
  "keyup",
  debounce(() => {
    socket.emit("stopped-typing");
  }, 2000)
);

socket.on("user-is-not-typing", (username) => {
  userIsTyping.remove()
});

socket.on("user-disconnected", (username) => {
  const h = document.createElement("H1");
  const t = document.createTextNode(`${username} has left the chat!`);
  h.appendChild(t);
  const chatBox = document.querySelector(".chat-box");

  chatBox.appendChild(h);
  const style = h.style;
  style.fontSize = "70%";
  style.textAlign = "center";
  style.marginTop = "10px";
  style.fontWeight = "100";
  style.alignSelf = "center";
});

const sendButton = document.querySelector("button");
const message = document.querySelector("input");
sendButton.addEventListener("click", () => {
  const messageValue = message.value;
  if (!messageValue) return alert("message box cannot be empty");
  socket.emit("new-message", { message: messageValue });


  const div = document.createElement("div");

  const h2 = document.createElement("H1");
  const t2 = document.createTextNode("me");
  h2.style.fontWeight = "600";
  h2.style.fontSize = "90%";
  h2.style.marginTop = "-6px";
  h2.style.color = "white";
  h2.appendChild(t2);

  div.style.background = "rgb(18, 157, 238)";
  div.style.marginLeft = "13px";
  div.style.borderRadius = "20px";
  div.style.display = "inline-block";
  div.style.padding = "10px";
  div.style.paddingLeft = "15px";
  div.style.paddingRight = "15px";
  div.style.marginTop = "20px";
  div.style.marginRight = "20px"
  div.style.alignSelf = "flex-end"

  const h = document.createElement("H1");
  const t = document.createTextNode(message.value);
  h.style.fontWeight = "100";
  h.style.fontSize = "90%";
  h.style.color = "white";

  h.appendChild(t);

  div.appendChild(h2);
  div.appendChild(h);
  const chatBox = document.querySelector(".chat-box");

  chatBox.appendChild(div);
  
  message.value = "";

  scroll();
});

socket.on("new-message-recieved", ({ message, username }) => {
  const div = document.createElement("div");

  const h2 = document.createElement("H1");
  const t2 = document.createTextNode("@" + username);
  h2.style.fontWeight = "600";
  h2.style.fontSize = "90%";
  h2.style.marginTop = "-6px";
  h2.appendChild(t2);

  div.style.background = "rgb(202, 202, 202)";
  div.style.marginLeft = "13px";
  div.style.borderRadius = "20px";
  div.style.display = "inline-block";
  div.style.padding = "10px";
  div.style.paddingLeft = "15px";
  div.style.paddingRight = "15px";
  div.style.marginTop = "10px";

  const h = document.createElement("H1");
  const t = document.createTextNode(message);
  h.style.fontWeight = "100";
  h.style.fontSize = "90%";

  h.appendChild(t);

  div.appendChild(h2);
  div.appendChild(h);
  const chatBox = document.querySelector(".chat-box");

  chatBox.appendChild(div);
  scroll();
});
socket.on("new-message-sent", ({ message, username }) => {});

const socket = io();
const loginForm = document.querySelector(".login-form");
const chatBox = document.querySelector(".chat-box");

class Text {
  constructor(text, style) {
    this.text = text;
    this.style = style;
  }

  create = () => {
    const h = document.createElement("H1");
    const t = document.createTextNode(this.text);
    h.appendChild(t);

    const style = h.style;

    for (let [key, value] of Object.entries(this.style)) {
      if (style.hasOwnProperty(key)) {
        if ((key === "classList")) {
          console.log(key, value)
          style[key].add(value);
          return;
        }
        style[key] = value;
      }
    }
    console.log(style.classList)
    return h;
  };
}

class Div {
  constructor(style, ...args) {
    this.children = args;
    this.style = style;
  }

  createDiv = () => {
    this.div = document.createElement("div");
    const style = this.div.style;

    for (let [key, value] of Object.entries(this.style)) {
      if (style.hasOwnProperty(key)) style[key] = value;
    }
    return this;
  };

  appendChildren = () => {
    this.children.forEach((child) => {
      this.div.appendChild(child);
    });
    return this.div;
  };
}

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const scroll = () => {
  chatBox.scrollTop = chatBox.scrollHeight;
};

socket.emit("join", { username, room }, () => {
  alert("Username in Room must be unique!");
  history.back();
});

socket.on("new-user", (username) => {
  const text = new Text(`${username} has joined the chat!`, {
    fontSize: "70%",
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "100",
    alignSelf: "center",
  }).create();

  chatBox.appendChild(text);
  scroll();
});

socket.on("welcome", (room) => {
  document.querySelector(".room-name").innerHTML = room;
  const text = new Text(`Welcome ${username} to the chat!`, {
    fontSize: "70%",
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "100",
    alignSelf: "center",
  }).create();

  chatBox.appendChild(text);
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
  const exists = document.querySelector(".exists");
  if (exists) return;

  userIsTyping = new Text(`${username} is typing...`, {
    classList: "exists",
    fontSize: "70%",
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "600",
    alignSelf: "center",
  }).create();

  chatBox.appendChild(userIsTyping);
});

typeSpace.addEventListener(
  "keyup",
  debounce(() => {
    socket.emit("stopped-typing");
  }, 2000)
);

socket.on("user-is-not-typing", (username) => {
  userIsTyping.remove();
});

socket.on("user-disconnected", (username) => {
  const text = new Text(`${username} has left the chat!`, {
    fontSize: "70%",
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "100",
    alignSelf: "center",
  }).create();

  chatBox.appendChild(text);
});

const sendButton = document.querySelector("button");
const message = document.querySelector("input");
sendButton.addEventListener("click", () => {
  const messageValue = message.value;
  if (!messageValue) return alert("message box cannot be empty");
  socket.emit("new-message", { message: messageValue });

  const text1 = new Text("me", {
    fontWeight: "600",
    fontSize: "90%",
    marginTop: "-6px",
    color: "white",
  }).create();
  const text2 = new Text(message.value, {
    fontWeight: "100",
    fontSize: "90%",
    color: "white",
  }).create();

  const div = new Div(
    {
      background: "rgb(18, 157, 238)",
      marginLeft: "13px",
      borderRadius: "20px",
      display: "inline-block",
      padding: "10px",
      paddingLeft: "15px",
      paddingRight: "15px",
      marginTop: "20px",
      marginRight: "13px",
      alignSelf: "flex-end",
    },
    text1,
    text2
  )
    .createDiv()
    .appendChildren();

  chatBox.appendChild(div);

  message.value = "";

  scroll();
});

socket.on("new-message-recieved", ({ message, username }) => {

  const text1 = new Text("@" + username, {
    fontWeight: "600",
    fontSize: "90%",
    marginTop: "-6px",
  }).create();

  const text2 = new Text(message.value, {
    fontWeight: "100",
    fontSize: "90%",
  }).create();
  
  const div = new Div(
    {
      background: "rgb(202, 202, 202)",
      marginLeft: "13px",
      borderRadius: "20px",
      display: "inline-block",
      padding: "10px",
      paddingLeft: "15px",
      paddingRight: "13px",
      marginTop: "10px",
    },
    text1,
    text2
  )
    .createDiv()
    .appendChildren();

  chatBox.appendChild(div);

  scroll();
});
socket.on("new-message-sent", ({ message, username }) => {});

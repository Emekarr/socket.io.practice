const socket = io();

socket.on("welcome", (welcome) => {
  const h = document.createElement("H1");
  const t = document.createTextNode(welcome);
  h.appendChild(t);
  h.style.fontSize = "70%";
  h.style.textAlign = "center";
  h.style.marginTop = "30px";

  document.body.appendChild(h);
});

socket.on("newUser", (newuser) => {
  const h = document.createElement("H1");
  const t = document.createTextNode(newuser);
  h.appendChild(t);
  h.style.fontSize = "70%";
  h.style.textAlign = "center";
  h.style.marginTop = "30px";

  document.body.appendChild(h);
});

document.querySelector(".app-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const data = document.querySelector(".data").value;
  document.querySelector(".data").value = "";
  socket.emit("message", data);
});

socket.on("newMessage", (message) => {
  const h = document.createElement("H1");
  const t = document.createTextNode(message);
  h.appendChild(t);
  h.style.fontSize = "110%";

  document.body.appendChild(h);
});

const locationBtn = document.querySelector(".location-btn");
locationBtn.addEventListener("click", () => {
  locationBtn.disabled = true;
  locationBtn.style.backgroundColor = "gray";
  const locationData = navigator.geolocation;
  if (!locationData) return alert("Your computer does not support this");

  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    socket.emit("location", { latitude, longitude }, () => {
      locationBtn.disabled = false;
      locationBtn.style.backgroundColor = "rgb(73, 73, 221)";
    });
  });
});

socket.on("alocation", (location) => {
  const h = document.createElement("H1");
  const t = document.createTextNode("Someones location");
  h.appendChild(t);
  h.style.fontSize = "70%";
  h.style.textAlign = "center";
  h.style.marginTop = "30px";

  document.body.appendChild(h);

  const h2 = document.createElement("a");
  const t2 = document.createTextNode("location");
  h2.appendChild(t2);
  h2.href = location;
  h2.style.fontSize = "70%";
  h2.style.textAlign = "center";
  h2.style.marginTop = "30px";

  document.body.appendChild(h2);
});

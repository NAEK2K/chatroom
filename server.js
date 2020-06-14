const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

let users = [];
let messages = [];

io.on("connection", (socket) => {
  socket.on("register", (user) => {
    if (users.includes(user)) {
      socket.emit("register bad");
    } else {
      socket.emit("register ok");
      socket.emit("update messages", messages);
      users.push(user);
      socket.user = user;
    }
  });
  socket.on("new message", (message) => {
    let msg = { user: socket.user, message: message.message };
    messages.push(msg);
    io.emit("update messages", messages);
    console.log(msg);
  });
  socket.on("disconnect", () => {
    users.splice(users.indexOf(socket.user), 1);
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "chatroom", "build")));

http.listen(8080, () => {
  console.log("running");
});

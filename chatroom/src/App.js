import React, { useState } from "react";
import openSocket from "socket.io-client";
import logo from "./logo.svg";
import "./App.css";

const socket = openSocket("http://localhost:8080");

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState();
  const [registered, setRegistered] = useState(false);
  const [message, setMessage] = useState();
  function register() {
    socket.emit("register", user);
  }
  function sendMessage() {
    socket.emit("new message", { message: message });
  }
  socket.on("register ok", () => {
    setRegistered(true);
  });
  socket.on("register bad", () => {
    setRegistered(false);
  });
  socket.on("update messages", (msg) => {
    setMessages(msg);
  });
  if (registered == false) {
    return (
      <div>
        <h2>Register</h2>
        <p>
          Username: <input type="text" value={user} onChange={(e) => setUser(e.target.value)}></input>
        </p>
        <button onClick={register}>Register</button>
      </div>
    );
  } else {
    return (
      <div>
        <input type="text" onChange={(e) => setMessage(e.target.value)}></input>
        <button onClick={sendMessage}>Send Message</button>
        {messages.map((x) => (
          <p className={"message"}>
            {x.user}: {x.message}
          </p>
        ))}
      </div>
    );
  }
}

export default App;

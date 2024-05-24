const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const conns = []


io.on("connection", (socket) => {
  console.log("A user connected");
  conns[socket.id] = socket.handshake.auth.id
  // console.log(conns);
  socket.on("disconnect", () => {
    console.log("User disconnected");
    conns[socket.id] = null
    // console.log(conns);
  });
});

server.listen(3001, () => {
  console.log("Socket server listening on port 3001");
});

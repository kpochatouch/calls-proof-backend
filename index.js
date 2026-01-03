// backend/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("ping-test", (msg) => {
    socket.emit("pong-test", msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("server listening on", PORT);
});

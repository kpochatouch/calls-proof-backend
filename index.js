// backend/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.get("/", (req, res) => {
  res.send("Calls proof backend is running");
});

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

  socket.on("room:join", ({ room }) => {
    socket.join(room);
    console.log(`socket ${socket.id} joined room ${room}`);

    // notify others in the room
    socket.to(room).emit("peer:joined", { id: socket.id });
  });

  socket.on("signal", ({ room, data }) => {
    console.log("signal relayed:", room, data.type);

    socket.to(room).emit("signal", {
      from: socket.id,
      data,
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("server listening on", PORT);
});

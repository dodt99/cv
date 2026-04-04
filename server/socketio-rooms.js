const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

const ROOMS = ["general", "tech", "random"];

async function emitRoomCounts() {
  for (const room of ROOMS) {
    const sockets = await io.in(room).fetchSockets();
    io.emit("room_count", { room, count: sockets.length });
  }
}

// ── Default namespace: rooms demo ──────────────────────────────────────────────
io.on("connection", (socket) => {
  emitRoomCounts();

  socket.on("set_username", (username) => {
    socket.data.username = username;
  });

  socket.on("join_room", (room) => {
    ROOMS.forEach((r) => socket.leave(r));
    socket.join(room);
    io.to(room).emit("room_message", {
      system: true,
      text: `${socket.data.username} joined`,
      room,
      timestamp: Date.now(),
    });
    emitRoomCounts();
  });

  socket.on("room_chat", ({ room, text }) => {
    io.to(room).emit("room_message", {
      username: socket.data.username,
      text,
      room,
      timestamp: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    emitRoomCounts();
  });
});

// ── /public namespace ──────────────────────────────────────────────────────────
const publicNs = io.of("/public");
publicNs.on("connection", (socket) => {
  socket.emit("ns_event", { text: `Connected to /public — your ID: ${socket.id}` });
  socket.broadcast.emit("ns_event", { text: `New socket joined /public: ${socket.id}` });

  socket.on("ns_broadcast", (text) => {
    publicNs.emit("ns_event", { text: `[${socket.id.slice(0, 6)}] ${text}` });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("ns_event", { text: `Socket left /public: ${socket.id}` });
  });
});

// ── /admin namespace ───────────────────────────────────────────────────────────
const adminNs = io.of("/admin");
adminNs.on("connection", (socket) => {
  socket.emit("ns_event", { text: `Connected to /admin — your ID: ${socket.id}` });
  socket.broadcast.emit("ns_event", { text: `New socket joined /admin: ${socket.id}` });

  socket.on("ns_broadcast", (text) => {
    adminNs.emit("ns_event", { text: `[${socket.id.slice(0, 6)}] ${text}` });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("ns_event", { text: `Socket left /admin: ${socket.id}` });
  });
});

httpServer.listen(3003, () => {
  console.log("Socket.io rooms server running on :3003");
  console.log("  Default namespace  → rooms demo");
  console.log("  /public namespace  → namespace isolation demo");
  console.log("  /admin  namespace  → namespace isolation demo");
});

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  io.emit("user_count", io.engine.clientsCount);

  socket.on("chat", ({ username, text }) => {
    io.emit("chat", { username, text, timestamp: Date.now() });
  });

  socket.on("disconnect", () => {
    io.emit("user_count", io.engine.clientsCount);
  });
});

httpServer.listen(3002, () => {
  console.log("socket.io server running on http://localhost:3002");
});

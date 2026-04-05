const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

const VALID_TOKENS = {
  "token-alice": { id: 1, username: "alice", role: "user" },
  "token-bob":   { id: 2, username: "bob",   role: "admin" },
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));
  const user = VALID_TOKENS[token];
  if (!user) return next(new Error("Invalid token"));
  socket.data.user = user;
  next();
});

io.on("connection", (socket) => {
  socket.emit("authenticated", socket.data.user);
  // Demo only — disconnect after confirming auth so the client stays stateless
  socket.disconnect();
});

httpServer.listen(3004, () => {
  console.log("Socket.io auth server running on :3004");
  console.log("  Valid tokens: token-alice, token-bob");
});

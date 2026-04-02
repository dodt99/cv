const { WebSocketServer } = require("ws");
const { randomUUID } = require("crypto");

const wss = new WebSocketServer({ port: 3001 });

function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const ws of wss.clients) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

wss.on("connection", (ws) => {
  const clientId = randomUUID().slice(0, 8);

  ws.send(
    JSON.stringify({
      type: "connected",
      clientId,
      totalClients: wss.clients.size,
    })
  );
  broadcast({ type: "user_count", count: wss.clients.size });

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.type === "echo") {
      ws.send(JSON.stringify({ type: "echo", payload: msg.payload }));
    } else if (msg.type === "chat") {
      broadcast({
        type: "chat",
        username: msg.username,
        text: msg.text,
        timestamp: Date.now(),
      });
    } else if (msg.type === "ping") {
      ws.send(JSON.stringify({ type: "pong" }));
    }
  });

  ws.on("close", () => {
    broadcast({ type: "user_count", count: wss.clients.size });
  });

  ws.on("error", (err) => {
    console.error("client error:", err.message);
  });
});

console.log("ws-server running on ws://localhost:3001");

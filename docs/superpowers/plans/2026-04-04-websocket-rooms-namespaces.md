# §9 Rooms & Namespaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `ComingSoon` placeholder for `id="rooms"` with a fully implemented §9 section covering Socket.io Rooms (live multi-room chat) and Namespaces (two isolated namespace panels).

**Architecture:** A new server script (`server/socketio-rooms.js`) runs on port 3003 and exposes the default namespace for the rooms demo plus `/public` and `/admin` namespaces for the isolation demo. A new React component (`RoomsSection.tsx`) is self-contained and replaces the placeholder in `page.tsx`.

**Tech Stack:** Node.js (socket.io v4), React 19, socket.io-client v4, Tailwind CSS v4

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `server/socketio-rooms.js` | Socket.io server on :3003 — rooms + namespaces |
| Create | `app/exercises/websocket/components/RoomsSection.tsx` | Full §9 section component |
| Modify | `package.json` | Add `ws:rooms` script |
| Modify | `app/exercises/websocket/page.tsx` | Import RoomsSection, replace ComingSoon |

---

## Task 1: Add `ws:rooms` npm script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add script**

In `package.json`, add `"ws:rooms"` to the `"scripts"` block:

```json
"ws:rooms": "node server/socketio-rooms.js"
```

The scripts block should look like:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "ws": "node server/ws-server.js",
  "ws:io": "node server/socketio-server.js",
  "ws:rooms": "node server/socketio-rooms.js"
},
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "chore: add ws:rooms script"
```

---

## Task 2: Create the Socket.io rooms server

**Files:**
- Create: `server/socketio-rooms.js`

- [ ] **Step 1: Create the file**

```js
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
```

- [ ] **Step 2: Verify server starts**

```bash
node server/socketio-rooms.js
```

Expected output:
```
Socket.io rooms server running on :3003
  Default namespace  → rooms demo
  /public namespace  → namespace isolation demo
  /admin  namespace  → namespace isolation demo
```

Stop it with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add server/socketio-rooms.js
git commit -m "feat: add Socket.io rooms+namespaces server on :3003"
```

---

## Task 3: Create RoomsSection component

**Files:**
- Create: `app/exercises/websocket/components/RoomsSection.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// ── Types ──────────────────────────────────────────────────────────────────────
interface RoomMessage {
  id: number;
  system?: boolean;
  username?: string;
  text: string;
  timestamp: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const ROOMS = ["general", "tech", "random"] as const;
type Room = (typeof ROOMS)[number];

// ── Theory content ─────────────────────────────────────────────────────────────
const THEORY_ASCII = `Server
└── Namespace (/chat, /admin, /)  ← separate connection endpoints
    └── Room (general, tech, random)  ← server-side grouping
        └── Socket (individual connection)`;

const NS_VS_ROOM = [
  { feature: "What it is",     ns: "Separate connection endpoint",     room: "Server-side grouping of sockets" },
  { feature: "Client sees it", ns: "Yes — connect to it explicitly",   room: "No — server-side only" },
  { feature: "Isolation",      ns: "Full (separate event pipeline)",   room: "Partial (same namespace)" },
  { feature: "Use case",       ns: "Feature separation (chat/admin)",  room: "Sub-channels within a feature" },
  { feature: "Default",        ns: "/ (always exists)",                room: "None — created with join()" },
];

// ── Server code snippets ───────────────────────────────────────────────────────
const ROOMS_SERVER_CODE = `// Rooms — default namespace (/)
io.on("connection", (socket) => {
  socket.on("set_username", (name) => {
    socket.data.username = name;
  });

  socket.on("join_room", (room) => {
    // leave all previous rooms first
    ["general", "tech", "random"].forEach(r => socket.leave(r));
    socket.join(room);

    // only sockets in this room receive the message
    io.to(room).emit("room_message", {
      system: true,
      text: \`\${socket.data.username} joined\`,
    });
  });

  socket.on("room_chat", ({ room, text }) => {
    io.to(room).emit("room_message", {
      username: socket.data.username,
      text,
      timestamp: Date.now(),
    });
  });
});`;

const NS_SERVER_CODE = `// Namespaces — two isolated endpoints on the same server
const publicNs = io.of("/public");
const adminNs  = io.of("/admin");

publicNs.on("connection", (socket) => {
  socket.emit("ns_event", { text: "Connected to /public" });
  socket.on("ns_broadcast", (text) => {
    // only /public sockets receive this
    publicNs.emit("ns_event", { text });
  });
});

adminNs.on("connection", (socket) => {
  socket.emit("ns_event", { text: "Connected to /admin" });
  socket.on("ns_broadcast", (text) => {
    // /public never sees this
    adminNs.emit("ns_event", { text });
  });
});`;

const NS_CLIENT_CODE = `// Connect to a specific namespace
const publicSocket = io("http://localhost:3003/public");
const adminSocket  = io("http://localhost:3003/admin");

// Each socket has its own ID, event pipeline, and lifecycle
publicSocket.on("ns_event", (e) => console.log("[public]", e.text));
adminSocket.on("ns_event",  (e) => console.log("[admin]",  e.text));`;

// ── RoomsDemo ──────────────────────────────────────────────────────────────────
function RoomsDemo() {
  const [phase, setPhase] = useState<"join" | "pick" | "chat">("join");
  const [username, setUsername] = useState("");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [input, setInput] = useState("");
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({
    general: 0, tech: 0, random: 0,
  });
  const [connected, setConnected] = useState(false);
  const [serverHint, setServerHint] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const idRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const usernameRef = useRef("");
  const currentRoomRef = useRef<Room | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => { socketRef.current?.disconnect(); }, []);

  const addMsg = (msg: Omit<RoomMessage, "id">) => {
    setMessages((prev) => [...prev.slice(-199), { ...msg, id: idRef.current++ }]);
  };

  const connect = useCallback(() => {
    if (!username.trim()) return;
    usernameRef.current = username.trim();
    const socket = io("http://localhost:3003", { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("set_username", usernameRef.current);
      setPhase("pick");
    });
    socket.on("connect_error", () => setServerHint(true));
    socket.on("room_message", (msg: { system?: boolean; username?: string; text: string; timestamp: number }) => {
      addMsg({ ...msg, timestamp: msg.timestamp ?? Date.now() });
    });
    socket.on("room_count", ({ room, count }: { room: string; count: number }) => {
      setRoomCounts((prev) => ({ ...prev, [room]: count }));
    });
    socket.on("disconnect", () => setConnected(false));
  }, [username]);

  const joinRoom = useCallback((room: Room) => {
    socketRef.current?.emit("join_room", room);
    setCurrentRoom(room);
    currentRoomRef.current = room;
    setMessages([]);
    setPhase("chat");
  }, []);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !currentRoomRef.current || !socketRef.current?.connected) return;
    socketRef.current.emit("room_chat", { room: currentRoomRef.current, text: input.trim() });
    setInput("");
  }, [input]);

  const leave = () => {
    socketRef.current?.disconnect();
    setPhase("join");
    setMessages([]);
    setCurrentRoom(null);
    setConnected(false);
    setServerHint(false);
    setRoomCounts({ general: 0, tech: 0, random: 0 });
  };

  if (phase === "join") {
    return (
      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-xs text-gray-500 mb-4">
          Connect with a username, then pick a room. Run{" "}
          <code className="bg-gray-100 px-1 rounded font-mono">pnpm ws:rooms</code> first.
        </p>
        <div className="flex gap-2 max-w-sm">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && connect()}
            placeholder="Your username…"
            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={connect}
            disabled={!username.trim()}
            className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg"
          >
            Connect
          </button>
        </div>
        {serverHint && (
          <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
            Could not connect. Run{" "}
            <code className="font-mono">pnpm ws:rooms</code> in a terminal first.
          </p>
        )}
      </div>
    );
  }

  if (phase === "pick") {
    return (
      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-xs font-semibold text-gray-600 mb-3">Pick a room to join</p>
        <div className="flex gap-2">
          {ROOMS.map((room) => (
            <button
              key={room}
              onClick={() => joinRoom(room)}
              className="flex flex-col items-center px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <span className="text-sm font-semibold text-gray-700">#{room}</span>
              <span className="text-[10px] text-gray-400 mt-1">
                {roomCounts[room] ?? 0} online
              </span>
            </button>
          ))}
        </div>
        <button onClick={leave} className="mt-3 text-xs text-gray-400 hover:text-gray-600">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-1">
          {ROOMS.map((room) => (
            <button
              key={room}
              onClick={() => {
                if (room !== currentRoom) joinRoom(room);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRoom === room
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              #{room}
              <span
                className={`ml-1.5 text-[10px] ${
                  currentRoom === room ? "text-blue-200" : "text-gray-400"
                }`}
              >
                {roomCounts[room] ?? 0}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500" : "bg-gray-300"}`} />
          <span className="text-xs text-gray-500">{usernameRef.current}</span>
          <button onClick={leave} className="text-xs text-gray-400 hover:text-gray-600 ml-1">
            Leave
          </button>
        </div>
      </div>

      <div className="h-52 overflow-y-auto px-4 py-3 space-y-1.5">
        {messages.map((m) =>
          m.system ? (
            <p key={m.id} className="text-center text-[11px] text-gray-400 italic">
              {m.text}
            </p>
          ) : (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.username === usernameRef.current ? "items-end" : "items-start"
              }`}
            >
              <span className="text-[10px] text-gray-400 mb-0.5">
                {m.username === usernameRef.current ? "You" : m.username} ·{" "}
                {new Date(m.timestamp).toLocaleTimeString("en", { hour12: false })}
              </span>
              <div
                className={`max-w-xs px-3 py-1.5 rounded-2xl text-sm ${
                  m.username === usernameRef.current
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={`Message #${currentRoom}…`}
          disabled={!connected}
          className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
        />
        <button
          onClick={sendMessage}
          disabled={!connected || !input.trim()}
          className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ── NsPanel ────────────────────────────────────────────────────────────────────
function NsPanel({
  namespace,
  color,
}: {
  namespace: "/public" | "/admin";
  color: "blue" | "purple";
}) {
  const [events, setEvents] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [broadcastText, setBroadcastText] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  useEffect(() => () => { socketRef.current?.disconnect(); }, []);

  const addEvent = (text: string) =>
    setEvents((prev) => [...prev.slice(-49), text]);

  const connect = () => {
    if (socketRef.current?.connected) return;
    const socket = io(`http://localhost:3003${namespace}`, {
      transports: ["websocket"],
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
      addEvent(`✓ Connected — socket ID: ${socket.id}`);
    });
    socket.on("ns_event", ({ text }: { text: string }) => addEvent(text));
    socket.on("connect_error", () =>
      addEvent("✗ Connection failed — is pnpm ws:rooms running?")
    );
    socket.on("disconnect", () => {
      setConnected(false);
      addEvent("Disconnected");
    });
  };

  const disconnect = () => socketRef.current?.disconnect();

  const broadcast = () => {
    if (!broadcastText.trim() || !socketRef.current?.connected) return;
    socketRef.current.emit("ns_broadcast", broadcastText.trim());
    setBroadcastText("");
  };

  const c =
    color === "blue"
      ? {
          badge: "bg-blue-100 text-blue-700",
          btn: "bg-blue-600 hover:bg-blue-700",
          dot: "bg-blue-500",
          border: "border-blue-200",
          emitBtn: "bg-blue-600 hover:bg-blue-700",
        }
      : {
          badge: "bg-purple-100 text-purple-700",
          btn: "bg-purple-600 hover:bg-purple-700",
          dot: "bg-purple-500",
          border: "border-purple-200",
          emitBtn: "bg-purple-600 hover:bg-purple-700",
        };

  return (
    <div
      className={`flex-1 rounded-xl border ${
        connected ? c.border : "border-gray-200"
      } overflow-hidden`}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${connected ? c.dot : "bg-gray-300"}`} />
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.badge}`}>
            {namespace}
          </span>
        </div>
        <button
          onClick={connected ? disconnect : connect}
          className={`text-[10px] font-medium px-2 py-1 rounded ${
            connected ? "text-gray-500 hover:text-gray-700" : `${c.btn} text-white`
          }`}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      </div>

      <div className="h-36 overflow-y-auto px-3 py-2 bg-gray-950 space-y-1 font-mono">
        {events.length === 0 && (
          <p className="text-[11px] text-gray-600">
            Click Connect to join {namespace}
          </p>
        )}
        {events.map((e, i) => (
          <p key={i} className="text-[11px] text-green-400 leading-relaxed">
            {e}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-1.5 px-3 py-2 border-t border-gray-100">
        <input
          value={broadcastText}
          onChange={(e) => setBroadcastText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && broadcast()}
          placeholder="Broadcast to namespace…"
          disabled={!connected}
          className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-40"
        />
        <button
          onClick={broadcast}
          disabled={!connected || !broadcastText.trim()}
          className={`px-3 py-1.5 text-[10px] font-medium ${c.emitBtn} disabled:opacity-40 text-white rounded-lg`}
        >
          Emit
        </button>
      </div>
    </div>
  );
}

// ── NamespacesDemo ─────────────────────────────────────────────────────────────
function NamespacesDemo() {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        Two panels, two namespaces on the same server. Connect both — then
        broadcast from one and watch the other stay silent.
      </p>
      <div className="flex gap-3">
        <NsPanel namespace="/public" color="blue" />
        <NsPanel namespace="/admin" color="purple" />
      </div>
    </div>
  );
}

// ── Shared UI ──────────────────────────────────────────────────────────────────
function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {badge}
        </span>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gray-400 font-mono">{filename}</span>
      </div>
      <pre className="text-[12px] leading-relaxed font-mono bg-white p-4 overflow-x-auto text-gray-700">
        {code}
      </pre>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function RoomsSection() {
  return (
    <section id="rooms" className="mb-16 scroll-mt-4">
      <SectionHeader
        badge="§9"
        title="Rooms & Namespaces"
        subtitle="Two ways to segment sockets — rooms group sockets server-side; namespaces create isolated connection endpoints."
      />

      {/* Theory */}
      <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-xs font-semibold text-slate-700 mb-2">Hierarchy</p>
        <pre className="text-[11px] font-mono text-slate-600 leading-relaxed mb-4">
          {THEORY_ASCII}
        </pre>
        <p className="text-xs font-semibold text-slate-700 mb-2">Namespace vs Room</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 text-slate-500 font-semibold w-1/3">Feature</th>
              <th className="text-left py-1.5 text-blue-600 font-semibold w-1/3">Namespace</th>
              <th className="text-left py-1.5 text-purple-600 font-semibold w-1/3">Room</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {NS_VS_ROOM.map(({ feature, ns, room }) => (
              <tr key={feature}>
                <td className="py-1.5 text-slate-600 font-medium">{feature}</td>
                <td className="py-1.5 text-blue-700">{ns}</td>
                <td className="py-1.5 text-purple-700">{room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rooms demo */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          Demo A — Rooms: multi-room chat
        </p>
        <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Key insight:</strong> Rooms are <em>server-side only</em>. The
            client never calls{" "}
            <code className="bg-blue-100 px-1 rounded">.join()</code> — it sends
            an event, and the server decides which room to place it in. Open two
            tabs to see isolation in action.
          </p>
        </div>
        <RoomsDemo />
      </div>

      {/* Namespaces demo */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          Demo B — Namespaces: isolated connection endpoints
        </p>
        <div className="mb-2 p-3 bg-purple-50 border border-purple-100 rounded-lg">
          <p className="text-xs text-purple-700">
            <strong>Key insight:</strong> Each namespace gets its own event
            pipeline. A socket connected to{" "}
            <code className="bg-purple-100 px-1 rounded">/admin</code>{" "}
            <em>never</em> receives events from{" "}
            <code className="bg-purple-100 px-1 rounded">/public</code>, even
            though they share the same HTTP server and port.
          </p>
        </div>
        <NamespacesDemo />
      </div>

      {/* Code blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CodeBlock filename="socketio-rooms.js (rooms)" code={ROOMS_SERVER_CODE} />
        <CodeBlock filename="socketio-rooms.js (namespaces)" code={NS_SERVER_CODE} />
      </div>
      <div className="mt-3">
        <CodeBlock filename="client.ts" code={NS_CLIENT_CODE} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/exercises/websocket/components/RoomsSection.tsx
git commit -m "feat: add RoomsSection component for §9"
```

---

## Task 4: Wire RoomsSection into page.tsx

**Files:**
- Modify: `app/exercises/websocket/page.tsx`

- [ ] **Step 1: Add import**

At the top of `app/exercises/websocket/page.tsx`, add the import alongside the other section imports:

```tsx
import { RoomsSection } from "./components/RoomsSection";
```

- [ ] **Step 2: Replace ComingSoon placeholder**

Find this line:
```tsx
<ComingSoon id="rooms"     badge="§9"  title="Rooms & Namespaces"        desc="socket.join(), targeted broadcasts, and namespace isolation." />
```

Replace it with:
```tsx
<RoomsSection />
```

- [ ] **Step 3: Verify build compiles**

```bash
pnpm build
```

Expected: build completes with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add app/exercises/websocket/page.tsx
git commit -m "feat: wire §9 RoomsSection into websocket exercise page"
```

---

## Verification Checklist

After all tasks are complete, manually verify:

- [ ] `pnpm ws:rooms` starts the server and prints the startup message
- [ ] Navigating to `/exercises/websocket` shows §9 in the sidebar nav
- [ ] Scrolling to §9 shows the theory block with the hierarchy ASCII and comparison table
- [ ] **Rooms demo:** Enter username → Connect → room picker shows 3 rooms with counts → join a room → send a message → message appears → switch rooms → previous room's messages are gone
- [ ] **Rooms isolation:** Open two browser tabs, join the same room → messages appear in both. Join different rooms → messages do NOT cross rooms.
- [ ] **Namespaces demo:** Click Connect on both panels → each shows a different socket ID → emit from `/public` panel → only `/public` log shows it, `/admin` stays silent
- [ ] Server hint appears if the server is not running

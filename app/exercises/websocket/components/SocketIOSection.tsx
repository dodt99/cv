"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  id: number;
  username: string;
  text: string;
  timestamp: number;
  isSelf: boolean;
}

const SERVER_CODE = `const { createServer } = require("http");
const { Server } = require("socket.io");

const io = new Server(createServer(), {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  // broadcast updated count to everyone
  io.emit("user_count", io.engine.clientsCount);

  socket.on("chat", ({ username, text }) => {
    // emit to ALL connected clients (including sender)
    io.emit("chat", { username, text, timestamp: Date.now() });
  });

  socket.on("disconnect", () => {
    io.emit("user_count", io.engine.clientsCount);
  });
}).listen(3002);`;

const CLIENT_CODE = `import { io } from "socket.io-client";

const socket = io("http://localhost:3002");

socket.on("connect",    () => console.log("connected:", socket.id));
socket.on("chat",       (msg) => console.log(msg));
socket.on("user_count", (n)   => console.log(n, "online"));
socket.on("disconnect", ()    => console.log("disconnected"));

// Send a message
socket.emit("chat", { username: "Độ", text: "hello" });

// Disconnect
socket.disconnect();`;

const COMPARISON = [
  { feature: "Reconnection",        raw: "You wrote it (§4)",    sio: "Automatic, built-in" },
  { feature: "Event names",         raw: 'JSON type: "chat"',     sio: 'socket.on("chat", ...)' },
  { feature: "Rooms / namespaces",  raw: "Manual client tracking", sio: "socket.join('room')" },
  { feature: "Fallback transport",  raw: "None",                  sio: "HTTP long-poll fallback" },
  { feature: "Acknowledgements",    raw: "Manual",                sio: "socket.emit('ev', cb)" },
  { feature: "Binary support",      raw: "Manual ArrayBuffer",    sio: "Built-in" },
  { feature: "Protocol",            raw: "Pure WebSocket frames", sio: "Custom Socket.io protocol" },
  { feature: "Server compatibility", raw: "Any WS server",        sio: "Must use socket.io server" },
];

export function SocketIOSection() {
  const [phase, setPhase] = useState<"join" | "chat">("join");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [serverHint, setServerHint] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const idRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const usernameRef = useRef("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMsg = (msg: Omit<ChatMessage, "id">) => {
    setMessages((prev) => [...prev.slice(-199), { ...msg, id: idRef.current++ }]);
  };

  const join = useCallback(() => {
    if (!username.trim()) return;
    usernameRef.current = username.trim();

    const socket = io("http://localhost:3002", { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setPhase("chat");
      socket.emit("chat", { username: usernameRef.current, text: "joined the room" });
    });

    socket.on("connect_error", () => setServerHint(true));

    socket.on("chat", (msg: { username: string; text: string; timestamp: number }) => {
      addMsg({ ...msg, isSelf: msg.username === usernameRef.current });
    });

    socket.on("user_count", (n: number) => setUserCount(n));

    socket.on("disconnect", () => {
      setConnected(false);
      socketRef.current = null;
    });
  }, [username]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socketRef.current?.connected) return;
    socketRef.current.emit("chat", { username: usernameRef.current, text: input.trim() });
    setInput("");
  }, [input]);

  const leave = () => {
    socketRef.current?.disconnect();
    setPhase("join");
    setMessages([]);
    setServerHint(false);
  };

  useEffect(() => () => { socketRef.current?.disconnect(); }, []);

  return (
    <section id="socketio" className="mb-16 scroll-mt-4">
      <SectionHeader badge="§8" title="Socket.io vs Raw WebSocket" subtitle="Same chat room as §7 — rebuilt with Socket.io. Spot the difference." />

      {/* Key insight */}
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs font-semibold text-amber-800 mb-1">Key insight</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Socket.io is <strong>not</strong> &ldquo;better WebSocket&rdquo; — it&apos;s a higher-level abstraction built on top of WebSocket.
          It uses its own framing protocol, which means a raw WS client <em>cannot</em> talk to a Socket.io server.
          Understanding raw WS (§2–§7) is what makes Socket.io feel like a shortcut rather than magic.
        </p>
      </div>

      {/* Comparison table */}
      <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Raw WS (§7) vs Socket.io (§8)</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-2 text-gray-500 font-semibold w-1/3">Feature</th>
              <th className="text-left px-4 py-2 text-gray-500 font-semibold w-1/3">Raw WS</th>
              <th className="text-left px-4 py-2 text-blue-600 font-semibold w-1/3">Socket.io</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {COMPARISON.map(({ feature, raw, sio }) => (
              <tr key={feature}>
                <td className="px-4 py-2 text-gray-600 font-medium">{feature}</td>
                <td className="px-4 py-2 text-gray-400">{raw}</td>
                <td className="px-4 py-2 text-blue-600">{sio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chat demo */}
      {phase === "join" ? (
        <div className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 mb-4">
            Same chat UX as §7, but using Socket.io under the hood. Run <code className="bg-gray-100 px-1 rounded font-mono">pnpm ws:io</code> to start the Socket.io server on port 3002.
          </p>
          <div className="flex gap-2 max-w-sm">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && join()}
              placeholder="Enter your username…"
              className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={join}
              disabled={!username.trim()}
              className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg"
            >
              Join
            </button>
          </div>
          {serverHint && (
            <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              Could not connect. Run <code className="font-mono">pnpm ws:io</code> in a terminal first.
            </p>
          )}
        </div>
      ) : (
        <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? "bg-blue-500" : "bg-gray-300"}`} />
              <span className="text-xs font-semibold text-gray-700">{usernameRef.current}</span>
              <span className="text-xs text-gray-400">· {userCount} online · via Socket.io</span>
            </div>
            <button onClick={leave} className="text-xs text-gray-400 hover:text-gray-600">Leave</button>
          </div>
          <div className="h-64 overflow-y-auto px-4 py-3 space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.isSelf ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-gray-400 mb-0.5">
                  {m.isSelf ? "You" : m.username} · {new Date(m.timestamp).toLocaleTimeString("en", { hour12: false })}
                </span>
                <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${m.isSelf ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message…"
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
      )}

      {/* Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CodeBlock filename="socketio-server.js" code={SERVER_CODE} />
        <CodeBlock filename="client.ts" code={CLIENT_CODE} />
      </div>
    </section>
  );
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{badge}</span>
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
      <pre className="text-[12px] leading-relaxed font-mono bg-white p-4 overflow-x-auto text-gray-700">{code}</pre>
    </div>
  );
}

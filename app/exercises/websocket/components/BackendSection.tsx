"use client";

import { useState, useRef, useCallback } from "react";

interface Message {
  id: number;
  direction: "sent" | "received";
  text: string;
  time: string;
}

const CLIENT_CODE = `const ws = new WebSocket("ws://localhost:3001");

ws.onopen = () => {
  // server sends "connected" immediately on open
};

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  // msg.type: "connected" | "echo" | "user_count"
};

// Send an echo request
ws.send(JSON.stringify({
  type: "echo",
  payload: "hello server"
}));`;

const SERVER_CODE = `const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({
    type: "connected",
    clientId: randomUUID().slice(0, 8),
    totalClients: wss.clients.size,
  }));

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    if (msg.type === "echo") {
      // reflect back to sender only
      ws.send(JSON.stringify({
        type: "echo",
        payload: msg.payload,
      }));
    }
  });
});`;

export function BackendSection() {
  const [connected, setConnected] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [totalClients, setTotalClients] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [serverHint, setServerHint] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const idRef = useRef(0);

  function addMsg(direction: Message["direction"], text: string) {
    const time = new Date().toLocaleTimeString("en", { hour12: false });
    setMessages((prev) => [...prev.slice(-49), { id: idRef.current++, direction, text, time }]);
  }

  const connect = useCallback(() => {
    if (wsRef.current) return;
    setServerHint(false);
    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onerror = () => setServerHint(true);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "connected") {
        setClientId(msg.clientId);
        setTotalClients(msg.totalClients);
      } else if (msg.type === "echo") {
        addMsg("received", `echo: ${msg.payload}`);
      } else if (msg.type === "user_count") {
        setTotalClients(msg.count);
      }
    };
    ws.onclose = () => {
      setConnected(false);
      setClientId(null);
      wsRef.current = null;
    };
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  const send = useCallback(() => {
    if (wsRef.current?.readyState !== 1 || !input.trim()) return;
    wsRef.current.send(JSON.stringify({ type: "echo", payload: input.trim() }));
    addMsg("sent", input.trim());
    setInput("");
  }, [input]);

  return (
    <section id="backend" className="mb-16 scroll-mt-4">
      <SectionHeader badge="§3" title="Backend" subtitle="Node.js ws server — echo, broadcast, client tracking" />

      {/* Concept */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">ws package</p>
            <p className="text-gray-500">Minimal Node.js WebSocket server. No magic — just events: <code className="bg-gray-100 px-1 rounded font-mono">connection</code>, <code className="bg-gray-100 px-1 rounded font-mono">message</code>, <code className="bg-gray-100 px-1 rounded font-mono">close</code>, <code className="bg-gray-100 px-1 rounded font-mono">error</code>.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">wss.clients</p>
            <p className="text-gray-500">A <code className="bg-gray-100 px-1 rounded font-mono">Set</code> of all connected sockets. Iterate to broadcast. Check <code className="bg-gray-100 px-1 rounded font-mono">readyState === 1</code> before sending.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">JSON protocol</p>
            <p className="text-gray-500">WebSocket sends raw strings. Wrap messages in JSON with a <code className="bg-gray-100 px-1 rounded font-mono">type</code> field to distinguish echo, chat, system events.</p>
          </div>
        </div>
      </div>

      {/* Demo */}
      <div className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Status bar */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${connected ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500" : "bg-gray-300"}`} />
            {connected ? "Connected" : "Disconnected"}
          </span>
          {clientId && (
            <span className="text-xs text-gray-400 font-mono">id: {clientId}</span>
          )}
          {connected && (
            <span className="text-xs text-gray-400">{totalClients} client{totalClients !== 1 ? "s" : ""} online</span>
          )}
          {!connected ? (
            <button onClick={connect} className="ml-auto px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Connect
            </button>
          ) : (
            <button onClick={disconnect} className="ml-auto px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
              Disconnect
            </button>
          )}
          {serverHint && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Run <code className="font-mono">pnpm ws</code> first
            </span>
          )}
        </div>

        {/* Send */}
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Send an echo message…"
            disabled={!connected}
            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
          />
          <button
            onClick={send}
            disabled={!connected}
            className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors"
          >
            Send
          </button>
        </div>

        {/* Message list */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Messages</span>
            <button onClick={() => setMessages([])} className="text-[10px] text-gray-400 hover:text-gray-600">clear</button>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
            {messages.length === 0 ? (
              <p className="text-gray-300 text-xs text-center py-6">Connect and send a message to see echo</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex items-start gap-3 px-3 py-2 text-xs ${m.direction === "sent" ? "bg-blue-50/30" : ""}`}>
                  <span className="text-gray-300 font-mono shrink-0">{m.time}</span>
                  <span className={`shrink-0 font-semibold w-14 ${m.direction === "sent" ? "text-blue-500" : "text-green-600"}`}>
                    {m.direction === "sent" ? "→ sent" : "← recv"}
                  </span>
                  <span className="text-gray-600">{m.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Side-by-side code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CodeBlock filename="client.ts" code={CLIENT_CODE} />
        <CodeBlock filename="ws-server.js" code={SERVER_CODE} />
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

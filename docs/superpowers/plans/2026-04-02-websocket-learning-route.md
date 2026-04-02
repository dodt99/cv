# WebSocket Learning Route — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/exercises/websocket` — an 8-section interactive learning page teaching WebSocket from theory to Socket.io, with a local Node.js backend.

**Architecture:** Two-zone layout (sticky mini-nav + scrollable content). Each of the 8 sections is an isolated Client Component. Two local servers (`server/ws-server.js` on port 3001, `server/socketio-server.js` on port 3002) handle echo, chat broadcast, and Socket.io events.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, native browser `WebSocket`, `ws` npm package (server), `socket.io` + `socket.io-client` (§8)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add `ws`, `socket.io`, `socket.io-client`; add `ws`/`ws:io` scripts |
| `server/ws-server.js` | Create | Raw WS server: echo, chat broadcast, ping/pong, port 3001 |
| `server/socketio-server.js` | Create | Socket.io server: chat broadcast, port 3002 |
| `app/exercises/websocket/page.tsx` | Create | Page shell: header, sticky mini-nav (IntersectionObserver), section layout |
| `app/exercises/websocket/components/TheorySection.tsx` | Create | Static concept cards: WS vs HTTP, handshake, frames |
| `app/exercises/websocket/components/RawApiSection.tsx` | Create | Live demo: connect/send/disconnect, readyState badge, event log |
| `app/exercises/websocket/components/BackendSection.tsx` | Create | Echo demo against ws-server.js, side-by-side client+server code |
| `app/exercises/websocket/components/ReconnectSection.tsx` | Create | Exponential backoff reconnect demo with visual timeline |
| `app/exercises/websocket/components/BinanceSection.tsx` | Create | Live BTC/USDT price feed from Binance public WS |
| `app/exercises/websocket/components/useWebSocket.ts` | Create | Reusable React hook: connect/disconnect/reconnect/messages |
| `app/exercises/websocket/components/HookSection.tsx` | Create | Hook source display + usage example + raw-vs-hook comparison |
| `app/exercises/websocket/components/ChallengeSection.tsx` | Create | Mini chat room against ws-server.js |
| `app/exercises/websocket/components/SocketIOSection.tsx` | Create | Socket.io chat + comparison table vs raw WS |
| `app/components/Sidebar.tsx` | Modify | Add WebSocket nav item under Exercises group |

---

## Task 1: Install dependencies and add server scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
pnpm add socket.io-client
pnpm add -D ws socket.io @types/ws
```

Expected output: packages added, no errors.

- [ ] **Step 2: Add server start scripts to `package.json`**

Add inside the `"scripts"` object:

```json
"ws": "node server/ws-server.js",
"ws:io": "node server/socketio-server.js"
```

Final `scripts` block:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "ws": "node server/ws-server.js",
  "ws:io": "node server/socketio-server.js"
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add ws, socket.io packages and server start scripts"
```

---

## Task 2: Build `server/ws-server.js`

**Files:**
- Create: `server/ws-server.js`

- [ ] **Step 1: Create the file**

```js
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
```

- [ ] **Step 2: Verify it starts**

```bash
pnpm ws
```

Expected output: `ws-server running on ws://localhost:3001`

Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add server/ws-server.js
git commit -m "feat: add raw WebSocket server (port 3001)"
```

---

## Task 3: Build `server/socketio-server.js`

**Files:**
- Create: `server/socketio-server.js`

- [ ] **Step 1: Create the file**

```js
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
```

- [ ] **Step 2: Verify it starts**

```bash
pnpm ws:io
```

Expected output: `socket.io server running on http://localhost:3002`

Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add server/socketio-server.js
git commit -m "feat: add Socket.io server (port 3002)"
```

---

## Task 4: Build page shell `app/exercises/websocket/page.tsx`

**Files:**
- Create: `app/exercises/websocket/page.tsx`

This is the layout shell. It renders the sticky mini-nav and imports all 8 section components as stubs (we'll fill them in subsequent tasks). The IntersectionObserver watches each section's `id` and highlights the matching nav item.

- [ ] **Step 1: Create the directories**

```bash
mkdir -p app/exercises/websocket/components
```

- [ ] **Step 2: Create stub section components** (so the page compiles immediately)

Create `app/exercises/websocket/components/TheorySection.tsx`:
```tsx
export function TheorySection() {
  return <section id="theory" className="mb-16 scroll-mt-4"><p className="text-gray-400 text-sm">Theory — coming soon</p></section>;
}
```

Create `app/exercises/websocket/components/RawApiSection.tsx`:
```tsx
export function RawApiSection() {
  return <section id="raw-api" className="mb-16 scroll-mt-4"><p className="text-gray-400 text-sm">Raw API — coming soon</p></section>;
}
```

Create `app/exercises/websocket/components/BackendSection.tsx`:
```tsx
export function BackendSection() {
  return <section id="backend" className="mb-16 scroll-mt-4"><p className="text-gray-400 text-sm">Backend — coming soon</p></section>;
}
```

Create `app/exercises/websocket/components/ReconnectSection.tsx`:
```tsx
export function ReconnectSection() {
  return <section id="reconnect" className="mb-16 scroll-mt-4"><p className="text-gray-400 text-sm">Reconnection — coming soon</p></section>;
}
```

Create `app/exercises/websocket/components/BinanceSection.tsx`:
```tsx
export function BinanceSection() {
  return <section id="binance" className="mb-16 scroll-mt-4"><p className="text-gray-400 text-sm">Binance — coming soon</p></section>;
}
```

Create `app/exercises/websocket/components/HookSection.tsx`:
```tsx
export function HookSection() {
  return <section id="hook" className="mb-16 scroll-mt-4"><p className="text-gray-400 text-sm">Hook — coming soon</p></section>;
}
```

Create `app/exercises/websocket/components/ChallengeSection.tsx`:
```tsx
export function ChallengeSection() {
  return <section id="challenge" className="mb-16 scroll-mt-4"><p className="text-gray-400 text-sm">Challenge — coming soon</p></section>;
}
```

Create `app/exercises/websocket/components/SocketIOSection.tsx`:
```tsx
export function SocketIOSection() {
  return <section id="socketio" className="mb-16 scroll-mt-4"><p className="text-gray-400 text-sm">Socket.io — coming soon</p></section>;
}
```

- [ ] **Step 3: Create `app/exercises/websocket/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { TheorySection } from "./components/TheorySection";
import { RawApiSection } from "./components/RawApiSection";
import { BackendSection } from "./components/BackendSection";
import { ReconnectSection } from "./components/ReconnectSection";
import { BinanceSection } from "./components/BinanceSection";
import { HookSection } from "./components/HookSection";
import { ChallengeSection } from "./components/ChallengeSection";
import { SocketIOSection } from "./components/SocketIOSection";

const NAV_SECTIONS = [
  { id: "theory",    label: "§1 Theory" },
  { id: "raw-api",   label: "§2 Raw API" },
  { id: "backend",   label: "§3 Backend" },
  { id: "reconnect", label: "§4 Reconnection" },
  { id: "binance",   label: "§5 Binance Feed" },
  { id: "hook",      label: "§6 useWebSocket" },
  { id: "challenge", label: "§7 Challenge" },
  { id: "socketio",  label: "§8 Socket.io" },
];

export default function WebSocketPage() {
  const [activeId, setActiveId] = useState("theory");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Exercises
        </p>
        <h1 className="text-2xl font-bold text-gray-900">WebSocket</h1>
        <p className="text-sm text-gray-500 mt-1">
          From theory to real-time apps — raw API, reconnection, live feeds, and Socket.io
        </p>
      </div>

      {/* Two-zone layout */}
      <div className="flex gap-8 items-start">
        {/* Sticky mini-nav */}
        <nav className="w-44 shrink-0 sticky top-8">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-2">
            Sections
          </p>
          <ul className="space-y-0.5">
            {NAV_SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSection(id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-all ${
                    activeId === id
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Scrollable content */}
        <div className="flex-1 min-w-0">
          <TheorySection />
          <RawApiSection />
          <BackendSection />
          <ReconnectSection />
          <BinanceSection />
          <HookSection />
          <ChallengeSection />
          <SocketIOSection />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify the page loads**

```bash
pnpm dev
```

Open `http://localhost:3000/exercises/websocket`. You should see the header, the mini-nav on the left, and 8 "coming soon" stubs on the right.

- [ ] **Step 5: Commit**

```bash
git add app/exercises/websocket/
git commit -m "feat: add websocket page shell with mini-nav and section stubs"
```

---

## Task 5: `TheorySection.tsx`

**Files:**
- Modify: `app/exercises/websocket/components/TheorySection.tsx`

- [ ] **Step 1: Replace stub with full implementation**

```tsx
export function TheorySection() {
  return (
    <section id="theory" className="mb-16 scroll-mt-4">
      <SectionHeader
        badge="§1"
        title="Theory"
        subtitle="How WebSocket works under the hood"
      />

      {/* WS vs HTTP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <ConceptCard color="blue" title="HTTP (Request-Response)">
          <ul className="space-y-1 text-xs text-gray-500">
            <li>▸ Client always initiates</li>
            <li>▸ One request → one response → connection closes</li>
            <li>▸ High overhead for real-time (polling needed)</li>
            <li>▸ Half-duplex: one direction at a time</li>
          </ul>
        </ConceptCard>
        <ConceptCard color="emerald" title="WebSocket (Persistent)">
          <ul className="space-y-1 text-xs text-gray-500">
            <li>▸ Single connection stays open</li>
            <li>▸ Either side can send at any time</li>
            <li>▸ Low overhead — no headers after handshake</li>
            <li>▸ Full-duplex: simultaneous both directions</li>
          </ul>
        </ConceptCard>
      </div>

      {/* Handshake */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Handshake — HTTP → WebSocket upgrade
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Client request</p>
            <pre className="text-[11px] font-mono bg-gray-50 rounded-lg p-3 text-gray-600 leading-relaxed">{`GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZQ==
Sec-WebSocket-Version: 13`}</pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Server response</p>
            <pre className="text-[11px] font-mono bg-gray-50 rounded-lg p-3 text-gray-600 leading-relaxed">{`HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`}</pre>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          After <code className="bg-gray-100 px-1 rounded font-mono">101</code>, the TCP connection is handed off to the WebSocket protocol. No more HTTP.
        </p>
      </div>

      {/* Frame types */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Frame types
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { type: "Text", desc: "UTF-8 string data. Most common — JSON messages use this.", color: "bg-blue-50 border-blue-200 text-blue-700" },
            { type: "Binary", desc: "Raw bytes. Used for images, audio, protobuf.", color: "bg-violet-50 border-violet-200 text-violet-700" },
            { type: "Ping / Pong", desc: "Heartbeat. Server pings, client must pong (browser does this automatically).", color: "bg-amber-50 border-amber-200 text-amber-700" },
            { type: "Close", desc: "Graceful shutdown. Either side sends a close frame with an optional status code.", color: "bg-rose-50 border-rose-200 text-rose-700" },
          ].map(({ type, desc, color }) => (
            <div key={type} className={`p-3 rounded-xl border text-xs ${color}`}>
              <p className="font-semibold mb-1">{type}</p>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key properties */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Key properties
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Protocol</p>
            <p className="text-gray-500 leading-relaxed">
              <code className="bg-gray-100 px-1 rounded font-mono">ws://</code> (plain) or{" "}
              <code className="bg-gray-100 px-1 rounded font-mono">wss://</code> (TLS). Always use{" "}
              <code className="bg-gray-100 px-1 rounded font-mono">wss://</code> in production.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Use cases</p>
            <p className="text-gray-500 leading-relaxed">
              Chat, live prices, multiplayer games, collaborative editing, real-time dashboards, notifications.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Not ideal for</p>
            <p className="text-gray-500 leading-relaxed">
              Simple request/response (use REST). One-way server push (use SSE). File uploads (use HTTP).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared helpers (local to this file) ─────────────────────────────────────

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
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

function ConceptCard({ color, title, children }: { color: "blue" | "emerald"; title: string; children: React.ReactNode }) {
  const colors = {
    blue: "border-blue-200 bg-blue-50/40",
    emerald: "border-emerald-200 bg-emerald-50/40",
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <p className="text-xs font-semibold text-gray-700 mb-2">{title}</p>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/exercises/websocket`. The Theory section should show concept cards, the handshake request/response, frame types grid, and key properties.

- [ ] **Step 3: Commit**

```bash
git add app/exercises/websocket/components/TheorySection.tsx
git commit -m "feat: add Theory section (§1) to websocket page"
```

---

## Task 6: `RawApiSection.tsx`

**Files:**
- Modify: `app/exercises/websocket/components/RawApiSection.tsx`

- [ ] **Step 1: Replace stub with full implementation**

```tsx
"use client";

import { useState, useRef, useCallback } from "react";

type EventType = "open" | "message" | "error" | "close";

interface LogEntry {
  id: number;
  time: string;
  event: EventType;
  data?: string;
}

const READY_STATE: Record<number, { label: string; cls: string }> = {
  0: { label: "CONNECTING", cls: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  1: { label: "OPEN",       cls: "text-green-700 bg-green-50 border-green-200" },
  2: { label: "CLOSING",    cls: "text-orange-700 bg-orange-50 border-orange-200" },
  3: { label: "CLOSED",     cls: "text-gray-500 bg-gray-50 border-gray-200" },
};

const EVENT_COLORS: Record<EventType, string> = {
  open:    "text-green-600",
  message: "text-blue-600",
  error:   "text-red-500",
  close:   "text-gray-400",
};

const CODE = `const ws = new WebSocket("ws://localhost:3001");

// readyState: 0=CONNECTING 1=OPEN 2=CLOSING 3=CLOSED
console.log(ws.readyState); // 0

ws.onopen    = ()  => console.log("connected");
ws.onmessage = (e) => console.log("received:", e.data);
ws.onerror   = ()  => console.log("error");
ws.onclose   = ()  => console.log("closed");

ws.send(JSON.stringify({ type: "echo", payload: "hello" }));
ws.close(); // graceful close`;

export function RawApiSection() {
  const [readyState, setReadyState] = useState(3);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [input, setInput] = useState("");
  const [serverHint, setServerHint] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const idRef = useRef(0);

  function addLog(event: EventType, data?: string) {
    const time = new Date().toLocaleTimeString("en", { hour12: false });
    setLog((prev) => [...prev.slice(-49), { id: idRef.current++, time, event, data }]);
  }

  const connect = useCallback(() => {
    if (wsRef.current) return;
    setServerHint(false);
    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;
    setReadyState(0);
    ws.onopen    = () => { setReadyState(1); addLog("open"); };
    ws.onmessage = (e) => { addLog("message", e.data); };
    ws.onerror   = () => { addLog("error"); setServerHint(true); };
    ws.onclose   = () => { setReadyState(3); addLog("close"); wsRef.current = null; };
  }, []);

  const disconnect = useCallback(() => {
    if (!wsRef.current) return;
    setReadyState(2);
    wsRef.current.close();
  }, []);

  const send = useCallback(() => {
    if (wsRef.current?.readyState !== 1 || !input.trim()) return;
    wsRef.current.send(JSON.stringify({ type: "echo", payload: input.trim() }));
    setInput("");
  }, [input]);

  const state = READY_STATE[readyState] ?? READY_STATE[3];

  return (
    <section id="raw-api" className="mb-16 scroll-mt-4">
      <SectionHeader badge="§2" title="Raw Browser API" subtitle="The native WebSocket API — events, readyState, send, close" />

      {/* Concept */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Constructor</p>
            <p className="text-gray-500"><code className="bg-gray-100 px-1 rounded font-mono">new WebSocket(url)</code> — starts connection immediately. No explicit open call needed.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">4 event handlers</p>
            <p className="text-gray-500"><code className="font-mono bg-gray-100 px-1 rounded">onopen</code>, <code className="font-mono bg-gray-100 px-1 rounded">onmessage</code>, <code className="font-mono bg-gray-100 px-1 rounded">onerror</code>, <code className="font-mono bg-gray-100 px-1 rounded">onclose</code>. All async — assign before connection opens.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">readyState</p>
            <p className="text-gray-500">0 CONNECTING → 1 OPEN → 2 CLOSING → 3 CLOSED. Check before calling <code className="font-mono bg-gray-100 px-1 rounded">send()</code>.</p>
          </div>
        </div>
      </div>

      {/* Demo */}
      <div className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Controls row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${state.cls}`}>
            {state.label}
          </span>
          <button
            onClick={connect}
            disabled={readyState !== 3}
            className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Connect
          </button>
          <button
            onClick={disconnect}
            disabled={readyState !== 1}
            className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Disconnect
          </button>
          {serverHint && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Run <code className="font-mono">pnpm ws</code> first
            </span>
          )}
        </div>

        {/* Send row */}
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message and send…"
            disabled={readyState !== 1}
            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
          />
          <button
            onClick={send}
            disabled={readyState !== 1}
            className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Send
          </button>
        </div>

        {/* Event log */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Event log</span>
            <button onClick={() => setLog([])} className="text-[10px] text-gray-400 hover:text-gray-600">clear</button>
          </div>
          <div className="max-h-48 overflow-y-auto font-mono text-[11px] divide-y divide-gray-50">
            {log.length === 0 ? (
              <p className="text-gray-300 text-center py-6">No events yet — click Connect</p>
            ) : (
              [...log].reverse().map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 px-3 py-1.5">
                  <span className="text-gray-300 shrink-0">{entry.time}</span>
                  <span className={`font-semibold shrink-0 w-16 ${EVENT_COLORS[entry.event]}`}>{entry.event}</span>
                  {entry.data && <span className="text-gray-500 truncate">{entry.data}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Code */}
      <CodeBlock filename="raw-websocket.ts" code={CODE} />
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
```

- [ ] **Step 2: Verify with server running**

```bash
# Terminal 1
pnpm ws
# Terminal 2
pnpm dev
```

Open `http://localhost:3000/exercises/websocket`. Scroll to §2. Click Connect → status badge turns green. Type a message → send → see echo appear in log. Click Disconnect → status turns CLOSED.

- [ ] **Step 3: Verify server hint (without server)**

Stop `pnpm ws`. Refresh page, click Connect → within 1s should see "Run `pnpm ws` first" hint.

- [ ] **Step 4: Commit**

```bash
git add app/exercises/websocket/components/RawApiSection.tsx
git commit -m "feat: add Raw API section (§2) with live connect/send/disconnect demo"
```

---

## Task 7: `BackendSection.tsx`

**Files:**
- Modify: `app/exercises/websocket/components/BackendSection.tsx`

- [ ] **Step 1: Replace stub with full implementation**

```tsx
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
```

- [ ] **Step 2: Verify with server running**

Start `pnpm ws`. Connect in §3 → verify you see your clientId and client count. Send messages → verify echo appears in message list.

- [ ] **Step 3: Commit**

```bash
git add app/exercises/websocket/components/BackendSection.tsx
git commit -m "feat: add Backend section (§3) with echo demo and side-by-side code"
```

---

## Task 8: `ReconnectSection.tsx`

**Files:**
- Modify: `app/exercises/websocket/components/ReconnectSection.tsx`

- [ ] **Step 1: Replace stub with full implementation**

```tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Status = "idle" | "connecting" | "open" | "reconnecting" | "stopped";

interface AttemptEntry {
  n: number;
  delay: number;
  result: "pending" | "success" | "failed";
}

const RECONNECT_CODE = `function createReconnectingWS(url: string) {
  let ws: WebSocket | null = null;
  let attempt = 0;
  let shouldReconnect = true;

  function connect() {
    ws = new WebSocket(url);

    ws.onopen = () => {
      attempt = 0; // reset on success
    };

    ws.onclose = () => {
      if (!shouldReconnect) return;
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s (max)
      const delay = Math.min(1000 * 2 ** attempt, 16_000);
      attempt++;
      setTimeout(connect, delay);
    };
  }

  function stop() {
    shouldReconnect = false;
    ws?.close();
  }

  connect();
  return { stop };
}`;

export function ReconnectSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [attempts, setAttempts] = useState<AttemptEntry[]>([]);
  const [countdown, setCountdown] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const attemptCountRef = useRef(0);
  const shouldReconnectRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }
    if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null; }
  };

  const connect = useCallback(() => {
    if (wsRef.current) return;
    setStatus("connecting");
    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;

    ws.onopen = () => {
      if (!shouldReconnectRef.current) return;
      attemptCountRef.current = 0;
      clearTimers();
      setCountdown(0);
      setStatus("open");
      setAttempts((prev) =>
        prev.map((a) => (a.result === "pending" ? { ...a, result: "success" as const } : a))
      );
    };

    ws.onerror = () => {
      setAttempts((prev) =>
        prev.map((a) => (a.result === "pending" ? { ...a, result: "failed" as const } : a))
      );
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (!shouldReconnectRef.current) {
        setStatus("stopped");
        return;
      }
      const delay = Math.min(1000 * 2 ** attemptCountRef.current, 16000);
      const n = ++attemptCountRef.current;
      setStatus("reconnecting");
      setCountdown(delay / 1000);
      setAttempts((prev) => [...prev, { n, delay, result: "pending" as const }]);

      countdownIntervalRef.current = setInterval(() => {
        setCountdown((c) => Math.max(0, +(c - 0.1).toFixed(1)));
      }, 100);

      reconnectTimerRef.current = setTimeout(() => {
        clearInterval(countdownIntervalRef.current!);
        connect();
      }, delay);
    };
  }, []);

  const startDemo = () => {
    shouldReconnectRef.current = true;
    attemptCountRef.current = 0;
    setAttempts([]);
    setStatus("idle");
    connect();
  };

  const simulateDisconnect = () => {
    wsRef.current?.close();
  };

  const stop = () => {
    shouldReconnectRef.current = false;
    clearTimers();
    wsRef.current?.close();
    if (!wsRef.current) setStatus("stopped");
  };

  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      clearTimers();
      wsRef.current?.close();
    };
  }, []);

  return (
    <section id="reconnect" className="mb-16 scroll-mt-4">
      <SectionHeader badge="§4" title="Reconnection" subtitle="Exponential backoff — handle drops gracefully" />

      {/* Concept */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Why reconnect?</p>
            <p className="text-gray-500">Networks are unreliable. Servers restart. Mobile devices sleep. Production WebSocket clients must handle disconnects without user interaction.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Exponential backoff</p>
            <p className="text-gray-500">Wait 1s → 2s → 4s → 8s → 16s between attempts. Prevents hammering the server. Reset attempt count on successful reconnect.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Stop condition</p>
            <p className="text-gray-500">Always provide a way to stop reconnecting — unmount, explicit disconnect, max attempts. Leaking reconnect loops is a memory leak.</p>
          </div>
        </div>
      </div>

      {/* Demo */}
      <div className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Status + controls */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <StatusBadge status={status} countdown={countdown} />
          <div className="flex gap-2 ml-auto">
            {status === "idle" || status === "stopped" ? (
              <button onClick={startDemo} className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Start Demo
              </button>
            ) : (
              <>
                <button
                  onClick={simulateDisconnect}
                  disabled={status !== "open"}
                  className="px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg transition-colors"
                >
                  Simulate Disconnect
                </button>
                <button onClick={stop} className="px-3 py-1.5 text-xs font-medium bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        {/* Attempt timeline */}
        {attempts.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Reconnect timeline</span>
            </div>
            <div className="divide-y divide-gray-50 max-h-40 overflow-y-auto">
              {attempts.map((a) => (
                <div key={a.n} className="flex items-center gap-3 px-3 py-2 text-xs">
                  <span className="text-gray-400 w-16 shrink-0">Attempt {a.n}</span>
                  <span className="text-gray-400">after {a.delay / 1000}s</span>
                  <span className={`ml-auto font-semibold ${
                    a.result === "success" ? "text-green-600" :
                    a.result === "failed"  ? "text-red-500"   : "text-amber-500"
                  }`}>
                    {a.result === "pending" ? "waiting…" : a.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(status === "idle" || status === "stopped") && attempts.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            Click "Start Demo" to connect, then "Simulate Disconnect" to trigger backoff
          </p>
        )}
      </div>

      <CodeBlock filename="reconnect.ts" code={RECONNECT_CODE} />
    </section>
  );
}

function StatusBadge({ status, countdown }: { status: Status; countdown: number }) {
  const map: Record<Status, { label: string; cls: string }> = {
    idle:         { label: "IDLE",         cls: "text-gray-500 bg-gray-50 border-gray-200" },
    connecting:   { label: "CONNECTING",   cls: "text-yellow-700 bg-yellow-50 border-yellow-200" },
    open:         { label: "OPEN",         cls: "text-green-700 bg-green-50 border-green-200" },
    reconnecting: { label: `RECONNECTING (${countdown}s)`, cls: "text-amber-700 bg-amber-50 border-amber-200" },
    stopped:      { label: "STOPPED",      cls: "text-gray-400 bg-gray-50 border-gray-200" },
  };
  const { label, cls } = map[status];
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>;
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
```

- [ ] **Step 2: Verify**

Start `pnpm ws` and `pnpm dev`. Open §4. Click "Start Demo" → status turns OPEN. Click "Simulate Disconnect" → status turns RECONNECTING with countdown → after 1s reconnects automatically → status back to OPEN. Attempt timeline shows attempt 1 → success.

- [ ] **Step 3: Commit**

```bash
git add app/exercises/websocket/components/ReconnectSection.tsx
git commit -m "feat: add Reconnection section (§4) with exponential backoff demo"
```

---

## Task 9: `BinanceSection.tsx`

**Files:**
- Modify: `app/exercises/websocket/components/BinanceSection.tsx`

- [ ] **Step 1: Replace stub with full implementation**

```tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Trade {
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

const CODE = `const ws = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcusdt@trade"
);

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  // data.p = price (string)
  // data.q = quantity (string)
  // data.T = trade time (ms timestamp)
  // data.m = true if buyer is market maker (sell)
  console.log(\`BTC/USDT \${data.p} qty:\${data.q}\`);
};`;

export function BinanceSection() {
  const [running, setRunning] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [msgCount, setMsgCount] = useState(0);
  const [msgPerSec, setMsgPerSec] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const countRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgPerSec(countRef.current);
      countRef.current = 0;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const start = useCallback(() => {
    if (wsRef.current) return;
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
    wsRef.current = ws;
    setRunning(true);

    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      const p = parseFloat(d.p);
      const q = parseFloat(d.q);
      setPrevPrice((prev) => prev ?? p);
      setPrice((prev) => { setPrevPrice(prev); return p; });
      setTrade({ price: p, qty: q, time: d.T, isBuyerMaker: d.m });
      setMsgCount((c) => c + 1);
      countRef.current += 1;
    };

    ws.onclose = () => {
      wsRef.current = null;
      setRunning(false);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  const stop = useCallback(() => {
    wsRef.current?.close();
  }, []);

  useEffect(() => () => { wsRef.current?.close(); }, []);

  const priceDir = price !== null && prevPrice !== null
    ? price > prevPrice ? "up" : price < prevPrice ? "down" : "same"
    : "same";

  return (
    <section id="binance" className="mb-16 scroll-mt-4">
      <SectionHeader badge="§5" title="Binance Live Feed" subtitle="Real-world WebSocket — BTC/USDT trade stream (public, no auth)" />

      {/* Concept */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Public streams</p>
            <p className="text-gray-500">Binance exposes market data streams at <code className="bg-gray-100 px-1 rounded font-mono">wss://stream.binance.com:9443/ws/</code>. No API key needed for public data.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Trade stream</p>
            <p className="text-gray-500"><code className="bg-gray-100 px-1 rounded font-mono">btcusdt@trade</code> pushes every single trade as it happens — typically 5–20 messages per second.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">This is your CV</p>
            <p className="text-gray-500">At ONUS Labs you built trading interfaces for 7M+ users on top of exactly this kind of stream. This is what production looks like at the source.</p>
          </div>
        </div>
      </div>

      {/* Live display */}
      <div className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${running ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
            <span className="text-xs text-gray-500">{running ? "Live" : "Stopped"}</span>
          </div>
          {running ? (
            <button onClick={stop} className="ml-auto px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
              Stop
            </button>
          ) : (
            <button onClick={start} className="ml-auto px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Start
            </button>
          )}
        </div>

        {price !== null ? (
          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-bold font-mono transition-colors ${
                priceDir === "up"   ? "text-green-600" :
                priceDir === "down" ? "text-red-500"   : "text-gray-800"
              }`}>
                ${price.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-lg mb-0.5 ${priceDir === "up" ? "text-green-500" : priceDir === "down" ? "text-red-400" : "text-gray-300"}`}>
                {priceDir === "up" ? "▲" : priceDir === "down" ? "▼" : "—"}
              </span>
              <span className="text-xs text-gray-400 mb-1">BTC / USDT</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Qty</p>
                <p className="text-sm font-mono text-gray-700">{trade?.qty.toFixed(5) ?? "—"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Side</p>
                <p className={`text-sm font-semibold ${trade?.isBuyerMaker ? "text-red-500" : "text-green-600"}`}>
                  {trade?.isBuyerMaker ? "SELL" : "BUY"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">msg/s</p>
                <p className="text-sm font-mono text-gray-700">{msgPerSec}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-300 text-right">{msgCount.toLocaleString()} messages received</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-300 text-sm">
            {running ? "Waiting for first trade…" : "Click Start to connect to Binance"}
          </div>
        )}
      </div>

      <CodeBlock filename="binance-stream.ts" code={CODE} />
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
```

- [ ] **Step 2: Verify**

Open §5. Click Start → price appears with live updates, direction arrows, msg/s counter. Click Stop → feed stops.

- [ ] **Step 3: Commit**

```bash
git add app/exercises/websocket/components/BinanceSection.tsx
git commit -m "feat: add Binance live feed section (§5)"
```

---

## Task 10: `useWebSocket.ts` + `HookSection.tsx`

**Files:**
- Create: `app/exercises/websocket/components/useWebSocket.ts`
- Modify: `app/exercises/websocket/components/HookSection.tsx`

- [ ] **Step 1: Create `useWebSocket.ts`**

```ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type WsStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closing"
  | "closed"
  | "reconnecting";

export interface WsMessage {
  id: number;
  data: string;
  timestamp: number;
}

export interface UseWebSocketReturn {
  status: WsStatus;
  messages: WsMessage[];
  send: (data: string) => void;
  connect: () => void;
  disconnect: () => void;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [status, setStatus] = useState<WsStatus>("idle");
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);
  const msgIdRef = useRef(0);
  const shouldReconnectRef = useRef(false);
  const unmountedRef = useRef(false);

  const clearReconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const connect = useCallback(() => {
    if (wsRef.current) return;
    shouldReconnectRef.current = true;
    setStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (unmountedRef.current) return;
      attemptRef.current = 0;
      setStatus("open");
    };

    ws.onmessage = (e) => {
      if (unmountedRef.current) return;
      setMessages((prev) => [
        ...prev.slice(-99),
        { id: msgIdRef.current++, data: e.data, timestamp: Date.now() },
      ]);
    };

    ws.onerror = () => { /* onclose always follows */ };

    ws.onclose = () => {
      if (unmountedRef.current) return;
      wsRef.current = null;

      if (!shouldReconnectRef.current) {
        setStatus("closed");
        return;
      }

      const delay = Math.min(1000 * 2 ** attemptRef.current, 16000);
      attemptRef.current += 1;
      setStatus("reconnecting");

      reconnectTimerRef.current = setTimeout(() => {
        if (!unmountedRef.current && shouldReconnectRef.current) connect();
      }, delay);
    };
  }, [url]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnect();
    if (wsRef.current) {
      setStatus("closing");
      wsRef.current.close();
    } else {
      setStatus("idle");
    }
  }, []);

  const send = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      shouldReconnectRef.current = false;
      clearReconnect();
      wsRef.current?.close();
    };
  }, []);

  return { status, messages, send, connect, disconnect };
}
```

- [ ] **Step 2: Replace `HookSection.tsx` stub with full implementation**

```tsx
"use client";

import { useState } from "react";
import { useWebSocket } from "./useWebSocket";

const HOOK_SOURCE = `export function useWebSocket(url: string) {
  const [status, setStatus] = useState<WsStatus>("idle");
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const attemptRef = useRef(0);
  const shouldReconnectRef = useRef(false);

  const connect = useCallback(() => {
    if (wsRef.current) return;
    shouldReconnectRef.current = true;
    setStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen  = () => { attemptRef.current = 0; setStatus("open"); };
    ws.onerror = () => { /* onclose always follows */ };
    ws.onmessage = (e) => {
      setMessages((prev) => [...prev.slice(-99),
        { id: msgIdRef.current++, data: e.data, timestamp: Date.now() }
      ]);
    };
    ws.onclose = () => {
      wsRef.current = null;
      if (!shouldReconnectRef.current) { setStatus("closed"); return; }
      const delay = Math.min(1000 * 2 ** attemptRef.current, 16_000);
      attemptRef.current++;
      setStatus("reconnecting");
      reconnectTimerRef.current = setTimeout(connect, delay);
    };
  }, [url]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearTimeout(reconnectTimerRef.current);
    wsRef.current ? (setStatus("closing"), wsRef.current.close())
                  : setStatus("idle");
  }, []);

  const send = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) ws.send(data);
  }, []);

  return { status, messages, send, connect, disconnect };
}`;

const RAW_USAGE = `// Without hook — all this in your component:
const [readyState, setReadyState] = useState(3);
const [log, setLog] = useState([]);
const wsRef = useRef(null);
// ... onopen, onmessage, onerror, onclose
// ... reconnect logic
// ... cleanup in useEffect`;

const HOOK_USAGE = `// With hook — one line:
const { status, messages, send, connect, disconnect }
  = useWebSocket("ws://localhost:3001");`;

export function HookSection() {
  const [input, setInput] = useState("");
  const { status, messages, send, connect, disconnect } =
    useWebSocket("ws://localhost:3001");

  const handleSend = () => {
    if (!input.trim()) return;
    send(JSON.stringify({ type: "echo", payload: input.trim() }));
    setInput("");
  };

  const statusColors: Record<string, string> = {
    idle:         "text-gray-400 bg-gray-50 border-gray-200",
    connecting:   "text-yellow-700 bg-yellow-50 border-yellow-200",
    open:         "text-green-700 bg-green-50 border-green-200",
    closing:      "text-orange-700 bg-orange-50 border-orange-200",
    closed:       "text-gray-500 bg-gray-50 border-gray-200",
    reconnecting: "text-amber-700 bg-amber-50 border-amber-200",
  };

  return (
    <section id="hook" className="mb-16 scroll-mt-4">
      <SectionHeader badge="§6" title="useWebSocket Hook" subtitle="Encapsulate all WS logic into a reusable hook" />

      {/* Raw vs Hook comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border-2 border-red-100 overflow-hidden">
          <div className="px-3 py-2 bg-red-50 border-b border-red-100">
            <span className="text-xs font-semibold text-red-600">Without hook</span>
          </div>
          <pre className="text-[11px] font-mono p-3 text-gray-600 bg-white leading-relaxed overflow-x-auto">{RAW_USAGE}</pre>
        </div>
        <div className="rounded-xl border-2 border-green-100 overflow-hidden">
          <div className="px-3 py-2 bg-green-50 border-b border-green-100">
            <span className="text-xs font-semibold text-green-600">With hook</span>
          </div>
          <pre className="text-[11px] font-mono p-3 text-gray-600 bg-white leading-relaxed overflow-x-auto">{HOOK_USAGE}</pre>
        </div>
      </div>

      {/* Live demo using the hook */}
      <div className="mb-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Live demo — this component uses the hook
        </p>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase ${statusColors[status] ?? statusColors.idle}`}>
            {status}
          </span>
          {status === "idle" || status === "closed" ? (
            <button onClick={connect} className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Connect</button>
          ) : (
            <button onClick={disconnect} className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg">Disconnect</button>
          )}
        </div>
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send via hook…"
            disabled={status !== "open"}
            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
          />
          <button
            onClick={handleSend}
            disabled={status !== "open"}
            className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg"
          >
            Send
          </button>
        </div>
        <div className="rounded-xl border border-gray-200 max-h-36 overflow-y-auto divide-y divide-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-300 text-xs text-center py-4">No messages yet</p>
          ) : (
            [...messages].reverse().map((m) => (
              <div key={m.id} className="px-3 py-1.5 text-[11px] font-mono text-gray-500">
                {m.data}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hook source */}
      <CodeBlock filename="useWebSocket.ts" code={HOOK_SOURCE} />
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
```

- [ ] **Step 3: Verify**

Open §6. Connect via hook → status changes. Send message → appears in list. Disconnect → status goes to closed. Reconnect works automatically if you kill the server.

- [ ] **Step 4: Commit**

```bash
git add app/exercises/websocket/components/useWebSocket.ts app/exercises/websocket/components/HookSection.tsx
git commit -m "feat: add useWebSocket hook and Hook section (§6)"
```

---

## Task 11: `ChallengeSection.tsx`

**Files:**
- Modify: `app/exercises/websocket/components/ChallengeSection.tsx`

- [ ] **Step 1: Replace stub with full implementation**

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  id: number;
  username: string;
  text: string;
  timestamp: number;
  isSelf: boolean;
}

export function ChallengeSection() {
  const [phase, setPhase] = useState<"join" | "chat">("join");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [serverHint, setServerHint] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
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
    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;

    ws.onerror = () => setServerHint(true);

    ws.onopen = () => {
      setConnected(true);
      setPhase("chat");
      ws.send(JSON.stringify({ type: "chat", username: usernameRef.current, text: "joined the room" }));
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "chat") {
        addMsg({
          username: msg.username,
          text: msg.text,
          timestamp: msg.timestamp,
          isSelf: msg.username === usernameRef.current,
        });
      } else if (msg.type === "user_count") {
        setUserCount(msg.count);
      } else if (msg.type === "connected") {
        setUserCount(msg.totalClients);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
    };
  }, [username]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || wsRef.current?.readyState !== 1) return;
    wsRef.current.send(
      JSON.stringify({ type: "chat", username: usernameRef.current, text: input.trim() })
    );
    setInput("");
  }, [input]);

  const leave = () => {
    wsRef.current?.close();
    setPhase("join");
    setMessages([]);
    setServerHint(false);
  };

  useEffect(() => () => { wsRef.current?.close(); }, []);

  if (phase === "join") {
    return (
      <section id="challenge" className="mb-16 scroll-mt-4">
        <SectionHeader badge="§7" title="Challenge — Mini Chat Room" subtitle="Connect, pick a username, open two tabs — see real-time sync" />
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 mb-4">
            This chat room runs on your local <code className="bg-gray-100 px-1 rounded font-mono">ws-server.js</code>.
            Open a second browser tab to the same page and join with a different username to see messages sync in real time.
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
              Could not connect. Run <code className="font-mono">pnpm ws</code> in a terminal first.
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="challenge" className="mb-16 scroll-mt-4">
      <SectionHeader badge="§7" title="Challenge — Mini Chat Room" subtitle="Connect, pick a username, open two tabs — see real-time sync" />
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-xs font-semibold text-gray-700">{usernameRef.current}</span>
            <span className="text-xs text-gray-400">· {userCount} online</span>
          </div>
          <button onClick={leave} className="text-xs text-gray-400 hover:text-gray-600">Leave</button>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto px-4 py-3 space-y-2">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.isSelf ? "items-end" : "items-start"}`}>
              <span className="text-[10px] text-gray-400 mb-0.5">
                {m.isSelf ? "You" : m.username} · {new Date(m.timestamp).toLocaleTimeString("en", { hour12: false })}
              </span>
              <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                m.isSelf
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
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
```

- [ ] **Step 2: Verify**

Start `pnpm ws`. Open two browser tabs to `http://localhost:3000/exercises/websocket`. Scroll to §7 in both. Join with different usernames. Send a message in one tab → appears in both tabs. User count badge shows 2.

- [ ] **Step 3: Commit**

```bash
git add app/exercises/websocket/components/ChallengeSection.tsx
git commit -m "feat: add Challenge chat room section (§7)"
```

---

## Task 12: `SocketIOSection.tsx`

**Files:**
- Modify: `app/exercises/websocket/components/SocketIOSection.tsx`

- [ ] **Step 1: Replace stub with full implementation**

```tsx
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
          Socket.io is <strong>not</strong> "better WebSocket" — it's a higher-level abstraction built on top of WebSocket.
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
```

- [ ] **Step 2: Verify**

Start `pnpm ws:io`. Open §8. Join with a username. Send a message. Open second tab, join with different username, confirm real-time sync. Compare the code in §7 vs §8 — notice socket.io removes the manual JSON type dispatching.

- [ ] **Step 3: Commit**

```bash
git add app/exercises/websocket/components/SocketIOSection.tsx
git commit -m "feat: add Socket.io section (§8) with comparison table and live chat"
```

---

## Task 13: Sidebar integration + final wiring

**Files:**
- Modify: `app/components/Sidebar.tsx`

- [ ] **Step 1: Add WebSocket nav item to Sidebar**

In `app/components/Sidebar.tsx`, find the Exercises group array and add the WebSocket item. The exercises items array currently ends with `image-optimization`. Add after it:

```tsx
{
  href: "/exercises/websocket",
  label: "WebSocket",
  icon: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  badge: "New",
},
```

- [ ] **Step 2: Verify**

Open `http://localhost:3000`. The sidebar Exercises group should show "WebSocket" with a "New" badge. Clicking it navigates to `/exercises/websocket`.

- [ ] **Step 3: Verify full page end-to-end**

With `pnpm ws` running:
1. Open `http://localhost:3000/exercises/websocket`
2. Mini-nav on left shows all 8 sections. Scrolling highlights the active one.
3. §1 Theory — concept cards visible, no demo needed.
4. §2 Raw API — connect, send, disconnect works; event log fills.
5. §3 Backend — connect, send echo, see client count and echo reply.
6. §4 Reconnection — start demo, simulate disconnect, watch backoff timeline.
7. §5 Binance — start feed, see live BTC/USDT price with direction arrows.
8. §6 Hook — connect via hook, send message, disconnect.
9. §7 Challenge — join chat, open second tab, confirm real-time sync.

With `pnpm ws:io` running:
10. §8 Socket.io — join chat, works same as §7, compare code panels.

- [ ] **Step 4: Final commit**

```bash
git add app/components/Sidebar.tsx
git commit -m "feat: add WebSocket nav item to sidebar — complete websocket learning route"
```

---

## Summary

| Task | Files | Commit message |
|---|---|---|
| 1 | `package.json` | chore: add ws, socket.io packages |
| 2 | `server/ws-server.js` | feat: add raw WebSocket server |
| 3 | `server/socketio-server.js` | feat: add Socket.io server |
| 4 | `page.tsx` + 8 stubs | feat: add websocket page shell |
| 5 | `TheorySection.tsx` | feat: add Theory section (§1) |
| 6 | `RawApiSection.tsx` | feat: add Raw API section (§2) |
| 7 | `BackendSection.tsx` | feat: add Backend section (§3) |
| 8 | `ReconnectSection.tsx` | feat: add Reconnection section (§4) |
| 9 | `BinanceSection.tsx` | feat: add Binance feed section (§5) |
| 10 | `useWebSocket.ts` + `HookSection.tsx` | feat: add useWebSocket hook and section (§6) |
| 11 | `ChallengeSection.tsx` | feat: add Challenge chat room (§7) |
| 12 | `SocketIOSection.tsx` | feat: add Socket.io section (§8) |
| 13 | `Sidebar.tsx` | feat: add WebSocket nav item to sidebar |

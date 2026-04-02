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

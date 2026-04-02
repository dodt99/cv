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
    if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(data);
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

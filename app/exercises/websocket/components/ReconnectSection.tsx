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

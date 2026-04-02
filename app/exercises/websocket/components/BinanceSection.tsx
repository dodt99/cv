"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Trade {
  price: string;
  qty: string;
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
  const [price, setPrice] = useState<string | null>(null);
  const [prevPrice, setPrevPrice] = useState<string | null>(null);
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
      const p: string = d.p;
      const q: string = d.q;
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
    ? parseFloat(price) > parseFloat(prevPrice) ? "up" : parseFloat(price) < parseFloat(prevPrice) ? "down" : "same"
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
                ${parseFloat(price).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <p className="text-sm font-mono text-gray-700">{trade ? parseFloat(trade.qty).toFixed(5) : "—"}</p>
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

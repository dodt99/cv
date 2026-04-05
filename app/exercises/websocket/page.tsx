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
import { RoomsSection } from "./components/RoomsSection";
import { AuthSection } from "./components/AuthSection";

const NAV_SECTIONS = [
  { id: "theory",      label: "§1 Theory" },
  { id: "raw-api",     label: "§2 Raw API" },
  { id: "backend",     label: "§3 Backend" },
  { id: "reconnect",   label: "§4 Reconnection" },
  { id: "binance",     label: "§5 Binance Feed" },
  { id: "hook",        label: "§6 useWebSocket" },
  { id: "challenge",   label: "§7 Challenge" },
  { id: "socketio",    label: "§8 Socket.io" },
  { id: "rooms",       label: "§9 Rooms & NS" },
  { id: "ack",         label: "§10 Acknowledgements" },
  { id: "presence",    label: "§11 Typing / Presence" },
  { id: "auth",        label: "§12 Auth Middleware" },
  { id: "volatile",    label: "§13 Volatile Events" },
  { id: "recovery",    label: "§14 State Recovery" },
  { id: "ratelimit",   label: "§15 Rate Limiting" },
  { id: "redis",       label: "§16 Redis Adapter" },
  { id: "binary",      label: "§17 Binary Data" },
  { id: "parser",      label: "§18 Custom Parsers" },
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
          <RoomsSection />
          <ComingSoon id="ack"       badge="§10" title="Acknowledgements"           desc="Request-reply pattern with timeout handling for reliable delivery." />
          <ComingSoon id="presence"  badge="§11" title="Typing Indicators & Presence" desc="Debounced typing events, broadcast vs emit, online/offline state." />
          <AuthSection />
          <ComingSoon id="volatile"  badge="§13" title="Volatile Events"            desc="socket.volatile.emit() — when to drop events vs guarantee delivery." />
          <ComingSoon id="recovery"  badge="§14" title="Connection State Recovery"  desc="Socket.io v4.6+ buffering and replaying missed events on reconnect." />
          <ComingSoon id="ratelimit" badge="§15" title="Rate Limiting & Backpressure" desc="Defending against flooding; detecting and handling slow consumers." />
          <ComingSoon id="redis"     badge="§16" title="Redis Adapter"              desc="Scaling to multiple Node processes with @socket.io/redis-adapter." />
          <ComingSoon id="binary"    badge="§17" title="Binary Data"               desc="Sending ArrayBuffers and Blobs instead of JSON for performance." />
          <ComingSoon id="parser"    badge="§18" title="Custom Parsers (msgpack)"   desc="Replacing JSON with msgpack for smaller payloads and faster parsing." />
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ id, badge, title, desc }: { id: string; badge: string; title: string; desc: string }) {
  return (
    <section id={id} className="mb-16 scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{badge}</span>
          <h2 className="text-lg font-bold text-gray-400">{title}</h2>
        </div>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
      <div className="flex items-center gap-3 p-5 rounded-xl border border-dashed border-gray-200 bg-gray-50">
        <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
        <p className="text-xs text-gray-400">Not implemented yet — coming soon.</p>
      </div>
    </section>
  );
}

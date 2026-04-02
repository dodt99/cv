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

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

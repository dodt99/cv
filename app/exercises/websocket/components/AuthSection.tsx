"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// ── Constants ──────────────────────────────────────────────────────────────────
const SERVER_CODE = `const VALID_TOKENS = {
  "token-alice": { id: 1, username: "alice", role: "user" },
  "token-bob":   { id: 2, username: "bob",   role: "admin" },
};

// Middleware runs before "connection" fires
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token)
    return next(new Error("No token provided"));

  const user = VALID_TOKENS[token];
  if (!user)
    return next(new Error("Invalid token"));

  socket.data.user = user; // ← server-populated, client can't fake this
  next();
});

io.on("connection", (socket) => {
  // Only reaches here if middleware called next() without an error
  socket.emit("authenticated", socket.data.user);
});`;

const CLIENT_CODE = `import { io } from "socket.io-client";

// Auth data travels in the handshake, not as an event
const socket = io("http://localhost:3004", {
  auth: { token: "token-alice" },
});

socket.on("authenticated", (user) => {
  console.log("Welcome,", user.username, "(", user.role, ")");
});

socket.on("connect_error", (err) => {
  // err.message === "No token provided" | "Invalid token"
  console.error("Rejected:", err.message);
});`;

const SCENARIOS = [
  {
    label: "No token",
    token: undefined,
    color: "gray",
  },
  {
    label: "Bad token",
    token: "fake-xyz-123",
    color: "red",
  },
  {
    label: "Valid: alice",
    token: "token-alice",
    color: "green",
  },
  {
    label: "Valid: bob",
    token: "token-bob",
    color: "green",
  },
] as const;

// ── Demo ───────────────────────────────────────────────────────────────────────
function AuthDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [serverDown, setServerDown] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<string | null>(null);

  useEffect(() => () => { socketRef.current?.disconnect(); }, []);

  const appendLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-49), line]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const tryScenario = useCallback((label: string, token: string | undefined) => {
    if (loadingRef.current) return;
    loadingRef.current = label;
    setLoading(label);
    setServerDown(false);

    // Disconnect any previous attempt
    socketRef.current?.disconnect();
    socketRef.current = null;

    const authPayload = token !== undefined ? { token } : {};
    const socket = io("http://localhost:3004", {
      auth: authPayload,
      transports: ["websocket"],
      reconnection: false,
    });
    socketRef.current = socket;

    appendLog(`→ Attempting: "${label}"…`);

    socket.on("authenticated", (user: { username: string; role: string }) => {
      appendLog(`✓ Authenticated — ${user.username} (role: ${user.role})`);
      loadingRef.current = null;
      setLoading(null);
    });

    socket.on("connect_error", (err: Error) => {
      // Distinguish auth rejections from server-not-running
      const isAuthError =
        err.message === "No token provided" || err.message === "Invalid token";
      if (isAuthError) {
        appendLog(`✗ Rejected — ${err.message}`);
      } else {
        appendLog(`✗ Could not reach server — is pnpm ws:auth running?`);
        setServerDown(true);
      }
      loadingRef.current = null;
      setLoading(null);
      socket.disconnect();
    });
  }, [appendLog]);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Scenario buttons */}
      <div className="flex gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 flex-wrap">
        {SCENARIOS.map(({ label, token, color }) => (
          <button
            key={label}
            onClick={() => tryScenario(label, token)}
            disabled={!!loading}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
              color === "green"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : color === "red"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {loading === label ? "…" : label}
          </button>
        ))}
        {log.length > 0 && (
          <button
            onClick={() => setLog([])}
            className="ml-auto text-[10px] text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Terminal log */}
      <div className="h-36 overflow-y-auto px-4 py-3 bg-gray-950 space-y-1 font-mono">
        {log.length === 0 ? (
          <p className="text-[11px] text-gray-600">
            Click a scenario to attempt a connection…
          </p>
        ) : (
          log.map((line, i) => (
            <p
              key={i}
              className={`text-[11px] leading-relaxed ${
                line.startsWith("✓")
                  ? "text-green-400"
                  : line.startsWith("✗")
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {line}
            </p>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {serverDown && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200">
          <p className="text-xs text-amber-700">
            Server not running. Start it with{" "}
            <code className="bg-amber-100 px-1 rounded font-mono">pnpm ws:auth</code>{" "}
            in a terminal.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Shared UI helpers ──────────────────────────────────────────────────────────
function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
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
      <pre className="text-[12px] leading-relaxed font-mono bg-white p-4 overflow-x-auto text-gray-700">
        {code}
      </pre>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function AuthSection() {
  return (
    <section id="auth" className="mb-16 scroll-mt-4">
      <SectionHeader
        badge="§12"
        title="Auth Middleware"
        subtitle="Validate tokens at the handshake — before the connection event fires."
      />

      {/* Theory */}
      <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-xs font-semibold text-slate-700 mb-2">
          Middleware position in the connection lifecycle
        </p>
        <pre className="text-[11px] font-mono text-slate-600 leading-relaxed mb-4">{`Client handshake
  └─▶ io.use() middleware   ← runs here, before connection fires
        ├─ next(new Error)  → socket rejected, never connects
        └─ next()           → socket accepted
              └─▶ io.on("connection", ...)  ← socket.data.user is guaranteed`}</pre>
        <p className="text-xs font-semibold text-slate-700 mb-2">
          Without vs With middleware
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 text-slate-500 font-semibold w-1/3">Aspect</th>
              <th className="text-left py-1.5 text-red-500 font-semibold w-1/3">Without middleware</th>
              <th className="text-left py-1.5 text-green-600 font-semibold w-1/3">With middleware</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ["Who connects?", "Any socket", "Only sockets with valid token"],
              ["Username source", "Client-supplied (fakeable)", "Server-populated via socket.data"],
              ["Rejection point", "After connection (or never)", "Before connection event fires"],
              ["connection handler", "Must re-validate every event", "User guaranteed on socket.data"],
            ].map(([aspect, without, with_]) => (
              <tr key={aspect}>
                <td className="py-1.5 text-slate-600 font-medium">{aspect}</td>
                <td className="py-1.5 text-red-600">{without}</td>
                <td className="py-1.5 text-green-700">{with_}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key insight */}
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs font-semibold text-amber-800 mb-1">Key insight</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          The client passes <code className="bg-amber-100 px-1 rounded font-mono">auth</code> data
          during the WebSocket handshake — not as a regular event — via{" "}
          <code className="bg-amber-100 px-1 rounded font-mono">
            io(url, {"{ auth: { token } }"})
          </code>.
          The server middleware intercepts this before the{" "}
          <code className="bg-amber-100 px-1 rounded font-mono">connection</code> event fires.
          A call to <code className="bg-amber-100 px-1 rounded font-mono">next(new Error(...))</code>{" "}
          prevents the socket from ever connecting — the client receives a{" "}
          <code className="bg-amber-100 px-1 rounded font-mono">connect_error</code> with the error
          message. Because <code className="bg-amber-100 px-1 rounded font-mono">socket.data.user</code>{" "}
          is set server-side, clients cannot fake their identity.
        </p>
      </div>

      {/* Demo */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          Demo — try all four scenarios
        </p>
        <AuthDemo />
      </div>

      {/* Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CodeBlock filename="socketio-auth.js" code={SERVER_CODE} />
        <CodeBlock filename="client.ts" code={CLIENT_CODE} />
      </div>
    </section>
  );
}

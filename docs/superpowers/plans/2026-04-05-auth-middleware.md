# §12 Auth Middleware Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement §12 "Auth Middleware" in the websocket exercise page — a Socket.io server with `io.use()` middleware that validates tokens at the handshake, and an interactive component with four preset scenarios showing accept/reject outcomes.

**Architecture:** A new server (`server/socketio-auth.js`) runs on port 3004 with hardcoded valid tokens and `io.use()` middleware. A new `AuthSection.tsx` component renders theory, a key insight callout, a four-button demo with a terminal-style log, and two code blocks. The existing page.tsx swaps the `ComingSoon` placeholder for the real component.

**Tech Stack:** Node.js + Socket.io v4 (server), React 19 + socket.io-client v4 (client), Tailwind CSS v4

---

### Task 1: Auth server

**Files:**
- Create: `server/socketio-auth.js`
- Modify: `package.json`

- [ ] **Step 1: Create `server/socketio-auth.js`**

```js
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

const VALID_TOKENS = {
  "token-alice": { id: 1, username: "alice", role: "user" },
  "token-bob":   { id: 2, username: "bob",   role: "admin" },
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));
  const user = VALID_TOKENS[token];
  if (!user) return next(new Error("Invalid token"));
  socket.data.user = user;
  next();
});

io.on("connection", (socket) => {
  socket.emit("authenticated", socket.data.user);
  // Demo only — disconnect after confirming auth so the client stays stateless
  socket.disconnect();
});

httpServer.listen(3004, () => {
  console.log("Socket.io auth server running on :3004");
  console.log("  Valid tokens: token-alice, token-bob");
});
```

- [ ] **Step 2: Add `ws:auth` script to `package.json`**

In `package.json`, inside the `"scripts"` object, add after the existing `ws:rooms` line:

```json
"ws:auth": "node server/socketio-auth.js"
```

- [ ] **Step 3: Verify the server starts**

```bash
node server/socketio-auth.js
```

Expected output:
```
Socket.io auth server running on :3004
  Valid tokens: token-alice, token-bob
```

Stop it with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add server/socketio-auth.js package.json
git commit -m "feat: add Socket.io auth middleware server on :3004"
```

---

### Task 2: AuthSection component

**Files:**
- Create: `app/exercises/websocket/components/AuthSection.tsx`

- [ ] **Step 1: Create `app/exercises/websocket/components/AuthSection.tsx`**

```tsx
"use client";

import { useRef, useState, useCallback } from "react";
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

  const appendLog = (line: string) => {
    setLog((prev) => [...prev.slice(-49), line]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const tryScenario = useCallback((label: string, token: string | undefined) => {
    if (loading) return;
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
      setLoading(null);
      socket.disconnect();
    });
  }, [loading]);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Scenario buttons */}
      <div className="flex gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 flex-wrap">
        {SCENARIOS.map(({ label, token, color }) => (
          <button
            key={label}
            onClick={() => tryScenario(label, token)}
            disabled={loading === label}
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
            io(url, {"{ auth: { token } }"})</code>.
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
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
pnpm build 2>&1 | head -30
```

Expected: build succeeds or shows only unrelated errors (not from AuthSection.tsx).

- [ ] **Step 3: Commit**

```bash
git add app/exercises/websocket/components/AuthSection.tsx
git commit -m "feat: add AuthSection component for §12"
```

---

### Task 3: Wire AuthSection into the page

**Files:**
- Modify: `app/exercises/websocket/page.tsx`

- [ ] **Step 1: Add import at top of `page.tsx`**

After the existing `import { SocketIOSection }` line (line 11), add:

```tsx
import { RoomsSection } from "./components/RoomsSection";
import { AuthSection } from "./components/AuthSection";
```

Note: `RoomsSection` may already be imported — add only what's missing.

- [ ] **Step 2: Replace the `ComingSoon` for `auth` with `<AuthSection />`**

Find this line in the scrollable content area (around line 107):

```tsx
<ComingSoon id="auth"      badge="§12" title="Auth Middleware"            desc="JWT validation on the socket handshake before connection is accepted." />
```

Replace with:

```tsx
<AuthSection />
```

- [ ] **Step 3: Also replace the `ComingSoon` for `rooms` if `RoomsSection` is not yet wired**

Check if `<RoomsSection />` is already rendered in the scrollable content area. If it's still showing as `ComingSoon`, find:

```tsx
<ComingSoon id="rooms"     badge="§9"  title="Rooms & Namespaces"        desc="socket.join(), targeted broadcasts, and namespace isolation." />
```

And replace with:

```tsx
<RoomsSection />
```

(Skip this step if `<RoomsSection />` is already rendered.)

- [ ] **Step 4: Verify the dev server compiles cleanly**

```bash
pnpm dev
```

Open `http://localhost:3000/exercises/websocket`, scroll to §12. Confirm:
- Section header renders with badge "§12"
- Theory block and table visible
- Amber key insight callout visible
- Four scenario buttons visible
- Log panel is empty with placeholder text

- [ ] **Step 5: Commit**

```bash
git add app/exercises/websocket/page.tsx
git commit -m "feat: wire AuthSection into websocket page for §12"
```

---

### Task 4: End-to-end smoke test

**Files:** (no changes — manual verification only)

- [ ] **Step 1: Start the auth server**

```bash
pnpm ws:auth
```

Expected:
```
Socket.io auth server running on :3004
  Valid tokens: token-alice, token-bob
```

- [ ] **Step 2: Open the page and test all four scenarios**

Navigate to `http://localhost:3000/exercises/websocket`, scroll to §12.

| Button | Expected log line |
|--------|-------------------|
| No token | `✗ Rejected — No token provided` |
| Bad token | `✗ Rejected — Invalid token` |
| Valid: alice | `✓ Authenticated — alice (role: user)` |
| Valid: bob | `✓ Authenticated — bob (role: admin)` |

- [ ] **Step 3: Test server-down state**

Stop the auth server (Ctrl+C). Click any scenario button.

Expected: log shows `✗ Could not reach server — is pnpm ws:auth running?` and amber hint banner appears below the log.

- [ ] **Step 4: Final commit if any fixup was needed**

If any small fixes were made during smoke testing:

```bash
git add -p
git commit -m "fix: address issues found in §12 smoke test"
```

---

## Self-Review

**Spec coverage:**
- ✓ Theory block with lifecycle diagram and without/with table — Task 2 Step 1
- ✓ Key insight callout (amber) — Task 2 Step 1
- ✓ Four preset scenario buttons — Task 2 Step 1 (`SCENARIOS` constant)
- ✓ Terminal-style log panel — Task 2 Step 1 (`AuthDemo`)
- ✓ Server hint when server is down — Task 2 Step 1 (`serverDown` state)
- ✓ Two code blocks — Task 2 Step 1 (`SERVER_CODE`, `CLIENT_CODE`)
- ✓ `server/socketio-auth.js` on port 3004 — Task 1
- ✓ `ws:auth` script in `package.json` — Task 1 Step 2
- ✓ Page wired up — Task 3

**Placeholder scan:** No TBDs, all code is complete.

**Type consistency:** `socket.data.user` typed as `{ username: string; role: string }` in the `authenticated` handler — matches what the server emits (`{ id, username, role }`). `id` is unused in the client, which is fine.

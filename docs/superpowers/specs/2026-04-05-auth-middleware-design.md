# §12 Auth Middleware — Design Spec

**Date:** 2026-04-05  
**Section:** WebSocket exercise page, §12

---

## Goal

Implement §12 "Auth Middleware" in the `/exercises/websocket` route. Covers JWT validation at the Socket.io handshake — theory, key insight, and an interactive demo with preset scenarios showing accept/reject outcomes.

---

## Architecture

### New files

| File | Purpose |
|------|---------|
| `server/socketio-auth.js` | Socket.io server on port 3004 with `io.use()` middleware |
| `app/exercises/websocket/components/AuthSection.tsx` | §12 section component |

### Modified files

| File | Change |
|------|--------|
| `package.json` | Add `ws:auth` script → `node server/socketio-auth.js` |
| `app/exercises/websocket/page.tsx` | Import `AuthSection`, replace `ComingSoon id="auth"` with `<AuthSection />` |

---

## Server (`server/socketio-auth.js`)

- Runs on **port 3004**
- Hardcoded token map (no JWT library — this is a demo):
  ```js
  const VALID_TOKENS = {
    "token-alice": { id: 1, username: "alice", role: "user" },
    "token-bob":   { id: 2, username: "bob",   role: "admin" },
  };
  ```
- Middleware via `io.use()`:
  - No token → `next(new Error("No token provided"))`
  - Unrecognised token → `next(new Error("Invalid token"))`
  - Valid token → attach user to `socket.data.user`, call `next()`
- On `connection`: emit `authenticated` with `socket.data.user`
- Disconnect immediately after emitting (demo only — no persistent session needed)

---

## Component (`AuthSection.tsx`)

### Layout (top to bottom)

1. **SectionHeader** — badge "§12", title "Auth Middleware", subtitle about handshake validation

2. **Theory block** (slate-50):
   - ASCII diagram: `Client handshake → io.use() middleware → accept/reject → connection event`
   - Two-column table: "Without middleware" vs "With middleware"

3. **Key insight callout** (amber-50):
   - Auth data travels in the handshake, not as an event
   - Middleware runs before `connection` fires
   - `next(new Error(...))` prevents the socket from ever connecting
   - `socket.data.user` is server-populated — client cannot fake it

4. **Demo** — four preset buttons + terminal-style log:
   - `No token` → connect with `auth: {}` → log `✗ No token provided`
   - `Bad token` → connect with `auth: { token: "fake-xyz" }` → log `✗ Invalid token`
   - `Valid: alice` → connect with `auth: { token: "token-alice" }` → log `✓ Authenticated — alice (role: user)`
   - `Valid: bob` → connect with `auth: { token: "token-bob" }` → log `✓ Authenticated — bob (role: admin)`
   - Each button click: disconnect existing socket if any, attempt new connection, append result to log
   - Server hint shown if `connect_error` is not auth-related (i.e., server not running)

5. **Code blocks** — `socketio-auth.js` (middleware snippet) and `client.ts` (auth option in `io()`)

### State

- `log: string[]` — appended on each attempt result
- `loading: string | null` — which scenario is currently attempting (button disabled state)
- `serverDown: boolean` — shown when connection fails for non-auth reasons

---

## Spec Self-Review

- No TBDs or placeholders
- Architecture consistent with existing sections (§9 RoomsSection pattern)
- Scope: single component + single server file — focused
- "Disconnect immediately after emitting" is explicit to avoid lingering connections in the demo

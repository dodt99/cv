# WebSocket Learning Route — Design Spec

**Date:** 2026-04-02  
**Status:** Approved

## Overview

A new route `/exercises/websocket` in the existing Next.js 16 portfolio/learning app. It teaches WebSocket from first principles through 7 progressive sections: theory, raw browser API, backend setup, reconnection, a live Binance price feed, a reusable React hook, and a mini chat room challenge.

The page uses a two-zone layout: a sticky left mini-nav + a scrollable right content area. Each section follows the established exercise pattern: concept card → live interactive demo → inline code snippet.

---

## File Structure

```
app/
└── exercises/
    └── websocket/
        ├── page.tsx                        # Page shell: header, mini-nav, section layout
        └── components/
            ├── TheorySection.tsx           # Static concept cards (no demo)
            ├── RawApiSection.tsx           # new WebSocket() demo with event log
            ├── BackendSection.tsx          # Echo demo against local ws-server.js
            ├── ReconnectSection.tsx        # Auto-reconnect with backoff demo
            ├── BinanceSection.tsx          # Live BTC/USDT feed from Binance public WS
            ├── HookSection.tsx             # useWebSocket hook source + usage example
            └── ChallengeSection.tsx        # Mini chat room against local ws-server.js

server/
└── ws-server.js                            # Local Node.js ws server (port 3001)
```

---

## Page Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: "WebSocket" title + subtitle               │
├────────────┬────────────────────────────────────────┤
│ Mini-nav   │  Scrollable content                    │
│ (sticky)   │                                        │
│ § Theory   │  Section 1: Theory                     │
│ § Raw API  │  Section 2: Raw API                    │
│ § Backend  │  Section 3: Backend                    │
│ § Reconnect│  Section 4: Reconnection               │
│ § Binance  │  Section 5: Binance feed               │
│ § Hook     │  Section 6: useWebSocket hook          │
│ § Challenge│  Section 7: Mini chat                  │
└────────────┴────────────────────────────────────────┘
```

Mini-nav highlights the active section using `IntersectionObserver`. Clicking a nav item smooth-scrolls to that section anchor.

---

## Section Content

### §1 Theory (static)
- WebSocket vs HTTP: request-response vs persistent full-duplex connection
- Handshake: HTTP `Upgrade` header → server responds `101 Switching Protocols`
- Frame types: text, binary, ping/pong, close
- Key properties: low latency, no polling overhead, truly bidirectional
- Presented as concept cards (no interactive demo needed)

### §2 Raw API
**Demo:** Connects to local `ws-server.js` on `ws://localhost:3001`. Focus is entirely on the **browser-side WebSocket API** — what properties and events exist, how they work. Shows a "start server first" hint if the connection fails.

- Connect button → `new WebSocket("ws://localhost:3001")`
- Live `readyState` badge: CONNECTING (yellow) → OPEN (green) → CLOSING (orange) → CLOSED (red), updates in real time
- Send message input → `ws.send(payload)`
- Event log panel: timestamped entries for `onopen`, `onmessage`, `onerror`, `onclose`
- Disconnect button → `ws.close()`

**Inline code:** Minimal WebSocket client setup showing all four event handlers and readyState constants.

### §3 Backend
**Demo:** Connects to local `ws-server.js` on `ws://localhost:3001`. Shows echo behavior.

- Connection status indicator (requires local server running — shows a "start server" hint if not connected)
- Send message → server echoes it back → appears in message log
- Server client count shown (from `connected` message on join)
- Side-by-side code panels: client code + `ws-server.js` echo handler

### §4 Reconnection
**Demo:** Simulates connection drop and auto-reconnect with exponential backoff.

- "Simulate disconnect" button closes the socket
- Reconnect state machine: RECONNECTING → shows attempt number + countdown to next retry
- Backoff schedule: 1s → 2s → 4s → 8s → 16s (max), resets on successful connect
- Visual timeline of reconnect attempts

**Inline code:** The reconnect wrapper function with backoff logic.

### §5 Binance Live Feed
**Demo:** Connects to `wss://stream.binance.com:9443/ws/btcusdt@trade` (public, no auth needed).

- Start/Stop buttons
- Live BTC/USDT price: green if price went up, red if down
- Trade size and timestamp
- Message counter (messages/sec)
- No local server required — connects directly to Binance

### §6 useWebSocket Hook
**Content:** Displays the full hook implementation + a usage example component.

- Hook API: `const { status, messages, send, connect, disconnect } = useWebSocket(url)`
- Status enum: `"idle" | "connecting" | "open" | "closing" | "closed" | "reconnecting"`
- Internally handles: connect on mount, cleanup on unmount, reconnect logic, message queue
- Side-by-side: raw approach (§2 code) vs hook usage — shows the abstraction value

### §7 Challenge (Mini Chat Room)
**Demo:** Connects to local `ws-server.js` chat endpoint.

- Username input → joins room (sends `{ type: "chat", username, text: "joined" }`)
- Message list with sender, text, timestamp
- Input + Send → broadcasts to all connected clients
- Open two browser tabs to see real-time sync
- Online user count badge (from server's `totalClients` field)

---

## Backend: `server/ws-server.js`

**Runtime:** Node.js with the `ws` package. Port: `3001`.

**Message protocol (JSON):**

```
Client → Server:
{ type: "echo",  payload: string }
{ type: "chat",  username: string, text: string }
{ type: "ping" }

Server → Client:
{ type: "echo",       payload: string }
{ type: "chat",       username: string, text: string, timestamp: number }
{ type: "pong" }
{ type: "connected",  clientId: string, totalClients: number }
{ type: "user_count", count: number }   // broadcast on connect/disconnect
```

**Server responsibilities:**
- Assign each client a random `clientId` on connect
- Echo: reflect `echo` messages back to sender only
- Chat broadcast: relay `chat` messages to all connected clients
- Ping/pong: respond to `ping` with `pong`
- Track connected clients count; broadcast `user_count` on connect/disconnect
- Handle `connection`, `message`, `close`, `error` events cleanly

**Start script** added to `package.json`:
```json
"ws": "node server/ws-server.js"
```
Run with: `pnpm ws`

---

## Sidebar Integration

Add a new nav item to `app/components/Sidebar.tsx` under the "Exercises" group:

```
{ href: "/exercises/websocket", label: "WebSocket", badge: "New" }
```

---

## Constraints

- **Vercel deployment:** The local `ws-server.js` is for local development only. §3, §7 gracefully show a "server not running" hint when `ws://localhost:3001` is unreachable. §2 and §5 work fully without the local server.
- **No new npm packages on the frontend** beyond what's already installed (`ws` is added as a dev dependency for the server only).
- **Styling:** Tailwind CSS v4, consistent with existing exercise pages.
- **No test suite** — consistent with project conventions.

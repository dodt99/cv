# §9 Rooms & Namespaces — Design Spec

**Date:** 2026-04-04  
**Section:** §9 of `/exercises/websocket`  
**Scope:** Add a fully implemented section covering both Socket.io Rooms and Namespaces with live interactive demos.

---

## Goal

Replace the `ComingSoon` placeholder for `id="rooms"` with a complete learning section that teaches the difference between Rooms (sub-channels within a namespace) and Namespaces (separate connection endpoints), each with a live demo.

---

## Content Structure

### 1. Theory Block
- ASCII diagram of the hierarchy:
  ```
  Server
  └── Namespace (/chat, /admin, /)
      └── Room (general, tech, random)
          └── Socket (individual connection)
  ```
- Comparison table: Namespace vs Room
  | | Namespace | Room |
  |---|---|---|
  | What it is | Separate connection endpoint | Server-side grouping of sockets |
  | Client sees it | Yes — must connect to it explicitly | No — server-side only |
  | Isolation | Full (separate event pipeline) | Partial (same namespace) |
  | Use case | Feature separation (chat vs admin) | Sub-channels within a feature |
  | Default | `/` (default namespace) | None — you create them with `join()` |

### 2. Rooms Demo
- 3 fixed rooms: `#general`, `#tech`, `#random`
- Flow: user enters username → sees room picker with live member counts → joins a room → chats → can switch rooms
- Member count badge on each room button updates in real time as people join/leave
- Messages are isolated to the joined room (socket receives only that room's events)
- System messages on join/leave ("Độ joined #tech")
- Server uses `socket.join(room)`, `socket.leave(room)`, `io.to(room).emit()`

### 3. Namespaces Demo
- Two side-by-side panels: `/public` and `/admin`
- Each panel has a "Connect" button that creates a socket to that namespace
- On connect: shows the socket ID assigned by that namespace
- A broadcast button sends a message to all sockets in that namespace
- Events on `/admin` never appear in `/public` panel — isolation is visually obvious
- Server uses `io.of("/public")` and `io.of("/admin")`

### 4. Code Blocks
- Server code showing rooms API: `socket.join()`, `socket.leave()`, `io.to(room).emit()`, `io.in(room).fetchSockets()`
- Server code showing namespaces API: `io.of("/ns")`, namespace-level `.on("connection")`
- Client code showing how to connect to a specific namespace: `io("http://localhost:3003/admin")`

---

## Technical Approach

### New Files
- `servers/socketio-rooms.js` — Socket.io server on port **3003**
- `app/exercises/websocket/components/RoomsSection.tsx` — main section component

### Server Design (`servers/socketio-rooms.js`)
One script, one HTTP server, three namespaces:

1. **Default namespace `/`** — powers the Rooms demo
   - `set_username` event: stores username in `socket.data.username`
   - `join_room` event: leaves current room, joins new room, broadcasts system message, emits updated room counts
   - `room_chat` event: emits to `io.to(room)` only
   - `disconnect`: re-emits room counts
   - Room count helper: calls `io.in(room).fetchSockets()` for each of the 3 rooms, emits `room_count` globally

2. **`/public` namespace** — powers left panel of Namespaces demo
   - On connect: emits `ns_event` with socket ID to the connecting socket
   - On `ns_broadcast`: re-emits to all in namespace
   - On disconnect: emits departure notice

3. **`/admin` namespace** — powers right panel of Namespaces demo
   - Same as `/public` but isolated — events never cross over

### Component Design (`RoomsSection.tsx`)
Self-contained file with these internal pieces:
- `RoomsSection` — top-level export, renders SectionHeader + theory + both demos + code blocks
- `RoomsDemo` — manages socket connection to default namespace, room state, messages
- `NamespacesDemo` — manages two independent socket refs (`publicSocket`, `adminSocket`), one per namespace panel
- `NsPanel` — single namespace panel (reused for both `/public` and `/admin`)
- `SectionHeader`, `CodeBlock` — copied from SocketIOSection pattern (no shared import needed)

### pnpm Script
Add to `package.json`:
```json
"ws:rooms": "node servers/socketio-rooms.js"
```

### page.tsx Change
Replace `<ComingSoon id="rooms" ... />` with `<RoomsSection />` and add import.

---

## No New Dependencies
`socket.io` and `socket.io-client` are already installed for §8.

---

## Success Criteria
- Rooms demo: two browser tabs can join the same room and exchange messages; joining a different room shows different messages
- Namespaces demo: connecting to `/public` and `/admin` shows different socket IDs; a broadcast on one namespace does not appear in the other panel
- Member counts update live when users join/leave rooms
- Server hint shown if connection fails (same pattern as §8)

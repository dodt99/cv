export function TheorySection() {
  return (
    <section id="theory" className="mb-16 scroll-mt-4">
      <SectionHeader
        badge="§1"
        title="Theory"
        subtitle="How WebSocket works under the hood"
      />

      {/* WS vs HTTP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <ConceptCard color="blue" title="HTTP (Request-Response)">
          <ul className="space-y-1 text-xs text-gray-500">
            <li>▸ Client always initiates</li>
            <li>▸ One request → one response → connection closes</li>
            <li>▸ High overhead for real-time (polling needed)</li>
            <li>▸ Half-duplex: one direction at a time</li>
          </ul>
        </ConceptCard>
        <ConceptCard color="emerald" title="WebSocket (Persistent)">
          <ul className="space-y-1 text-xs text-gray-500">
            <li>▸ Single connection stays open</li>
            <li>▸ Either side can send at any time</li>
            <li>▸ Low overhead — no headers after handshake</li>
            <li>▸ Full-duplex: simultaneous both directions</li>
          </ul>
        </ConceptCard>
      </div>

      {/* Handshake */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Handshake — HTTP → WebSocket upgrade
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Client request</p>
            <pre className="text-[11px] font-mono bg-gray-50 rounded-lg p-3 text-gray-600 leading-relaxed">{`GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZQ==
Sec-WebSocket-Version: 13`}</pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Server response</p>
            <pre className="text-[11px] font-mono bg-gray-50 rounded-lg p-3 text-gray-600 leading-relaxed">{`HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`}</pre>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          After <code className="bg-gray-100 px-1 rounded font-mono">101</code>, the TCP connection is handed off to the WebSocket protocol. No more HTTP.
        </p>
      </div>

      {/* Frame types */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Frame types
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { type: "Text", desc: "UTF-8 string data. Most common — JSON messages use this.", color: "bg-blue-50 border-blue-200 text-blue-700" },
            { type: "Binary", desc: "Raw bytes. Used for images, audio, protobuf.", color: "bg-violet-50 border-violet-200 text-violet-700" },
            { type: "Ping / Pong", desc: "Heartbeat. Server pings, client must pong (browser does this automatically).", color: "bg-amber-50 border-amber-200 text-amber-700" },
            { type: "Close", desc: "Graceful shutdown. Either side sends a close frame with an optional status code.", color: "bg-rose-50 border-rose-200 text-rose-700" },
          ].map(({ type, desc, color }) => (
            <div key={type} className={`p-3 rounded-xl border text-xs ${color}`}>
              <p className="font-semibold mb-1">{type}</p>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key properties */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Key properties
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Protocol</p>
            <p className="text-gray-500 leading-relaxed">
              <code className="bg-gray-100 px-1 rounded font-mono">ws://</code> (plain) or{" "}
              <code className="bg-gray-100 px-1 rounded font-mono">wss://</code> (TLS). Always use{" "}
              <code className="bg-gray-100 px-1 rounded font-mono">wss://</code> in production.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Use cases</p>
            <p className="text-gray-500 leading-relaxed">
              Chat, live prices, multiplayer games, collaborative editing, real-time dashboards, notifications.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Not ideal for</p>
            <p className="text-gray-500 leading-relaxed">
              Simple request/response (use REST). One-way server push (use SSE). File uploads (use HTTP).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared helpers (local to this file) ─────────────────────────────────────

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
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

function ConceptCard({ color, title, children }: { color: "blue" | "emerald"; title: string; children: React.ReactNode }) {
  const colors = {
    blue: "border-blue-200 bg-blue-50/40",
    emerald: "border-emerald-200 bg-emerald-50/40",
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <p className="text-xs font-semibold text-gray-700 mb-2">{title}</p>
      {children}
    </div>
  );
}

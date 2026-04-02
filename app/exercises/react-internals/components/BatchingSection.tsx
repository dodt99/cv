// app/exercises/react-internals/components/BatchingSection.tsx
"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { SectionHeader } from "./helpers";

const CODE_REACT17 = `// React 17 — only batches inside React event handlers
setTimeout(() => {
  setA(a + 1); // → render 1
  setB(b + 1); // → render 2  ← separate renders!
}, 0);`;

const CODE_REACT18 = `// React 18 — automatic batching everywhere
setTimeout(() => {
  setA(a + 1);
  setB(b + 1); // → batched → only 1 render
}, 0);`;

const CODE_FLUSH_SYNC = `import { flushSync } from "react-dom";

// flushSync — opt out of batching
flushSync(() => setA(a + 1)); // render 1
flushSync(() => setB(b + 1)); // render 2
flushSync(() => setC(c + 1)); // render 3`;

export function BatchingSection() {
  return (
    <section id="batching" className="mb-16 scroll-mt-4">
      <SectionHeader
        badge="§3"
        title="Batching"
        subtitle="React 18 automatic batching and flushSync"
      />

      {/* Theory */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
          What is batching?
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          When multiple <code className="bg-gray-100 px-1 rounded font-mono">setState</code> calls happen in the same synchronous block, React{" "}
          <strong className="text-gray-700">batches</strong> them into a single re-render instead of re-rendering once per call.{" "}
          React 18 extends this to <em>all</em> contexts — including{" "}
          <code className="bg-gray-100 px-1 rounded font-mono">setTimeout</code>, promises, and native event handlers.{" "}
          Use <code className="bg-gray-100 px-1 rounded font-mono">flushSync</code> to opt out and force synchronous, unbatched renders.
        </p>
      </div>

      {/* Live demo */}
      <BatchingDemo />

      {/* Code comparison */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Code comparison
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              label: "React 17 — no batching outside handlers",
              code: CODE_REACT17,
              border: "border-rose-200 bg-rose-50/30",
            },
            {
              label: "React 18 — automatic batching everywhere",
              code: CODE_REACT18,
              border: "border-emerald-200 bg-emerald-50/30",
            },
            {
              label: "flushSync — opt out of batching",
              code: CODE_FLUSH_SYNC,
              border: "border-amber-200 bg-amber-50/30",
            },
          ].map(({ label, code, border }) => (
            <div key={label} className={`rounded-xl border p-3 ${border}`}>
              <p className="text-[10px] font-semibold text-gray-500 mb-2 leading-tight">
                {label}
              </p>
              <pre className="text-[10px] font-mono bg-gray-900 text-gray-200 rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {code}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BatchingDemo ─────────────────────────────────────────────────────────────
// Demo approach: local variable tracking (no useEffect/useRef).
// Batched: all setA/setB/setC/setLogs are batched into 1 React commit → 1 log entry.
// flushSync: each flushSync forces its own synchronous commit → 3 log entries.

function BatchingDemo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  function handleBatched() {
    // All three setState calls + setLogs are batched in one React event handler
    // → 1 commit → 1 log line showing the final values
    const nextA = a + 1;
    const nextB = b + 1;
    const nextC = c + 1;
    setA(nextA);
    setB(nextB);
    setC(nextC);
    setLogs([`committed: a=${nextA}, b=${nextB}, c=${nextC}`]);
  }

  function handleFlushSync() {
    // Each flushSync forces a synchronous commit before the next line runs.
    // We track values with local variables since state is captured in closure.
    const nextA = a + 1;
    const nextB = b + 1;
    const nextC = c + 1;
    const accumulated: string[] = [];

    flushSync(() => setA(nextA));
    // commit 1: a updated, b and c still at old values
    accumulated.push(`committed: a=${nextA}, b=${b}, c=${c}`);

    flushSync(() => setB(nextB));
    // commit 2: b updated
    accumulated.push(`committed: a=${nextA}, b=${nextB}, c=${c}`);

    flushSync(() => setC(nextC));
    // commit 3: c updated
    accumulated.push(`committed: a=${nextA}, b=${nextB}, c=${nextC}`);

    setLogs(accumulated);
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Live demo — committed renders
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/30">
          <p className="text-xs font-semibold text-gray-700 mb-0.5">
            Batched (×3 setState)
          </p>
          <p className="text-xs text-gray-500 mb-3">
            All updates in one event handler →{" "}
            <strong className="text-gray-700">1 render</strong>
          </p>
          <button
            onClick={handleBatched}
            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Update a, b, c
          </button>
        </div>
        <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/30">
          <p className="text-xs font-semibold text-gray-700 mb-0.5">
            flushSync (×3 setState)
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Each update in its own flushSync →{" "}
            <strong className="text-gray-700">3 renders</strong>
          </p>
          <button
            onClick={handleFlushSync}
            className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors"
          >
            Update a, b, c
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-3 font-mono text-[11px] min-h-[4rem]">
        {logs.length === 0 ? (
          <span className="text-gray-600">
            Click a button to see how many renders occur…
          </span>
        ) : (
          <>
            {logs.map((log, i) => (
              <div key={i} className="text-green-400">
                render #{i + 1} — {log}
              </div>
            ))}
            <div className="mt-1 border-t border-gray-700 pt-1 text-yellow-400">
              flushSync commits triggered: {logs.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

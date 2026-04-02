# React Internals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/exercises/react-internals` — a scrollable learning page covering Fiber architecture, render vs commit phases, and React 18 batching, each with an interactive demo.

**Architecture:** Follows the WebSocket exercise page pattern exactly — a `"use client"` page shell with IntersectionObserver-driven mini-nav and three section components. Section components share a local `helpers.tsx` for `SectionHeader` and `ConceptCard`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, `react-dom/flushSync`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `app/exercises/react-internals/page.tsx` | Page shell: header, sticky mini-nav (3 sections), scroll tracking |
| Create | `app/exercises/react-internals/components/helpers.tsx` | Shared `SectionHeader` and `ConceptCard` used by all 3 sections |
| Create | `app/exercises/react-internals/components/FiberSection.tsx` | §1 static fiber tree diagram (current vs WIP tree, field legend) |
| Create | `app/exercises/react-internals/components/PhasesSection.tsx` | §2 animated 6-step timeline with trigger button + execution log |
| Create | `app/exercises/react-internals/components/BatchingSection.tsx` | §3 live render counter demo + code comparison (React 17/18/flushSync) |
| Modify | `app/components/Sidebar.tsx` | Add "React Internals" nav item under Exercises |

---

## Task 1: Shared helpers

**Files:**
- Create: `app/exercises/react-internals/components/helpers.tsx`

- [ ] **Step 1: Create the file**

```tsx
// app/exercises/react-internals/components/helpers.tsx

export function SectionHeader({
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

export function ConceptCard({
  color,
  title,
  children,
}: {
  color: "blue" | "emerald" | "violet" | "amber" | "rose";
  title: string;
  children: React.ReactNode;
}) {
  const colors = {
    blue: "border-blue-200 bg-blue-50/40",
    emerald: "border-emerald-200 bg-emerald-50/40",
    violet: "border-violet-200 bg-violet-50/40",
    amber: "border-amber-200 bg-amber-50/40",
    rose: "border-rose-200 bg-rose-50/40",
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <p className="text-xs font-semibold text-gray-700 mb-2">{title}</p>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/exercises/react-internals/components/helpers.tsx
git commit -m "feat: add shared helpers for react-internals exercise"
```

---

## Task 2: FiberSection — static fiber tree diagram

**Files:**
- Create: `app/exercises/react-internals/components/FiberSection.tsx`

- [ ] **Step 1: Create the file**

```tsx
// app/exercises/react-internals/components/FiberSection.tsx

import { SectionHeader, ConceptCard } from "./helpers";

export function FiberSection() {
  return (
    <section id="fiber" className="mb-16 scroll-mt-4">
      <SectionHeader
        badge="§1"
        title="Fiber Architecture"
        subtitle="How React represents and updates your component tree"
      />

      {/* Theory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <ConceptCard color="blue" title="Fiber Node">
          <p className="text-xs text-gray-500 leading-relaxed">
            A plain JS object representing one component instance. React builds
            a tree of fiber nodes — one per element in your component tree.
          </p>
        </ConceptCard>
        <ConceptCard color="violet" title="Two Trees">
          <p className="text-xs text-gray-500 leading-relaxed">
            React maintains two trees:{" "}
            <strong className="text-gray-700">current</strong> (what's on
            screen) and{" "}
            <strong className="text-gray-700">work-in-progress</strong> (what's
            being built). On commit, they swap roles.
          </p>
        </ConceptCard>
        <ConceptCard color="emerald" title="Work Loop">
          <p className="text-xs text-gray-500 leading-relaxed">
            React processes fibers one at a time in a loop. In Concurrent Mode
            it can <em>pause</em> after each unit of work and yield to the
            browser — enabling features like transitions and Suspense.
          </p>
        </ConceptCard>
      </div>

      {/* Two-tree diagram */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Fiber tree — &lt;App&gt; → &lt;Counter&gt; → &lt;button&gt;
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FiberTree label="current tree" variant="gray" />
          <FiberTree label="work-in-progress tree" variant="blue" />
        </div>
        <p className="text-xs text-gray-400 mt-4 leading-relaxed">
          On commit, React swaps the root pointer — the work-in-progress tree
          becomes the current tree. The old current tree is recycled as the
          next work-in-progress (the <code className="bg-gray-100 px-1 rounded font-mono">alternate</code> pointer).
        </p>
      </div>

      {/* Field legend */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Key fiber node fields
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {FIBER_FIELDS.map(({ field, desc }) => (
            <div key={field} className="flex gap-2 text-xs items-start">
              <code className="shrink-0 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                {field}
              </code>
              <span className="text-gray-500 leading-relaxed">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FIBER_FIELDS = [
  { field: "type", desc: 'The function/class component, or a string like "button" for host elements.' },
  { field: "key", desc: "Optional reconciliation hint. Helps React match elements across re-renders." },
  { field: "pendingProps", desc: "Props received by this element in the current render call." },
  { field: "memoizedState", desc: "The hook linked-list — useState, useEffect, useRef, etc. are all stored here." },
  { field: "child", desc: "Pointer to the first child fiber node." },
  { field: "sibling", desc: "Pointer to the next sibling fiber node." },
  { field: "return", desc: 'Pointer back to the parent fiber ("return" not "parent" to avoid DOM confusion).' },
  { field: "alternate", desc: "Pointer to the corresponding fiber in the other tree (current ↔ WIP)." },
];

const NODES = [
  {
    type: "App",
    pendingProps: "{}",
    memoizedState: "null",
    child: "→ Counter",
    sibling: "null",
    returnTo: "↑ FiberRoot",
  },
  {
    type: "Counter",
    pendingProps: "{}",
    memoizedState: "State { val: 0 } →",
    child: "→ button",
    sibling: "null",
    returnTo: "↑ App",
  },
  {
    type: '"button"',
    pendingProps: "{ onClick, children }",
    memoizedState: "null",
    child: "null",
    sibling: "null",
    returnTo: "↑ Counter",
  },
];

// ─── FiberTree ───────────────────────────────────────────────────────────────

function FiberTree({
  label,
  variant,
}: {
  label: string;
  variant: "gray" | "blue";
}) {
  const isBlue = variant === "blue";
  const headerCls = isBlue ? "text-blue-700" : "text-gray-500";
  const borderCls = isBlue ? "border-blue-200" : "border-gray-200";
  const bgCls = isBlue ? "bg-blue-50/40" : "bg-gray-50/40";
  const badgeCls = isBlue
    ? "bg-blue-100 text-blue-700"
    : "bg-gray-100 text-gray-600";
  const lineCls = isBlue ? "bg-blue-200" : "bg-gray-200";

  return (
    <div>
      <p
        className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${headerCls}`}
      >
        {label}
      </p>
      <div className="space-y-2">
        {NODES.map((node, i) => (
          <div key={i}>
            <div
              className={`rounded-lg border ${borderCls} ${bgCls} p-3`}
            >
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block mb-2 ${badgeCls}`}
              >
                {node.type}
              </span>
              <div className="font-mono text-[10px] text-gray-500 space-y-0.5">
                <div><span className="text-gray-400">type: </span>{node.type}</div>
                <div><span className="text-gray-400">key: </span>null</div>
                <div><span className="text-gray-400">pendingProps: </span>{node.pendingProps}</div>
                <div><span className="text-gray-400">memoizedState: </span>{node.memoizedState}</div>
                <div><span className="text-gray-400">child: </span>{node.child}</div>
                <div><span className="text-gray-400">sibling: </span>{node.sibling}</div>
                <div><span className="text-gray-400">return: </span>{node.returnTo}</div>
              </div>
            </div>
            {i < NODES.length - 1 && (
              <div className="flex justify-center my-1">
                <div className={`w-px h-3 ${lineCls}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/exercises/react-internals/components/FiberSection.tsx
git commit -m "feat: add FiberSection with two-tree diagram"
```

---

## Task 3: PhasesSection — animated render/commit timeline

**Files:**
- Create: `app/exercises/react-internals/components/PhasesSection.tsx`

- [ ] **Step 1: Create the file**

```tsx
// app/exercises/react-internals/components/PhasesSection.tsx
"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "./helpers";

const STEPS = [
  {
    id: "render",
    label: "Render",
    color: "blue" as const,
    log: "[render body] component function called — new fiber tree built",
    desc: "React calls your component function. It builds a new work-in-progress fiber tree. This phase is pure — no DOM mutations. In Concurrent Mode it can be interrupted.",
  },
  {
    id: "reconcile",
    label: "Reconcile",
    color: "violet" as const,
    log: "[reconcile] diffing current tree vs work-in-progress tree",
    desc: 'React walks both trees and computes the minimal set of DOM changes. Elements with matching type and key are reused ("bailed out"); others are destroyed and recreated.',
  },
  {
    id: "commit-dom",
    label: "Commit (DOM)",
    color: "amber" as const,
    log: "[commit] DOM mutations applied synchronously",
    desc: "React applies all queued DOM mutations in one synchronous pass — insertions, updates, deletions. This is when the browser's DOM actually changes.",
  },
  {
    id: "layout-effect",
    label: "useLayoutEffect",
    color: "rose" as const,
    log: "[useLayoutEffect] synchronous — DOM updated, not yet painted",
    desc: "React runs all useLayoutEffect cleanup and setup functions synchronously. You can read layout from the DOM here. The browser has NOT painted yet.",
  },
  {
    id: "paint",
    label: "Paint",
    color: "emerald" as const,
    log: "[browser] pixels painted to screen",
    desc: "The browser paints updated pixels to the screen. React has no control over this step — it happens between useLayoutEffect and useEffect.",
  },
  {
    id: "effect",
    label: "useEffect",
    color: "teal" as const,
    log: "[useEffect] async — after paint (subscriptions, fetching, etc.)",
    desc: "React runs all useEffect cleanup and setup functions asynchronously, after the browser has painted. Ideal for subscriptions, data fetching, and side effects.",
  },
] as const;

const ACTIVE_COLORS: Record<string, string> = {
  blue:   "bg-blue-500   border-blue-500   text-white",
  violet: "bg-violet-500 border-violet-500 text-white",
  amber:  "bg-amber-500  border-amber-500  text-white",
  rose:   "bg-rose-500   border-rose-500   text-white",
  emerald:"bg-emerald-500 border-emerald-500 text-white",
  teal:   "bg-teal-500   border-teal-500   text-white",
};

export function PhasesSection() {
  const [activeStep, setActiveStep] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const running = activeStep >= 0 && activeStep < STEPS.length - 1;

  // Auto-advance to next step every 700 ms
  useEffect(() => {
    if (activeStep < 0 || activeStep >= STEPS.length - 1) return;
    const id = setTimeout(() => setActiveStep((s) => s + 1), 700);
    return () => clearTimeout(id);
  }, [activeStep]);

  // Append log line when a new step becomes active
  useEffect(() => {
    if (activeStep < 0) return;
    setLogs((prev) => [...prev, STEPS[activeStep].log]);
  }, [activeStep]);

  function handleTrigger() {
    setLogs([]);
    setActiveStep(0);
  }

  return (
    <section id="phases" className="mb-16 scroll-mt-4">
      <SectionHeader
        badge="§2"
        title="Render vs Commit Phase"
        subtitle="Two distinct phases with very different rules"
      />

      {/* Theory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
          <p className="text-xs font-semibold text-gray-700 mb-2">Render phase</p>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>▸ React calls your component functions</li>
            <li>▸ Builds a new work-in-progress fiber tree</li>
            <li>▸ Diffs it against the current tree</li>
            <li>▸ <strong className="text-gray-700">Pure</strong> — no DOM mutations, no side effects</li>
            <li>▸ Can be <strong className="text-gray-700">interrupted</strong> (Concurrent Mode)</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
          <p className="text-xs font-semibold text-gray-700 mb-2">Commit phase</p>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>▸ Applies all DOM mutations in one pass</li>
            <li>▸ Runs <code className="bg-amber-100 px-1 rounded font-mono text-amber-800">useLayoutEffect</code> (before paint)</li>
            <li>▸ Browser paints</li>
            <li>▸ Runs <code className="bg-amber-100 px-1 rounded font-mono text-amber-800">useEffect</code> (after paint)</li>
            <li>▸ Always <strong className="text-gray-700">synchronous</strong> — never interrupted</li>
          </ul>
        </div>
      </div>

      {/* Animated timeline */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Interactive timeline
        </p>

        {/* Step pills */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-300 ${
                  activeStep >= i
                    ? ACTIVE_COLORS[step.color]
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="text-gray-300 text-xs">→</span>
              )}
            </div>
          ))}
        </div>

        {/* Active step description */}
        <div className="min-h-[3.5rem] mb-4">
          {activeStep >= 0 && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-0.5">
                {STEPS[activeStep].label}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {STEPS[activeStep].desc}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleTrigger}
          disabled={running}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {running ? "Running…" : "Trigger re-render"}
        </button>
      </div>

      {/* Execution log */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Execution log
        </p>
        <div className="bg-gray-900 rounded-lg p-3 font-mono text-[11px] min-h-[5rem]">
          {logs.length === 0 ? (
            <span className="text-gray-600">
              Click &quot;Trigger re-render&quot; to see the execution order…
            </span>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-green-400 leading-relaxed">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/exercises/react-internals/components/PhasesSection.tsx
git commit -m "feat: add PhasesSection with animated render/commit timeline"
```

---

## Task 4: BatchingSection — live demo + code comparison

**Files:**
- Create: `app/exercises/react-internals/components/BatchingSection.tsx`

- [ ] **Step 1: Create the file**

```tsx
// app/exercises/react-internals/components/BatchingSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
// useEffect([a, b, c]) fires once per committed render that changed a, b, or c.
// Batched: all 3 update in 1 commit → effect fires once → 1 log line.
// flushSync: each update is its own commit → effect fires 3 times → 3 log lines.

function BatchingDemo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);

  useEffect(() => {
    logsRef.current = [
      ...logsRef.current,
      `committed: a=${a}, b=${b}, c=${c}`,
    ];
    setLogs([...logsRef.current]);
  }, [a, b, c]);

  function handleBatched() {
    logsRef.current = [];
    setLogs([]);
    setA((v) => v + 1);
    setB((v) => v + 1);
    setC((v) => v + 1);
    // React 18 batches all 4 setState calls (including setLogs) → 1 commit
  }

  function handleFlushSync() {
    logsRef.current = [];
    setLogs([]);
    // setLogs([]) is flushed as part of the first flushSync below
    flushSync(() => setA((v) => v + 1)); // commit 1
    flushSync(() => setB((v) => v + 1)); // commit 2
    flushSync(() => setC((v) => v + 1)); // commit 3
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
              Total committed renders: {logs.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/exercises/react-internals/components/BatchingSection.tsx
git commit -m "feat: add BatchingSection with live demo and code comparison"
```

---

## Task 5: Page shell

**Files:**
- Create: `app/exercises/react-internals/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
// app/exercises/react-internals/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FiberSection } from "./components/FiberSection";
import { PhasesSection } from "./components/PhasesSection";
import { BatchingSection } from "./components/BatchingSection";

const NAV_SECTIONS = [
  { id: "fiber",    label: "§1 Fiber" },
  { id: "phases",   label: "§2 Phases" },
  { id: "batching", label: "§3 Batching" },
];

export default function ReactInternalsPage() {
  const [activeId, setActiveId] = useState("fiber");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
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
        <h1 className="text-2xl font-bold text-gray-900">React Internals</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fiber architecture, rendering phases, and batching — from theory to
          interactive demo
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
          <FiberSection />
          <PhasesSection />
          <BatchingSection />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Start dev server and verify the page loads at `/exercises/react-internals`**

```bash
pnpm dev
```

Open `http://localhost:3000/exercises/react-internals`.

Expected: page renders with sticky mini-nav, three sections visible, no TypeScript/build errors in the terminal.

- [ ] **Step 3: Commit**

```bash
git add app/exercises/react-internals/page.tsx
git commit -m "feat: add react-internals exercise page shell with mini-nav"
```

---

## Task 6: Sidebar integration

**Files:**
- Modify: `app/components/Sidebar.tsx`

- [ ] **Step 1: Add the nav item to the Exercises group**

In `app/components/Sidebar.tsx`, find the `"Exercises"` group's `items` array. Add the following entry **before** the WebSocket item (alphabetical is fine — just keep it consistent with the existing order):

```tsx
{
  href: "/exercises/react-internals",
  label: "React Internals",
  icon: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        transform="rotate(120 12 12)"
      />
    </svg>
  ),
  badge: "New",
},
```

- [ ] **Step 2: Verify sidebar in browser**

With `pnpm dev` running, confirm the "React Internals" item appears under **Exercises** in the sidebar with the atom icon and the orange "New" badge. Clicking it navigates to `/exercises/react-internals`.

- [ ] **Step 3: Verify interactive demos**

Check each demo works:
- §1 Fiber: two-column fiber tree diagram renders with gray and blue cards
- §2 Phases: clicking "Trigger re-render" animates through all 6 steps and fills the log box
- §3 Batching: "Update a, b, c" (batched) → 1 log line; "Update a, b, c" (flushSync) → 3 log lines

- [ ] **Step 4: Commit**

```bash
git add app/components/Sidebar.tsx
git commit -m "feat: add React Internals nav item to sidebar"
```

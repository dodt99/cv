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
            <strong className="text-gray-700">current</strong> (what&apos;s on
            screen) and{" "}
            <strong className="text-gray-700">work-in-progress</strong> (what&apos;s
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

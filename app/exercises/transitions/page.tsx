"use client";

import {
  useState,
  useTransition,
  useDeferredValue,
  memo,
  useMemo,
  useRef,
} from "react";

// ─── Dataset ────────────────────────────────────────────────────────────────

const FIRST = ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Henry","Iris","James",
  "Kate","Liam","Mia","Noah","Olivia","Paul","Quinn","Rose","Sam","Tina",
  "Uma","Victor","Wendy","Xander","Yara","Zoe","Aaron","Bella","Carlos","Daisy"];
const LAST = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson",
  "Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Lee","Clark","Lewis"];
const ROLES = ["Frontend Dev","Backend Dev","Fullstack Dev","UI Designer","DevOps","QA Engineer","PM"];

const ALL_ITEMS = Array.from({ length: 8000 }, (_, i) => ({
  id: i,
  name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`,
  role: ROLES[i % ROLES.length],
  score: Math.floor(50 + ((i * 37) % 50)),
}));

// ─── Slow Item — deliberately makes rendering measurable ────────────────────

const SlowItem = memo(function SlowItem({
  name, role, score, highlight,
}: { name: string; role: string; score: number; highlight: string }) {
  // Simulate a component that takes real work to render (e.g. complex chart row)
  const now = performance.now();
  while (performance.now() - now < 0.08) { /* ~0.08ms × 8000 items = ~640ms */ }

  const hl = (text: string) => {
    if (!highlight) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + highlight.length)}</mark>
        {text.slice(idx + highlight.length)}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm border-b border-gray-100 hover:bg-gray-50">
      <div>
        <span className="font-medium text-gray-800">{hl(name)}</span>
        <span className="ml-2 text-xs text-gray-400">{role}</span>
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        score >= 80 ? "bg-green-100 text-green-700" :
        score >= 60 ? "bg-blue-100 text-blue-700" :
        "bg-gray-100 text-gray-500"
      }`}>{score}%</span>
    </div>
  );
});

// ─── Shared ResultList ───────────────────────────────────────────────────────

function ResultList({ query, label, isPending = false }: {
  query: string; label: string; isPending?: boolean;
}) {
  const filtered = useMemo(
    () => ALL_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.role.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 50),
    [query]
  );

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        {isPending && (
          <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            updating…
          </span>
        )}
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-400">
          Showing first 50 of {ALL_ITEMS.filter(i =>
            i.name.toLowerCase().includes(query.toLowerCase()) ||
            i.role.toLowerCase().includes(query.toLowerCase())
          ).length} results
        </div>
        <div className="max-h-72 overflow-y-auto">
          {filtered.map((item) => (
            <SlowItem key={item.id} {...item} highlight={query} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No results</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Exercise 1: useTransition ───────────────────────────────────────────────

function TransitionExercise() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"with" | "without">("with");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (mode === "with") {
      setInput(value);                        // urgent — input stays snappy
      startTransition(() => setQuery(value)); // non-urgent — list can lag
    } else {
      setInput(value);
      setQuery(value);                        // both urgent — input freezes
    }
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-500 font-medium">Mode:</span>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(["with", "without"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {m === "with" ? "✅ with useTransition" : "❌ without useTransition"}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type a name or role… (try 'Alice' or 'Dev')"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {mode === "with" && isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-500">⏳</span>
        )}
      </div>

      {/* Result */}
      <ResultList
        query={mode === "with" ? query : input}
        label={mode === "with" ? "Results (deferred via startTransition)" : "Results (blocking)"}
        isPending={mode === "with" ? isPending : false}
      />

      {/* Code */}
      <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono">useTransition.tsx</span>
        </div>
        <pre className="text-[12px] leading-relaxed font-mono bg-white p-4 overflow-x-auto text-gray-700">{
`const [input, setInput] = useState("");
const [query, setQuery] = useState("");
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  setInput(e.target.value);        // urgent — never deferred
  startTransition(() => {
    setQuery(e.target.value);      // non-urgent — can be interrupted
  });
};

// isPending = true while transition is in progress
{isPending && <Spinner />}`
        }</pre>
      </div>
    </div>
  );
}

// ─── Exercise 2: useDeferredValue ────────────────────────────────────────────

function DeferredValueExercise() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div>
      {/* Input */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a name or role…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      {/* State inspector */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">query (live)</p>
          <p className="text-sm font-mono text-gray-800 min-h-[20px]">
            {query || <span className="text-gray-300">""</span>}
          </p>
        </div>
        <div className={`p-3 border rounded-xl shadow-sm transition-colors ${
          isStale ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"
        }`}>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
            deferredQuery {isStale && <span className="text-amber-500">(stale)</span>}
          </p>
          <p className={`text-sm font-mono min-h-[20px] ${isStale ? "text-amber-600" : "text-gray-800"}`}>
            {deferredQuery || <span className="text-gray-300">""</span>}
          </p>
        </div>
      </div>

      {/* List — uses deferred value */}
      <div className={`transition-opacity duration-300 ${isStale ? "opacity-60" : "opacity-100"}`}>
        <ResultList
          query={deferredQuery}
          label={`Results using deferredQuery ${isStale ? "— showing previous results" : "— up to date"}`}
          isPending={isStale}
        />
      </div>

      {/* Code */}
      <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono">useDeferredValue.tsx</span>
        </div>
        <pre className="text-[12px] leading-relaxed font-mono bg-white p-4 overflow-x-auto text-gray-700">{
`const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);

// deferredQuery lags behind query during rapid typing
// isStale = true when they differ → show stale UI
const isStale = query !== deferredQuery;

// Pass deferredQuery to the expensive component
// React will re-render SlowList with old value first,
// then re-render with new value when idle
<SlowList
  query={deferredQuery}
  style={{ opacity: isStale ? 0.6 : 1 }}
/>`
        }</pre>
      </div>
    </div>
  );
}

// ─── Exercise 3: Side-by-side comparison ────────────────────────────────────

function ComparisonExercise() {
  // Shared input
  const [input, setInput] = useState("");

  // useTransition approach
  const [transQuery, setTransQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // useDeferredValue approach
  const deferredInput = useDeferredValue(input);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInput(v);
    startTransition(() => setTransQuery(v));
  };

  return (
    <div>
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type here — both lists update together"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">useTransition</span>
            {isPending && <span className="text-xs text-amber-600">updating…</span>}
          </div>
          <ResultList query={transQuery} label="Deferred via startTransition" isPending={isPending} />
          <p className="text-xs text-gray-400 mt-2">You control which setState is deferred</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-violet-100 bg-violet-50/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">useDeferredValue</span>
            {input !== deferredInput && <span className="text-xs text-amber-600">stale…</span>}
          </div>
          <ResultList query={deferredInput} label="Deferred via useDeferredValue" isPending={input !== deferredInput} />
          <p className="text-xs text-gray-400 mt-2">You defer the value — useful when you don&apos;t own the setState</p>
        </div>
      </div>
    </div>
  );
}

// ─── Challenge ───────────────────────────────────────────────────────────────

function ChallengeBox() {
  const [show, setShow] = useState(false);
  return (
    <div className="border-2 border-dashed border-amber-200 rounded-xl p-5 bg-amber-50/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-800 mb-1">Challenge: Tab switcher with heavy content</p>
          <p className="text-xs text-amber-700 leading-relaxed max-w-lg">
            Build a tab component with 3 tabs. One tab renders a heavy list of 5000 items.
            Use <code className="bg-amber-100 px-1 rounded font-mono">useTransition</code> so the tab
            button responds instantly while the content loads, and show a loading state on the active tab.
          </p>
        </div>
        <button
          onClick={() => setShow(!show)}
          className="shrink-0 ml-4 text-xs text-amber-600 hover:text-amber-800 font-medium underline"
        >
          {show ? "hide hint" : "show hint"}
        </button>
      </div>
      {show && (
        <pre className="mt-4 text-[11px] font-mono text-gray-700 bg-white border border-amber-200 rounded-lg p-3 overflow-x-auto leading-relaxed">{
`const [tab, setTab] = useState("home");
const [isPending, startTransition] = useTransition();

function selectTab(next: string) {
  startTransition(() => setTab(next));  // non-urgent
}

<TabButton
  onClick={() => selectTab("heavy")}
  pending={isPending}   // show spinner on button
>
  Heavy Tab
</TabButton>

{/* Tab content — renders with old tab until transition completes */}
{tab === "heavy" && <HeavyList />}`
        }</pre>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

type Tab = "transition" | "deferred" | "comparison";

const TABS: { id: Tab; label: string; badge: string; color: string }[] = [
  { id: "transition", label: "useTransition", badge: "Exercise 1", color: "blue" },
  { id: "deferred", label: "useDeferredValue", badge: "Exercise 2", color: "violet" },
  { id: "comparison", label: "Side-by-side", badge: "Exercise 3", color: "gray" },
];

const CONCEPTS: Record<Tab, { what: string; when: string; key: string }> = {
  transition: {
    what: "Marks a setState call as non-urgent. React can interrupt and restart it when higher-priority updates come in.",
    when: "You own the state update. Wrap the slow setState in startTransition(). Use isPending to show a loading indicator.",
    key: "startTransition(() => setSlowState(value))",
  },
  deferred: {
    what: "Returns a lagging copy of a value. The component using the deferred value re-renders after urgent renders finish.",
    when: "You don't own the state (e.g., receiving a prop or can't wrap the setState). Defer the value you pass to the slow component.",
    key: "const deferred = useDeferredValue(value)",
  },
  comparison: {
    what: "Both hooks solve the same problem — keeping UI responsive during heavy renders — but from different angles.",
    when: "useTransition: wrap the setState. useDeferredValue: wrap the value. Result is the same; pick based on where you have control.",
    key: "query !== deferredQuery → stale content → show opacity: 0.6",
  },
};

export default function TransitionsExercise() {
  const [activeTab, setActiveTab] = useState<Tab>("transition");
  const concept = CONCEPTS[activeTab];

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Exercises</p>
        <h1 className="text-2xl font-bold text-gray-900">useTransition & useDeferredValue</h1>
        <p className="text-sm text-gray-500 mt-1">
          Concurrent React — keep UI responsive during expensive renders
        </p>
      </div>

      {/* Concept card */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Concept</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">What it does</p>
            <p className="text-gray-500 leading-relaxed">{concept.what}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">When to use</p>
            <p className="text-gray-500 leading-relaxed">{concept.when}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Key line</p>
            <code className="block bg-gray-100 text-blue-700 px-2 py-1.5 rounded-lg font-mono text-[11px] leading-relaxed">
              {concept.key}
            </code>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id
                ? tab.color === "blue" ? "bg-blue-100 text-blue-600"
                  : tab.color === "violet" ? "bg-violet-100 text-violet-600"
                  : "bg-gray-100 text-gray-500"
                : "bg-gray-200 text-gray-400"
            }`}>{tab.badge}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Exercise content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
        {activeTab === "transition" && <TransitionExercise />}
        {activeTab === "deferred" && <DeferredValueExercise />}
        {activeTab === "comparison" && <ComparisonExercise />}
      </div>

      {/* Challenge */}
      <ChallengeBox />

      {/* Footer note */}
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
        <span className="shrink-0 mt-0.5">💡</span>
        <p>
          The list renders <strong>8,000 items</strong> with an artificial ~0.08ms delay per item (~640ms total).
          This simulates real-world complex components like charts, rich text cells, or deeply nested trees.
          Open DevTools → Performance to see the difference in frame times.
        </p>
      </div>
    </div>
  );
}

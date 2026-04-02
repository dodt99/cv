// app/exercises/react-internals/components/PhasesSection.tsx
"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "./helpers";

const STEPS = [
  {
    id: "render",
    label: "Render",
    color: "blue" as const,
    log: "[render body] component function called, new fiber tree built",
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
  const running = activeStep >= 0 && activeStep < STEPS.length - 1;

  // Auto-advance to next step every 700 ms
  useEffect(() => {
    if (activeStep < 0 || activeStep >= STEPS.length - 1) return;
    const id = setTimeout(() => setActiveStep((s) => s + 1), 700);
    return () => clearTimeout(id);
  }, [activeStep]);

  // Derive logs from activeStep
  const logs = activeStep < 0 ? [] : Array.from(STEPS.slice(0, activeStep + 1), (s) => s.log);

  function handleTrigger() {
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

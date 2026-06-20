"use client";

import { useEffect, useState } from "react";
import MarkdownViewer from "../components/MarkdownViewer";
import { InterviewPanel } from "../components/interview/InterviewPanel";
import type { TocItem } from "./parseToc";
import type { Section } from "../components/interview/types";

type Tab = "knowledge" | "interview";

function getTabFromHash(): Tab {
  if (typeof window === "undefined") return "knowledge";
  return window.location.hash.slice(1) === "interview" ? "interview" : "knowledge";
}

type VuePageClientProps = {
  content: string;
  toc: TocItem[];
  interviewSections: Section[];
  tags: string[];
};

export default function VuePageClient({
  content,
  toc,
  interviewSections,
  tags,
}: VuePageClientProps) {
  const [tab, setTab] = useState<Tab>(getTabFromHash);

  useEffect(() => {
    const onHashChange = () => setTab(getTabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function switchTab(next: Tab) {
    setTab(next);
    window.history.replaceState(
      null,
      "",
      next === "interview" ? "#interview" : "#knowledge"
    );
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Interview Prep
        </p>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-gray-900">Vue.js</h1>
          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
            Vue 3
          </span>
          <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
            Job Prep
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Vue 3 thuần — Composition API, Pinia, Vue Router
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {tags.map((t) => (
          <span
            key={t}
            className="text-[11px] bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full shadow-sm"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(["knowledge", "interview"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t === "knowledge" ? "Kiến thức" : "Phỏng vấn"}
          </button>
        ))}
      </div>

      {tab === "knowledge" ? (
        <div className="flex gap-6">
          <aside className="hidden lg:block w-44 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-[11px] text-gray-500 hover:text-blue-600 py-1 leading-snug"
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </aside>
          <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <MarkdownViewer content={content} />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <InterviewPanel sections={interviewSections} />
        </div>
      )}
    </div>
  );
}

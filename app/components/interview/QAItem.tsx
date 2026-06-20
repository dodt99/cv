"use client";

import { useState } from "react";
import type { MCQAnswer, SectionItem } from "./types";
import { AnswerContent } from "./AnswerContent";

export function QAItem({ item }: { item: SectionItem }) {
  const [open, setOpen] = useState(false);
  const isMCQ =
    typeof item.a === "object" &&
    !Array.isArray(item.a) &&
    (item.a as MCQAnswer).type === "mcq";

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors"
      >
        <div className="flex items-start gap-2 min-w-0">
          {isMCQ && (
            <span className="shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300 uppercase tracking-wide">
              Quiz
            </span>
          )}
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
            {item.q}
          </span>
        </div>
        <span
          className={`text-zinc-400 shrink-0 mt-0.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-700 pt-3 bg-zinc-50 dark:bg-zinc-800/50">
          <AnswerContent answer={item.a} />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { MCQAnswer, Section } from "./types";
import { QAItem } from "./QAItem";

export function SectionBlock({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);
  const mcqCount = section.items.filter(
    (item) =>
      typeof item.a === "object" &&
      !Array.isArray(item.a) &&
      (item.a as MCQAnswer).type === "mcq"
  ).length;

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-3 text-left group"
      >
        <span
          className={`text-zinc-400 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          {section.title}
        </h2>
        <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded">
          {section.items.length}
        </span>
        {mcqCount > 0 && (
          <span className="text-xs text-violet-500 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400 px-1.5 py-0.5 rounded">
            {mcqCount} quiz
          </span>
        )}
      </button>
      {open && (
        <div className="space-y-2 ml-5">
          {section.items.map((item, i) => (
            <QAItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

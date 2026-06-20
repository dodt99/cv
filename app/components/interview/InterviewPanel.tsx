"use client";

import { useState } from "react";
import type { Section } from "./types";
import { SectionBlock } from "./SectionBlock";
import { countMCQ, filterSections } from "./filterSections";

type InterviewPanelProps = {
  sections: Section[];
  showTips?: boolean;
};

export function InterviewPanel({ sections, showTips = false }: InterviewPanelProps) {
  const [search, setSearch] = useState("");
  const filtered = filterSections(sections, search);
  const totalQuestions = sections.reduce((acc, s) => acc + s.items.length, 0);
  const totalMCQ = countMCQ(sections);

  return (
    <div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        {totalQuestions} câu hỏi • {sections.length} sections •{" "}
        <span className="text-violet-500">{totalMCQ} quiz (A/B/C/D)</span>
      </p>

      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showTips && !search && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
            Mẹo khi phỏng vấn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-600 dark:text-amber-300">
            {[
              [
                "Câu hỏi technical khó",
                "Nói to suy nghĩ, đừng im lặng. Interviewer đánh giá cả process",
              ],
              [
                "Câu hỏi bạn không biết",
                '"Tôi chưa dùng cái đó nhưng tôi sẽ approach theo hướng..."',
              ],
              [
                "Câu hỏi về điểm yếu",
                "Chọn điểm yếu thật nhưng đang cải thiện",
              ],
              [
                "Câu hỏi về conflict",
                "Dùng STAR method: Situation, Task, Action, Result",
              ],
            ].map(([situation, advice]) => (
              <div key={situation}>
                <span className="font-medium">{situation}:</span> {advice}
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-8">
          Không tìm thấy kết quả.
        </p>
      ) : (
        filtered.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))
      )}
    </div>
  );
}

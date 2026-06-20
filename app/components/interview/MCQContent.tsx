"use client";

import { useState } from "react";
import type { MCQAnswer } from "./types";

export function MCQContent({ answer }: { answer: MCQAnswer }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <div className="space-y-2 mb-3">
        {answer.options.map((opt) => (
          <div
            key={opt.label}
            className={`flex gap-2.5 p-2.5 rounded-lg text-sm border transition-colors ${
              revealed && opt.label === answer.correct
                ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
                : "bg-white border-zinc-200 text-zinc-700 dark:bg-zinc-800/60 dark:border-zinc-600 dark:text-zinc-300"
            }`}
          >
            <span className="font-bold shrink-0 w-4">{opt.label}.</span>
            <span className="flex-1">{opt.text}</span>
            {revealed && opt.label === answer.correct && (
              <span className="text-green-500 dark:text-green-400 font-bold shrink-0">
                ✓
              </span>
            )}
          </div>
        ))}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors px-3 py-1.5 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          Reveal Answer
        </button>
      ) : (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <span className="font-semibold">Answer: {answer.correct}</span>
            {answer.explanation && (
              <span className="text-blue-700 dark:text-blue-300">
                {" "}
                — {answer.explanation}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

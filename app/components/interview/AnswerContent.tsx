"use client";

import type { MCQAnswer, SectionItem } from "./types";
import { MCQContent } from "./MCQContent";

export function AnswerContent({ answer }: { answer: SectionItem["a"] }) {
  if (
    typeof answer === "object" &&
    !Array.isArray(answer) &&
    (answer as MCQAnswer).type === "mcq"
  ) {
    return <MCQContent answer={answer as MCQAnswer} />;
  }
  if (typeof answer === "string") {
    return (
      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
        {answer}
      </p>
    );
  }
  if (Array.isArray(answer)) {
    return (
      <ul className="space-y-1.5">
        {answer.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300"
          >
            <span className="text-blue-500 shrink-0 mt-0.5">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

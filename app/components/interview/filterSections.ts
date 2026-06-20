import type { MCQAnswer, Section } from "./types";

export function filterSections(sections: Section[], search: string): Section[] {
  const term = search.trim().toLowerCase();
  if (!term) return sections;

  return sections
    .map((s) => ({
      ...s,
      items: s.items.filter((item) => {
        if (item.q.toLowerCase().includes(term)) return true;
        if (typeof item.a === "string") return item.a.toLowerCase().includes(term);
        if (Array.isArray(item.a))
          return item.a.some((a) => a.toLowerCase().includes(term));
        if (
          typeof item.a === "object" &&
          (item.a as MCQAnswer).type === "mcq"
        ) {
          const mcq = item.a as MCQAnswer;
          return (
            mcq.options.some((o) => o.text.toLowerCase().includes(term)) ||
            mcq.explanation.toLowerCase().includes(term)
          );
        }
        return false;
      }),
    }))
    .filter((s) => s.items.length > 0);
}

export function countMCQ(sections: Section[]): number {
  return sections.reduce(
    (acc, s) =>
      acc +
      s.items.filter(
        (item) =>
          typeof item.a === "object" &&
          !Array.isArray(item.a) &&
          (item.a as MCQAnswer).type === "mcq"
      ).length,
    0
  );
}

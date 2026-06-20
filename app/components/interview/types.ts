export type MCQOption = { label: string; text: string };

export type MCQAnswer = {
  type: "mcq";
  options: MCQOption[];
  correct: string;
  explanation: string;
};

export type TableAnswer = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type SectionItem = {
  q: string;
  a: string | string[] | TableAnswer | MCQAnswer;
};

export type Section = {
  id: string;
  title: string;
  items: SectionItem[];
};

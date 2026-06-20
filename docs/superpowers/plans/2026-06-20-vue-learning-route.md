# Vue.js Learning & Interview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/vue` — a combined Vue 3 knowledge base (~1200 line markdown) and interview prep page (~32 open Q&A + ~20 MCQ), with shared interview UI extracted from `/interview-qa`.

**Architecture:** Extract interview components into `app/components/interview/`, refactor `/interview-qa` to import them unchanged. Server page reads markdown; client `VuePageClient` handles top tabs (`#knowledge` / `#interview`), sticky TOC sidebar, and `InterviewPanel`. Extend `MarkdownViewer` with slugified H2 `id` attributes for TOC scroll.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, react-markdown, TypeScript

**Spec:** `docs/superpowers/specs/2026-06-20-vue-learning-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `app/components/interview/types.ts` | Shared Section / MCQ types |
| Create | `app/components/interview/MCQContent.tsx` | MCQ option list + reveal |
| Create | `app/components/interview/AnswerContent.tsx` | Render answer variants |
| Create | `app/components/interview/QAItem.tsx` | Single question accordion |
| Create | `app/components/interview/SectionBlock.tsx` | Collapsible section |
| Create | `app/components/interview/InterviewPanel.tsx` | Search, filter, stats, section list |
| Create | `app/components/interview/filterSections.ts` | Pure filter helper |
| Modify | `app/interview-qa/page.tsx` | Import shared components; keep `sections` data |
| Create | `app/components/markdown-slug.ts` | `slugifyHeading()` utility |
| Modify | `app/components/MarkdownViewer.tsx` | Add `id` to H2 via slugify |
| Create | `app/vue/parseToc.ts` | Parse `## headings` from markdown |
| Create | `app/vue/VuePageClient.tsx` | Tabs, TOC sidebar, interview panel |
| Create | `app/vue/page.tsx` | Server shell: read markdown + TOC |
| Create | `app/vue/vue-interview-data.ts` | 9 sections, 32 open + 20 MCQ |
| Create | `app/components/vue-knowledge-base.md` | 18 sections, ~1200 lines |
| Modify | `app/components/Sidebar.tsx` | Add Vue.js nav item |

---

## Task 1: Shared interview types

**Files:**
- Create: `app/components/interview/types.ts`

- [ ] **Step 1: Create types file**

```typescript
// app/components/interview/types.ts

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
```

- [ ] **Step 2: Commit**

```bash
git add app/components/interview/types.ts
git commit -m "feat: add shared interview types for Q&A panels"
```

---

## Task 2: MCQContent and AnswerContent

**Files:**
- Create: `app/components/interview/MCQContent.tsx`
- Create: `app/components/interview/AnswerContent.tsx`

- [ ] **Step 1: Create MCQContent** (copy from `app/interview-qa/page.tsx` lines 671–713)

```tsx
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
              <span className="text-green-500 dark:text-green-400 font-bold shrink-0">✓</span>
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
              <span className="text-blue-700 dark:text-blue-300"> — {answer.explanation}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create AnswerContent**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add app/components/interview/MCQContent.tsx app/components/interview/AnswerContent.tsx
git commit -m "feat: extract MCQContent and AnswerContent interview components"
```

---

## Task 3: QAItem and SectionBlock

**Files:**
- Create: `app/components/interview/QAItem.tsx`
- Create: `app/components/interview/SectionBlock.tsx`

- [ ] **Step 1: Create QAItem** (copy from `interview-qa/page.tsx` lines 757–805, import types + AnswerContent)

```tsx
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
```

- [ ] **Step 2: Create SectionBlock** (copy from lines 808–861)

- [ ] **Step 3: Commit**

```bash
git add app/components/interview/QAItem.tsx app/components/interview/SectionBlock.tsx
git commit -m "feat: extract QAItem and SectionBlock interview components"
```

---

## Task 4: InterviewPanel + filter helper + refactor interview-qa

**Files:**
- Create: `app/components/interview/filterSections.ts`
- Create: `app/components/interview/InterviewPanel.tsx`
- Modify: `app/interview-qa/page.tsx`

- [ ] **Step 1: Create filterSections.ts**

```typescript
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
```

- [ ] **Step 2: Create InterviewPanel.tsx**

```tsx
"use client";

import { useState } from "react";
import type { Section } from "./types";
import { SectionBlock } from "./SectionBlock";
import { countMCQ, filterSections } from "./filterSections";

type InterviewPanelProps = {
  sections: Section[];
  statsLabel?: string;
  showTips?: boolean;
};

export function InterviewPanel({
  sections,
  statsLabel,
  showTips = false,
}: InterviewPanelProps) {
  const [search, setSearch] = useState("");
  const filtered = filterSections(sections, search);
  const totalQuestions = sections.reduce((acc, s) => acc + s.items.length, 0);
  const totalMCQ = countMCQ(sections);

  return (
    <div>
      {statsLabel && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{statsLabel}</p>
      )}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        {totalQuestions} câu hỏi • {sections.length} sections •{" "}
        <span className="text-violet-500">{totalMCQ} quiz (A/B/C/D)</span>
      </p>

      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
              ["Câu hỏi technical khó", "Nói to suy nghĩ, đừng im lặng. Interviewer đánh giá cả process"],
              ["Câu hỏi bạn không biết", '"Tôi chưa dùng cái đó nhưng tôi sẽ approach theo hướng..."'],
              ["Câu hỏi về điểm yếu", "Chọn điểm yếu thật nhưng đang cải thiện"],
              ["Câu hỏi về conflict", "Dùng STAR method: Situation, Task, Action, Result"],
            ].map(([situation, advice]) => (
              <div key={situation}>
                <span className="font-medium">{situation}:</span> {advice}
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-8">Không tìm thấy kết quả.</p>
      ) : (
        filtered.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))
      )}
    </div>
  );
}
```

- [ ] **Step 3: Refactor `app/interview-qa/page.tsx`**

Remove local types and components (`MCQContent`, `AnswerContent`, `QAItem`, `SectionBlock`). Keep `"use client"`, the `sections` array, page header, and render:

```tsx
"use client";

import { InterviewPanel } from "../components/interview/InterviewPanel";
import type { Section } from "../components/interview/types";

const sections: Section[] = [
  // ... existing sections data unchanged ...
];

export default function InterviewQA() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Interview Q&amp;A
        </h1>
      </div>
      <InterviewPanel sections={sections} showTips />
    </div>
  );
}
```

- [ ] **Step 4: Verify interview-qa still works**

Run: `pnpm dev`  
Navigate: `http://localhost:3000/interview-qa`  
Expected: Page loads, search works, accordion opens, MCQ reveal works, tips banner visible.

- [ ] **Step 5: Commit**

```bash
git add app/components/interview/ app/interview-qa/page.tsx
git commit -m "refactor: extract InterviewPanel and refactor interview-qa"
```

---

## Task 5: Markdown slug utility + MarkdownViewer H2 ids

**Files:**
- Create: `app/components/markdown-slug.ts`
- Modify: `app/components/MarkdownViewer.tsx`

- [ ] **Step 1: Create markdown-slug.ts**

```typescript
export function slugifyHeading(text: string): string {
  return text
    .replace(/^\d+\.\s*/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
```

- [ ] **Step 2: Update MarkdownViewer h2 renderer**

```tsx
import { slugifyHeading } from "./markdown-slug";

// inside components prop:
h2: ({ children }) => {
  const text = String(children);
  const id = slugifyHeading(text);
  return (
    <h2
      id={id}
      className="text-base font-semibold text-gray-900 mt-7 mb-2.5 flex items-center gap-2 scroll-mt-24"
    >
      <span className="w-1 h-4 bg-blue-500 rounded-full inline-block shrink-0"></span>
      {children}
    </h2>
  );
},
```

- [ ] **Step 3: Commit**

```bash
git add app/components/markdown-slug.ts app/components/MarkdownViewer.tsx
git commit -m "feat: add slugified id attributes to markdown H2 headings"
```

---

## Task 6: parseToc + VuePageClient + page shell

**Files:**
- Create: `app/vue/parseToc.ts`
- Create: `app/vue/VuePageClient.tsx`
- Create: `app/vue/page.tsx`

- [ ] **Step 1: Create parseToc.ts**

```typescript
import { slugifyHeading } from "../components/markdown-slug";

export type TocItem = { id: string; title: string };

export function parseToc(markdown: string): TocItem[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const title = line.slice(3).trim();
      return { id: slugifyHeading(title), title };
    });
}
```

- [ ] **Step 2: Create VuePageClient.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import MarkdownViewer from "../components/MarkdownViewer";
import { InterviewPanel } from "../components/interview/InterviewPanel";
import type { TocItem } from "./parseToc";
import type { Section } from "../components/interview/types";

type Tab = "knowledge" | "interview";

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
  const [tab, setTab] = useState<Tab>("knowledge");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === "interview") setTab("interview");
    else setTab("knowledge");
  }, []);

  function switchTab(next: Tab) {
    setTab(next);
    window.history.replaceState(null, "", next === "interview" ? "#interview" : "#knowledge");
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
```

- [ ] **Step 3: Create page.tsx**

```tsx
import fs from "fs";
import path from "path";
import VuePageClient from "./VuePageClient";
import { parseToc } from "./parseToc";
import { vueInterviewSections } from "./vue-interview-data";

const TAGS = [
  "Composition API",
  "script setup",
  "Reactivity",
  "Pinia",
  "Vue Router",
  "Composables",
  "Testing",
  "TypeScript",
];

export default function VuePage() {
  const filePath = path.join(process.cwd(), "app/components/vue-knowledge-base.md");
  const content = fs.readFileSync(filePath, "utf-8");
  const toc = parseToc(content);

  return (
    <VuePageClient
      content={content}
      toc={toc}
      interviewSections={vueInterviewSections}
      tags={TAGS}
    />
  );
}
```

- [ ] **Step 4: Commit shell (before content files exist, page will 404 on import — complete Task 7+8 first or stub vue-interview-data.ts and vue-knowledge-base.md with minimal content)**

Create stub files first if needed:
- `vue-knowledge-base.md`: `# Vue Knowledge Base\n\n## 0. Tổng quan Vue 3\n\nPlaceholder.`
- `vue-interview-data.ts`: `export const vueInterviewSections = [];`

- [ ] **Step 5: Commit**

```bash
git add app/vue/
git commit -m "feat: add Vue page shell with tabs and TOC sidebar"
```

---

## Task 7: Vue interview data (32 open + 20 MCQ)

**Files:**
- Create: `app/vue/vue-interview-data.ts`

- [ ] **Step 1: Create complete interview data file**

Export `vueInterviewSections: Section[]` with 9 sections. Import `Section` from `../components/interview/types`.

**Section I — `id: "vue-core"` — 5 items:**
1. `ref` vs `reactive` — khi nào dùng cái nào?
2. Vue 3 reactivity hoạt động thế nào? (Proxy)
3. `computed` vs method trong template — khác biệt?
4. `watch` vs `watchEffect` — khác biệt và use case?
5. `shallowRef` / `shallowReactive` dùng khi nào?

**Section II — `id: "vue-composition"` — 4 items:**
1. `<script setup>` là gì? Lợi ích so với `setup()`?
2. Composables pattern — quy tắc đặt tên và khi nào tách?
3. `defineExpose` dùng khi nào?
4. Các compiler macros phổ biến trong script setup?

**Section III — `id: "vue-components"` — 4 items:**
1. Props validation với TypeScript (`defineProps`)
2. `v-model` và `defineModel` (Vue 3.4+)
3. Slots: default, named, scoped — giải thích
4. `provide` / `inject` vs props drilling

**Section IV — `id: "vue-router"` — 4 items:**
1. Các loại navigation guards trong Vue Router 4
2. Lazy loading routes — cách implement
3. Nested routes — cấu trúc và `<router-view>`
4. Programmatic navigation — `router.push` vs `router.replace`

**Section V — `id: "vue-pinia"` — 4 items:**
1. Khi nào dùng Pinia vs local component state?
2. Cấu trúc store: state, getters, actions
3. Composition-style Pinia store
4. Chia sẻ state giữa nhiều components

**Section VI — `id: "vue-performance"` — 3 items:**
1. `<keep-alive>` — use case và `include`/`exclude`
2. `v-memo` — khi nào dùng?
3. Tối ưu list lớn với `v-for` và `:key`

**Section VII — `id: "vue-advanced"` — 4 items:**
1. `<Teleport>` — use case thực tế
2. `<Suspense>` với async setup / async components
3. `defineAsyncComponent` — lazy load component
4. Custom directives — ví dụ `v-focus`

**Section VIII — `id: "vue-scenario"` — 4 items:**
1. Debug Vue app trong DevTools
2. Memory leak phổ biến trong Vue và cách tránh
3. Feature-based vs type-based folder structure
4. Xử lý API errors trong Vue (composable pattern)

**Section IX — `id: "vue-mcq"` — title: `"IX. Vue — Quiz (Multiple Choice)"` — 20 MCQ items:**

| # | Topic | correct |
|---|-------|---------|
| 1 | Primitive value nên dùng `ref` hay `reactive`? | A: ref |
| 2 | `computed` re-evaluate khi nào? | lazy, khi dependency đổi |
| 3 | `watchEffect` chạy lần đầu? | ngay lập tức |
| 4 | `v-if` vs `v-show` | v-if destroy/create DOM |
| 5 | Pinia store id unique scope | global app |
| 6 | `router.beforeEach` guard type | global beforeEach |
| 7 | `defineModel` thay thế | modelValue + update:modelValue |
| 8 | `onMounted` chạy khi nào | sau DOM mount |
| 9 | `key` trong v-for mục đích | track identity, reuse DOM |
| 10 | `provide/inject` reactivity | ref/reactive qua provide |
| 11 | `<script setup>` scope | module scope, không cần return |
| 12 | `shallowRef` trigger update | chỉ khi .value thay đổi reference |
| 13 | Teleport target | element ngoài component tree |
| 14 | Pinia getter vs computed in component | getter cached in store |
| 15 | Lazy route import syntax | `() => import('./Page.vue')` |
| 16 | `watch` vs `watchEffect` lazy | watch lazy by default |
| 17 | `defineEmits` type syntax | `defineEmits<{ submit: [id: number] }>()` |
| 18 | keep-alive cache | component instance preserved |
| 19 | Vue 3 reactivity API base | Proxy |
| 20 | Composable naming | must start with `use` |

Write full Vietnamese answers for open questions (use `string[]` bullet format like interview-qa). Write full MCQ objects with 4 options each.

- [ ] **Step 2: Verify counts**

Run in Node or manually count: 32 non-MCQ items across sections I–VIII, 20 MCQ in section IX, 9 sections total.

- [ ] **Step 3: Commit**

```bash
git add app/vue/vue-interview-data.ts
git commit -m "feat: add Vue interview Q&A and MCQ data"
```

---

## Task 8: Vue knowledge base markdown (sections 0–8)

**Files:**
- Create: `app/components/vue-knowledge-base.md`

**Reference depth:** Mirror `app/components/angular-knowledge-base.md` — each section has prose + multiple TypeScript code blocks.

- [ ] **Step 1: Write sections 0–8** (~650 lines)

Required `## headings` (must match parseToc):

```
## 0. Tổng quan Vue 3
## 1. Project Setup
## 2. Composition API
## 3. Reactivity
## 4. Components
## 5. Template & Directives
## 6. Lifecycle Hooks
## 7. Vue Router 4
## 8. Pinia
```

Each section must include:
- Intro paragraph (Vietnamese)
- At least 2 code blocks (```typescript or ```vue)
- Comparison table where relevant (e.g. ref vs reactive in §3)

**§0 must cover:** Vue 3 as progressive framework, Vite, SFC structure (template/script/style), reactivity overview.

**§3 must include code for:** `ref`, `reactive`, `computed`, `watch`, `watchEffect`, `toRef`, `toRefs`.

**§8 must include:** Options store + Setup store examples with Pinia.

- [ ] **Step 2: Commit**

```bash
git add app/components/vue-knowledge-base.md
git commit -m "feat: add Vue knowledge base sections 0-8"
```

---

## Task 9: Vue knowledge base markdown (sections 9–17)

**Files:**
- Modify: `app/components/vue-knowledge-base.md`

- [ ] **Step 1: Append sections 9–17** (~550 lines, total file ~1200 lines)

```
## 9. Composables
## 10. Forms & Validation
## 11. Async & Suspense
## 12. Performance
## 13. Testing
## 14. TypeScript
## 15. Cấu trúc Project
## 16. Interview Tips
## 17. Quick Reference
```

**§9:** Full `useFetch` composable example.

**§13:** Vitest + `@vue/test-utils` mount example.

**§17:** Markdown table cheat sheet: API | Syntax | Notes (≥15 rows).

- [ ] **Step 2: Verify line count**

Run: `powershell -Command "(Get-Content app/components/vue-knowledge-base.md).Count"`  
Expected: ≥ 1100 lines

- [ ] **Step 3: Commit**

```bash
git add app/components/vue-knowledge-base.md
git commit -m "feat: complete Vue knowledge base sections 9-17"
```

---

## Task 10: Sidebar nav item

**Files:**
- Modify: `app/components/Sidebar.tsx`

- [ ] **Step 1: Add Vue.js item after Angular** (inside Interview Prep `items` array)

```tsx
{
  href: "/vue",
  label: "Vue.js",
  icon: (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
},
```

- [ ] **Step 2: Commit**

```bash
git add app/components/Sidebar.tsx
git commit -m "feat: add Vue.js link to sidebar navigation"
```

---

## Task 11: Final verification

- [ ] **Step 1: Lint**

Run: `pnpm lint`  
Expected: no errors

- [ ] **Step 2: Production build**

Run: `pnpm build`  
Expected: build succeeds, `/vue` route listed

- [ ] **Step 3: Manual smoke test**

| Check | URL / Action | Expected |
|-------|--------------|----------|
| Knowledge tab | `/vue` | Markdown renders, TOC visible on lg+ |
| TOC scroll | Click TOC item | Smooth scroll to H2 |
| Interview tab | Click "Phỏng vấn" | 52 questions, search works |
| Hash deep link | `/vue#interview` | Opens interview tab |
| MCQ | Open quiz, Reveal Answer | Shows correct + explanation |
| interview-qa regression | `/interview-qa` | Unchanged behavior, tips visible |
| Sidebar | Click Vue.js | Active highlight on `/vue` |

- [ ] **Step 4: Final commit if any fixups**

```bash
git add -A
git commit -m "fix: address Vue page verification issues"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|------------------|------|
| Route `/vue` | Task 6 |
| Top tabs + hash persistence | Task 6 (VuePageClient) |
| Knowledge markdown ~1200 lines | Tasks 8, 9 |
| 32 open + 20 MCQ | Task 7 |
| Shared interview components | Tasks 1–4 |
| interview-qa refactor unchanged | Task 4 |
| MarkdownViewer H2 ids | Task 5 |
| TOC sidebar | Tasks 5, 6 |
| Sidebar Vue.js link | Task 10 |
| No tips on Vue interview tab | Task 6 (`showTips` omitted) |
| Vue 3 pure, no React comparison | Tasks 8, 9 content guidance |

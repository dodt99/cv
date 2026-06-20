# Vue.js Learning & Interview — Design Spec

**Date:** 2026-06-20  
**Route:** `/vue`  
**Sidebar group:** Interview Prep  
**Pattern:** Single page combining knowledge base (markdown) and interview Q&A (interactive), with top-level tabs and inner navigation

---

## Goals

Add a dedicated Vue.js section to the portfolio/learning app for:

1. **Knowledge consolidation** — comprehensive Vue 3 reference (~1200 lines markdown)
2. **Interview preparation** — open-ended Q&A (~32 questions) + MCQ quiz (~20 questions)

Content is **Vue 3 pure** (Composition API, `<script setup>`, Pinia). No React comparison focus.

---

## User Decisions (Brainstorming)

| Decision | Choice |
|---|---|
| Structure | Single `/vue` page (knowledge + interview combined) |
| Perspective | Pure Vue 3 — explain concepts independently |
| Version | Vue 3 only |
| Layout | Top tabs (Kiến thức / Phỏng vấn) + sidebar TOC or accordion inside each tab |
| Interview format | Open Q&A accordion + separate MCQ quiz section (same as `/interview-qa`) |
| Content scope | Full — ~1200 line KB + 30+ open questions + 20 MCQ |
| Implementation | Extract shared interview components; refactor `/interview-qa` to use them |

---

## Architecture

### Page layout

```
┌─────────────────────────────────────────────┐
│ Header: Vue.js · Vue 3 · Job Prep badge     │
│ Tag pills: Composition API, Pinia, Router…  │
├─────────────────────────────────────────────┤
│  [ Kiến thức ]  [ Phỏng vấn ]    ← top tabs │
├─────────────────────────────────────────────┤
│ Tab Kiến thức:                              │
│  ┌──────────┬──────────────────────────┐  │
│  │ Sidebar  │ MarkdownViewer           │  │
│  │ TOC (H2) │ vue-knowledge-base.md    │  │
│  │ sticky   │                          │  │
│  └──────────┴──────────────────────────┘  │
│                                             │
│ Tab Phỏng vấn:                              │
│  Search bar + stats                         │
│  Sections I–VIII: Câu hỏi mở (accordion)    │
│  Section IX: Quiz MCQ (accordion)           │
└─────────────────────────────────────────────┘
```

### Tab state

Persist active tab via URL hash (`#knowledge` / `#interview`) so users can bookmark or share links.

- Default: `#knowledge`
- On mount, read hash and set active tab; on tab change, update hash without full navigation

### Server vs client split

| Part | Rendering | Reason |
|---|---|---|
| Page shell, markdown read | Server Component | `fs.readFileSync` for markdown (same as `/angular`) |
| Top tabs, sidebar TOC scroll, interview UI | Client Component | Interactivity (tabs, accordion, search, MCQ reveal) |

---

## File Structure

```
app/vue/
├── page.tsx                  # Server: read markdown, render header + VuePageClient
├── VuePageClient.tsx         # Client: tabs, knowledge TOC sidebar, interview panel
└── vue-interview-data.ts     # Section[] with ~32 open + ~20 MCQ items

app/components/
├── vue-knowledge-base.md     # ~1200 lines, 18 sections
└── interview/                # Extracted from interview-qa/page.tsx
    ├── types.ts              # Section, MCQOption, MCQAnswer
    ├── MCQContent.tsx
    ├── AnswerContent.tsx
    ├── QAItem.tsx
    ├── SectionBlock.tsx
    └── InterviewPanel.tsx    # Search + filter + section list

app/interview-qa/page.tsx     # Refactored: import shared interview components + keep sections data inline
app/components/Sidebar.tsx    # Add Vue.js nav item under Interview Prep
```

---

## Knowledge Base Content

**File:** `app/components/vue-knowledge-base.md`  
**Language:** Vietnamese prose + English technical terms + TypeScript code examples  
**Renderer:** Existing `MarkdownViewer` (remark-gfm, rehype-highlight)

| # | Section | Topics |
|---|---|---|
| 0 | Tổng quan Vue 3 | SPA framework, Vite, SFC, reactivity system overview |
| 1 | Project Setup | `create-vue`, folder structure, `vite.config.ts` |
| 2 | Composition API | `setup()`, `<script setup>`, brief Options API mention (legacy context only) |
| 3 | Reactivity | `ref`, `reactive`, `computed`, `watch`, `watchEffect`, `toRef`, `toRefs`, `shallowRef` |
| 4 | Components | props, emits, slots, `defineModel`, dynamic/async components |
| 5 | Template & Directives | `v-if/for/show`, `v-bind/on`, custom directives |
| 6 | Lifecycle Hooks | `onMounted`, `onUnmounted`, `onUpdated`, `onBeforeMount`, etc. |
| 7 | Vue Router 4 | routes, navigation guards, lazy routes, nested routes, route meta |
| 8 | Pinia | stores, state/getters/actions, composition-style stores, store composition |
| 9 | Composables | `use*` pattern, reusable logic extraction |
| 10 | Forms & Validation | `v-model`, form handling, VeeValidate overview |
| 11 | Async & Suspense | `defineAsyncComponent`, `<Suspense>`, loading/error states |
| 12 | Performance | `keep-alive`, lazy loading, `v-memo`, `shallowRef`, code splitting |
| 13 | Testing | Vitest + Vue Test Utils, mount vs shallowMount |
| 14 | TypeScript | `defineProps<T>()`, typed emits, generic components |
| 15 | Cấu trúc Project | feature-based vs type-based folder layout |
| 16 | Interview Tips | How to answer common Vue interview questions |
| 17 | Quick Reference | Cheat sheet of frequently used APIs |

Each section includes practical code snippets. Target length: ~1200 lines (comparable to `angular-knowledge-base.md`).

### Knowledge tab — sidebar TOC

- Server parses `## ` headings from markdown via regex; produces `{ id, title }[]` for TOC
- Extend `MarkdownViewer` h2 renderer: slugify heading text → set `id` attribute (e.g. `"3. Reactivity"` → `id="3-reactivity"`)
- Sticky left sidebar (~180px); click calls `document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })`
- Slugify rule: lowercase, strip leading `N. ` prefix, replace spaces/special chars with `-`

---

## Interview Content

**File:** `app/vue/vue-interview-data.ts`  
**Format:** Same `Section[]` type as `/interview-qa`

### Open questions (~32), Sections I–VIII

| Section | Title | Topics | ~Count |
|---|---|---|---|
| I | Core & Reactivity | ref vs reactive, computed caching, watch vs watchEffect | 5 |
| II | Composition API & script setup | setup syntax, composables, script setup macros | 4 |
| III | Components & Communication | props/emits, slots, v-model, provide/inject | 4 |
| IV | Vue Router | guards, lazy loading, nested routes, navigation | 4 |
| V | Pinia & State Management | store design, when to use Pinia vs local state | 4 |
| VI | Performance & Optimization | keep-alive, v-memo, lazy components, list keys | 3 |
| VII | Advanced | Teleport, Suspense, async components, custom directives | 4 |
| VIII | Thực hành & Scenario | debugging, common pitfalls, project structure decisions | 4 |

Answer formats: `string`, `string[]` (bullet lists), or `{ type: "table", headers, rows }` where appropriate.

### MCQ quiz (~20), Section IX

Separate section titled **"IX. Vue — Quiz (Multiple Choice)"**.

Each item uses:

```typescript
{
  type: "mcq",
  options: [{ label: "A", text: "..." }, ...],
  correct: "B",
  explanation: "..."
}
```

Sample topics: ref vs reactive, watch vs watchEffect, Pinia vs component state, route guard types, v-if vs v-show, computed lazy evaluation, v-for key importance, `defineModel`, `keep-alive` behavior, `<script setup>` macros.

### Interview tab UI

Reuse `InterviewPanel` with:

- Search input (filter by question text, answer text, MCQ options/explanation)
- Stats line: `{total} câu hỏi • {sections} sections • {mcqCount} quiz (A/B/C/D)`
- Collapsible section headers with item count badges
- Per-question accordion with reveal for open answers; MCQ with option select + "Reveal Answer"

No global "tips banner" on Vue page (keeps page focused; general tips remain on `/interview-qa`).

---

## Shared Interview Components (Extract)

Move from `app/interview-qa/page.tsx` into `app/components/interview/`:

| Component | Responsibility |
|---|---|
| `types.ts` | `MCQOption`, `MCQAnswer`, `Section`, `SectionItem` types |
| `MCQContent.tsx` | Option buttons, reveal correct answer + explanation |
| `AnswerContent.tsx` | Render string / string[] / table / MCQ answer types |
| `QAItem.tsx` | Single question accordion |
| `SectionBlock.tsx` | Collapsible section with question list |
| `InterviewPanel.tsx` | Search state, filter logic, stats, map sections to `SectionBlock` |

**Refactor constraint:** `/interview-qa` behavior and appearance must remain unchanged after extraction. Only the component location changes; `sections` data stays in `interview-qa/page.tsx`.

---

## Sidebar Integration

Add to `app/components/Sidebar.tsx` under **Interview Prep**, after Angular:

```tsx
{
  href: "/vue",
  label: "Vue.js",
  icon: /* Vue-style icon: layered V or green accent hex */,
}
```

No `"New"` badge initially (optional — can add if desired).

---

## Styling

Follow existing pages (`/angular`, `/interview-qa`):

- Page container: `max-w-3xl` for interview tab; knowledge tab may use wider layout (`max-w-5xl`) to accommodate sidebar + content
- Header: category label `"Interview Prep"`, title `"Vue.js"`, `"Job Prep"` badge, subtitle describing Vue 3 focus
- Tag pills row (same pattern as Angular page): Composition API, Pinia, Vue Router, Composables, Testing, etc.
- Cards: `bg-white rounded-xl border border-gray-200 shadow-sm`
- Interview tab inherits zinc/blue palette from `interview-qa` (including dark mode classes if present)

---

## Out of Scope

- Vue 2 deep dive or migration guide (Options API covered only as brief legacy mention in KB)
- React vs Vue comparison sections
- Live Vue code playground / StackBlitz embed
- Adding Vue sections to `/interview-qa` (all Vue interview content lives on `/vue` only)
- Automated tests (no test suite configured in project)

---

## Verification

Manual checks after implementation:

1. `pnpm dev` — navigate to `/vue`, both tabs render
2. Tab hash persistence — `#interview` loads interview tab directly
3. Knowledge sidebar TOC scrolls to correct sections
4. Interview search filters questions correctly
5. MCQ reveal shows correct answer and explanation
6. `/interview-qa` unchanged in behavior after component extraction
7. Sidebar shows Vue.js link; active state highlights on `/vue`
8. `pnpm build` passes without errors
9. `pnpm lint` passes

---

## Implementation Approach

**Recommended:** Extract shared interview components first (refactor `/interview-qa`), then build `/vue` page shell and content files. This avoids duplicate UI code and validates the extraction before adding new content.

Estimated new content volume:

- `vue-knowledge-base.md`: ~1200 lines
- `vue-interview-data.ts`: ~32 open + ~20 MCQ items
- New/modified TS/TSX files: ~8 files

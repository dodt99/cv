# React Internals — Design Spec

**Date:** 2026-04-02  
**Route:** `/exercises/react-internals`  
**Pattern:** Follows the WebSocket exercise page exactly (sticky mini-nav, scroll-tracked sections, `"use client"` page shell)

---

## Topics Covered

1. **Fiber Architecture** — fiber nodes, reconciliation algorithm, work loop
2. **Rendering Phases** — render phase vs commit phase
3. **Batching** — automatic batching (React 18+), `flushSync`

---

## File Structure

```
app/exercises/react-internals/
├── page.tsx
└── components/
    ├── FiberSection.tsx
    ├── PhasesSection.tsx
    └── BatchingSection.tsx
```

Sidebar: new "React Internals" nav item under **Exercises**, badge `"New"`.

---

## Section Designs

### §1 FiberSection — Fiber Architecture

**Theory:**
- A fiber node is a plain JS object representing a unit of work (one component instance).
- React maintains two trees: the **current tree** (what is on screen) and the **work-in-progress tree** (what React is building for the next commit).
- The **work loop** processes fibers one at a time. In Concurrent Mode, React can pause and resume this loop, yielding to the browser between units of work.

**Demo:** Annotated HTML card tree for a small hierarchy (`App → Counter → button`). Two columns — current tree (gray) and work-in-progress tree (blue). Each card shows key fiber fields: `type`, `key`, `pendingProps`, `memoizedState`, `child`, `sibling`, `return`. A legend below explains each field.

---

### §2 PhasesSection — Render vs Commit

**Theory:**
- **Render phase:** React calls component functions and diffs fiber trees. Pure, no side effects. Can be interrupted (Concurrent Mode).
- **Commit phase:** React applies DOM mutations, runs `useLayoutEffect` (synchronously, before paint), paints, then runs `useEffect`. Always synchronous; never interrupted.

**Demo:** Horizontal stepper with steps: `Render` → `Reconcile` → `Commit (DOM)` → `useLayoutEffect` → `Paint` → `useEffect`. A "Trigger re-render" button animates a highlight moving through each step with a short description. An on-screen log box shows the actual execution order of logs from the render body, `useLayoutEffect`, and `useEffect`.

---

### §3 BatchingSection — Automatic Batching + flushSync

**Demo (first):** Two buttons side by side:
- **"Batched (×3 setState)"** — triggers 3 state updates inside one event handler → render counter increments by 1.
- **"flushSync (×3 setState)"** — wraps each update in `flushSync` → render counter increments by 3.
A visible render count and an on-screen log list make the difference obvious.

**Code comparison (below demo):**
- React 17: only batches inside React event handlers; `setTimeout`/promises cause separate renders.
- React 18: batches everywhere by default (automatic batching).
- `flushSync`: opt-out escape hatch to force a synchronous flush of pending state updates.

---

## Sidebar Integration

Add to `app/components/Sidebar.tsx` under the **Exercises** group:

```tsx
{
  href: "/exercises/react-internals",
  label: "React Internals",
  icon: <...>,   // atom/nucleus SVG
  badge: "New",
}
```

---

## Constraints

- No test suite — no tests to write.
- All components are Client Components (`"use client"` on the page shell is sufficient).
- Tailwind v4 via PostCSS — no config file, class-based only.
- No new dependencies — animations use CSS transitions / `useState` state machines only.
- Follow the visual language of the WebSocket page exactly: `SectionHeader`, `ConceptCard`-style cards, `pre` blocks for code snippets, gray/white card backgrounds.

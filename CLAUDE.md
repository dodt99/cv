# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm lint       # Run ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 16 / React 19** portfolio + learning app. It uses the App Router exclusively — no Pages Router.

**Package manager:** pnpm (use `pnpm`, not `npm` or `yarn`)

**Path alias:** `@/*` maps to the repo root (e.g. `@/app/components/Sidebar`).

**Styling:** Tailwind CSS v4 via PostCSS — no `tailwind.config.*` file; configuration is done in CSS.

### App structure

```
app/
├── layout.tsx              # Root layout: Geist fonts, Sidebar + <main> wrapper
├── page.tsx                # Dashboard / portfolio home
├── components/
│   ├── Sidebar.tsx         # Client component — icon-based nav
│   └── MarkdownViewer.tsx  # Client component — react-markdown + rehype-highlight
├── exercises/
│   ├── intercept/          # Intercepting routes demo (@modal parallel slot)
│   └── slots/              # Parallel routes demo (@feed, @stats slots)
└── [other routes]/         # study-roadmap, interview-qa, angular, roadmap, knowledge-base, image-optimization
```

### Key architectural points

- **Intercepting routes** (`exercises/intercept`): uses `(.)photo/[id]` convention inside an `@modal` parallel slot. Consult `node_modules/next/dist/docs/` before modifying — this API changed significantly in Next.js 16.
- **Parallel routes** (`exercises/slots`): `@feed` and `@stats` slots rendered in the slots layout.
- **MarkdownViewer**: renders markdown with GitHub-flavored markdown (`remark-gfm`) and syntax highlighting (`rehype-highlight` + `highlight.js`). It is a Client Component (`"use client"`).
- **Images**: only `picsum.photos` is whitelisted in `next.config.ts` as a remote image host.
- **Deployment:** Vercel (no static export).

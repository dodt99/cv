"use client";

import { useState, useMemo } from "react";

const PHASES = [
  {
    id: "phase1",
    title: "Phase 1: Củng cố nền tảng Mid-Level",
    duration: "Tuần 1–4",
    color: "#3B82F6",
    weeks: [
      {
        week: "Tuần 1",
        title: "React Hooks Mastery",
        focus: "Nắm vững mọi built-in hooks",
        daily: [
          {
            day: "T2",
            task: "Ôn lại useState, useEffect, useRef — viết lại từ đầu 3 component quen thuộc KHÔNG nhìn code cũ",
            type: "practice",
          },
          {
            day: "T3",
            task: "useReducer: xây Counter → TodoApp → Shopping Cart với reducer pattern. So sánh với useState version",
            type: "practice",
          },
          {
            day: "T4",
            task: "useContext: xây ThemeProvider + AuthProvider. Thực hành tách context, tránh re-render thừa",
            type: "practice",
          },
          {
            day: "T5",
            task: "useMemo + useCallback: profile app bằng React DevTools, tìm unnecessary re-renders, apply memoization CÓ CHỌN LỌC",
            type: "practice",
          },
          {
            day: "T6",
            task: "useTransition + useDeferredValue: xây search với 10,000 items, so sánh performance có/không dùng concurrent features",
            type: "practice",
          },
          {
            day: "T7-CN",
            task: "Đọc: react.dev/reference/react — đọc kỹ phần 'Pitfalls' và 'Troubleshooting' của MỖI hook",
            type: "theory",
          },
        ],
        resources: [
          "https://react.dev/reference/react/hooks",
          "https://react.dev/learn/you-might-not-need-an-effect",
        ],
        milestone:
          "Tự tin giải thích khi nào dùng hook nào, viết được component phức tạp không cần tra cứu",
      },
      {
        week: "Tuần 2",
        title: "Custom Hooks & Patterns",
        focus: "Tách logic, tái sử dụng, abstract hóa",
        daily: [
          {
            day: "T2",
            task: "Viết useDebounce + useThrottle từ scratch. Test với search input",
            type: "practice",
          },
          {
            day: "T3",
            task: "Viết useLocalStorage + useSessionStorage — handle SSR, serialize/deserialize, error handling",
            type: "practice",
          },
          {
            day: "T4",
            task: "Viết useMediaQuery + useOnClickOutside + useEventListener",
            type: "practice",
          },
          {
            day: "T5",
            task: "Viết useIntersectionObserver → áp dụng: lazy load images, infinite scroll trigger",
            type: "practice",
          },
          {
            day: "T6",
            task: "Viết useFetch (basic) → so sánh với TanStack Query ở tuần sau. Viết usePrevious + useInterval",
            type: "practice",
          },
          {
            day: "T7-CN",
            task: "Refactor 1 project cũ: tìm logic lặp lại, extract thành custom hooks. Đọc source code usehooks.com",
            type: "review",
          },
        ],
        resources: [
          "https://react.dev/learn/reusing-logic-with-custom-hooks",
          "https://usehooks.com/",
          "https://usehooks-ts.com/",
        ],
        milestone:
          "Có bộ hooks library cá nhân (8-10 hooks), hiểu khi nào cần extract logic thành hook",
      },
      {
        week: "Tuần 3",
        title: "State Management",
        focus: "Zustand, Jotai, URL state, phân biệt loại state",
        daily: [
          {
            day: "T2",
            task: "Zustand cơ bản: tạo cart store, auth store. Sử dụng selectors để tránh re-render",
            type: "practice",
          },
          {
            day: "T3",
            task: "Zustand nâng cao: middleware (persist, devtools), slices pattern cho store lớn, immer middleware",
            type: "practice",
          },
          {
            day: "T4",
            task: "Jotai: tạo atoms, derived atoms, async atoms. So sánh DX với Zustand — khi nào dùng gì",
            type: "practice",
          },
          {
            day: "T5",
            task: "URL State: dùng useSearchParams sync filter/sort/pagination với URL. Xây product filter page",
            type: "practice",
          },
          {
            day: "T6",
            task: "Bài tập tổng hợp: xây mini e-commerce với Zustand (cart) + URL state (filters) + local state (UI)",
            type: "project",
          },
          {
            day: "T7-CN",
            task: "Đọc: so sánh Redux Toolkit vs Zustand vs Jotai vs Valtio. Viết ADR cho dự án hiện tại",
            type: "theory",
          },
        ],
        resources: [
          "https://zustand-demo.pmnd.rs/",
          "https://jotai.org/docs/introduction",
          "https://tkdodo.eu/blog/practical-react-query",
        ],
        milestone:
          "Biết phân loại state (UI/server/global/URL) và chọn đúng tool cho từng loại",
      },
      {
        week: "Tuần 4",
        title: "Data Fetching & Forms",
        focus: "TanStack Query, React Hook Form + Zod",
        daily: [
          {
            day: "T2",
            task: "TanStack Query: setup, useQuery với queryKey strategies, staleTime vs gcTime, enabled conditional",
            type: "practice",
          },
          {
            day: "T3",
            task: "useMutation: create/update/delete, invalidateQueries, optimistic updates pattern",
            type: "practice",
          },
          {
            day: "T4",
            task: "useInfiniteQuery: infinite scroll page. Prefetching + HydrationBoundary cho Next.js",
            type: "practice",
          },
          {
            day: "T5",
            task: "React Hook Form + Zod: xây multi-step form với validation, useFieldArray cho dynamic fields",
            type: "practice",
          },
          {
            day: "T6",
            task: "Tổng hợp: CRUD page hoàn chỉnh — list (query + infinite) + create/edit (form + mutation) + delete (optimistic)",
            type: "project",
          },
          {
            day: "T7-CN",
            task: "Đọc TkDodo blog series về React Query. Review lại toàn bộ Phase 1",
            type: "theory",
          },
        ],
        resources: [
          "https://tanstack.com/query/latest/docs/framework/react/overview",
          "https://react-hook-form.com/get-started",
          "https://zod.dev/",
          "https://tkdodo.eu/blog/practical-react-query",
        ],
        milestone:
          "Xây được CRUD flow hoàn chỉnh: data fetching + caching + forms + validation",
      },
    ],
  },
  {
    id: "phase2",
    title: "Phase 2: Next.js & TypeScript Nâng cao",
    duration: "Tuần 5–10",
    color: "#8B5CF6",
    weeks: [
      {
        week: "Tuần 5",
        title: "Next.js App Router — Routing & Layout",
        focus: "File-based routing, layouts, loading/error states",
        daily: [
          {
            day: "T2",
            task: "Setup project mới với App Router. Tạo layout lồng nhau, route groups: (auth), (dashboard), (marketing)",
            type: "practice",
          },
          {
            day: "T3",
            task: "Dynamic routes: [id], [...slug], [[...slug]]. generateStaticParams cho SSG. not-found.tsx customization",
            type: "practice",
          },
          {
            day: "T4",
            task: "Parallel routes (@slot) + Intercepting routes: xây modal pattern — click product → modal, refresh → full page",
            type: "practice",
          },
          {
            day: "T5",
            task: "loading.tsx + error.tsx: streaming UI, nested Suspense boundaries. Skeleton patterns",
            type: "practice",
          },
          {
            day: "T6",
            task: "Middleware: auth redirect, A/B testing, geo-routing, security headers. Matcher config",
            type: "practice",
          },
          {
            day: "T7-CN",
            task: "Đọc: Next.js docs Routing section toàn bộ. Vẽ diagram route structure của project",
            type: "theory",
          },
        ],
        resources: [
          "https://nextjs.org/docs/app/building-your-application/routing",
          "https://nextjs.org/docs/app/building-your-application/routing/parallel-routes",
        ],
        milestone:
          "Thiết kế được route structure phức tạp: auth flow, dashboard, modals, error handling",
      },
      {
        week: "Tuần 6",
        title: "Next.js Data Fetching & Caching",
        focus: "Server Components, caching layers, revalidation",
        daily: [
          {
            day: "T2",
            task: "Server Components: fetch data trực tiếp, so sánh với client-side fetching. Đo performance difference",
            type: "practice",
          },
          {
            day: "T3",
            task: "4 Layers of Caching: Request Memoization, Data Cache, Full Route Cache, Router Cache. Vẽ diagram",
            type: "theory",
          },
          {
            day: "T4",
            task: "Caching control: cache: 'force-cache'|'no-store', next: {revalidate}, next: {tags}. Test từng strategy",
            type: "practice",
          },
          {
            day: "T5",
            task: "Server Actions: form handling, useActionState, revalidatePath/revalidateTag, progressive enhancement",
            type: "practice",
          },
          {
            day: "T6",
            task: "Route Handlers: API routes, streaming responses. Kết hợp Server Actions + TanStack Query",
            type: "practice",
          },
          {
            day: "T7-CN",
            task: "Debug caching: intentionally break cache, observe behavior. Đọc: nextjs.org/docs caching section",
            type: "review",
          },
        ],
        resources: [
          "https://nextjs.org/docs/app/building-your-application/caching",
          "https://nextjs.org/docs/app/building-your-application/data-fetching",
        ],
        milestone:
          "Hiểu và kiểm soát được 4 layers caching, chọn đúng strategy cho từng use case",
      },
      {
        week: "Tuần 7",
        title: "Next.js Production Features",
        focus: "Metadata, Image/Font optimization, i18n, Edge",
        daily: [
          {
            day: "T2",
            task: "Metadata API: generateMetadata, dynamic OG images (opengraph-image.tsx), JSON-LD structured data",
            type: "practice",
          },
          {
            day: "T3",
            task: "Image optimization: next/image deep dive — sizes, quality, priority, placeholder blur. Đo LCP trước/sau",
            type: "practice",
          },
          {
            day: "T4",
            task: "Font optimization: next/font/google, next/font/local. Variable fonts. Đo CLS trước/sau",
            type: "practice",
          },
          {
            day: "T5",
            task: "Internationalization: setup next-intl, locale routing, server/client translation, language switcher",
            type: "practice",
          },
          {
            day: "T6",
            task: "Edge Runtime: khi nào dùng, limitations. Middleware vs Edge API Routes. Security headers setup",
            type: "practice",
          },
          {
            day: "T7-CN",
            task: "Lighthouse audit toàn bộ project. Ghi lại scores và improvement plan",
            type: "review",
          },
        ],
        resources: [
          "https://nextjs.org/docs/app/building-your-application/optimizing",
          "https://nextjs.org/docs/app/api-reference/file-conventions/metadata",
          "https://next-intl-docs.vercel.app/",
        ],
        milestone: "Project đạt Lighthouse score 90+ trên tất cả metrics",
      },
      {
        week: "Tuần 8–9",
        title: "TypeScript Nâng cao",
        focus: "Type system mastery, patterns cho React",
        daily: [
          {
            day: "T8-T2",
            task: "Generics deep dive: constraints, default types, generic components, generic hooks",
            type: "practice",
          },
          {
            day: "T8-T3",
            task: "Utility types mastery: tự implement lại Partial, Required, Pick, Omit, Record, ReturnType từ scratch",
            type: "practice",
          },
          {
            day: "T8-T4",
            task: "Conditional types + infer: UnwrapPromise<T>, ExtractRouteParams<T>. Mapped types: Getters<T>, DeepPartial<T>",
            type: "practice",
          },
          {
            day: "T8-T5",
            task: "Discriminated unions: xây type-safe API response handler, state machine types, exhaustive switch",
            type: "practice",
          },
          {
            day: "T8-T6",
            task: "Branded types: UserId, OrderId, Email. Template literal types cho API routes",
            type: "practice",
          },
          {
            day: "T8-T7",
            task: "Đọc: TypeScript handbook Advanced Types. Giải challenges trên type-challenges.github.io (Easy + Medium)",
            type: "theory",
          },
          {
            day: "T9-T2",
            task: "React + TS: typing props, events, refs, generic components, polymorphic components (as prop)",
            type: "practice",
          },
          {
            day: "T9-T3",
            task: "Module augmentation: extend NextAuth types, extend Window interface, declare .env types",
            type: "practice",
          },
          {
            day: "T9-T4",
            task: "Satisfies operator, const assertions, strict tsconfig options. Refactor project với stricter config",
            type: "practice",
          },
          {
            day: "T9-T5",
            task: "Builder pattern với TS, type-safe event emitter, type-safe route builder",
            type: "practice",
          },
          {
            day: "T9-T6",
            task: "Tổng hợp: refactor toàn bộ project — eliminate 'any', add strict types, generic utilities",
            type: "project",
          },
          {
            day: "T9-T7",
            task: "Giải thêm type-challenges (Medium level). Review TypeScript performance tips",
            type: "review",
          },
        ],
        resources: [
          "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
          "https://github.com/type-challenges/type-challenges",
          "https://www.totaltypescript.com/tutorials",
          "https://www.totaltypescript.com/books/effective-typescript",
        ],
        milestone:
          "Tự viết được complex utility types, project 0 any, strict config enable",
      },
      {
        week: "Tuần 10",
        title: "Accessibility & Testing Cơ bản",
        focus: "a11y foundation, testing setup & patterns",
        daily: [
          {
            day: "T2",
            task: "A11y audit: cài axe-core extension, audit project hiện tại. Fix tất cả critical/serious issues",
            type: "practice",
          },
          {
            day: "T3",
            task: "ARIA: roles, labels, live regions. Keyboard navigation: focus management, tab order, focus trapping modal",
            type: "practice",
          },
          {
            day: "T4",
            task: "Testing setup: Vitest + React Testing Library + MSW. Viết test cho 3 utility functions + 2 custom hooks",
            type: "practice",
          },
          {
            day: "T5",
            task: "Component testing: test user flows (not implementation). Viết test cho form submit, search, filter",
            type: "practice",
          },
          {
            day: "T6",
            task: "MSW setup: mock API handlers. Test loading states, error states, empty states",
            type: "practice",
          },
          {
            day: "T7-CN",
            task: "Review Phase 2. Xây mini project tổng hợp: Next.js + TS strict + a11y compliant + tests",
            type: "review",
          },
        ],
        resources: [
          "https://testing-library.com/docs/react-testing-library/intro/",
          "https://mswjs.io/docs/",
          "https://www.w3.org/WAI/ARIA/apg/patterns/",
        ],
        milestone:
          "Project có test coverage > 60%, 0 a11y violations (critical/serious)",
      },
    ],
  },
  {
    id: "phase3",
    title: "Phase 3: Senior-Level Depth",
    duration: "Tuần 11–18",
    color: "#EC4899",
    weeks: [
      {
        week: "Tuần 11–12",
        title: "React Internals & Performance",
        focus: "Fiber, reconciliation, profiling, optimization",
        daily: [
          {
            day: "T11-T2",
            task: "Fiber Architecture: đọc + vẽ diagram Fiber tree, render phase vs commit phase, work loop",
            type: "theory",
          },
          {
            day: "T11-T3",
            task: "Reconciliation: diffing rules, key behavior, force remount pattern. Tạo demo chứng minh từng rule",
            type: "practice",
          },
          {
            day: "T11-T4",
            task: "Batching: automatic batching demo, flushSync. Concurrent features: startTransition behavior",
            type: "practice",
          },
          {
            day: "T11-T5",
            task: "Hydration: SSR hydration flow, hydration mismatch debugging, selective hydration, suppressHydrationWarning",
            type: "practice",
          },
          {
            day: "T11-T6",
            task: "React Profiler: profile real app, tìm bottlenecks, flame chart analysis. Document findings",
            type: "practice",
          },
          {
            day: "T11-T7",
            task: "Đọc: github.com/acdlite/react-fiber-architecture, React source code overview",
            type: "theory",
          },
          {
            day: "T12-T2",
            task: "Core Web Vitals: setup measurement (useReportWebVitals), baseline current scores, identify issues",
            type: "practice",
          },
          {
            day: "T12-T3",
            task: "LCP optimization: critical rendering path, image optimization, preconnect, server response time",
            type: "practice",
          },
          {
            day: "T12-T4",
            task: "INP optimization: identify long tasks, break up heavy renders, useTransition, Web Workers for CPU tasks",
            type: "practice",
          },
          {
            day: "T12-T5",
            task: "CLS optimization: dimension reservation, font loading, dynamic content insertion patterns",
            type: "practice",
          },
          {
            day: "T12-T6",
            task: "Bundle optimization: @next/bundle-analyzer, tree shaking audit, dynamic imports, route-based splitting",
            type: "practice",
          },
          {
            day: "T12-T7",
            task: "Virtualization: implement @tanstack/react-virtual cho list 10K+ items. Benchmark performance",
            type: "practice",
          },
        ],
        resources: [
          "https://github.com/acdlite/react-fiber-architecture",
          "https://web.dev/articles/vitals",
          "https://nextjs.org/docs/app/building-your-application/optimizing",
          "https://tanstack.com/virtual/latest",
        ],
        milestone:
          "Giải thích được React render cycle, tối ưu app đạt Core Web Vitals 'Good' rating",
      },
      {
        week: "Tuần 13–14",
        title: "Design Patterns & Architecture",
        focus: "Component patterns, project structure, scalability",
        daily: [
          {
            day: "T13-T2",
            task: "Compound Components: xây Accordion, Tabs, Select từ scratch. Shared state qua Context",
            type: "practice",
          },
          {
            day: "T13-T3",
            task: "State Machine Pattern: useReducer as FSM, typed transitions. Xây multi-step wizard",
            type: "practice",
          },
          {
            day: "T13-T4",
            task: "Render Props + Children as Function. Inversion of Control: MouseTracker, DataProvider",
            type: "practice",
          },
          {
            day: "T13-T5",
            task: "Adapter Pattern: xây analytics adapter, notification adapter. Swap implementation không sửa consumer",
            type: "practice",
          },
          {
            day: "T13-T6",
            task: "Slot Pattern + Provider Composition: compose nhiều providers, tránh provider hell",
            type: "practice",
          },
          {
            day: "T13-T7",
            task: "Đọc: patterns.dev/react, Review tất cả patterns đã học, khi nào dùng gì",
            type: "theory",
          },
          {
            day: "T14-T2",
            task: "Feature-based structure: refactor project từ type-based sang feature-based. Barrel exports",
            type: "practice",
          },
          {
            day: "T14-T3",
            task: "Module boundaries: define public API per feature, enforce import rules (ESLint import boundaries)",
            type: "practice",
          },
          {
            day: "T14-T4",
            task: "Component library design: xây 5 base components (Button, Input, Modal, Toast, Card) với consistent API",
            type: "practice",
          },
          {
            day: "T14-T5",
            task: "Monorepo concept: setup Turborepo, shared packages (ui, config, types), build pipeline",
            type: "practice",
          },
          {
            day: "T14-T6",
            task: "ADR writing: viết 3 ADRs cho project — state management choice, styling approach, testing strategy",
            type: "practice",
          },
          {
            day: "T14-T7",
            task: "Review: vẽ architecture diagram toàn bộ project, identify coupling points, improvement plan",
            type: "review",
          },
        ],
        resources: [
          "https://www.patterns.dev/react",
          "https://feature-sliced.design/",
          "https://turbo.build/repo/docs",
        ],
        milestone:
          "Thiết kế được architecture cho project mới, viết ADR, enforce module boundaries",
      },
      {
        week: "Tuần 15–16",
        title: "Testing Nâng cao & Security",
        focus: "E2E, testing strategy, security best practices",
        daily: [
          {
            day: "T15-T2",
            task: "Testing strategy: vẽ testing pyramid/trophy cho project. Define: test gì ở level nào, coverage targets",
            type: "theory",
          },
          {
            day: "T15-T3",
            task: "Integration tests: test 5 user flows end-to-end với Testing Library + MSW. No mocking components",
            type: "practice",
          },
          {
            day: "T15-T4",
            task: "Playwright setup: config, first E2E test — login flow. Page Object Model pattern",
            type: "practice",
          },
          {
            day: "T15-T5",
            task: "Playwright advanced: test CRUD flow, test error scenarios, screenshot comparison, mobile viewport",
            type: "practice",
          },
          {
            day: "T15-T6",
            task: "Test custom hooks + context providers: renderHook, custom render wrappers, test async hooks",
            type: "practice",
          },
          {
            day: "T15-T7",
            task: "A11y testing: jest-axe integration, Playwright a11y checks. Fix all violations",
            type: "practice",
          },
          {
            day: "T16-T2",
            task: "XSS prevention: audit project cho dangerouslySetInnerHTML, setup DOMPurify, CSP headers",
            type: "practice",
          },
          {
            day: "T16-T3",
            task: "Authentication: implement NextAuth (Auth.js) — credentials + OAuth, protected routes, middleware",
            type: "practice",
          },
          {
            day: "T16-T4",
            task: "Input validation: audit tất cả forms — client + server validation (Zod), sanitize user input",
            type: "practice",
          },
          {
            day: "T16-T5",
            task: "Environment variables: audit .env files, tách NEXT_PUBLIC vs server-only, setup .env.example",
            type: "practice",
          },
          {
            day: "T16-T6",
            task: "Security headers: CSP, CORS, X-Frame-Options trong middleware. npm audit + fix vulnerabilities",
            type: "practice",
          },
          {
            day: "T16-T7",
            task: "Security checklist: tạo checklist cho project, audit theo OWASP Top 10 cho frontend",
            type: "review",
          },
        ],
        resources: [
          "https://playwright.dev/docs/intro",
          "https://authjs.dev/getting-started",
          "https://cheatsheetseries.owasp.org/",
          "https://kentcdodds.com/blog/write-tests",
        ],
        milestone:
          "E2E tests cho happy paths, security audit pass, test coverage > 70%",
      },
      {
        week: "Tuần 17–18",
        title: "Full-stack Patterns & DevOps",
        focus: "tRPC/Prisma, CI/CD, monitoring, deployment",
        daily: [
          {
            day: "T17-T2",
            task: "Prisma setup: schema design, relations, migrations. CRUD queries, transactions, pagination",
            type: "practice",
          },
          {
            day: "T17-T3",
            task: "tRPC setup: router, procedures, middleware. Connect với Prisma — full type-safe API layer",
            type: "practice",
          },
          {
            day: "T17-T4",
            task: "tRPC + React: useQuery/useMutation qua tRPC, invalidation, optimistic updates",
            type: "practice",
          },
          {
            day: "T17-T5",
            task: "Real-time: implement basic WebSocket hoặc SSE. Notification system pattern",
            type: "practice",
          },
          {
            day: "T17-T6",
            task: "File upload: presigned URLs pattern (S3/R2), chunked upload, progress tracking UI",
            type: "practice",
          },
          {
            day: "T17-T7",
            task: "Đọc: tRPC docs advanced, Prisma best practices, connection pooling",
            type: "theory",
          },
          {
            day: "T18-T2",
            task: "CI/CD: setup GitHub Actions — lint → typecheck → test → build. Caching node_modules",
            type: "practice",
          },
          {
            day: "T18-T3",
            task: "Docker: Dockerfile cho Next.js (multi-stage build), docker-compose cho dev environment",
            type: "practice",
          },
          {
            day: "T18-T4",
            task: "Sentry setup: error tracking, source maps, performance monitoring, session replay",
            type: "practice",
          },
          {
            day: "T18-T5",
            task: "Logging: pino setup, structured logging, log levels. Vercel Analytics / PostHog setup",
            type: "practice",
          },
          {
            day: "T18-T6",
            task: "Deployment: deploy lên Vercel/Railway, preview deployments, environment management",
            type: "practice",
          },
          {
            day: "T18-T7",
            task: "Review Phase 3: tổng kết tất cả kiến thức, gaps analysis, update learning plan",
            type: "review",
          },
        ],
        resources: [
          "https://trpc.io/docs",
          "https://www.prisma.io/docs",
          "https://docs.github.com/en/actions",
          "https://docs.sentry.io/platforms/javascript/guides/nextjs/",
        ],
        milestone:
          "Full-stack app deployed: Next.js + tRPC + Prisma + CI/CD + monitoring",
      },
    ],
  },
  {
    id: "phase4",
    title: "Phase 4: Senior Capstone & Mindset",
    duration: "Tuần 19–24",
    color: "#F59E0B",
    weeks: [
      {
        week: "Tuần 19–20",
        title: "Capstone Project — Build & Ship",
        focus: "Xây dự án thực tế áp dụng TẤT CẢ kiến thức",
        daily: [
          {
            day: "T19-T2",
            task: "Planning: chọn project idea, viết PRD (Product Requirements Document), vẽ wireframes",
            type: "theory",
          },
          {
            day: "T19-T3",
            task: "Architecture: thiết kế system architecture, chọn tech stack, viết ADRs, define feature modules",
            type: "theory",
          },
          {
            day: "T19-T4",
            task: "Setup: project scaffold, CI/CD, linting, TypeScript strict, testing infrastructure",
            type: "practice",
          },
          {
            day: "T19-T5",
            task: "Core features: authentication, database schema, tRPC routers, base UI components",
            type: "project",
          },
          {
            day: "T19-T6",
            task: "Core features: main CRUD flows, data fetching patterns, form handling",
            type: "project",
          },
          {
            day: "T19-T7",
            task: "Core features: continued development",
            type: "project",
          },
          {
            day: "T20-T2",
            task: "Advanced features: real-time updates, optimistic UI, error handling, loading states",
            type: "project",
          },
          {
            day: "T20-T3",
            task: "Advanced features: search, filtering, pagination, infinite scroll",
            type: "project",
          },
          {
            day: "T20-T4",
            task: "Performance: Lighthouse audit, Core Web Vitals optimization, bundle analysis",
            type: "project",
          },
          {
            day: "T20-T5",
            task: "Testing: integration tests cho critical paths, E2E tests cho happy paths, a11y tests",
            type: "project",
          },
          {
            day: "T20-T6",
            task: "Security: auth flow, input validation, CSP, environment variables audit",
            type: "project",
          },
          {
            day: "T20-T7",
            task: "Deploy: production deployment, monitoring setup (Sentry), final QA",
            type: "project",
          },
        ],
        resources: [],
        milestone:
          "Ship một sản phẩm hoàn chỉnh lên production — đây là portfolio piece quan trọng nhất",
      },
      {
        week: "Tuần 21–22",
        title: "Error Handling, Resilience & DX",
        focus: "Production-grade patterns, developer experience",
        daily: [
          {
            day: "T21-T2",
            task: "Error Boundaries: granular boundaries, fallback UI, retry mechanisms, error logging tới Sentry",
            type: "practice",
          },
          {
            day: "T21-T3",
            task: "Network resilience: retry with exponential backoff, circuit breaker pattern, offline detection",
            type: "practice",
          },
          {
            day: "T21-T4",
            task: "Feature flags: implement simple feature flag system, A/B testing setup, gradual rollout",
            type: "practice",
          },
          {
            day: "T21-T5",
            task: "Developer tooling: Husky pre-commit hooks, lint-staged, commitlint, changelog generation",
            type: "practice",
          },
          {
            day: "T21-T6",
            task: "Documentation: README template, component documentation (Storybook hoặc code comments), API docs",
            type: "practice",
          },
          {
            day: "T21-T7",
            task: "Đọc: engineering blogs — Vercel, Shopify, Airbnb frontend engineering",
            type: "theory",
          },
          {
            day: "T22-T2",
            task: "Code review practice: review 5 open-source PRs, viết constructive feedback theo review hierarchy",
            type: "practice",
          },
          {
            day: "T22-T3",
            task: "RFC writing: viết 1 RFC proposal cho technical change (ví dụ: migrate từ Pages Router sang App Router)",
            type: "practice",
          },
          {
            day: "T22-T4",
            task: "Estimation practice: break down feature thành tasks, estimate giờ, identify risks và unknowns",
            type: "practice",
          },
          {
            day: "T22-T5",
            task: "Trade-off analysis: viết 3 trade-off matrices cho past decisions (styling, state, testing tools)",
            type: "practice",
          },
          {
            day: "T22-T6",
            task: "Incident response: viết postmortem cho 1 bug past project (hoặc hypothetical scenario)",
            type: "practice",
          },
          {
            day: "T22-T7",
            task: "Review + plan: tự đánh giá gap analysis, identify weak areas for continued learning",
            type: "review",
          },
        ],
        resources: [
          "https://github.com/bvaughn/react-error-boundary",
          "https://adr.github.io/",
          "https://google.github.io/eng-practices/review/",
        ],
        milestone:
          "Có production-grade error handling, viết được RFC & ADR, review code có chiều sâu",
      },
      {
        week: "Tuần 23–24",
        title: "Interview Prep & Knowledge Consolidation",
        focus: "Ôn tập tổng hợp, chuẩn bị interview, networking",
        daily: [
          {
            day: "T23-T2",
            task: "React deep dive review: giải thích Fiber, reconciliation, hooks rules, concurrent mode — NÓI TO, giả lập phỏng vấn",
            type: "review",
          },
          {
            day: "T23-T3",
            task: "System design practice: thiết kế e-commerce frontend, real-time dashboard, social feed — vẽ diagram, giải thích",
            type: "practice",
          },
          {
            day: "T23-T4",
            task: "Coding challenges: implement debounce, throttle, EventEmitter, Promise.all, deep clone — timed (30 min each)",
            type: "practice",
          },
          {
            day: "T23-T5",
            task: "Behavioral questions: STAR method cho 10 scenarios (conflict, failure, leadership, trade-off, deadline)",
            type: "practice",
          },
          {
            day: "T23-T6",
            task: "Portfolio review: update README capstone project, deploy link, write technical blog post about learnings",
            type: "practice",
          },
          {
            day: "T23-T7",
            task: "Mock interview: nhờ bạn/mentor phỏng vấn thử 1 tiếng — technical + behavioral",
            type: "practice",
          },
          {
            day: "T24-T2",
            task: "Teach-back: giải thích 5 concepts phức tạp nhất cho người khác (hoặc viết blog). Teaching = best learning",
            type: "practice",
          },
          {
            day: "T24-T3",
            task: "Open source: contribute 1 PR cho project yêu thích (fix bug, update docs, add test)",
            type: "practice",
          },
          {
            day: "T24-T4",
            task: "Networking: join Discord communities (Reactiflux, Next.js, TypeScript), trả lời questions",
            type: "practice",
          },
          {
            day: "T24-T5",
            task: "Staying current plan: setup RSS feeds, newsletter subscriptions, conference watchlist",
            type: "theory",
          },
          {
            day: "T24-T6",
            task: "Final review: re-read toàn bộ knowledge base document, đánh dấu areas cần revisit",
            type: "review",
          },
          {
            day: "T24-T7",
            task: "Celebration & next steps: reflect on journey, set 6-month learning goals, celebrate progress 🎉",
            type: "review",
          },
        ],
        resources: [
          "https://www.greatfrontend.com/",
          "https://bigfrontend.dev/",
          "https://discord.gg/reactiflux",
        ],
        milestone:
          "Tự tin interview Senior Frontend. Có capstone project + blog + open source contribution",
      },
    ],
  },
];

const PROJECT_IDEAS = [
  {
    name: "Task Management App (Trello-like)",
    skills: "Drag & drop, real-time, optimistic UI, complex state",
    complexity: "★★★★",
  },
  {
    name: "E-commerce Platform",
    skills: "CRUD, search/filter, cart, checkout, auth, payments",
    complexity: "★★★★★",
  },
  {
    name: "Blog/CMS Platform",
    skills: "Rich text editor, SSG/ISR, SEO, image upload, RBAC",
    complexity: "★★★",
  },
  {
    name: "Real-time Chat App",
    skills: "WebSocket, infinite scroll, file sharing, presence",
    complexity: "★★★★",
  },
  {
    name: "Analytics Dashboard",
    skills: "Charts, data viz, streaming, filters, export",
    complexity: "★★★★",
  },
];

const TYPE_COLORS = {
  practice: { bg: "#DBEAFE", text: "#1E40AF", label: "Practice" },
  theory: { bg: "#FEF3C7", text: "#92400E", label: "Theory" },
  project: { bg: "#D1FAE5", text: "#065F46", label: "Project" },
  review: { bg: "#EDE9FE", text: "#5B21B6", label: "Review" },
};

export default function StudyRoadmap() {
  const [expandedPhase, setExpandedPhase] = useState("phase1");
  const [expandedWeek, setExpandedWeek] = useState("Tuần 1");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [showProjects, setShowProjects] = useState(false);

  const toggleTask = (weekTitle: string, dayIdx: number) => {
    const key = `${weekTitle}-${dayIdx}`;
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const stats = useMemo(() => {
    let total = 0,
      done = 0;
    PHASES.forEach((p) =>
      p.weeks.forEach((w) =>
        w.daily.forEach((_, i) => {
          total++;
          if (completedTasks[`${w.week}-${i}`]) done++;
        })
      )
    );
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [completedTasks]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const phaseStats = (phase: any) => {
    let total = 0,
      done = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    phase.weeks.forEach((w: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      w.daily.forEach((_: any, i: number) => {
        total++;
        if (completedTasks[`${w.week}-${i}`]) done++;
      })
    );
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        padding: "16px",
        color: "#1F2937",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          🗺️ Lộ trình Mid → Senior Frontend
        </h1>
        <p style={{ color: "#6B7280", fontSize: 14 }}>
          24 tuần · 5 ngày/tuần · ~2-3 giờ/ngày
        </p>
      </div>

      {/* Progress */}
      <div
        style={{
          background: "#F9FAFB",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: 13,
          }}
        >
          <span style={{ fontWeight: 600 }}>
            Tiến độ tổng: {stats.done}/{stats.total} tasks
          </span>
          <span style={{ fontWeight: 700, color: "#3B82F6" }}>
            {stats.pct}%
          </span>
        </div>
        <div
          style={{
            background: "#E5E7EB",
            borderRadius: 99,
            height: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)",
              height: "100%",
              width: `${stats.pct}%`,
              borderRadius: 99,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Phases */}
      {PHASES.map((phase) => {
        const ps = phaseStats(phase);
        const isOpen = expandedPhase === phase.id;
        return (
          <div
            key={phase.id}
            style={{
              marginBottom: 12,
              border: `2px solid ${isOpen ? phase.color : "#E5E7EB"}`,
              borderRadius: 12,
              overflow: "hidden",
              transition: "border-color 0.3s",
            }}
          >
            {/* Phase Header */}
            <button
              onClick={() => setExpandedPhase(isOpen ? "" : phase.id)}
              style={{
                width: "100%",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: isOpen ? `${phase.color}10` : "#FFF",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: phase.color,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {phase.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {phase.duration} · {ps.done}/{ps.total} done
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 60,
                    height: 6,
                    background: "#E5E7EB",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${ps.pct}%`,
                      background: phase.color,
                      borderRadius: 99,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 18,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▾
                </span>
              </div>
            </button>

            {/* Weeks */}
            {isOpen && (
              <div style={{ padding: "0 12px 12px" }}>
                {phase.weeks.map((week) => {
                  const isWeekOpen = expandedWeek === week.week;
                  const weekDone = week.daily.filter(
                    (_, i) => completedTasks[`${week.week}-${i}`]
                  ).length;
                  return (
                    <div
                      key={week.week}
                      style={{
                        marginTop: 8,
                        background: "#FFF",
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        overflow: "hidden",
                      }}
                    >
                      {/* Week Header */}
                      <button
                        onClick={() =>
                          setExpandedWeek(isWeekOpen ? "" : week.week)
                        }
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: isWeekOpen ? "#F9FAFB" : "#FFF",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>
                            {week.week}: {week.title}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#6B7280",
                              marginTop: 2,
                            }}
                          >
                            {week.focus}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "#6B7280",
                              background: "#F3F4F6",
                              padding: "2px 8px",
                              borderRadius: 99,
                            }}
                          >
                            {weekDone}/{week.daily.length}
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              transform: isWeekOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s",
                            }}
                          >
                            ▾
                          </span>
                        </div>
                      </button>

                      {/* Tasks */}
                      {isWeekOpen && (
                        <div style={{ padding: "4px 12px 12px" }}>
                          {week.daily.map((item, i) => {
                            const key = `${week.week}-${i}`;
                            const done = !!completedTasks[key];
                            const tc = TYPE_COLORS[item.type as keyof typeof TYPE_COLORS];
                            return (
                              <div
                                key={i}
                                onClick={() => toggleTask(week.week, i)}
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  padding: "8px 0",
                                  borderBottom:
                                    i < week.daily.length - 1
                                      ? "1px solid #F3F4F6"
                                      : "none",
                                  cursor: "pointer",
                                  opacity: done ? 0.5 : 1,
                                  alignItems: "flex-start",
                                }}
                              >
                                <div
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 4,
                                    border: `2px solid ${
                                      done ? phase.color : "#D1D5DB"
                                    }`,
                                    background: done
                                      ? phase.color
                                      : "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    marginTop: 1,
                                  }}
                                >
                                  {done && (
                                    <span
                                      style={{
                                        color: "#FFF",
                                        fontSize: 11,
                                        fontWeight: 700,
                                      }}
                                    >
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 6,
                                      alignItems: "center",
                                      marginBottom: 2,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "#6B7280",
                                      }}
                                    >
                                      {item.day}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 10,
                                        padding: "1px 6px",
                                        borderRadius: 99,
                                        background: tc.bg,
                                        color: tc.text,
                                        fontWeight: 600,
                                      }}
                                    >
                                      {tc.label}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      lineHeight: 1.5,
                                      textDecoration: done
                                        ? "line-through"
                                        : "none",
                                      color: done ? "#9CA3AF" : "#374151",
                                    }}
                                  >
                                    {item.task}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Milestone */}
                          {week.milestone && (
                            <div
                              style={{
                                marginTop: 8,
                                padding: "8px 10px",
                                background: `${phase.color}10`,
                                borderRadius: 6,
                                borderLeft: `3px solid ${phase.color}`,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: phase.color,
                                  marginBottom: 2,
                                }}
                              >
                                🎯 MILESTONE
                              </div>
                              <div style={{ fontSize: 12, color: "#374151" }}>
                                {week.milestone}
                              </div>
                            </div>
                          )}

                          {/* Resources */}
                          {week.resources?.length > 0 && (
                            <div
                              style={{
                                marginTop: 8,
                                padding: "8px 10px",
                                background: "#F9FAFB",
                                borderRadius: 6,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#6B7280",
                                  marginBottom: 4,
                                }}
                              >
                                📚 TÀI LIỆU
                              </div>
                              {week.resources.map((r, ri) => (
                                <div
                                  key={ri}
                                  style={{
                                    fontSize: 11,
                                    color: "#3B82F6",
                                    wordBreak: "break-all",
                                    lineHeight: 1.6,
                                  }}
                                >
                                  → {r}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Capstone Project Ideas */}
      <div
        style={{
          marginTop: 20,
          border: "2px solid #F59E0B",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setShowProjects(!showProjects)}
          style={{
            width: "100%",
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            background: "#FFFBEB",
            border: "none",
            cursor: "pointer",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            💡 Capstone Project Ideas (Tuần 19-20)
          </span>
          <span
            style={{
              transform: showProjects ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▾
          </span>
        </button>
        {showProjects && (
          <div style={{ padding: "4px 16px 16px" }}>
            {PROJECT_IDEAS.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 0",
                  borderBottom:
                    i < PROJECT_IDEAS.length - 1 ? "1px solid #FEF3C7" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 13 }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: 12, color: "#F59E0B" }}>
                    {p.complexity}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                  {p.skills}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "#F0FDF4",
          borderRadius: 12,
          border: "1px solid #BBF7D0",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 8,
            color: "#065F46",
          }}
        >
          💪 Nguyên tắc học hiệu quả
        </div>
        <div style={{ fontSize: 12, color: "#065F46", lineHeight: 1.8 }}>
          <strong>1. Code TRƯỚC, đọc SAU:</strong> Thử tự implement trước khi
          đọc docs/solution. Sai → học nhiều hơn đúng.
          <br />
          <strong>2. Spaced Repetition:</strong> Mỗi thứ 7 ôn lại tuần trước.
          Mỗi cuối tháng ôn lại tháng trước.
          <br />
          <strong>3. Dạy lại người khác:</strong> Viết blog, giải thích cho bạn
          bè. Nếu không giải thích đơn giản được → chưa hiểu.
          <br />
          <strong>4. Build real projects:</strong> Không chỉ follow tutorial. Tự
          nghĩ feature, tự debug, tự design.
          <br />
          <strong>5. Đọc source code:</strong> Đọc code thư viện yêu thích
          (Zustand chỉ ~400 LOC, TanStack Query, shadcn/ui).
          <br />
          <strong>6. Consistency {">"} Intensity:</strong> 2h/ngày × 5 ngày tốt
          hơn 10h cuối tuần. Não cần thời gian consolidate.
        </div>
      </div>
    </div>
  );
}

# Frontend React/Next.js Roadmap: Junior → Mid → Senior

---

## PHASE 1: FUNDAMENTALS (Junior Level)

### 1.1 HTML & Semantic HTML
- Các thẻ cơ bản: `div`, `span`, `p`, `a`, `img`, `ul/ol/li`, `table`
- Semantic tags: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`
- Form elements: `input`, `textarea`, `select`, `label`, `fieldset`, `legend`
- Attributes: `id`, `class`, `data-*`, `aria-*`
- SEO tags: `meta`, `title`, `og:*`, `canonical`
- `<picture>`, `<source>`, `srcset` cho responsive images

### 1.2 CSS Cơ bản
- Selectors: element, class, id, attribute, pseudo-class (`:hover`, `:focus`, `:nth-child`), pseudo-element (`::before`, `::after`)
- Box Model: `margin`, `padding`, `border`, `box-sizing`
- Display: `block`, `inline`, `inline-block`, `none`, `flex`, `grid`
- Positioning: `static`, `relative`, `absolute`, `fixed`, `sticky`
- Flexbox: `justify-content`, `align-items`, `flex-direction`, `flex-wrap`, `gap`, `flex-grow/shrink/basis`
- Grid: `grid-template-columns/rows`, `grid-area`, `grid-gap`, `auto-fit`, `minmax()`
- Responsive: Media queries (`@media`), mobile-first approach, breakpoints
- Units: `px`, `em`, `rem`, `%`, `vw`, `vh`, `dvh`, `clamp()`, `min()`, `max()`
- Typography: `font-family`, `font-size`, `line-height`, `letter-spacing`, `font-weight`
- Colors: `hex`, `rgb`, `rgba`, `hsl`, `hsla`, CSS custom properties (`--var`)
- Transitions: `transition-property`, `duration`, `timing-function`, `delay`
- Animations: `@keyframes`, `animation` shorthand
- CSS Variables: `--custom-property`, `var()`, scoping, fallback values

### 1.3 JavaScript Cơ bản
- Variables: `var` vs `let` vs `const`, hoisting, temporal dead zone
- Data types: string, number, boolean, null, undefined, symbol, bigint
- Operators: arithmetic, comparison (`==` vs `===`), logical (`&&`, `||`, `??`), optional chaining (`?.`)
- String methods: `slice`, `substring`, `includes`, `replace`, `split`, `trim`, `padStart`
- Number methods: `parseInt`, `parseFloat`, `toFixed`, `isNaN`, `Number.isFinite`
- Control flow: `if/else`, `switch`, ternary, `for`, `while`, `for...of`, `for...in`
- Functions: declaration, expression, arrow functions, default params, rest params (`...args`)
- Scope: global, function, block scope, lexical scope, closures
- Objects: creation, destructuring, spread (`...`), `Object.keys/values/entries`, `Object.assign`, `Object.freeze`
- Arrays: destructuring, spread, `map`, `filter`, `reduce`, `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`, `sort`, `splice`, `slice`
- Template literals: backtick strings, interpolation, tagged templates
- Error handling: `try/catch/finally`, `throw`, custom errors
- JSON: `JSON.parse`, `JSON.stringify`, replacer/reviver

### 1.4 JavaScript Nâng cao (ES6+)
- Destructuring nâng cao: nested, rename, default values
- Modules: `import/export`, named exports, default export, dynamic `import()`
- Promises: `new Promise`, `.then/.catch/.finally`, `Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.any`
- Async/Await: `async function`, `await`, error handling với try/catch, parallel execution
- Classes: `constructor`, `extends`, `super`, `static`, private fields (`#field`)
- Iterators & Generators: `Symbol.iterator`, `function*`, `yield`
- Proxy & Reflect (hiểu concept)
- WeakMap, WeakSet, Map, Set
- Regex cơ bản: `test`, `match`, `replace`, common patterns
- Event Loop: call stack, task queue, microtask queue, `setTimeout` vs `Promise` execution order

### 1.5 DOM & Browser APIs
- DOM manipulation: `querySelector`, `getElementById`, `addEventListener`
- Event: bubbling, capturing, `stopPropagation`, `preventDefault`, event delegation
- Storage: `localStorage`, `sessionStorage`, `cookies`
- Fetch API: `fetch`, `Request`, `Response`, `Headers`, `AbortController`
- URL API: `URL`, `URLSearchParams`
- History API: `pushState`, `replaceState`, `popstate`
- IntersectionObserver (lazy loading, infinite scroll)
- ResizeObserver, MutationObserver
- Web Workers (concept)
- Clipboard API, Geolocation API

### 1.6 Git Cơ bản
- `init`, `clone`, `add`, `commit`, `push`, `pull`, `fetch`
- Branching: `branch`, `checkout`, `switch`, `merge`
- `.gitignore`
- Xem history: `log`, `diff`, `blame`
- Remote: `origin`, `upstream`

### 1.7 Package Manager
- npm: `install`, `uninstall`, `update`, `run`, `npx`
- `package.json`: `dependencies` vs `devDependencies`, `scripts`, `engines`
- `package-lock.json` / `yarn.lock` — tại sao quan trọng
- Semantic versioning: `^`, `~`, exact version
- pnpm (hiểu ưu điểm: disk space, speed, strict dependency)

### 1.8 React Cơ bản
- JSX: syntax, expressions, conditional rendering, list rendering với `key`
- Components: function components, props, children
- `useState`: primitive state, object state, array state, updater function pattern `setState(prev => ...)`
- `useEffect`: dependency array, cleanup function, empty deps vs no deps
- `useRef`: DOM access, mutable values không trigger re-render
- Event handling: `onClick`, `onChange`, `onSubmit`, synthetic events
- Conditional rendering: `&&`, ternary, early return
- Lists & Keys: tại sao `key` quan trọng, khi nào dùng `index` làm key (và khi nào không)
- Forms: controlled vs uncontrolled components
- Component composition: children pattern, render props (basic)
- Fragment: `<>...</>` và `<React.Fragment>`

### 1.9 Styling trong React
- CSS Modules: `.module.css`, scoped styles
- Tailwind CSS: utility classes, responsive prefixes (`sm:`, `md:`), `@apply`
- Styled-components / Emotion (biết concept)
- CSS-in-JS trade-offs
- className conditional: `clsx` hoặc `classnames` library

### 1.10 Tooling Cơ bản
- Vite: dev server, build, config cơ bản
- ESLint: setup, rules, `.eslintrc`
- Prettier: config, format on save
- Browser DevTools: Elements, Console, Network, Application tabs
- React DevTools: component tree, props/state inspection

---

## PHASE 2: INTERMEDIATE (Mid Level)

### 2.1 React Hooks Nâng cao
- `useReducer`: complex state logic, dispatch pattern, khi nào dùng thay `useState`
- `useContext`: tạo context, Provider pattern, tránh re-render không cần thiết
- `useMemo`: memoize expensive computation, dependency array
- `useCallback`: memoize function reference, khi nào thực sự cần
- `useId`: generate unique IDs cho accessibility
- `useLayoutEffect`: khác gì `useEffect`, khi nào cần dùng
- `useImperativeHandle` + `forwardRef`: expose custom ref API
- `useSyncExternalStore`: subscribe external stores
- `useDeferredValue`: defer non-urgent updates
- `useTransition`: mark state updates as non-urgent, `isPending`

### 2.2 Custom Hooks
- Tách logic ra khỏi components
- Các patterns phổ biến:
  - `useDebounce` — debounce value
  - `useThrottle` — throttle callback
  - `useLocalStorage` — sync state với localStorage
  - `useMediaQuery` — responsive logic
  - `useOnClickOutside` — detect click ngoài element
  - `useIntersectionObserver` — lazy load, infinite scroll
  - `usePrevious` — lưu giá trị trước đó
  - `useToggle` — boolean toggle
  - `useFetch` — data fetching cơ bản
  - `useEventListener` — attach/detach events
  - `useInterval / useTimeout` — declarative timers
- Rules of Hooks: tại sao phải gọi ở top level, không trong condition/loop

### 2.3 State Management
- **Local State**: `useState`, `useReducer`
- **Lifted State**: lifting state up, prop drilling và khi nào nó trở thành vấn đề
- **Context API**: khi nào dùng, khi nào KHÔNG dùng (performance), split contexts
- **Zustand**: store creation, selectors, middleware (`persist`, `devtools`), slices pattern
- **Jotai**: atomic state, derived atoms, async atoms
- **Redux Toolkit** (biết concept): slices, `createAsyncThunk`, RTK Query
- **URL State**: `useSearchParams`, sync filter/sort/pagination với URL
- **Khi nào dùng gì**: phân biệt server state vs client state vs UI state vs URL state

### 2.4 Data Fetching
- **TanStack Query (React Query)**:
  - `useQuery`: queryKey, queryFn, staleTime, gcTime
  - `useMutation`: mutationFn, onSuccess, onError, onSettled
  - `useInfiniteQuery`: infinite scroll, pagination
  - Query invalidation: `invalidateQueries`, `refetchQueries`
  - Optimistic updates
  - Prefetching: `prefetchQuery`
  - Parallel & dependent queries
  - Cache management, retry logic
- **SWR** (biết concept): `useSWR`, revalidation strategies
- **Axios**: interceptors, instance creation, cancel tokens
- Error handling patterns: error boundaries + retry logic
- Loading states: skeleton, spinner, progressive loading

### 2.5 Form Management
- **React Hook Form**:
  - `useForm`, `register`, `handleSubmit`
  - `Controller` cho custom components
  - `useFieldArray` cho dynamic fields
  - `watch`, `setValue`, `reset`, `trigger`
  - Form validation modes: `onBlur`, `onChange`, `onSubmit`
- **Zod** (schema validation):
  - Basic schemas: `z.string()`, `z.number()`, `z.boolean()`
  - Object schemas: `z.object()`, optional, nullable
  - Array schemas: `z.array()`, min, max
  - Refinements: `.refine()`, `.superRefine()`
  - Transform: `.transform()`
  - Union, discriminated union, intersection
- **React Hook Form + Zod**: `zodResolver`, type-safe forms
- **Formik** (biết concept)

### 2.6 Routing (Next.js App Router)
- File-based routing: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Dynamic routes: `[id]`, `[...slug]`, `[[...slug]]`
- Route groups: `(group)` — tổ chức không ảnh hưởng URL
- Parallel routes: `@slot` — render nhiều pages cùng lúc
- Intercepting routes: `(.)`, `(..)`, `(...)` — modal patterns
- `Link` component: prefetching, `replace`, `scroll`
- `useRouter`, `usePathname`, `useSearchParams`, `useParams`
- `redirect()`, `permanentRedirect()`, `notFound()`
- Middleware: `middleware.ts`, matching paths, redirects, rewrites

### 2.7 Next.js Data Fetching
- Server Components: fetch data trực tiếp, không cần API route
- `fetch` với caching: `cache: 'force-cache'`, `no-store`, `revalidate`
- `generateStaticParams`: SSG cho dynamic routes
- `revalidatePath`, `revalidateTag`: on-demand revalidation
- Server Actions: `'use server'`, form actions, `useActionState`
- Route Handlers: `GET`, `POST`, `PUT`, `DELETE` trong `route.ts`
- Streaming: `loading.tsx`, `<Suspense>` boundaries
- Data fetching patterns: sequential vs parallel fetching

### 2.8 TypeScript Intermediate
- Generics: `<T>`, constraints (`extends`), default type params
- Utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`, `ReturnType`, `Parameters`, `Awaited`
- Union types: `|`, literal types, discriminated unions
- Intersection types: `&`
- Type narrowing: `typeof`, `instanceof`, `in`, custom type guards (`is`)
- Type assertion: `as`, non-null assertion `!`
- `interface` vs `type`: khi nào dùng gì
- Typing React: `React.FC`, `React.ReactNode`, `React.ComponentProps<typeof X>`, `React.HTMLAttributes<HTMLDivElement>`
- Event types: `React.ChangeEvent`, `React.MouseEvent`, `React.FormEvent`
- Generic components: `<T>` trong component props

### 2.9 API & Backend Communication
- REST API: methods, status codes, headers, CORS
- GraphQL cơ bản: queries, mutations, fragments (biết concept)
- Authentication: JWT, cookies, `httpOnly`, `secure`, refresh tokens
- Authorization: role-based, permission-based
- API error handling: standardized error responses, retry strategies
- Rate limiting (concept)
- WebSocket cơ bản: `new WebSocket()`, `onmessage`, `onclose`
- Server-Sent Events (SSE)

### 2.10 Testing Cơ bản
- **Vitest / Jest**: test runner, describe/it/expect, matchers
- **React Testing Library**: `render`, `screen`, `fireEvent`, `userEvent`, `waitFor`
- Unit tests: utility functions, custom hooks (`renderHook`)
- Component tests: render, interaction, assertion
- Mocking: `vi.mock`, `vi.fn`, `vi.spyOn`, mock modules
- Test patterns: Arrange-Act-Assert (AAA)
- Code coverage: setup, đọc reports

### 2.11 Git Nâng cao
- `rebase` vs `merge`: trade-offs, interactive rebase (`rebase -i`)
- `cherry-pick`, `stash`, `stash pop`
- Squash commits
- Git flow / trunk-based development
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Pull Request best practices: description, small PRs, self-review
- Resolve merge conflicts

### 2.12 Accessibility (a11y)
- ARIA roles: `role`, `aria-label`, `aria-describedby`, `aria-hidden`, `aria-live`
- Keyboard navigation: `tabIndex`, focus management, `onKeyDown`
- Screen reader testing (VoiceOver, NVDA)
- Color contrast requirements (WCAG AA/AAA)
- Semantic HTML và tại sao quan trọng cho a11y
- Focus trapping trong modals
- `prefers-reduced-motion`, `prefers-color-scheme`

### 2.13 Performance Basics
- React DevTools Profiler: đo render time
- `React.memo`: khi nào dùng, khi nào không
- Code splitting: `React.lazy`, `Suspense`, dynamic imports
- Image optimization: `next/image`, lazy loading, formats (WebP, AVIF)
- Font optimization: `next/font`, font-display swap
- Bundle size awareness: import cost, tree shaking

### 2.14 UI Libraries & Component Systems
- Component libraries: shadcn/ui, Radix UI, Headless UI, Ark UI
- Headless vs styled: trade-offs
- Icon libraries: Lucide, Heroicons
- Animation: Framer Motion (`motion.div`, `AnimatePresence`, variants, layout animations)
- Toast/Notification: Sonner, react-hot-toast
- Date handling: date-fns, dayjs (tránh moment.js)

---

## PHASE 3: ADVANCED (Senior Level)

### 3.1 React Internals
- Fiber Architecture: fiber nodes, reconciliation algorithm, work loop
- Rendering phases: render phase vs commit phase
- Batching: automatic batching (React 18+), `flushSync`
- Concurrent features: `startTransition`, `useDeferredValue`, Suspense for data fetching
- React Server Components (RSC): serialization, streaming, server/client boundary
- Hydration: full hydration, selective hydration, hydration errors và cách debug
- `key` prop deep dive: reconciliation behavior, force remount pattern
- Strict Mode: double rendering, double effect, tại sao quan trọng

### 3.2 Design Patterns Nâng cao
- **Compound Components**: shared state qua Context, flexible API design
- **Render Props**: function as children, inversion of control
- **Higher-Order Components (HOC)**: `withAuth`, `withTheme` (biết pattern, ít dùng trong hooks era)
- **Provider Pattern**: nested providers, provider composition
- **State Machine Pattern**: `useReducer` as state machine, XState
- **Observer Pattern**: event emitter, pub/sub trong React
- **Strategy Pattern**: pluggable behavior qua props/config
- **Factory Pattern**: component factories, dynamic component rendering
- **Adapter Pattern**: wrap third-party libraries, normalize APIs
- **Facade Pattern**: simplify complex subsystems
- **Composition over Inheritance**: luôn ưu tiên composition trong React
- **Inversion of Control**: để consumer quyết định behavior
- **Slot Pattern**: named slots qua props hoặc children

### 3.3 Architecture & Project Structure
- **Feature-based structure**: tổ chức theo feature thay vì theo type
- **Layered architecture**: UI → Hooks → Services → API → Types
- **Barrel exports**: `index.ts` re-exports, khi nào nên và không nên dùng
- **Dependency Injection**: trong React context
- **Module boundaries**: public API surface, internal modules
- **Monorepo**: Turborepo, Nx — shared packages, workspace management
- **Shared packages**: UI library, config, utils, types — chia sẻ giữa apps
- **Micro-frontends** (concept): Module Federation, khi nào cần

### 3.4 TypeScript Nâng cao
- **Conditional types**: `T extends U ? X : Y`, `infer`
- **Mapped types**: `{ [K in keyof T]: ... }`, modifier removal (`-readonly`, `-?`)
- **Template literal types**: `` `${A}-${B}` ``
- **Recursive types**: tree structures, deep partial
- **Branded types / Opaque types**: `type UserId = string & { __brand: 'UserId' }`
- **Satisfies operator**: `const x = { ... } satisfies Type`
- **Type-safe event emitters**
- **Builder pattern** với method chaining types
- **Exhaustive checks**: `never` type, exhaustive switch
- **Module augmentation**: extend third-party types
- **Declaration files**: `.d.ts`, `declare module`, ambient types
- **Strict tsconfig**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **Performance**: tránh deep inference, type instantiation limits

### 3.5 Next.js Nâng cao
- **Caching deep dive**: Full Route Cache, Data Cache, Router Cache, Request Memoization
  - Hiểu 4 layers of caching và cách chúng interact
  - `unstable_cache`, `cache()` function
  - Cache invalidation strategies
- **Streaming & Suspense**: nested Suspense boundaries, streaming SSR, progressive rendering
- **Middleware nâng cao**: authentication, A/B testing, geo-routing, rate limiting
- **Internationalization (i18n)**: `next-intl`, locale routing, server/client translation
- **Image optimization deep dive**: `next/image` internals, CDN, responsive sizes, priority
- **Edge Runtime**: khi nào dùng Edge vs Node.js runtime, limitations
- **Instrumentation**: `instrumentation.ts`, OpenTelemetry
- **Custom server** (khi nào cần): WebSocket support, custom routing
- **Output modes**: `standalone`, `export` (static), Docker deployment
- **Security headers**: CSP, CORS, X-Frame-Options, nonce cho inline scripts
- **Metadata API**: `generateMetadata`, dynamic OG images, `opengraph-image.tsx`

### 3.6 Performance Optimization Nâng cao
- **Core Web Vitals deep dive**:
  - LCP (Largest Contentful Paint): optimize critical rendering path
  - INP (Interaction to Next Paint): long tasks, input delay, event handlers
  - CLS (Cumulative Layout Shift): dimension reservation, font loading
- **Bundle optimization**:
  - `@next/bundle-analyzer`: analyze bundle size
  - Tree shaking: named imports, sideEffects config
  - Dynamic imports: `next/dynamic`, `React.lazy`, route-based splitting
  - Module/nomodule: modern vs legacy bundles
- **Runtime performance**:
  - Virtualization: `@tanstack/react-virtual` cho long lists
  - Debounce / Throttle trong event handlers
  - `requestAnimationFrame`, `requestIdleCallback`
  - Web Workers cho heavy computation
  - `will-change`, GPU-accelerated animations
  - Optimistic UI updates
- **Network performance**:
  - Resource hints: `preload`, `prefetch`, `preconnect`, `dns-prefetch`
  - HTTP/2 multiplexing, compression (Brotli, gzip)
  - CDN strategies, edge caching
  - Service Workers (concept): offline support, cache strategies
- **Profiling & Monitoring**:
  - Chrome Performance tab: flame charts, long tasks
  - Lighthouse CI: automated performance scoring
  - React Profiler API: `<Profiler>` component, programmatic measurement
  - Real User Monitoring (RUM): Vercel Analytics, Web Vitals API

### 3.7 Testing Nâng cao
- **Testing strategy**: Testing Diamond / Trophy — integration > unit > e2e
- **Integration testing**: test user flows, không test implementation details
- **E2E testing**:
  - Playwright: setup, selectors, assertions, fixtures
  - Page Object Model pattern
  - Visual regression: screenshot comparison
  - API mocking trong E2E: `route.fulfill`
- **Component testing**: Storybook + interaction tests
- **API mocking**: MSW (Mock Service Worker) — intercept network layer
- **Test patterns**:
  - Testing custom hooks: `renderHook`, act
  - Testing context providers: custom render wrappers
  - Testing async flows: `waitFor`, `findBy` queries
  - Testing error boundaries
  - Testing accessibility: `jest-axe`, axe-core
- **CI testing**: parallel runs, sharding, test reporting
- **Contract testing** (concept): Pact, consumer-driven contracts
- **Load testing** (concept): k6, artillery

### 3.8 Error Handling & Resilience
- **Error Boundaries**: class component pattern, `react-error-boundary` library
- **Granular error boundaries**: page-level vs component-level
- **Fallback UI**: graceful degradation, retry mechanisms
- **Error logging**: Sentry, LogRocket — setup, context, breadcrumbs
- **Global error handling**: `window.onerror`, `unhandledrejection`
- **Network resilience**: retry with exponential backoff, circuit breaker pattern
- **Offline handling**: detect network status, queue actions

### 3.9 Security
- **XSS prevention**: `dangerouslySetInnerHTML` risks, DOMPurify, CSP
- **CSRF protection**: tokens, SameSite cookies
- **Authentication patterns**: JWT vs Session, OAuth 2.0, OpenID Connect
- **Auth libraries**: NextAuth.js (Auth.js), Clerk, Supabase Auth
- **Input validation**: client-side + server-side (Zod), never trust client
- **Environment variables**: `NEXT_PUBLIC_*` vs server-only, `.env.local`
- **Dependency security**: `npm audit`, Snyk, Dependabot
- **Content Security Policy**: nonce-based, hash-based
- **Rate limiting**: API routes, middleware-based
- **HTTPS**, **HSTS**, **Subresource Integrity (SRI)**

### 3.10 CI/CD & DevOps
- **CI pipelines**: GitHub Actions, GitLab CI
  - Lint → Type check → Test → Build → Deploy
  - Caching: node_modules, Next.js build cache
  - Matrix testing: multiple Node versions
- **CD**: preview deployments (Vercel), staging → production
- **Docker**: Dockerfile for Next.js, multi-stage builds, `.dockerignore`
- **Environment management**: dev → staging → production, feature flags
- **Feature flags**: LaunchDarkly, Unleash, Vercel Edge Config, custom solutions
- **Monitoring & Alerting**: uptime monitoring, error rate alerts, performance budgets
- **Infrastructure**: Vercel, AWS (Amplify, CloudFront, Lambda@Edge), Cloudflare Pages

### 3.11 API Design & Full-stack Patterns
- **REST API design**: resource naming, versioning, pagination, filtering, sorting
- **tRPC**: end-to-end type safety, routers, procedures, middleware
- **GraphQL**: Apollo Client, schema design, code generation, caching
- **API Route patterns** (Next.js): middleware, validation, error handling
- **Server Actions best practices**: validation, revalidation, optimistic updates
- **BFF (Backend for Frontend)**: aggregation layer, API gateway
- **Real-time**: WebSocket, Socket.io, Pusher, Server-Sent Events
- **File upload**: presigned URLs (S3), chunked upload, progress tracking
- **Rate limiting & Throttling** trong API routes

### 3.12 Database & ORM (Full-stack Next.js)
- **Prisma**: schema, migrations, relations, queries, transactions
- **Drizzle ORM**: schema definition, type-safe queries, migrations
- **Database choices**: PostgreSQL, MySQL, SQLite, MongoDB
- **Connection pooling**: PgBouncer, Prisma Accelerate
- **Serverless DB**: PlanetScale, Neon, Supabase, Turso
- **Caching layer**: Redis, Upstash — khi nào cần cache DB queries
- **Database patterns**: optimistic locking, soft delete, pagination strategies

### 3.13 Observability & Monitoring
- **Logging**: structured logging, log levels, pino
- **Error tracking**: Sentry — source maps, performance, session replay
- **APM (Application Performance Monitoring)**: traces, spans, OpenTelemetry
- **Analytics**: Vercel Analytics, Google Analytics, Plausible, PostHog
- **Real User Monitoring**: Web Vitals tracking, custom metrics
- **Alerting**: PagerDuty, OpsGenie, Slack webhooks

### 3.14 Advanced Patterns & Concepts
- **Optimistic UI**: update UI trước khi server respond
- **Pessimistic UI**: đợi server confirm rồi mới update
- **Stale-While-Revalidate**: serve cached → fetch fresh → update
- **CQRS** (concept): tách read/write models
- **Event Sourcing** (concept): immutable event log
- **Debounce vs Throttle**: khi nào dùng gì, implementation
- **Pub/Sub trong frontend**: custom event bus, EventEmitter
- **Finite State Machines**: XState, useReducer as FSM
- **Dependency Injection** trong React: Context, module injection
- **Plugin architecture**: extensible systems

---

## PHASE 4: SENIOR MINDSET & SOFT SKILLS

### 4.1 Code Quality & Standards
- Đặt ra coding standards cho team
- Viết và maintain ESLint custom rules
- Thiết kế PR review guidelines
- ADR (Architecture Decision Records): ghi lại quyết định kiến trúc và lý do
- RFC (Request for Comments): propose technical changes
- Technical debt management: identify, prioritize, plan

### 4.2 System Design
- Component library design: API design, versioning, documentation
- Design system: tokens, components, patterns, guidelines
- Performance budgets: set targets, enforce in CI
- Scalability: code splitting strategies, lazy loading plans
- Migration strategies: incremental migration, strangler fig pattern, codemods
- Evaluate & choose technologies: decision matrix, proof of concept

### 4.3 Leadership & Communication
- Mentoring junior/mid developers: code review, pairing, coaching
- Technical writing: RFCs, documentation, runbooks
- Estimating work: break down tasks, identify risks, buffer for unknowns
- Cross-team communication: align with backend, design, product
- Stakeholder management: translate technical concepts cho non-technical people
- Interviewing: technical interview design, rubrics

### 4.4 Problem Solving Approach
- **Trade-off analysis**: mọi quyết định đều có trade-off, document chúng
- **"Good enough" engineering**: perfect is the enemy of shipped
- **Debugging complex issues**: systematic approach, bisect, isolate
- **Root cause analysis**: 5 Whys, fishbone diagram
- **Incident response**: postmortem, blameless culture
- **Technical spikes**: time-boxed research, proof of concept

### 4.5 Staying Current
- Đọc RFCs & changelogs: React, Next.js, TypeScript
- Follow core team members: Twitter/X, blog posts
- Contribute to open source (nếu có thể)
- Conference talks: React Conf, Next.js Conf, local meetups
- Thử nghiệm tools mới: evaluate → prototype → adopt/reject
- Community: Discord servers, GitHub discussions

---

## BONUS: Ecosystem & Tools Map

### Build Tools
`Vite` · `Turbopack` · `Webpack (legacy)` · `esbuild` · `SWC`

### CSS
`Tailwind CSS` · `CSS Modules` · `Vanilla Extract` · `Panda CSS` · `StyleX`

### UI Components
`shadcn/ui` · `Radix UI` · `Headless UI` · `Ark UI` · `React Aria`

### Animation
`Framer Motion` · `GSAP` · `Lottie` · `React Spring` · `Auto Animate`

### State
`Zustand` · `Jotai` · `Valtio` · `Redux Toolkit` · `Recoil`

### Data Fetching
`TanStack Query` · `SWR` · `tRPC` · `Apollo Client` · `urql`

### Forms
`React Hook Form` · `Zod` · `Yup` · `Formik` · `Conform`

### Testing
`Vitest` · `Playwright` · `Testing Library` · `MSW` · `Storybook` · `Cypress`

### Auth
`NextAuth.js` · `Clerk` · `Auth0` · `Supabase Auth` · `Firebase Auth`

### Database/ORM
`Prisma` · `Drizzle` · `Kysely` · `Mongoose`

### Deployment
`Vercel` · `Netlify` · `AWS` · `Cloudflare` · `Docker` · `Railway`

### Monitoring
`Sentry` · `LogRocket` · `Datadog` · `Vercel Analytics` · `PostHog`

### Developer Experience
`ESLint` · `Prettier` · `Husky` · `lint-staged` · `commitlint` · `Changesets`

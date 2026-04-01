"use client";

import { useState } from "react";

type MCQOption = { label: string; text: string };
type MCQAnswer = {
  type: "mcq";
  options: MCQOption[];
  correct: string;
  explanation: string;
};

type Section = {
  id: string;
  title: string;
  items: {
    q: string;
    a:
      | string
      | string[]
      | { type: "table"; headers: string[]; rows: string[][] }
      | MCQAnswer;
  }[];
};

const sections: Section[] = [
  {
    id: "intro",
    title: "I. Giới thiệu bản thân",
    items: [
      {
        q: "Hãy giới thiệu về bản thân và kinh nghiệm của bạn?",
        a: "Tôi là Đinh Tiến Độ, Frontend Developer với hơn 4 năm kinh nghiệm xây dựng các ứng dụng web scalable, high-performance. Tôi chuyên sâu về React/Next.js, với kinh nghiệm thực tế ở nhiều domain khác nhau: crypto trading (ONUS Labs), energy platform (FPT Software – LGCNS Korea), financial analytics (VNEXT – FiinGroup), và fullstack (AMELA Technology). Gần nhất tôi đã contribute vào nền tảng giao dịch crypto Goonus.io phục vụ 7M+ users, tập trung vào real-time data, performance optimization và scalable architecture.",
      },
    ],
  },
  {
    id: "react-nextjs",
    title: "II. React & Next.js",
    items: [
      {
        q: "Bạn giải thích sự khác nhau giữa SSR, SSG và CSR trong Next.js? Khi nào dùng cái nào?",
        a: [
          "CSR: Render ở client, phù hợp với nội dung cần tương tác cao, không cần SEO (ví dụ: dashboard sau login).",
          "SSR: Render mỗi request tại server, phù hợp với data thay đổi thường xuyên và cần SEO (ví dụ: trang sản phẩm, trang thị trường crypto).",
          "SSG: Build time render, phù hợp với nội dung ít thay đổi (blog, landing page).",
          "→ Tại ONUS Labs, apply SSR/SSG kết hợp code splitting và lazy loading để cải thiện performance và SEO cho platform 7M+ users.",
        ],
      },
      {
        q: "Bạn xử lý state management như thế nào? Khi nào dùng React Query, khi nào dùng Redux Toolkit hay Zustand?",
        a: [
          "React Query: Dùng cho server state — fetching, caching, syncing data từ API. Refactor với React Query tại ONUS Labs giảm redundant API calls ~20-30%.",
          "Redux Toolkit: Dùng cho global client state phức tạp, nhiều slice, có side effects cần middleware.",
          "Zustand: Lightweight, dùng cho global state đơn giản hơn, ít boilerplate hơn Redux.",
          "→ Nguyên tắc: phân tách rõ server state vs client state, tránh đưa server data vào Redux.",
        ],
      },
      {
        q: "Bạn hiểu gì về React rendering và cách tối ưu performance?",
        a: [
          "React.memo để tránh re-render component không cần thiết",
          "useMemo / useCallback cho expensive computation và stable reference",
          "Code splitting với React.lazy + Suspense",
          "Lazy loading components và images",
          "Virtualization (react-window/react-virtual) cho danh sách lớn",
          "→ Đã áp dụng tại ONUS Labs và VNEXT cho data-intensive dashboard với hàng nghìn data points.",
        ],
      },
      {
        q: "Custom Hook là gì? Bạn đã tạo những custom hook nào?",
        a: [
          "Custom Hook là function bắt đầu bằng `use`, cho phép tái sử dụng stateful logic giữa các component.",
          "useWebSocket: Quản lý kết nối, subscribe/unsubscribe channel, reconnect logic",
          "useDebounce / useThrottle: Giới hạn tần suất xử lý event (search, resize)",
          "useIntersectionObserver: Lazy load component khi vào viewport",
          "useLocalStorage: Sync state với localStorage",
          "→ Custom hooks giúp tách business logic ra khỏi UI component, dễ test và tái sử dụng.",
        ],
      },
      {
        q: "Bạn giải thích React lifecycle với functional component (hooks) như thế nào?",
        a: [
          "Mount: useEffect(() => { ... }, []) — chạy một lần sau render đầu tiên",
          "Update: useEffect(() => { ... }, [dep]) — chạy khi dependency thay đổi",
          "Unmount: return cleanup function trong useEffect — dùng để clear timer, close WebSocket, cancel request",
          "→ Cleanup function đặc biệt cần thiết với WebSocket và subscription để tránh memory leak.",
        ],
      },
    ],
  },
  {
    id: "realtime",
    title: "III. Real-time & WebSocket",
    items: [
      {
        q: "Bạn đã xử lý real-time data với WebSocket như thế nào trong dự án?",
        a: [
          "Tại ONUS Labs, build trading interface handle real-time market data (price feeds, order books) qua Socket.io.",
          "High-frequency updates: throttle/debounce UI updates để tránh render quá nhiều lần",
          "Data consistency: reconcile giữa WebSocket data và REST API data",
          "Memory management: cleanup listener khi component unmount, tránh memory leak",
          "Reconnection: handle reconnect logic và re-subscribe channels khi mất kết nối",
          "→ Tích hợp TradingView widget với custom datafeed để stream real-time candlestick data.",
        ],
      },
      {
        q: "Làm sao bạn đảm bảo UI ổn định khi có continuous data stream?",
        a: [
          "Dùng requestAnimationFrame hoặc throttle để batch UI updates",
          "Tách biệt data layer và UI layer — data update không trigger toàn bộ tree re-render",
          "Dùng React Query's staleTime và refetchInterval thay vì polling thủ công",
          "→ Tại FPT Software (energy platform), dùng buffer và batch update để đảm bảo UI không bị giật.",
        ],
      },
      {
        q: "Sự khác nhau giữa WebSocket và HTTP polling? Khi nào dùng cái nào?",
        a: [
          "HTTP Polling: Client gửi request định kỳ. Đơn giản nhưng lãng phí bandwidth, latency cao.",
          "Long Polling: Client giữ connection mở đến khi có data mới. Tốt hơn nhưng vẫn có overhead.",
          "WebSocket: Bidirectional, persistent connection. Latency thấp, phù hợp với real-time thực sự.",
          "→ Với trading platform, WebSocket là bắt buộc vì price data thay đổi hàng chục lần/giây.",
        ],
      },
    ],
  },
  {
    id: "performance",
    title: "IV. Performance Optimization",
    items: [
      {
        q: "Core Web Vitals là gì và bạn đã cải thiện chúng như thế nào?",
        a: [
          "LCP (Largest Contentful Paint): Thời gian render element lớn nhất. Tối ưu bằng SSR, image optimization, preload.",
          "FID/INP (Interaction to Next Paint): Phản hồi input. Tối ưu bằng giảm JS bundle, code splitting.",
          "CLS (Cumulative Layout Shift): Tránh layout shift bằng cách định sẵn kích thước image/component.",
          "→ Tại ONUS Labs, collaborate với SEO team implement metadata, sitemap, structured data, SSR và lazy loading.",
        ],
      },
      {
        q: "Bạn handle code splitting như thế nào trong một large-scale app?",
        a: [
          "Route-based splitting với Next.js (automatic) — mỗi page là một chunk riêng",
          "Component-level splitting với React.lazy cho heavy component (charts, modals, editors)",
          "Dynamic import cho third-party libraries chỉ dùng ở một số nơi (TradingView, ApexCharts)",
          "Phân tích bundle với @next/bundle-analyzer để identify large dependencies",
        ],
      },
      {
        q: "Bạn xử lý large dataset trên UI như thế nào?",
        a: [
          "Virtualization: Chỉ render rows đang visible (react-window hoặc TanStack Virtual)",
          "Pagination / Infinite scroll: Không load toàn bộ data một lúc",
          "Memoization: Cache kết quả tính toán nặng với useMemo",
          "Web Worker: Offload heavy computation ra khỏi main thread",
          "→ Tại VNEXT (FiinGroup), optimize rendering cho financial dashboard với hàng nghìn rows và complex charts.",
        ],
      },
    ],
  },
  {
    id: "typescript",
    title: "V. TypeScript",
    items: [
      {
        q: "Bạn dùng TypeScript như thế nào trong dự án thực tế?",
        a: [
          "Define strict interface/type cho API response, props, state",
          "Generic types cho reusable components và hooks",
          "Discriminated unions cho state machines (loading/success/error)",
          "Utility types như Pick, Omit, Partial, Record để tái sử dụng types",
          "→ TypeScript giúp catch bugs sớm, đặc biệt quan trọng trong trading platform nơi data structure rất phức tạp.",
        ],
      },
      {
        q: "Phân biệt `interface` và `type` trong TypeScript?",
        a: [
          "interface: Dùng cho object shape, có thể extend và merge (declaration merging). Ưu tiên cho component props và API response.",
          "type: Linh hoạt hơn, dùng cho union, intersection, primitive, tuple. Dùng khi cần compose types phức tạp.",
          "→ Thực tế: dùng interface cho props/API types, type cho union types và utility types phức tạp.",
        ],
      },
    ],
  },
  {
    id: "projects",
    title: "VI. Kinh nghiệm dự án cụ thể",
    items: [
      {
        q: "Kể về thách thức lớn nhất trong dự án Goonus.io và cách bạn giải quyết?",
        a: [
          "Thách thức: Handle high-frequency WebSocket updates (price/order book) không làm UI lag trên platform 7M+ users.",
          "1. Throttle UI updates — chỉ re-render mỗi ~100ms thay vì mỗi message",
          "2. Normalize data structure để React có thể diff nhanh hơn",
          "3. Dùng React Query để manage server state, tránh duplicate fetching",
          "4. Áp dụng React.memo và useMemo cho order book component",
          "→ Kết quả: UI responsiveness cải thiện rõ rệt, API calls giảm ~20-30%.",
        ],
      },
      {
        q: "Bạn có kinh nghiệm mentor và review code không?",
        a: "Có. Tại FPT Software, lead frontend development cho key modules của energy platform (LGCNS Korea), mentor junior developers và đảm bảo code quality qua PR reviews. Tập trung vào: naming convention, component design, performance pitfalls và TypeScript correctness.",
      },
      {
        q: "Bạn đã làm việc với client nước ngoài chưa?",
        a: "Có, tại FPT Software làm việc trực tiếp với client Korea (LGCNS) cho dự án energy platform. Collaborate qua email, Jira và meeting định kỳ. Kinh nghiệm này giúp hiểu tầm quan trọng của việc clarify requirement rõ ràng từ đầu, document kỹ, và communicate proactively khi có issue.",
      },
    ],
  },
  {
    id: "cicd",
    title: "VII. CI/CD & DevOps",
    items: [
      {
        q: "Bạn đã làm việc với CI/CD như thế nào?",
        a: "Đã setup và làm việc với GitHub Actions và GitLab CI để automate build, test và deploy. Tại AMELA Technology, deploy ứng dụng lên AWS (EC2, S3) với CI/CD pipelines. Kinh nghiệm với Docker để containerize frontend app và Nginx làm reverse proxy, Vercel cho Next.js deployments.",
      },
      {
        q: "Bạn dùng Docker để làm gì trong frontend project?",
        a: [
          "Build static files trong Docker image (multi-stage build để giảm image size)",
          "Dùng Nginx image để serve static files",
          "Chạy container locally để test production build trước khi deploy",
        ],
      },
    ],
  },
  {
    id: "behavioral",
    title: "VIII. Câu hỏi hành vi (Behavioral)",
    items: [
      {
        q: "Bạn làm việc với backend team như thế nào để deliver feature đúng deadline?",
        a: "Proactively align với backend về API contract sớm (dùng OpenAPI/Swagger hoặc mock data). Trong khi backend còn develop, dùng mock data để progress song song. Khi có breaking changes, communicate ngay để không bị block. Tại ONUS Labs, work closely với backend team để deliver real-time trading features — communication thường xuyên là key.",
      },
      {
        q: "Kể về một lần bạn phát hiện và fix một performance issue nghiêm trọng?",
        a: "Tại ONUS Labs, phát hiện page load chậm do data fetching không có caching — cùng một API được gọi nhiều lần từ các component khác nhau. Refactor toàn bộ sang React Query với proper queryKey và staleTime, kết quả giảm redundant API calls ~20-30%. Ngoài ra identify một component order book bị re-render liên tục mỗi WebSocket message — fix bằng React.memo và throttle.",
      },
      {
        q: "Bạn ưu tiên gì khi review code của người khác?",
        a: [
          "1. Correctness: Logic có đúng không, edge case đã handle chưa",
          "2. Performance: Có re-render không cần thiết không, query có được cache chưa",
          "3. Type safety: TypeScript đã strict chưa, có dùng any không",
          "4. Readability: Naming rõ ràng, component có quá lớn không",
          "5. Consistency: Theo đúng convention của project chưa",
        ],
      },
      {
        q: "Tại sao bạn chọn Frontend và định hướng của bạn là gì?",
        a: "Tôi thích Frontend vì sự kết hợp giữa technical depth và user-facing impact. Định hướng là tiếp tục deep dive vào performance optimization, real-time systems, và mở rộng sang system design cho large-scale frontend applications. Cũng quan tâm đến việc contribute vào frontend architecture decisions.",
      },
    ],
  },
  {
    id: "quickfire",
    title: "IX. Câu hỏi kỹ thuật nhanh (Quick Fire)",
    items: [
      {
        q: "useEffect vs useLayoutEffect?",
        a: "useLayoutEffect chạy synchronous sau DOM mutation, trước khi browser paint. Dùng khi cần đọc/write DOM ngay (đo kích thước, scroll position). useEffect chạy asynchronous sau paint — dùng cho side effects thông thường.",
      },
      {
        q: "Controlled vs Uncontrolled component?",
        a: "Controlled: state do React quản lý (value + onChange). Uncontrolled: state do DOM quản lý (ref). Controlled dễ validate và compose hơn, uncontrolled phù hợp tích hợp với non-React code.",
      },
      {
        q: "`key` prop trong list dùng để làm gì?",
        a: "Giúp React identify element nào thay đổi, thêm, xóa — tránh re-render không cần thiết và giữ đúng component state khi list thay đổi thứ tự.",
      },
      {
        q: "Reconciliation là gì?",
        a: "Thuật toán React dùng để compare Virtual DOM cũ và mới (diffing), chỉ update phần thay đổi lên real DOM. Giảm số DOM operations, cải thiện performance.",
      },
      {
        q: "`Suspense` dùng để làm gì?",
        a: "Wrap lazy-loaded component hoặc data-fetching, hiển thị fallback UI trong khi component đang load. Cho phép declarative loading states.",
      },
      {
        q: "Stale closure trong hook là gì?",
        a: "Hook capture giá trị state/props tại thời điểm tạo closure — nếu không update dependency array, sẽ dùng giá trị cũ (stale). Fix bằng cách thêm đúng dependencies vào useEffect/useCallback.",
      },
    ],
  },
  {
    id: "angular-open",
    title: "X. Angular — Open Questions (2+ yrs)",
    items: [
      {
        q: "What is the difference between `ngOnInit` and the `constructor` in Angular?",
        a: [
          "constructor: Called by JavaScript engine when class is instantiated. Used only for Dependency Injection — injecting services. Should NOT contain component logic.",
          "ngOnInit: Lifecycle hook called by Angular after first ngOnChanges. @Input() bindings are already initialized here. Ideal for data fetching, subscriptions, and initialization logic.",
          "Rule of thumb: inject in constructor, initialize in ngOnInit.",
        ],
      },
      {
        q: "Explain Angular's change detection — Default vs OnPush strategy.",
        a: [
          "Default: Angular checks the entire component tree on every async event (click, timer, HTTP response). Simple but expensive for large trees.",
          "OnPush: Angular only checks the component when: (1) an @Input() reference changes, (2) an event originates from the component or its children, (3) an Observable via async pipe emits, (4) markForCheck() or detectChanges() is called explicitly.",
          "OnPush requires immutable data patterns — mutating objects without changing the reference will not trigger re-render.",
          "→ Apply OnPush broadly on leaf/presentational components to drastically reduce change detection cycles.",
        ],
      },
      {
        q: "What is the difference between `providedIn: 'root'`, module-level `providers`, and component-level `providers`?",
        a: [
          "providedIn: 'root': Registers a singleton service at the root injector. Tree-shakable — if not injected anywhere, it won't be included in the bundle. Preferred modern approach.",
          "Module providers: Scoped to that module's injector. Lazy-loaded modules get their own injector, so services there are NOT shared with the root.",
          "Component providers: A new instance is created for each component instance. Use when you need isolated state per component (e.g., a form service).",
        ],
      },
      {
        q: "How does lazy loading work in Angular routing? What is preloading?",
        a: [
          "Lazy loading: Routes use loadChildren to load a module (or standalone component) only when the route is first visited. Reduces initial bundle size.",
          "Syntax: { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }",
          "Preloading: After app is loaded, Angular preloads lazy modules in the background so subsequent navigations are instant.",
          "Strategies: NoPreloading (default), PreloadAllModules, or custom strategy (e.g., preload only modules with data: { preload: true }).",
        ],
      },
      {
        q: "What are standalone components and how do they differ from NgModule-based components?",
        a: [
          "Standalone components (Angular 14+): Declared with standalone: true. They manage their own dependencies via imports array — no NgModule required.",
          "They can import other standalone components, directives, pipes, and NgModules directly.",
          "App bootstrapped with bootstrapApplication(AppComponent, { providers: [...] }) instead of platformBrowserDynamic().bootstrapModule(AppModule).",
          "Benefits: Less boilerplate, better tree-shaking, easier testing, aligns with React/Vue mental model.",
          "→ Angular 17+ defaults to standalone — NgModules are now optional.",
        ],
      },
      {
        q: "Explain the difference between switchMap, mergeMap, concatMap, and exhaustMap.",
        a: [
          "switchMap: Cancels the previous inner observable when a new source value arrives. Best for: search typeahead, route-based data fetch (only care about latest).",
          "mergeMap: Runs all inner observables in parallel, no cancellation. Best for: parallel independent requests.",
          "concatMap: Queues inner observables, executes one at a time in order. Best for: sequential operations where order matters (e.g., ordered API calls).",
          "exhaustMap: Ignores new source values while current inner observable is active. Best for: preventing duplicate form submissions.",
          "Memory tip: Switch = latest wins | Merge = all run | Concat = queue | Exhaust = ignore until done.",
        ],
      },
      {
        q: "How do you prevent memory leaks from RxJS subscriptions in Angular?",
        a: [
          "async pipe (recommended): Auto-subscribes and unsubscribes when component is destroyed. Cleanest approach.",
          "takeUntilDestroyed() (Angular 16+): pipe(takeUntilDestroyed()) in injection context — no manual Subject needed.",
          "takeUntil pattern: Use a Subject destroy$ and call destroy$.next() + destroy$.complete() in ngOnDestroy.",
          "Store subscription and call .unsubscribe() in ngOnDestroy — verbose but explicit.",
          "→ Prefer async pipe or takeUntilDestroyed() in modern Angular.",
        ],
      },
      {
        q: "What are Angular Signals and how do they compare to RxJS Observables?",
        a: [
          "Signals (Angular 16+): Reactive primitive that holds a value and notifies consumers when it changes. Synchronous and always have a current value.",
          "signal(value): Create a writable signal. | computed(() => ...): Derived read-only signal. | effect(() => ...): Side effect that runs when signals it reads change.",
          "vs Observables: Signals are synchronous, always have a value, simpler API. Observables are asynchronous streams, can represent events over time, more powerful for complex async flows.",
          "Change detection: Signals enable fine-grained, Zone-less change detection — Angular knows exactly which components need updating.",
          "→ Use Signals for local/derived state; keep RxJS for complex async flows (HTTP, WebSocket, combineLatest).",
        ],
      },
      {
        q: "What is the `@defer` block in Angular 17+? What are its loading triggers?",
        a: [
          "@defer: Lazily loads a template block and its dependencies at runtime — reducing initial bundle size without manual dynamic imports.",
          "on idle: Load when browser is idle (requestIdleCallback)",
          "on viewport: Load when the placeholder enters the viewport (IntersectionObserver)",
          "on interaction: Load on first user interaction (click, focus) with placeholder",
          "on timer(2s): Load after a delay",
          "on immediate: Load as soon as possible after initial render",
          "when condition: Load when a boolean expression becomes true",
          "@placeholder, @loading, @error blocks provide declarative fallback UI.",
        ],
      },
      {
        q: "What is the `inject()` function and when would you use it over constructor injection?",
        a: [
          "inject() is a functional alternative to constructor-based DI. It can be called in an injection context: field initializers, constructor body, or factory functions.",
          "Use cases: (1) Functional route guards/interceptors (no class needed). (2) Composable logic in standalone functions. (3) Mixing inject() into base class logic without constructor chaining issues.",
          "Example: const router = inject(Router); inside a guard function or standalone component field.",
          "inject() + takeUntilDestroyed() is the modern pattern for clean subscriptions.",
        ],
      },
      {
        q: "What is the difference between `ViewChild`/`ViewChildren` and `ContentChild`/`ContentChildren`?",
        a: [
          "ViewChild/ViewChildren: Access elements or directives defined in the component's own template (between its opening and closing tags in .html file).",
          "ContentChild/ContentChildren: Access elements or directives projected into the component via <ng-content>. Only available after ngAfterContentInit.",
          "Timing: ViewChild available after ngAfterViewInit. ContentChild available after ngAfterContentInit.",
          "Example: A tab component using ContentChild to query TabPane components projected into it.",
        ],
      },
      {
        q: "How do you create a custom validator in Angular Reactive Forms?",
        a: [
          "A ValidatorFn takes an AbstractControl and returns null (valid) or a ValidationErrors object (invalid).",
          "Example: const forbiddenName = (name: string): ValidatorFn => (control) => control.value === name ? { forbiddenName: { value: control.value } } : null;",
          "Cross-field validator: Apply at FormGroup level — access both controls via group.get('field').",
          "Async validator: Returns Observable<ValidationErrors | null> or Promise — used for server-side checks (e.g., username availability).",
          "Register: Validators.compose([Validators.required, myValidator]) or as second arg to new FormControl('', myValidator).",
        ],
      },
      {
        q: "Explain Angular route guards. What is the difference between CanActivate, CanDeactivate, CanLoad, and Resolve?",
        a: [
          "CanActivate: Prevents navigation TO a route. Most common — used for auth checks.",
          "CanDeactivate: Prevents leaving a route. Useful for 'unsaved changes' warning on forms.",
          "CanLoad: Prevents the lazy-loaded MODULE from being downloaded at all. More secure than CanActivate for lazy routes.",
          "CanActivateChild: Protects all child routes of a parent route.",
          "Resolve: Pre-fetches data before the route is activated. Component receives the data via ActivatedRoute.data. Avoids loading spinners inside component.",
          "→ Modern Angular (v15+): Guards can be plain functions returning boolean | UrlTree | Observable.",
        ],
      },
      {
        q: "What is Zone.js and how does it relate to Angular's change detection?",
        a: [
          "Zone.js: A library that monkey-patches async APIs (setTimeout, Promise, fetch, addEventListener). It intercepts when async operations complete.",
          "Angular uses NgZone: When an async operation finishes inside Angular's zone, NgZone triggers change detection automatically.",
          "This is why code inside setTimeout or HTTP callbacks triggers UI updates automatically.",
          "runOutsideAngular(): Use to run code without triggering CD — useful for heavy animations or third-party libs that update frequently.",
          "→ Angular 17+ supports Zoneless change detection using Signals, eliminating the Zone.js overhead entirely.",
        ],
      },
      {
        q: "What are the ViewEncapsulation modes in Angular?",
        a: [
          "Emulated (default): Angular adds unique attribute selectors to component styles and DOM elements. CSS is scoped but uses the regular DOM — no shadow DOM.",
          "ShadowDom: Uses the browser's native Shadow DOM. True style isolation. Supported in modern browsers.",
          "None: Styles are added to the global stylesheet. No encapsulation — styles bleed into other components.",
          "→ Use Emulated for most cases. Use None when building a shared design system where styles need to cascade. Avoid ShadowDom unless you need true shadow DOM semantics.",
        ],
      },
    ],
  },
  {
    id: "angular-mcq",
    title: "XI. Angular — Quiz (Multiple Choice)",
    items: [
      {
        q: "Which lifecycle hook is called ONCE after the component's first change detection run, when @Input() bindings are already available?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "ngOnChanges" },
            { label: "B", text: "ngOnInit" },
            { label: "C", text: "ngDoCheck" },
            { label: "D", text: "ngAfterViewInit" },
          ],
          correct: "B",
          explanation: "ngOnInit is called once after the first ngOnChanges. @Input() values are already set, making it the right place for initialization logic and data fetching.",
        },
      },
      {
        q: "With `ChangeDetectionStrategy.OnPush`, which scenario will NOT automatically trigger change detection?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "An @Input() reference changes to a new object" },
            { label: "B", text: "A DOM event fires inside the component" },
            { label: "C", text: "An Observable subscribed via async pipe emits a value" },
            { label: "D", text: "A setTimeout callback mutates an existing @Input() object" },
          ],
          correct: "D",
          explanation: "OnPush only checks when an Input reference changes, a component event fires, or async pipe emits. Mutating an existing object without changing its reference won't be detected — you need immutable updates.",
        },
      },
      {
        q: "Which RxJS operator should you use for a search typeahead — to cancel stale HTTP requests and only use the latest result?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "mergeMap" },
            { label: "B", text: "concatMap" },
            { label: "C", text: "switchMap" },
            { label: "D", text: "exhaustMap" },
          ],
          correct: "C",
          explanation: "switchMap cancels the previous inner observable when a new value arrives — perfect for typeahead where only the latest search result matters.",
        },
      },
      {
        q: "Which operator is best for a 'Submit' button handler to prevent duplicate submissions while a request is in-flight?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "switchMap" },
            { label: "B", text: "mergeMap" },
            { label: "C", text: "concatMap" },
            { label: "D", text: "exhaustMap" },
          ],
          correct: "D",
          explanation: "exhaustMap ignores new source emissions while the current inner observable is still active. This prevents firing duplicate requests on multiple button clicks.",
        },
      },
      {
        q: "What does `providedIn: 'root'` provide over adding a service to a module's `providers` array?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Creates a new instance per component" },
            { label: "B", text: "Makes the service lazy-loaded per route" },
            { label: "C", text: "Makes the service tree-shakable — excluded from bundle if unused" },
            { label: "D", text: "Restricts the service to a single module" },
          ],
          correct: "C",
          explanation: "providedIn: 'root' registers the service at the root injector AND enables tree-shaking. If nothing injects the service, the bundler excludes it. Module providers are always included in the module's bundle.",
        },
      },
      {
        q: "Which Angular pipe is impure (re-evaluated on every change detection cycle)?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "DatePipe" },
            { label: "B", text: "UpperCasePipe" },
            { label: "C", text: "AsyncPipe" },
            { label: "D", text: "DecimalPipe" },
          ],
          correct: "C",
          explanation: "AsyncPipe is impure — it must check the observable's latest emission on every CD cycle. Pure pipes only re-run when the input reference changes.",
        },
      },
      {
        q: "What does `trackBy` in `*ngFor` / `@for` primarily improve?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Sorting performance" },
            { label: "B", text: "DOM reconciliation — Angular reuses existing DOM nodes instead of recreating them" },
            { label: "C", text: "TypeScript type inference for list items" },
            { label: "D", text: "Template compilation speed" },
          ],
          correct: "B",
          explanation: "trackBy provides a unique key per item so Angular can match old and new lists. Unchanged items reuse their existing DOM nodes instead of being destroyed and recreated — critical for large lists.",
        },
      },
      {
        q: "Which route guard pre-fetches data BEFORE the component is activated?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "CanActivate" },
            { label: "B", text: "CanDeactivate" },
            { label: "C", text: "CanLoad" },
            { label: "D", text: "Resolve" },
          ],
          correct: "D",
          explanation: "Resolve runs before the route activates and passes the resolved data via ActivatedRoute.data. The component renders only after the data is ready, eliminating loading states inside the component.",
        },
      },
      {
        q: "In Angular Signals, what does `computed()` create?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "A writable signal with initial value" },
            { label: "B", text: "A side effect that runs on signal change" },
            { label: "C", text: "A read-only derived signal recalculated when its dependencies change" },
            { label: "D", text: "A replacement for ngOnInit" },
          ],
          correct: "C",
          explanation: "computed() creates a lazily evaluated, read-only signal. It automatically tracks which signals it reads and recomputes only when those signals change — similar to a Vue computed property.",
        },
      },
      {
        q: "Which `@defer` trigger loads a block when the user scrolls it into the viewport?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "on idle" },
            { label: "B", text: "on interaction" },
            { label: "C", text: "on viewport" },
            { label: "D", text: "on timer" },
          ],
          correct: "C",
          explanation: "on viewport uses IntersectionObserver to detect when the @placeholder element enters the viewport, then loads and renders the deferred block.",
        },
      },
      {
        q: "Which `ViewEncapsulation` mode is NOT valid in current Angular (was deprecated)?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Emulated" },
            { label: "B", text: "ShadowDom" },
            { label: "C", text: "Native" },
            { label: "D", text: "None" },
          ],
          correct: "C",
          explanation: "ViewEncapsulation.Native was deprecated and removed. It was replaced by ViewEncapsulation.ShadowDom which uses the standardized Shadow DOM API.",
        },
      },
      {
        q: "In Reactive Forms, what should a custom `ValidatorFn` return when the field value is VALID?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "true" },
            { label: "B", text: "{ valid: true }" },
            { label: "C", text: "null" },
            { label: "D", text: "undefined" },
          ],
          correct: "C",
          explanation: "A ValidatorFn must return null when the value is valid, and a ValidationErrors object (e.g., { required: true }) when invalid. Returning null signals 'no error'.",
        },
      },
      {
        q: "What is the key difference between `BehaviorSubject` and `Subject`?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Subject can multicast; BehaviorSubject cannot" },
            { label: "B", text: "BehaviorSubject requires an initial value and immediately emits the current value to new subscribers" },
            { label: "C", text: "Subject is synchronous; BehaviorSubject is asynchronous" },
            { label: "D", text: "BehaviorSubject can only emit once" },
          ],
          correct: "B",
          explanation: "BehaviorSubject stores the current value and emits it immediately to any new subscriber. Subject only emits to subscribers active at the moment of emission — late subscribers miss previous values.",
        },
      },
      {
        q: "In a standalone component, how do you use a directive or pipe from another module?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Add it to a shared NgModule's declarations" },
            { label: "B", text: "Add it to the component's imports array directly" },
            { label: "C", text: "Use providedIn: 'root' on the directive" },
            { label: "D", text: "Register it in main.ts providers" },
          ],
          correct: "B",
          explanation: "Standalone components declare their own dependencies in the imports array — they can import other standalone components/directives/pipes, or entire NgModules. No shared module needed.",
        },
      },
      {
        q: "Which Angular feature enables fine-grained, zone-less change detection in Angular 17+?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Lazy loading" },
            { label: "B", text: "OnPush strategy" },
            { label: "C", text: "Signals" },
            { label: "D", text: "Standalone components" },
          ],
          correct: "C",
          explanation: "Signals provide fine-grained reactivity — Angular knows exactly which components depend on a signal and re-renders only those, without needing Zone.js to trigger a full tree check.",
        },
      },
    ],
  },
  {
    id: "questions-for-interviewer",
    title: "XII. Câu hỏi ngược lại cho Interviewer",
    items: [
      {
        q: "Những câu hỏi nên hỏi interviewer",
        a: [
          "Tech stack và architecture hiện tại của team như thế nào?",
          "Bài toán scale/performance lớn nhất team đang đối mặt là gì?",
          "Team làm việc theo quy trình nào (Scrum, Kanban)?",
          "Cơ hội để contribute vào architecture decisions có không?",
          "Roadmap sản phẩm trong 6-12 tháng tới?",
        ],
      },
    ],
  },
];

function MCQContent({ answer }: { answer: MCQAnswer }) {
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

function AnswerContent({
  answer,
}: {
  answer:
    | string
    | string[]
    | { type: "table"; headers: string[]; rows: string[][] }
    | MCQAnswer;
}) {
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

function QAItem({ item }: { item: Section["items"][0] }) {
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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

function SectionBlock({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);
  const mcqCount = section.items.filter(
    (item) =>
      typeof item.a === "object" &&
      !Array.isArray(item.a) &&
      (item.a as MCQAnswer).type === "mcq"
  ).length;

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-3 text-left group"
      >
        <span
          className={`text-zinc-400 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          {section.title}
        </h2>
        <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded">
          {section.items.length}
        </span>
        {mcqCount > 0 && (
          <span className="text-xs text-violet-500 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400 px-1.5 py-0.5 rounded">
            {mcqCount} quiz
          </span>
        )}
      </button>
      {open && (
        <div className="space-y-2 ml-5">
          {section.items.map((item, i) => (
            <QAItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function InterviewQA() {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? sections
        .map((s) => ({
          ...s,
          items: s.items.filter((item) => {
            const q = item.q.toLowerCase();
            const term = search.toLowerCase();
            if (q.includes(term)) return true;
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
        .filter((s) => s.items.length > 0)
    : sections;

  const totalQuestions = sections.reduce((acc, s) => acc + s.items.length, 0);
  const totalMCQ = sections.reduce(
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

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Interview Q&amp;A
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {totalQuestions} câu hỏi • {sections.length} sections •{" "}
          <span className="text-violet-500">{totalMCQ} quiz (A/B/C/D)</span>
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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

      {/* Tips banner */}
      {!search && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
            Mẹo khi phỏng vấn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-600 dark:text-amber-300">
            {[
              [
                "Câu hỏi technical khó",
                "Nói to suy nghĩ, đừng im lặng. Interviewer đánh giá cả process",
              ],
              [
                "Câu hỏi bạn không biết",
                '"Tôi chưa dùng cái đó nhưng tôi sẽ approach theo hướng..."',
              ],
              [
                "Câu hỏi về điểm yếu",
                "Chọn điểm yếu thật nhưng đang cải thiện",
              ],
              [
                "Câu hỏi về conflict",
                "Dùng STAR method: Situation, Task, Action, Result",
              ],
            ].map(([situation, advice]) => (
              <div key={situation}>
                <span className="font-medium">{situation}:</span> {advice}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-400 text-center py-8">
          Không tìm thấy kết quả.
        </p>
      ) : (
        filtered.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))
      )}
    </div>
  );
}

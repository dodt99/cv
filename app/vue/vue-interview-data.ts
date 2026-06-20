import type { Section } from "../components/interview/types";

export const vueInterviewSections: Section[] = [
  {
    id: "vue-core",
    title: "I. Core & Reactivity",
    items: [
      {
        q: "`ref` vs `reactive` — khi nào dùng cái nào?",
        a: [
          "`ref`: Dùng cho primitive values (string, number, boolean) và khi cần reassign toàn bộ giá trị. Trong script truy cập qua `.value`, trong template tự unwrap.",
          "`reactive`: Dùng cho object/array phức tạp khi bạn giữ reference và chỉ mutate properties bên trong. Không thể reassign reactive object sang object mới mà vẫn giữ reactivity.",
          "Quy tắc thực tế: primitive → `ref`; object/array lớn hoặc form state → `reactive`; khi cần destructure từ reactive → dùng `toRefs()` để giữ reactivity.",
          "Ví dụ: `const count = ref(0)`; `const form = reactive({ name: '', email: '' })`.",
        ],
      },
      {
        q: "Vue 3 reactivity hoạt động thế nào? (Proxy)",
        a: [
          "Vue 3 dùng ES6 `Proxy` thay cho `Object.defineProperty` (Vue 2) để intercept get/set trên object.",
          "Khi đọc property (track): Vue ghi nhận dependency — component/computed/watch đang dùng property đó.",
          "Khi ghi property (trigger): Vue thông báo cho tất cả subscriber cập nhật (re-render, re-compute, chạy watcher).",
          "Proxy hỗ trợ thêm/xóa property, array index mutation, và Map/Set — những thứ Vue 2 phải hack.",
          "Limitation: destructure reactive object mất reactivity (cần `toRefs`); assign mới toàn bộ object cần `ref` hoặc `Object.assign`.",
        ],
      },
      {
        q: "`computed` vs method trong template — khác biệt?",
        a: [
          "`computed`: Cached — chỉ re-evaluate khi dependency thay đổi. Dùng cho derived state, tránh tính toán lặp lại mỗi render.",
          "Method: Chạy lại mỗi lần component re-render, không cache. Phù hợp khi cần side effect hoặc logic không phụ thuộc reactive state.",
          "Computed có getter/setter (writable computed); method thì không.",
          "Best practice: template expression phức tạp hoặc lọc/transform data → dùng `computed`; event handler → dùng method.",
        ],
      },
      {
        q: "`watch` vs `watchEffect` — khác biệt và use case?",
        a: [
          "`watch`: Lazy — không chạy ngay khi mount (trừ `{ immediate: true }`). Theo dõi source cụ thể (ref, reactive property, getter function). Trả về oldValue và newValue.",
          "`watchEffect`: Eager — chạy ngay lập tức, tự track mọi reactive dependency được đọc trong callback. Không có old/new value.",
          "Use case `watch`: gọi API khi `userId` đổi, validate form field cụ thể, sync state với URL query.",
          "Use case `watchEffect`: side effect phụ thuộc nhiều source (logging, localStorage sync), setup subscription tự cleanup.",
          "Cả hai đều hỗ trợ cleanup function (return trong callback) để tránh memory leak.",
        ],
      },
      {
        q: "`shallowRef` / `shallowReactive` dùng khi nào?",
        a: [
          "`shallowRef`: Chỉ trigger update khi `.value` thay đổi reference, không deep track bên trong object. Dùng cho large immutable data, third-party instances (Chart.js, Mapbox).",
          "`shallowReactive`: Chỉ reactive ở root level — thêm/sửa property root trigger update, nhưng mutate nested object không trigger.",
          "Performance: Giảm overhead tracking khi bạn biết chắn chỉ cần shallow reactivity hoặc data được replace wholesale.",
          "Kết hợp `triggerRef(shallowRef)` khi mutate nested mà vẫn muốn force update.",
          "Ví dụ: `const chartData = shallowRef(largeDataset)` — update bằng `chartData.value = newDataset`.",
        ],
      },
    ],
  },
  {
    id: "vue-composition",
    title: "II. Composition API & script setup",
    items: [
      {
        q: "`<script setup>` là gì? Lợi ích so với `setup()`?",
        a: [
          "`<script setup>` là compile-time sugar cho Composition API — code chạy trong context của `setup()`, mọi binding top-level tự expose ra template.",
          "Không cần `return { ... }` — biến, function, import đều dùng trực tiếp trong template.",
          "Compiler macros: `defineProps`, `defineEmits`, `defineExpose`, `defineModel`, `defineOptions`, `defineSlots` — không cần import, được hoist tại compile time.",
          "So với `setup()`: ít boilerplate hơn, TypeScript inference tốt hơn, tree-shaking tốt hơn (unused bindings bị loại).",
          "Vẫn có thể dùng `setup()` thường khi cần return object động hoặc integrate với Options API legacy.",
        ],
      },
      {
        q: "Composables pattern — quy tắc đặt tên và khi nào tách?",
        a: [
          "Composable là function bắt đầu bằng `use` (convention): `useAuth`, `useFetch`, `useLocalStorage`.",
          "Tách khi: logic stateful lặp lại ≥2 component, logic phức tạp làm component quá dài, hoặc cần test logic độc lập.",
          "Quy tắc: chỉ gọi composable ở top level setup (không trong loop/condition); return reactive state + methods cần thiết.",
          "Composable có thể gọi composable khác — compose logic như Lego blocks.",
          "Không tách quá sớm: logic chỉ dùng 1 lần và <20 dòng thì giữ inline trong component.",
        ],
      },
      {
        q: "`defineExpose` dùng khi nào?",
        a: [
          "Mặc định `<script setup>` component không expose internal state — parent không truy cập qua template ref.",
          "`defineExpose({ focus, reset })` cho phép parent gọi method hoặc đọc property qua `ref` trên child component.",
          "Use case: form input component expose `validate()`, modal expose `open()/close()`, wrapper expose imperative API.",
          "Parent: `const inputRef = ref<InstanceType<typeof MyInput>>(); inputRef.value?.focus()`.",
          "Best practice: ưu tiên props/emits cho data flow; chỉ dùng `defineExpose` khi thực sự cần imperative control.",
        ],
      },
      {
        q: "Các compiler macros phổ biến trong script setup?",
        a: [
          "`defineProps<T>()` / `withDefaults(defineProps<...>(), {})`: khai báo props với TypeScript, runtime validation optional.",
          "`defineEmits<{ submit: [id: number] }>()`: typed events, thay thế `emits` option.",
          "`defineModel()` (Vue 3.4+): two-way binding đơn giản, thay `modelValue` + `update:modelValue` boilerplate.",
          "`defineExpose()`: expose public API cho parent ref.",
          "`defineOptions({ inheritAttrs: false })`: set component options trong script setup.",
          "`defineSlots()` + `useSlots()`: typed slot props cho scoped slots.",
        ],
      },
    ],
  },
  {
    id: "vue-components",
    title: "III. Components & Communication",
    items: [
      {
        q: "Props validation với TypeScript (`defineProps`)",
        a: [
          "Runtime + TS: `defineProps<{ title: string; count?: number }>()` — compile-time check, không runtime validation mặc định.",
          "Runtime validation: `defineProps({ title: { type: String, required: true }, count: { type: Number, default: 0 } })`.",
          "Kết hợp: dùng interface + `withDefaults` cho default values: `withDefaults(defineProps<Props>(), { count: 0 })`.",
          "Props là read-only — mutate trực tiếp gây warning; emit event hoặc dùng local copy nếu cần edit.",
          "Complex props: dùng `PropType<T>` cho object/array typed; validator function cho custom logic.",
        ],
      },
      {
        q: "`v-model` và `defineModel` (Vue 3.4+)",
        a: [
          "Vue 3 `v-model` mặc định bind `modelValue` prop + emit `update:modelValue`. Multiple v-model: `v-model:title`, `v-model:visible`.",
          "Trước 3.4: child cần `defineProps(['modelValue'])` + `defineEmits(['update:modelValue'])` + computed getter/setter.",
          "`defineModel()` (3.4+): `const model = defineModel<string>()` — trả về writable ref, tự wire prop + emit.",
          "Modifiers: `v-model.trim` → `defineModel({ set(value) { ... } })` hoặc nhận qua `defineModel('modelValue', { get/set })`.",
          "Use case: input component, dialog visibility, form field wrapper — bất kỳ two-way binding nào giữa parent-child.",
        ],
      },
      {
        q: "Slots: default, named, scoped — giải thích",
        a: [
          "Default slot: `<slot />` — parent truyền content không tên. Fallback: `<slot>Default text</slot>`.",
          "Named slot: `<slot name=\"header\" />` — parent dùng `<template #header>...</template>` (shorthand `v-slot:header`).",
          "Scoped slot: `<slot :item=\"item\" :index=\"i\" />` — child truyền data lên parent template qua slot props: `<template #default=\"{ item }\">`.",
          "Multiple slots: combine named + scoped — ví dụ table component expose `{ row, column }` cho custom cell.",
          "`defineSlots()` (3.3+): typed slot props cho TypeScript autocomplete trong parent.",
        ],
      },
      {
        q: "`provide` / `inject` vs props drilling",
        a: [
          "Props drilling: truyền props qua nhiều tầng component trung gian không dùng data — verbose, khó maintain.",
          "`provide(key, value)` ở ancestor + `inject(key)` ở descendant bất kỳ depth — bỏ qua middle layers.",
          "Reactivity: provide ref/reactive/computed để descendant nhận reactive value; provide plain value thì không reactive.",
          "Symbol key hoặc `InjectionKey<T>` cho TypeScript type-safe inject.",
          "Use case: theme, locale, form validation context, auth user. Không thay thế Pinia cho global app state phức tạp.",
        ],
      },
    ],
  },
  {
    id: "vue-router",
    title: "IV. Vue Router",
    items: [
      {
        q: "Các loại navigation guards trong Vue Router 4",
        a: [
          "Global: `router.beforeEach`, `router.beforeResolve`, `router.afterEach` — áp dụng mọi navigation.",
          "Per-route: `beforeEnter` trong route config — guard cho route cụ thể (auth, prefetch data).",
          "In-component: `onBeforeRouteLeave`, `onBeforeRouteUpdate` (Composition API) hoặc `beforeRouteEnter/Update/Leave` (Options API).",
          "Guard return: `return false` cancel; `return '/login'` redirect; `return { name: 'Home' }` redirect object; async guard có thể return Promise.",
          "Use case: auth check (`beforeEach`), unsaved changes warning (`onBeforeRouteLeave`), reload data khi param đổi (`onBeforeRouteUpdate`).",
        ],
      },
      {
        q: "Lazy loading routes — cách implement",
        a: [
          "Dynamic import: `{ path: '/dashboard', component: () => import('./views/Dashboard.vue') }` — tạo separate chunk, load khi navigate.",
          "Named chunk: `import(/* webpackChunkName: \"dashboard\" */ './views/Dashboard.vue')` hoặc Vite tự split.",
          "Route-level code splitting giảm initial bundle — chỉ load code cần cho route hiện tại.",
          "Kết hợp `defineAsyncComponent` + loading/error component cho UX tốt hơn khi chunk load chậm.",
          "Prefetch: Vite/Rollup có thể prefetch linked routes; Vue Router 4 hỗ trợ `<RouterLink>` với prefetch behavior.",
        ],
      },
      {
        q: "Nested routes — cấu trúc và `<router-view>`",
        a: [
          "Child routes khai báo trong `children` array của parent route — URL nested: `/users/123/profile`.",
          "Parent component phải có `<router-view />` để render child component.",
          "Named views: nhiều `<router-view name=\"sidebar\" />` cho layout phức tạp (header + sidebar + main).",
          "Absolute vs relative path: child `path: 'profile'` (relative) vs `path: '/profile'` (absolute, bỏ parent segment).",
          "Redirect nested: `{ path: '', redirect: 'list' }` cho default child khi vào parent URL.",
        ],
      },
      {
        q: "Programmatic navigation — `router.push` vs `router.replace`",
        a: [
          "`router.push(location)`: thêm entry mới vào history stack — user bấm Back quay lại trang trước.",
          "`router.replace(location)`: thay thế entry hiện tại — Back bỏ qua trang bị replace.",
          "Location argument: string path `'/users'`, hoặc object `{ name: 'User', params: { id: '1' }, query: { tab: 'posts' } }`.",
          "Return Promise — `await router.push(...)` catch `NavigationFailure` (duplicate navigation, aborted guard).",
          "Use case replace: redirect sau login (không muốn Back về login page), replace 404 → home.",
        ],
      },
    ],
  },
  {
    id: "vue-pinia",
    title: "V. Pinia & State Management",
    items: [
      {
        q: "Khi nào dùng Pinia vs local component state?",
        a: [
          "Local state (`ref`/`reactive` trong component): UI state chỉ component đó dùng — toggle modal, form input, hover state.",
          "Pinia: state cần chia sẻ giữa nhiều component không quan hệ parent-child, persist across routes, hoặc logic phức tạp (auth, cart, notifications).",
          "Server state: ưu tiên fetch library (VueUse `useFetch`, TanStack Query) thay vì đưa API cache vào Pinia.",
          "Rule of thumb: nếu prop drilling >2 tầng hoặc 2+ unrelated components cần cùng data → Pinia.",
          "Không over-use: không đưa mọi state vào store — giữ component self-contained khi có thể.",
        ],
      },
      {
        q: "Cấu trúc store: state, getters, actions",
        a: [
          "Options-style store: `defineStore('id', { state: () => ({ ... }), getters: { ... }, actions: { ... } })`.",
          "State: reactive data của store, khởi tạo qua function return object.",
          "Getters: computed properties của store — derived state, có thể nhận state/getters khác, hỗ trợ cache.",
          "Actions: methods mutate state — có thể async (API calls), gọi `this.otherAction()` hoặc `this.count++`.",
          "Store instance: `const store = useStore()` trong setup — destructure cần `storeToRefs` để giữ reactivity.",
        ],
      },
      {
        q: "Composition-style Pinia store",
        a: [
          "Setup store: `defineStore('id', () => { const count = ref(0); const double = computed(() => count.value * 2); function increment() { count.value++ }; return { count, double, increment } })`.",
          "Giống composable — dùng `ref`, `computed`, function tự do; linh hoạt hơn Options store.",
          "Watchers: có thể dùng `watch` bên trong setup store cho side effects.",
          "Không có `this` — dùng closure; TypeScript inference thường tốt hơn Options style.",
          "Return tất cả state/getters/actions cần public; private logic giữ trong closure không return.",
        ],
      },
      {
        q: "Chia sẻ state giữa nhiều components",
        a: [
          "Mọi component gọi `useXxxStore()` nhận cùng singleton instance (per app) — state tự sync.",
          "Template: dùng trực tiếp `store.count` hoặc destructure `const { count } = storeToRefs(store)`.",
          "Actions: bất kỳ component nào gọi `store.fetchUser()` — state update propagate tới mọi subscriber.",
          "Pinia plugin: persist to localStorage, log mutations, sync across tabs.",
          "Testing: `createPinia()` + `setActivePinia()` trong test setup; mock store hoặc reset state giữa tests.",
        ],
      },
    ],
  },
  {
    id: "vue-performance",
    title: "VI. Performance & Optimization",
    items: [
      {
        q: "`<keep-alive>` — use case và `include`/`exclude`",
        a: [
          "`<keep-alive>` cache component instance thay vì destroy khi unmount — giữ state (scroll position, form input) khi switch tab/view.",
          "`include`/`exclude`: string, regex, hoặc array tên component (`name` option) để chọn component nào cache.",
          "`max`: giới hạn số instance cache — LRU eviction khi vượt max.",
          "Lifecycle: cached component dùng `onActivated`/`onDeactivated` thay vì mount/unmount lặp lại.",
          "Use case: tab panel, multi-step wizard quay lại bước trước, email list ↔ detail navigation.",
        ],
      },
      {
        q: "`v-memo` — khi nào dùng?",
        a: [
          "`v-memo=\"[dep1, dep2]\"` trên element/block — skip update subtree nếu dependency array không đổi (shallow compare).",
          "Dùng cho list lớn với item ổn định: `v-for=\"item in list\" :key=\"item.id\" v-memo=\"[item.selected]\"` — chỉ re-render item khi `selected` đổi.",
          "Khác `v-once`: `v-once` render 1 lần forever; `v-memo` conditional skip dựa trên deps.",
          "Trade-off: thêm memory/complexity — chỉ dùng khi đo được performance issue (Vue DevTools, profiler).",
          "Vue 3.2+ feature — không cần import, directive built-in.",
        ],
      },
      {
        q: "Tối ưu list lớn với `v-for` và `:key`",
        a: [
          "`:key` bắt buộc unique stable id (database id) — không dùng index khi list có thêm/xóa/sắp xếp (DOM reuse sai → bug state).",
          "Virtual scrolling: chỉ render visible items — thư viện `vue-virtual-scroller`, `@tanstack/vue-virtual`.",
          "Avoid inline object/function trong `v-for` template — tạo reference mới mỗi render, break child memoization.",
          "Tách item thành child component — Vue có thể skip diff subtree nếu props không đổi.",
          "Pagination hoặc infinite scroll thay vì render 10k DOM nodes cùng lúc.",
        ],
      },
    ],
  },
  {
    id: "vue-advanced",
    title: "VII. Advanced (Teleport, Suspense, provide/inject)",
    items: [
      {
        q: "`<Teleport>` — use case thực tế",
        a: [
          "`<Teleport to=\"body\">` render content DOM ra ngoài component tree — giữ logical hierarchy trong Vue, physical DOM ở target.",
          "Use case: modal, dropdown, tooltip, toast notification — tránh bị `overflow: hidden` hoặc `z-index` stacking context của parent.",
          "`to` selector: `#modal-root`, `body`, hoặc existing element. `disabled` prop render inline khi cần.",
          "Multiple Teleport cùng target — append theo thứ tự mount.",
          "SSR: đảm bảo target element tồn tại trên client (`onMounted` hoặc dedicated div trong index.html).",
        ],
      },
      {
        q: "`<Suspense>` với async setup / async components",
        a: [
          "`<Suspense>` wrap component có async dependency — hiển thị `#fallback` slot trong lúc chờ Promise resolve.",
          "Async setup: `async setup()` với top-level `await` — component suspend cho đến khi fetch xong.",
          "Async component: `defineAsyncComponent(() => import('./Heavy.vue'))` — lazy load + Suspense fallback.",
          "Nested Suspense: fallback cascade — inner Suspense resolve trước outer.",
          "Error handling: kết hợp `onErrorCaptured` hoặc wrapper component vì Suspense chưa có error slot built-in (experimental `onError` prop).",
        ],
      },
      {
        q: "`defineAsyncComponent` — lazy load component",
        a: [
          "`defineAsyncComponent(() => import('./Modal.vue'))` — return async component wrapper, load chunk khi render lần đầu.",
          "Options: `{ loader, loadingComponent, errorComponent, delay: 200, timeout: 3000, onError(retry, fail, attempts) }`.",
          "Loading component hiển thị sau `delay` ms — tránh flash spinner cho load nhanh.",
          "Retry logic trong `onError` — retry network failure vài lần trước khi show error UI.",
          "Dùng cho route component, heavy chart/editor, conditional feature flags — giảm initial bundle size.",
        ],
      },
      {
        q: "Custom directives — ví dụ `v-focus`",
        a: [
          "Directive: `{ mounted(el) { el.focus() }, updated(el) { ... } }` — hook vào DOM element lifecycle.",
          "Vue 3 lifecycle hooks: `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`.",
          "Register global: `app.directive('focus', { mounted: (el) => el.focus() })` — dùng `v-focus` trong template.",
          "Local: trong script setup không có local directive dễ dàng — thường register global hoặc import directive object.",
          "Use case: focus trap, click-outside, infinite scroll observer, permission-based DOM manipulation. Logic phức tạp → prefer composable.",
        ],
      },
    ],
  },
  {
    id: "vue-scenario",
    title: "VIII. Thực hành & Scenario",
    items: [
      {
        q: "Debug Vue app trong DevTools",
        a: [
          "Vue DevTools extension: inspect component tree, xem props/data/computed/pinia state realtime.",
          "Timeline/Performance: record component render, track reactive trigger → identify unnecessary re-renders.",
          "Pinia tab: time-travel state, inspect actions, reset store.",
          "Console: `app.config.performance = true` (dev) log render timing; `watchEffect` debug dependency.",
          "Breakpoint trong `setup()` hoặc watcher; `debugger` statement khi guard/route logic phức tạp.",
        ],
      },
      {
        q: "Memory leak phổ biến trong Vue và cách tránh",
        a: [
          "Quên cleanup watcher/timer/subscription trong `onUnmounted` — luôn return cleanup trong `watch`/`watchEffect` hoặc clear trong unmount hook.",
          "Event listener trên `window`/`document` không remove — add trong `onMounted`, remove trong `onUnmounted`.",
          "Closure giữ reference tới destroyed component — tránh store large object trong global variable.",
          "Third-party lib (chart, map) không destroy instance — gọi `.destroy()` trong cleanup.",
          "Pinia/keep-alive giữ stale reference — reset state khi logout; `include`/`max` cho keep-alive cache.",
        ],
      },
      {
        q: "Feature-based vs type-based folder structure",
        a: [
          "Type-based: `components/`, `composables/`, `stores/`, `views/` — dễ tìm theo loại file, phù hợp app nhỏ/trung bình.",
          "Feature-based: `features/auth/`, `features/cart/` — mỗi feature chứa components, composables, store, types riêng — scale tốt cho team lớn.",
          "Hybrid phổ biến: shared `components/ui/`, `composables/` global + feature folders cho domain logic.",
          "Colocate: test, types, constants gần feature code — giảm cross-folder hunting.",
          "Vue official không enforce — chọn theo team size; refactor khi type-based folder quá flat (>50 files/folder).",
        ],
      },
      {
        q: "Xử lý API errors trong Vue (composable pattern)",
        a: [
          "Composable `useFetch`/`useApi`: encapsulate loading, data, error refs + fetch function — `const { data, error, loading, execute } = useFetch('/api/users')`.",
          "Error handling layers: HTTP interceptor (axios) normalize error → composable set `error` ref → component hiển thị `<ErrorAlert :message=\"error\" />`.",
          "Retry: exponential backoff trong composable; cancel stale request với AbortController khi param đổi.",
          "Global: toast notification via Pinia store hoặc event bus; 401 → router push login trong `router.beforeEach` hoặc interceptor.",
          "Typed errors: discriminated union `{ type: 'network' | 'validation', message, fields? }` cho UX khác nhau.",
        ],
      },
    ],
  },
  {
    id: "vue-mcq",
    title: "IX. Vue — Quiz (Multiple Choice)",
    items: [
      {
        q: "Primitive value (string, number, boolean) nên dùng `ref` hay `reactive`?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "ref" },
            { label: "B", text: "reactive" },
            { label: "C", text: "computed" },
            { label: "D", text: "shallowReactive" },
          ],
          correct: "A",
          explanation:
            "Primitive values nên wrap bằng `ref`. `reactive()` chỉ nhận object — không thể `reactive(0)`. `ref` hỗ trợ reassign toàn bộ value qua `.value`.",
        },
      },
      {
        q: "`computed` re-evaluate khi nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Mỗi lần component re-render" },
            { label: "B", text: "Chỉ khi reactive dependency thay đổi (lazy, cached)" },
            { label: "C", text: "Mỗi giây một lần" },
            { label: "D", text: "Chỉ khi gọi `.value` trong script" },
          ],
          correct: "B",
          explanation:
            "Computed là lazy và cached — chỉ tính lại khi dependency reactive bên trong getter thay đổi. Khác method chạy lại mỗi render.",
        },
      },
      {
        q: "`watchEffect` chạy lần đầu khi nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Không bao giờ tự chạy — cần `{ immediate: true }`" },
            { label: "B", text: "Ngay lập tức khi setup (eager)" },
            { label: "C", text: "Sau khi user click" },
            { label: "D", text: "Chỉ khi unmount component" },
          ],
          correct: "B",
          explanation:
            "`watchEffect` là eager — chạy ngay khi component setup, tự track dependency đọc trong callback. Khác `watch` mặc định lazy.",
        },
      },
      {
        q: "Sự khác biệt chính giữa `v-if` và `v-show`?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "v-if toggle CSS display; v-show destroy DOM" },
            { label: "B", text: "v-if destroy/create DOM; v-show toggle CSS display" },
            { label: "C", text: "Không có khác biệt" },
            { label: "D", text: "v-if chỉ dùng với ref" },
          ],
          correct: "B",
          explanation:
            "`v-if` conditional rendering thật — destroy/create DOM và chạy lifecycle. `v-show` luôn render, toggle `display: none` — phù hợp toggle thường xuyên.",
        },
      },
      {
        q: "Pinia store id có scope như thế nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Per component instance" },
            { label: "B", text: "Per route" },
            { label: "C", text: "Global singleton per app (một instance cho mọi component)" },
            { label: "D", text: "Per browser tab tự động" },
          ],
          correct: "C",
          explanation:
            "Mỗi store id tạo một singleton trong app — mọi `useXxxStore()` share cùng state. Multi-tab sync cần plugin riêng.",
        },
      },
      {
        q: "`router.beforeEach` thuộc loại navigation guard nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Global beforeEach guard" },
            { label: "B", text: "Per-route beforeEnter only" },
            { label: "C", text: "Component beforeRouteEnter only" },
            { label: "D", text: "afterEach hook" },
          ],
          correct: "A",
          explanation:
            "`router.beforeEach` là global guard — chạy trước mọi navigation. Dùng phổ biến cho auth check, loading indicator.",
        },
      },
      {
        q: "`defineModel()` (Vue 3.4+) thay thế pattern nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "props + emit `update:propName` (two-way binding boilerplate)" },
            { label: "B", text: "provide/inject" },
            { label: "C", text: "Pinia store" },
            { label: "D", text: "Vuex mutations" },
          ],
          correct: "A",
          explanation:
            "`defineModel()` gom `modelValue` prop + `update:modelValue` emit thành một writable ref — đơn giản hóa v-model trong child component.",
        },
      },
      {
        q: "`onMounted` lifecycle hook chạy khi nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Trước khi DOM render lần đầu" },
            { label: "B", text: "Sau khi component DOM đã mount (có thể truy cập template ref)" },
            { label: "C", text: "Khi component unmount" },
            { label: "D", text: "Trước khi setup() chạy" },
          ],
          correct: "B",
          explanation:
            "`onMounted` chạy sau initial render và DOM insert — an toàn cho DOM manipulation, third-party lib init, focus input.",
        },
      },
      {
        q: "Mục đích của `:key` trong `v-for`?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "CSS styling identifier" },
            { label: "B", text: "Track node identity — giúp Vue reuse/patch DOM đúng khi list thay đổi" },
            { label: "C", text: "Encrypt list item" },
            { label: "D", text: "Bắt buộc phải là index" },
          ],
          correct: "B",
          explanation:
            "`:key` giúp Vue identify element identity — reuse DOM efficiently, preserve component state đúng item khi reorder/add/remove.",
        },
      },
      {
        q: "Làm sao `provide/inject` truyền reactive value?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Chỉ provide plain string — inject tự reactive" },
            { label: "B", text: "Provide ref hoặc reactive object — inject nhận reactive value" },
            { label: "C", text: "Không thể reactive — phải dùng Pinia" },
            { label: "D", text: "Dùng v-model trên provide" },
          ],
          correct: "B",
          explanation:
            "Provide `ref()` hoặc `reactive()` — inject descendant nhận reactive reference. Provide plain value thì không auto-update.",
        },
      },
      {
        q: "`<script setup>` có scope như thế nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Module scope — top-level bindings auto available in template, không cần return" },
            { label: "B", text: "Function scope — phải return mọi binding" },
            { label: "C", text: "Global scope — mọi file truy cập được" },
            { label: "D", text: "Chỉ chạy trên server (SSR only)" },
          ],
          correct: "A",
          explanation:
            "`<script setup>` compile như module scope trong setup context — imports, refs, functions top-level tự expose template mà không cần return object.",
        },
      },
      {
        q: "`shallowRef` trigger update khi nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Khi mutate nested property bên trong object" },
            { label: "B", text: "Chỉ khi `.value` thay đổi reference (gán object mới)" },
            { label: "C", text: "Mỗi render cycle" },
            { label: "D", text: "Không bao giờ trigger update" },
          ],
          correct: "B",
          explanation:
            "`shallowRef` chỉ track `.value` assignment — mutate `shallowRef.value.nested.prop` không trigger. Cần gán reference mới hoặc `triggerRef()`.",
        },
      },
      {
        q: "`<Teleport>` render content ở đâu?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Luôn inline trong component parent" },
            { label: "B", text: "Target element ngoài component tree (vd: body, #modal-root)" },
            { label: "C", text: "Chỉ trong Shadow DOM" },
            { label: "D", text: "Server-side only" },
          ],
          correct: "B",
          explanation:
            "Teleport render DOM vào target selector (thường `body`) — logical component tree giữ nguyên, physical DOM move ra ngoài cho modal/dropdown.",
        },
      },
      {
        q: "Pinia getter khác computed trong component thế nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Getter không cached" },
            { label: "B", text: "Getter cached trong store — shared across mọi component dùng store" },
            { label: "C", text: "Getter chỉ chạy trên server" },
            { label: "D", text: "Không thể có parameter" },
          ],
          correct: "B",
          explanation:
            "Pinia getters tương đương computed của store — cached, shared. Mọi component dùng cùng getter value không re-compute riêng lẻ.",
        },
      },
      {
        q: "Lazy route import syntax đúng trong Vue Router?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "component: require('./Page.vue')" },
            { label: "B", text: "component: () => import('./Page.vue')" },
            { label: "C", text: "component: import('./Page.vue') sync" },
            { label: "D", text: "component: 'Page.vue' string path only" },
          ],
          correct: "B",
          explanation:
            "Dynamic `import()` return Promise — Vue Router code-split route thành separate chunk, load on navigation.",
        },
      },
      {
        q: "`watch` vs `watchEffect` — cái nào lazy by default?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "watchEffect lazy; watch eager" },
            { label: "B", text: "watch lazy by default; watchEffect eager" },
            { label: "C", text: "Cả hai eager" },
            { label: "D", text: "Cả hai lazy" },
          ],
          correct: "B",
          explanation:
            "`watch` không chạy cho đến khi source thay đổi (trừ `{ immediate: true }`). `watchEffect` chạy ngay và auto-track deps.",
        },
      },
      {
        q: "Type syntax đúng cho `defineEmits`?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "defineEmits(['submit', 'cancel'])" },
            { label: "B", text: "defineEmits<{ submit: [id: number] }>()" },
            { label: "C", text: "defineEmits = { submit: Function }" },
            { label: "D", text: "emits: { submit: null }" },
          ],
          correct: "B",
          explanation:
            "TypeScript typed emits: `defineEmits<{ submit: [id: number]; close: [] }>()` — tuple syntax cho payload types. Option A valid runtime nhưng không typed.",
        },
      },
      {
        q: "`<keep-alive>` cache cái gì?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "HTTP response" },
            { label: "B", text: "Component instance — preserve state, skip destroy/recreate" },
            { label: "C", text: "Pinia store" },
            { label: "D", text: "Router history" },
          ],
          correct: "B",
          explanation:
            "keep-alive cache component instance in memory — khi switch away không unmount, quay lại giữ state (form, scroll). Dùng activated/deactivated hooks.",
        },
      },
      {
        q: "Vue 3 Reactivity API dựa trên công nghệ nào?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Object.defineProperty" },
            { label: "B", text: "ES6 Proxy" },
            { label: "C", text: "MutationObserver" },
            { label: "D", text: "Virtual DOM diff only" },
          ],
          correct: "B",
          explanation:
            "Vue 3 reactivity core dùng `Proxy` intercept get/set — thay thế defineProperty của Vue 2, hỗ trợ array/index và property add/delete.",
        },
      },
      {
        q: "Quy ước đặt tên composable?",
        a: {
          type: "mcq",
          options: [
            { label: "A", text: "Bắt đầu bằng `get` (vd: getAuth)" },
            { label: "B", text: "Bắt đầu bằng `use` (vd: useAuth)" },
            { label: "C", text: "Bắt đầu bằng `create` (vd: createAuth)" },
            { label: "D", text: "Không có quy ước" },
          ],
          correct: "B",
          explanation:
            "Vue convention: composable functions bắt đầu `use` — `useFetch`, `useMouse`, `useLocalStorage`. ESLint plugin vue cũng enforce rule này.",
        },
      },
    ],
  },
];

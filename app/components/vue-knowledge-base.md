# Vue 3 Knowledge Base

> Tài liệu tham khảo toàn diện về **Vue 3** — Composition API, reactivity, ecosystem, và best practices cho production app.

---

## 0. Tổng quan Vue 3

Vue 3 (2020) là bản nâng cấp lớn so với Vue 2: **Composition API** làm first-class citizen, **Proxy-based reactivity** thay thế `Object.defineProperty`, **Tree-shaking** tốt hơn, và **TypeScript** support mạnh hơn. Vue là **progressive framework** — bạn có thể dùng chỉ phần view layer hoặc full-stack với Router, Pinia, và build tooling.

| | Vue 3 | Ghi chú |
|---|---|---|
| Language | TypeScript / JavaScript | TS được khuyến khích cho project lớn |
| API style | Composition API (khuyến nghị) + Options API | `<script setup>` là standard hiện đại |
| Reactivity | Proxy (`ref`, `reactive`, `computed`) | Fine-grained, không re-render toàn tree |
| Routing | Vue Router 4 | Official, lazy loading built-in |
| State | Pinia (official) | Thay thế Vuex |
| Build | Vite (default) | Nhanh, HMR tốt |
| SFC | `.vue` Single File Components | Template + Script + Style trong một file |

**Key mindset:** Vue kết hợp **declarative template** với **reactive script**. Data flow chủ yếu **unidirectional** (parent → child qua props, child → parent qua emit), nhưng hỗ trợ `v-model` cho two-way binding ở component boundary.

```typescript
// Minimal Vue 3 app (Composition API)
import { createApp, ref } from 'vue';

const App = {
  setup() {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
  },
  template: `<button @click="increment">Count: {{ count }}</button>`,
};

createApp(App).mount('#app');
```

```vue
<!-- Modern approach: <script setup> -->
<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
const increment = () => count.value++;
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

---

## 1. Project Setup

Vue 3 project hiện đại dùng **Vite** làm bundler. `create-vue` là scaffolding tool chính thức, cho phép chọn TypeScript, Router, Pinia, Vitest, ESLint.

```bash
npm create vue@latest my-vue-app
# ✔ TypeScript → Yes | Vue Router → Yes | Pinia → Yes | Vitest → Yes

cd my-vue-app && npm install
npm run dev        # localhost:5173
npm run build      # Production build
npm run test:unit  # Vitest
```

```typescript
// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
```

```typescript
// vite.config.ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } },
  },
});
```

```typescript
// .env: VITE_API_BASE_URL=https://api.example.com
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.DEV;
```

| Script | Mô tả |
|---|---|
| `npm run dev` | Dev server với HMR |
| `npm run build` | Type-check + production bundle |
| `npm run preview` | Serve dist/ locally |
| `npm run test:unit` | Vitest unit tests |

---

## 2. Composition API

**Composition API** tổ chức logic component bằng functions thay vì Options object. Ưu điểm: **logic reuse** qua composables, **TypeScript inference** tốt, và **grouping by concern**.

```vue
<!-- <script setup> — syntax sugar khuyến nghị -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps<{ userId: number }>();
const emit = defineEmits<{ loaded: [user: User] }>();

const userStore = useUserStore();
const loading = ref(false);
const user = computed(() => userStore.getUserById(props.userId));

onMounted(async () => {
  loading.value = true;
  await userStore.fetchUser(props.userId);
  loading.value = false;
  if (user.value) emit('loaded', user.value);
});

const refresh = () => userStore.fetchUser(props.userId);
defineExpose({ refresh });
</script>
```

| | Options API | Composition API |
|---|---|---|
| Tổ chức | `data`, `methods`, `computed` tách rời | Group theo feature/concern |
| Reuse logic | Mixins (hạn chế) | Composables |
| TypeScript | Khó infer | `defineProps`, `ref` infer tốt |
| Khuyến nghị | Legacy codebase | Project mới |

```vue
<!-- defineModel (Vue 3.4+) — two-way binding đơn giản -->
<script setup lang="ts">
const title = defineModel<string>({ required: true });
</script>
<template><input v-model="title" /></template>
```

---

## 3. Reactivity

Vue 3 reactivity dựa trên **ES6 Proxy**. Các primitive chính: `ref` (mọi kiểu), `reactive` (object), `computed` (derived state), `watch`/`watchEffect` (side effects), `toRef`/`toRefs` (destructure an toàn), `shallowRef` (shallow tracking).

### ref — Reactive reference cho mọi kiểu

```typescript
import { ref } from 'vue';

const count = ref(0);
const message = ref('Hello');
const user = ref<User | null>(null);

count.value++;                    // script: truy cập qua .value
message.value = 'Updated';
// template: auto-unwrap — {{ count }}

const state = ref({ items: [] as string[] });
state.value.items.push('new');    // inner object vẫn reactive
```

### reactive — Deep reactive object

```typescript
import { reactive } from 'vue';

const form = reactive({ email: '', password: '', remember: false });
form.email = 'user@example.com';  // trigger update

// ❌ Không reassign toàn bộ — mất reactivity
// form = { email: '' };

// ❌ Destructure mất reactivity — dùng toRefs
const { email } = form;
```

### computed — Derived state có cache

```typescript
import { ref, computed } from 'vue';

const firstName = ref('Nguyen');
const lastName = ref('Van A');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// Writable computed (ít dùng)
const fullNameWritable = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val: string) => {
    const parts = val.split(' ');
    firstName.value = parts[0] ?? '';
    lastName.value = parts.slice(1).join(' ');
  },
});
```

### watch — Theo dõi source cụ thể

```typescript
import { ref, watch, reactive } from 'vue';

const query = ref('');
const results = ref<SearchResult[]>([]);

watch(query, async (newQuery, oldQuery) => {
  if (newQuery.length < 2) return;
  results.value = await searchApi(newQuery);
});

// Multiple sources
watch([query, () => props.category], ([q, cat]) => fetchResults(q, cat));

// Reactive object — watch getter
const state = reactive({ user: { name: '' } });
watch(() => state.user.name, (name) => console.log('Name:', name));

watch(query, callback, {
  immediate: true,   // chạy ngay khi setup
  deep: true,        // deep watch object
  flush: 'post',     // sau DOM update
  once: true,        // Vue 3.4+: chỉ chạy một lần
});
```

### watchEffect — Auto-track dependencies

```typescript
import { ref, watchEffect } from 'vue';

const userId = ref(1);
const user = ref<User | null>(null);

const stop = watchEffect(async (onCleanup) => {
  const controller = new AbortController();
  onCleanup(() => controller.abort());

  const res = await fetch(`/api/users/${userId.value}`, {
    signal: controller.signal,
  });
  user.value = await res.json();
});
// stop(); — dừng watcher thủ công
```

### toRef & toRefs — Giữ reactivity khi destructure

```typescript
import { reactive, toRef, toRefs } from 'vue';

const state = reactive({ name: 'Vue', age: 3, nested: { count: 10 } });

const name = toRef(state, 'name');
name.value = 'Vue 3';  // sync với state.name

const { name: n, age } = toRefs(state);
// n.value, age.value — vẫn reactive

function useUserState() {
  const state = reactive({ loading: false, error: null as string | null });
  return toRefs(state);
}
```

### shallowRef — Shallow reactivity

```typescript
import { shallowRef, triggerRef } from 'vue';

const state = shallowRef({ count: 0, items: [] as string[] });

state.value = { count: 1, items: [] };  // ✅ trigger update
state.value.count++;                     // ❌ KHÔNG trigger
state.value.items.push('a');             // ❌ KHÔNG trigger

state.value.items.push('b');
triggerRef(state);  // force notify sau deep mutate

// Use case: large immutable data, external library state
const chartData = shallowRef<ChartDataset>(initialData);
```

### Reactivity API tổng hợp

| API | Input | Reactive depth | Template unwrap |
|---|---|---|---|
| `ref()` | any | deep (inner object) | yes |
| `shallowRef()` | any | shallow (.value only) | yes |
| `reactive()` | object | deep | N/A |
| `computed()` | getter | tracks deps | yes |
| `toRef()` | reactive + key | linked | yes |
| `toRefs()` | reactive | linked per key | yes |
| `readonly()` | any | deep, no mutate | yes |

```typescript
import { readonly, unref, isRef } from 'vue';

const original = reactive({ count: 0 });
const copy = readonly(original);  // copy.count++ → warning

const maybeRef = ref(42);
const val = unref(maybeRef);  // 42 — unwrap nếu là ref
```

---

## 4. Components

Vue component là **Single File Component (SFC)** gồm `<script>`, `<template>`, `<style>`. Communication: **props down**, **emits up**, **provide/inject** cho deep tree, **slots** cho content projection.

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface User { id: number; name: string; email: string; }

const props = withDefaults(
  defineProps<{ user: User; variant?: 'primary' | 'secondary'; disabled?: boolean }>(),
  { variant: 'primary', disabled: false },
);

const emit = defineEmits<{
  submit: [payload: FormData];
  cancel: [];
}>();
</script>

<template>
  <div :class="['card', `card--${variant}`, { 'card--disabled': disabled }]">
    <h3>{{ user.name }}</h3>
    <button @click="emit('cancel')">Cancel</button>
  </div>
</template>
```

```vue
<!-- BaseCard.vue — Slots -->
<template>
  <div class="card">
    <header v-if="$slots.header"><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" :item-count="items.length" /></footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const items = ref(['a', 'b', 'c']);
</script>
```

```vue
<!-- Parent usage -->
<BaseCard>
  <template #header><h2>Users</h2></template>
  <UserList :users="users" />
  <template #footer="{ itemCount }">{{ itemCount }} items</template>
</BaseCard>
```

```typescript
// provide / inject — Dependency injection
import { provide, inject, ref, type InjectionKey, type Ref } from 'vue';

interface ThemeContext {
  theme: Ref<'light' | 'dark'>;
  toggle: () => void;
}
export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme');

// Parent
const theme = ref<'light' | 'dark'>('light');
provide(ThemeKey, { theme, toggle: () => { theme.value = theme.value === 'light' ? 'dark' : 'light'; } });

// Child (bất kỳ depth)
const ctx = inject(ThemeKey);
if (!ctx) throw new Error('ThemeKey not provided');
```

| Pattern | API | Use case |
|---|---|---|
| Props | `defineProps` | Parent → child data |
| Emits | `defineEmits` | Child → parent events |
| v-model | `defineModel` | Two-way binding |
| Slots | `<slot>` | Content projection |
| provide/inject | `provide()`, `inject()` | Cross-tree shared state |
| expose | `defineExpose` | Parent access child methods |

---

## 5. Template & Directives

Vue template là **HTML-based declarative syntax**. Directives là attributes đặc biệt prefix `v-` để attach reactive behavior lên DOM.

```vue
<template>
  <!-- Interpolation — auto HTML-escape -->
  <p>{{ message }}</p>
  <p>{{ count + 1 }}</p>

  <!-- v-html — raw HTML (cẩn thận XSS) -->
  <div v-html="sanitizedHtml"></div>

  <!-- Attribute binding -->
  <div :id="dynamicId" :class="{ active: isActive }" :style="{ color }"></div>
  <button :disabled="isDisabled">Submit</button>

  <!-- Conditional -->
  <div v-if="type === 'A'">Type A</div>
  <div v-else-if="type === 'B'">Type B</div>
  <p v-show="isVisible">Toggle CSS display</p>

  <!-- List — luôn dùng :key -->
  <li v-for="user in users" :key="user.id">{{ user.name }}</li>
</template>
```

```vue
<template>
  <!-- Events & modifiers -->
  <form @submit.prevent="onSubmit">
    <input @keyup.enter="onEnter" />
    <div @click.stop="onClick">Stop propagation</div>
  </form>

  <!-- v-model -->
  <input v-model="text" />
  <input type="checkbox" v-model="checked" />
  <select v-model="selected">
    <option value="a">A</option>
  </select>
  <CustomInput v-model="search" />
  <CustomInput v-model:query="search" />  <!-- named model -->
</template>
```

| Directive | Mô tả | Ví dụ |
|---|---|---|
| `v-if` / `v-else` | Conditional mount/unmount | `v-if="ok"` |
| `v-show` | Toggle `display` CSS | `v-show="visible"` |
| `v-for` | List render | `v-for="i in items" :key="i.id"` |
| `v-bind` / `:` | Bind attribute | `:class="cls"` |
| `v-on` / `@` | Event listener | `@click="fn"` |
| `v-model` | Two-way binding | `v-model="value"` |
| `v-slot` / `#` | Named slot | `#header="{ data }"` |
| `v-memo` | Memoize sub-tree (3.2+) | `v-memo="[value]"` |
| `v-once` | Render một lần | `v-once` |

```typescript
// Custom directive
import type { Directive } from 'vue';

export const vFocus: Directive = {
  mounted(el: HTMLElement) { el.focus(); },
};

export const vClickOutside: Directive<HTMLElement, (e: Event) => void> = {
  mounted(el, binding) {
    el._handler = (e: Event) => {
      if (!el.contains(e.target as Node)) binding.value(e);
    };
    document.addEventListener('click', el._handler);
  },
  unmounted(el) {
    document.removeEventListener('click', el._handler);
  },
};
```

---

## 6. Lifecycle Hooks

Vue component lifecycle: **creation → mounting → updating → unmounting**. Composition API dùng `onXxx` functions trong `setup()` hoặc `<script setup>`.

| Hook | Khi nào chạy | Use case |
|---|---|---|
| `onBeforeMount` | Trước DOM mount | Rare |
| `onMounted` | Sau DOM mount | Fetch data, focus input, init chart |
| `onBeforeUpdate` | Trước re-render | Debug |
| `onUpdated` | Sau re-render | DOM đã cập nhật |
| `onBeforeUnmount` | Trước destroy | Cleanup timers |
| `onUnmounted` | Sau destroy | Final cleanup |
| `onActivated` | Keep-alive hiện | Restore scroll |
| `onDeactivated` | Keep-alive ẩn | Pause polling |
| `onErrorCaptured` | Child error bubble | Error boundary |

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onErrorCaptured } from 'vue';

const count = ref(0);
let intervalId: ReturnType<typeof setInterval>;

onMounted(() => {
  intervalId = setInterval(() => count.value++, 1000);
});

onBeforeUnmount(() => clearInterval(intervalId));

onErrorCaptured((err, instance, info) => {
  console.error('Captured:', err, info);
  return false;
});
</script>
```

```vue
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(async () => {
  inputRef.value?.focus();
  count.value++;
  await nextTick();  // đợi DOM flush sau reactive update
});
</script>

<template>
  <input ref="inputRef" />
  <KeepAlive :include="['UserList']" :max="10">
    <component :is="currentView" />
  </KeepAlive>
</template>
```

---

## 7. Vue Router 4

**Vue Router 4** là official router cho Vue 3. Hỗ trợ **nested routes**, **lazy loading**, **navigation guards**, **route meta**, và **history modes**.

```typescript
// router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UserListView.vue'),
    meta: { requiresAuth: true, title: 'Users' },
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('@/views/UserDetailView.vue'),
    props: true,
  },
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardLayout.vue'),
    children: [
      { path: '', component: () => import('@/views/DashboardHome.vue') },
      { path: 'settings', component: () => import('@/views/SettingsView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_, __, saved) => saved ?? { top: 0 },
});
```

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed, watch } from 'vue';

const router = useRouter();
const route = useRoute();
const userId = computed(() => Number(route.params.id));

const goToUser = (id: number) => router.push({ name: 'user-detail', params: { id } });

watch(() => route.params.id, (id) => { if (id) fetchUser(Number(id)); });
</script>

<template>
  <RouterLink :to="{ name: 'users' }">Users</RouterLink>
  <RouterView />
</template>
```

```typescript
// Global guard — authentication
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.title) document.title = `${to.meta.title} | My App`;
});
```

| Guard | Scope | Timing |
|---|---|---|
| `beforeEach` | Global | Trước mọi navigation |
| `beforeResolve` | Global | Sau async components loaded |
| `afterEach` | Global | Sau navigation complete |
| `beforeEnter` | Per-route | Trên route config |
| `onBeforeRouteLeave` | Component | Rời component |
| `onBeforeRouteUpdate` | Component | Cùng component, param đổi |

---

## 8. Pinia

**Pinia** là official state management cho Vue 3, thay thế Vuex. API đơn giản, **TypeScript** support tốt, không mutations, hỗ trợ **Setup stores** và **Option stores**.

### Setup store (khuyến nghị)

```typescript
// stores/user.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { userApi } from '@/api/user';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeUsers = computed(() => users.value.filter((u) => u.active));
  const getUserById = computed(() => (id: number) => users.value.find((u) => u.id === id));
  const userCount = computed(() => users.value.length);

  async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
      users.value = await userApi.getAll();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  async function addUser(user: Omit<User, 'id'>) {
    const created = await userApi.create(user);
    users.value.push(created);
    return created;
  }

  function removeUser(id: number) {
    users.value = users.value.filter((u) => u.id !== id);
  }

  function $reset() {
    users.value = [];
    loading.value = false;
    error.value = null;
  }

  return { users, loading, error, activeUsers, getUserById, userCount, fetchUsers, addUser, removeUser, $reset };
});
```

### Options store

```typescript
// stores/cart.ts
import { defineStore } from 'pinia';
import type { CartItem, Product } from '@/types/cart';

interface CartState {
  items: CartItem[];
  checkoutLoading: boolean;
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    checkoutLoading: false,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    getItemById: (state) => (productId: number) =>
      state.items.find((i) => i.productId === productId),
  },

  actions: {
    addItem(product: Product, quantity = 1) {
      const existing = this.items.find((i) => i.productId === product.id);
      if (existing) existing.quantity += quantity;
      else this.items.push({ productId: product.id, name: product.name, price: product.price, quantity });
    },

    removeItem(productId: number) {
      this.items = this.items.filter((i) => i.productId !== productId);
    },

    async checkout() {
      this.checkoutLoading = true;
      try {
        await cartApi.checkout(this.items);
        this.items = [];
      } finally {
        this.checkoutLoading = false;
      }
    },
  },
});
```

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';

const userStore = useUserStore();
const cartStore = useCartStore();

const { users, loading, activeUsers } = storeToRefs(userStore);
const { fetchUsers } = userStore;

fetchUsers();
</script>

<template>
  <div v-if="loading">Loading...</div>
  <ul><li v-for="user in activeUsers" :key="user.id">{{ user.name }}</li></ul>
  <p>Cart: {{ cartStore.itemCount }} — ${{ cartStore.totalPrice }}</p>
</template>
```

| | Setup Store | Options Store |
|---|---|---|
| Syntax | `defineStore('id', () => {})` | `defineStore('id', { state, getters, actions })` |
| State | `ref()` / `reactive()` | `state()` function |
| Getters | `computed()` | `getters` object |
| Actions | plain functions | `actions` object |
| Khuyến nghị | Project mới | Port từ Vuex |

---

## 9. Composables

**Composables** là functions tái sử dụng logic stateful, convention prefix `use`. Pattern chính để share logic trong Composition API.

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  const doubled = computed(() => count.value * 2);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => { count.value = initial; };
  return { count, doubled, increment, decrement, reset };
}
```

```typescript
// composables/useFetch.ts
import { ref, watchEffect, type Ref } from 'vue';

export function useFetch<T>(url: Ref<string> | string) {
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function execute() {
    loading.value = true;
    error.value = null;
    try {
      const resolved = typeof url === 'string' ? url : url.value;
      const res = await fetch(resolved);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data.value = await res.json();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Fetch failed');
    } finally {
      loading.value = false;
    }
  }

  watchEffect(() => execute());
  return { data, error, loading, refetch: execute };
}
```

| Rule | Giải thích |
|---|---|
| Prefix `use` | Convention — `useAuth`, `useFetch` |
| Return refs | Consumer destructure với reactivity |
| Cleanup `onUnmounted` | Tránh memory leak |
| Single responsibility | Một composable = một concern |

---

## 10. Forms & Validation

Vue 3 không có built-in form library. Ecosystem phổ biến: **VeeValidate 4**, **FormKit**, hoặc tự build với `v-model` + composables.

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({ email: '', password: '', remember: false });
const errors = ref<Partial<Record<string, string>>>({});
const submitting = ref(false);

function validate(): boolean {
  errors.value = {};
  if (!form.email) errors.value.email = 'Email required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.value.email = 'Invalid email';
  if (!form.password || form.password.length < 8) errors.value.password = 'Min 8 characters';
  return Object.keys(errors.value).length === 0;
}

async function onSubmit() {
  if (!validate()) return;
  submitting.value = true;
  try { await authApi.login(form); } finally { submitting.value = false; }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.email" type="email" />
    <span v-if="errors.email">{{ errors.email }}</span>
    <input v-model="form.password" type="password" />
    <span v-if="errors.password">{{ errors.password }}</span>
    <label><input v-model="form.remember" type="checkbox" /> Remember</label>
    <button :disabled="submitting">Login</button>
  </form>
</template>
```

```typescript
// VeeValidate 4 + Zod
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const schema = toTypedSchema(z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
}));

export function useLoginForm() {
  const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema: schema });
  const { value: email } = useField<string>('email');
  const { value: password } = useField<string>('password');
  const onSubmit = handleSubmit(async (values) => authApi.login(values));
  return { email, password, errors, isSubmitting, onSubmit };
}
```

| Approach | Khi nào dùng |
|---|---|
| Native v-model + manual validation | Form đơn giản |
| VeeValidate + Zod/Yup | Form phức tạp, schema validation |
| FormKit | Full form UI framework |
| Custom composable | Reuse validation logic |

---

## 11. Async & Suspense

Vue 3 hỗ trợ **`<Suspense>`** cho async component setup và **async components** với `defineAsyncComponent`.

```typescript
import { defineAsyncComponent } from 'vue';

const AsyncDashboard = defineAsyncComponent({
  loader: () => import('@/views/DashboardView.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 10000,
  suspensible: true,
});
```

```vue
<!-- AsyncUserProfile.vue — top-level await -->
<script setup lang="ts">
const props = defineProps<{ userId: number }>();
const user = await userApi.getById(props.userId);
const posts = await postApi.getByUser(props.userId);
</script>

<template>
  <h1>{{ user.name }}</h1>
  <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
</template>
```

```vue
<!-- Parent.vue -->
<template>
  <Suspense>
    <AsyncUserProfile :user-id="1" />
    <template #fallback><div class="skeleton">Loading...</div></template>
  </Suspense>
</template>
```

```typescript
// composables/useAsyncData.ts
import { ref, watch, type Ref } from 'vue';

export function useAsyncData<T>(source: Ref<unknown>, fetcher: () => Promise<T>) {
  const data = ref<T | null>(null) as Ref<T | null>;
  const pending = ref(true);
  const error = ref<Error | null>(null);

  async function refresh() {
    pending.value = true;
    try { data.value = await fetcher(); }
    catch (e) { error.value = e instanceof Error ? e : new Error('Failed'); }
    finally { pending.value = false; }
  }

  watch(source, refresh, { immediate: true });
  return { data, pending, error, refresh };
}
```

---

## 12. Performance

Vue 3 đã tối ưu bundle và patch speed. App lớn vẫn cần **conscious optimization**: `v-memo`, `shallowRef`, lazy routes, virtual scrolling.

```vue
<template>
  <!-- v-memo — chỉ re-render khi deps đổi -->
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
    <ExpensiveChild :item="item" />
  </div>

  <KeepAlive :max="5">
    <component :is="activeTab" />
  </KeepAlive>
</template>
```

```typescript
import { markRaw, shallowRef } from 'vue';
import * as echarts from 'echarts';

const chartInstance = shallowRef<echarts.ECharts | null>(null);

function initChart(el: HTMLElement) {
  chartInstance.value = markRaw(echarts.init(el));
}

// Lazy route
const routes = [{ path: '/reports', component: () => import('@/views/ReportsView.vue') }];
```

| Technique | Mô tả |
|---|---|
| `v-memo` | Skip re-render khi deps không đổi |
| `shallowRef` / `markRaw` | Large data không cần deep track |
| Lazy routes | Code splitting per route |
| `defineAsyncComponent` | Split heavy components |
| `KeepAlive` | Cache tab views |
| Virtual scroll | List 1000+ items |
| `computed` over methods | Cache derived values trong template |

---

## 13. Testing

Vue 3 ecosystem dùng **Vitest** (unit) và **Vue Test Utils** (component testing).

```typescript
// vitest.config.ts
import { mergeConfig, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, defineConfig({
  test: { environment: 'jsdom', globals: true },
}));
```

```typescript
// components/__tests__/CounterButton.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CounterButton from '@/components/CounterButton.vue';

describe('CounterButton', () => {
  it('increments on click', async () => {
    const wrapper = mount(CounterButton, { props: { initial: 0 } });
    await wrapper.find('button').trigger('click');
    expect(wrapper.text()).toContain('1');
    expect(wrapper.emitted('change')).toEqual([[1]]);
  });
});
```

```typescript
// stores/__tests__/user.spec.ts
import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { useUserStore } from '@/stores/user';

vi.mock('@/api/user', () => ({
  userApi: { getAll: vi.fn().mockResolvedValue([{ id: 1, name: 'Alice', active: true }]) },
}));

describe('useUserStore', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('fetches users', async () => {
    const store = useUserStore();
    await store.fetchUsers();
    expect(store.users).toHaveLength(1);
    expect(store.activeUsers).toHaveLength(1);
  });
});
```

| Tool | Purpose |
|---|---|
| Vitest | Test runner, mocking |
| `@vue/test-utils` | `mount`, `trigger`, `emitted` |
| `@testing-library/vue` | User-centric queries |
| `msw` | Mock API |

---

## 14. TypeScript

Vue 3 + TypeScript là combination được khuyến khích. `vue-tsc` type-check SFC.

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  variant?: 'primary' | 'secondary';
}

const props = withDefaults(defineProps<Props>(), { count: 0, variant: 'primary' });

const emit = defineEmits<{
  change: [id: number];
  update: [value: string];
}>();

emit('change', 42);
// emit('change', 'wrong');  // ❌ TS error
</script>
```

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChildComponent from './ChildComponent.vue';

const inputEl = ref<HTMLInputElement | null>(null);
const childComp = ref<InstanceType<typeof ChildComponent> | null>(null);

onMounted(() => {
  inputEl.value?.focus();
  childComp.value?.refresh();
});
</script>
```

```typescript
// Typing composables
import { ref, type Ref } from 'vue';

export interface UseFetchReturn<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
}

export function useFetch<T>(url: string): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null);
  const loading = ref(false);
  return { data, error, loading };
}
```

---

## 15. Cấu trúc Project

Cấu trúc production app thường tổ chức theo **feature** hoặc **type**. Feature-based scale tốt hơn cho team lớn.

```
src/
├── api/                        # API clients
│   ├── client.ts
│   └── user.api.ts
├── assets/styles/
├── components/                 # Shared components
│   ├── ui/BaseButton.vue
│   └── layout/AppHeader.vue
├── composables/                # useAuth.ts, useFetch.ts
├── directives/                 # clickOutside.ts
├── features/                   # Feature modules
│   ├── auth/
│   │   ├── components/LoginForm.vue
│   │   ├── composables/useLogin.ts
│   │   └── views/LoginView.vue
│   └── users/
│       ├── components/UserCard.vue
│       ├── views/UserListView.vue
│       └── types.ts
├── router/index.ts
├── stores/auth.ts
├── types/api.ts
├── utils/format.ts
├── App.vue
└── main.ts
```

| Loại | Convention | Ví dụ |
|---|---|---|
| Component file | PascalCase | `UserCard.vue` |
| Composable | camelCase, `use` prefix | `useAuth.ts` |
| Store | `use` + `Store` suffix | `useUserStore` |
| View/Page | PascalCase + `View` | `UserListView.vue` |
| API module | `.api.ts` suffix | `user.api.ts` |

```typescript
// features/users/composables/useUsers.ts — feature-scoped composable
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

export function useUsers() {
  const store = useUserStore();
  const { users, loading } = storeToRefs(store);
  return { users, loading, fetchUsers: store.fetchUsers };
}
```

---

## 16. Interview Tips

### Câu hỏi thường gặp khi phỏng vấn Vue 3

**Q: Composition API khác Options API thế nào?**
> Composition API tổ chức logic theo concern, reuse qua composables, TypeScript inference tốt. Options API tổ chức theo option type. Vue 3 khuyến nghị Composition API + `<script setup>`.

**Q: `ref` và `reactive` khác nhau thế nào?**
> `ref` wrap mọi giá trị, truy cập `.value` trong script, auto-unwrap trong template. `reactive` chỉ object, deep reactive, không reassign được. Destructure `reactive` mất reactivity — dùng `toRefs`.

**Q: `watch` và `watchEffect` khác nhau thế nào?**
> `watch` cần source cụ thể, lazy (trừ `immediate`), có old value. `watchEffect` auto-track deps, chạy ngay, không có old value.

**Q: Vue 3 reactivity hoạt động thế nào?**
> ES6 Proxy intercept get/set. `ref` bọc giá trị trong `{ value }`. Trigger update khi tracked property đổi, scheduler batch updates vào microtask queue.

**Q: Pinia khác Vuex thế nào?**
> Pinia không mutations — state, getters, actions. Multiple stores, TypeScript tốt, modular. Setup store dùng `ref`, `computed` bên trong.

**Q: `v-if` vs `v-show`?**
> `v-if` mount/unmount DOM. `v-show` toggle CSS `display`, element luôn trong DOM. `v-if` khi ít toggle, `v-show` khi toggle thường xuyên.

**Q: `v-model` hoạt động thế nào?**
> Syntax sugar: `:modelValue` + `@update:modelValue`. Multiple v-model: `v-model:title`. `defineModel` (3.4+) đơn giản hóa trong child.

**Q: Khi nào dùng `shallowRef`?**
> Large dataset hoặc external library objects không cần deep reactivity. Dùng `triggerRef` sau deep mutate.

**Q: Làm sao optimize performance?**
> Lazy routes/components, `v-memo`, `shallowRef`/`markRaw`, virtual scroll, `computed` thay method trong template, `KeepAlive` cho tabs.

---

## 17. Quick Reference

| API / Pattern | Syntax / Usage | Ghi chú |
|---|---|---|
| `ref()` | `const x = ref(0); x.value++` | Mọi kiểu, unwrap trong template |
| `reactive()` | `const s = reactive({ a: 1 })` | Chỉ object, deep reactive |
| `computed()` | `const d = computed(() => x.value * 2)` | Cached derived state |
| `watch()` | `watch(src, (n, o) => {})` | Watch specific source |
| `watchEffect()` | `watchEffect(() => { ... })` | Auto-track deps |
| `toRef()` | `toRef(state, 'key')` | Reactive property ref |
| `toRefs()` | `const { a } = toRefs(state)` | Destructure reactive |
| `shallowRef()` | `shallowRef({ big })` | Shallow reactivity |
| `defineProps` | `defineProps<{ id: number }>()` | Typed props |
| `defineEmits` | `defineEmits<{ save: [id: number] }>()` | Typed emits |
| `defineModel` | `const m = defineModel<string>()` | Two-way binding (3.4+) |
| `provide/inject` | `provide(key, val)` / `inject(key)` | DI across tree |
| `onMounted` | `onMounted(() => {})` | After DOM mount |
| `nextTick` | `await nextTick()` | After DOM flush |
| `<script setup>` | `<script setup lang="ts">` | Modern SFC syntax |
| `defineAsyncComponent` | `defineAsyncComponent(() => import())` | Lazy component |
| `<Suspense>` | `#default` + `#fallback` slots | Async setup handling |
| `<Teleport>` | `<Teleport to="body">` | Render elsewhere |
| `v-model` | `v-model="x"` / `v-model:name="x"` | Two-way binding |
| `v-memo` | `v-memo="[dep1, dep2]"` | Template memoization |
| `Pinia` | `defineStore('id', () => {})` | State management |
| `storeToRefs` | `const { x } = storeToRefs(store)` | Reactive destructure |
| `useRouter` | `router.push({ name: 'home' })` | Programmatic navigation |
| `useRoute` | `route.params.id` | Current route info |
| `composable` | `function useX() { return { ... } }` | Reusable logic |
| `markRaw` | `markRaw(nonReactiveObj)` | Opt-out reactivity |

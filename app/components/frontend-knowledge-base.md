# COMPLETE FRONTEND REACT/NEXT.JS KNOWLEDGE BASE

---

# PHASE 1: FUNDAMENTALS (Junior Level) — Tổng quan

> Phase này mô tả sơ qua. Đây là nền tảng bạn cần nắm vững trước khi tiến lên mid-level.

## 1.1 HTML & Semantic HTML

HTML là ngôn ngữ đánh dấu cấu trúc nội dung web. Bạn cần nắm các thẻ cơ bản (`div`, `span`, `p`, `a`, `img`, `ul/ol/li`, `table`), các thẻ semantic (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`) giúp trình duyệt và screen reader hiểu cấu trúc trang. Form elements (`input`, `textarea`, `select`, `label`) là nền tảng cho mọi tương tác nhập liệu. SEO tags (`meta`, `title`, `og:*`, `canonical`) giúp trang hiển thị tốt trên search engines và social media.

> Ref: https://developer.mozilla.org/en-US/docs/Web/HTML

## 1.2 CSS Cơ bản

CSS kiểm soát giao diện và bố cục. Bạn cần thành thạo Box Model (`margin`, `padding`, `border`, `box-sizing`), Flexbox và Grid cho layout, positioning (`static`, `relative`, `absolute`, `fixed`, `sticky`), responsive design với media queries, các đơn vị (`px`, `rem`, `vw`, `vh`, `clamp()`), transitions và animations, CSS Variables (`--custom-property`).

> Ref: https://developer.mozilla.org/en-US/docs/Web/CSS
> Ref: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
> Ref: https://css-tricks.com/snippets/css/complete-guide-grid/

## 1.3 JavaScript Cơ bản & ES6+

JavaScript là ngôn ngữ lập trình core. Nắm vững: variables (`let`, `const` vs `var`), data types, operators (đặc biệt `===`, `??`, `?.`), string/number/array/object methods, destructuring, spread/rest, arrow functions, scope & closures, promises & async/await, modules (import/export), classes, Map/Set, error handling (try/catch), Event Loop (call stack, task queue, microtask queue).

> Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript
> Ref: https://javascript.info/

## 1.4 DOM & Browser APIs

Hiểu cách JavaScript tương tác với trình duyệt: DOM manipulation (`querySelector`, `addEventListener`), event bubbling/capturing/delegation, Storage APIs (`localStorage`, `sessionStorage`), Fetch API, URL API, History API, IntersectionObserver, Web Workers (concept).

> Ref: https://developer.mozilla.org/en-US/docs/Web/API

## 1.5 Git Cơ bản

Version control: `init`, `clone`, `add`, `commit`, `push`, `pull`, `fetch`, branching (`branch`, `checkout`, `merge`), `.gitignore`, remote management.

> Ref: https://git-scm.com/doc

## 1.6 Package Manager & Tooling

npm/pnpm: `install`, `run`, `npx`, `package.json` (`dependencies` vs `devDependencies`), semantic versioning (`^`, `~`). Tooling: Vite (dev server, build), ESLint, Prettier, Browser DevTools, React DevTools.

> Ref: https://docs.npmjs.com/
> Ref: https://vitejs.dev/guide/

## 1.7 React Cơ bản

JSX, function components, props, children, `useState`, `useEffect`, `useRef`, event handling, conditional rendering, lists & keys, controlled vs uncontrolled forms, component composition, Fragment.

> Ref: https://react.dev/learn

## 1.8 Styling trong React

CSS Modules (`.module.css`), Tailwind CSS, `clsx`/`classnames` cho conditional classes, biết concept của CSS-in-JS (styled-components, Emotion).

> Ref: https://tailwindcss.com/docs
> Ref: https://github.com/css-modules/css-modules

---
---

# PHASE 2: INTERMEDIATE (Mid Level) — Chi tiết

## 2.1 React Hooks Nâng cao

### useReducer

`useReducer` là phiên bản nâng cao của `useState`, phù hợp khi state có nhiều trường liên quan hoặc logic cập nhật phức tạp. Nó hoạt động theo mô hình: **dispatch một action → reducer function xử lý action → trả về state mới**.

```tsx
import { useReducer } from 'react';

// 1. Định nghĩa types
type State = {
  count: number;
  step: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'setStep'; payload: number };

// 2. Reducer function — PHẢI là pure function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'reset':
      return { count: 0, step: 1 };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

// 3. Sử dụng trong component
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count} (step: {state.step})</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
      />
    </div>
  );
}
```

**Khi nào dùng `useReducer` thay `useState`:**
- State là object/array có nhiều trường liên quan
- Logic cập nhật phức tạp (ví dụ: cập nhật field A phụ thuộc vào field B)
- Muốn tách logic ra khỏi component (reducer có thể test độc lập)
- Có nhiều actions khác nhau tác động lên cùng một state

> Ref: https://react.dev/reference/react/useReducer

### useContext

`useContext` cho phép chia sẻ data xuyên suốt component tree mà không cần prop drilling (truyền props qua nhiều tầng).

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Tạo context với type
type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. Custom hook để consume context (pattern quan trọng!)
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 3. Provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Consume ở bất kỳ component con nào
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}
```

**Vấn đề performance của Context:** Khi value thay đổi, TẤT CẢ components consume context đều re-render. Cách giải quyết:
- Tách context theo trách nhiệm (không gộp mọi thứ vào 1 context)
- Dùng `useMemo` cho value object
- Cân nhắc dùng Zustand/Jotai nếu state thay đổi thường xuyên

> Ref: https://react.dev/reference/react/useContext

### useMemo và useCallback

**`useMemo`** memoize kết quả tính toán. **`useCallback`** memoize function reference.

```tsx
import { useMemo, useCallback, useState } from 'react';

function ProductList({ products, taxRate }: { products: Product[]; taxRate: number }) {
  // ✅ useMemo: tính toán nặng, chỉ chạy lại khi products hoặc taxRate thay đổi
  const sortedWithTax = useMemo(() => {
    console.log('Computing sorted products with tax...');
    return products
      .map((p) => ({ ...p, finalPrice: p.price * (1 + taxRate) }))
      .sort((a, b) => a.finalPrice - b.finalPrice);
  }, [products, taxRate]);

  // ✅ useCallback: function reference ổn định, tránh child re-render nếu child dùng React.memo
  const handleDelete = useCallback((id: string) => {
    // gọi API xóa sản phẩm
    deleteProduct(id);
  }, []); // không dependency vì deleteProduct là import ổn định

  return (
    <ul>
      {sortedWithTax.map((p) => (
        <ProductItem key={p.id} product={p} onDelete={handleDelete} />
      ))}
    </ul>
  );
}

// Child component dùng React.memo — chỉ re-render khi props thay đổi
const ProductItem = React.memo(({ product, onDelete }: Props) => {
  return (
    <li>
      {product.name} - ${product.finalPrice}
      <button onClick={() => onDelete(product.id)}>Delete</button>
    </li>
  );
});
```

**Khi nào KHÔNG cần memoize:**
- Tính toán đơn giản (`a + b`, string concat)
- Component không có children nặng
- Component luôn re-render vì props luôn thay đổi
- Premature optimization: đo lường trước, optimize sau

> Ref: https://react.dev/reference/react/useMemo
> Ref: https://react.dev/reference/react/useCallback

### useLayoutEffect

`useLayoutEffect` chạy **đồng bộ** sau khi DOM được cập nhật nhưng **trước khi** trình duyệt paint lên màn hình. Khác với `useEffect` chạy **bất đồng bộ** sau khi paint.

```tsx
import { useLayoutEffect, useRef, useState } from 'react';

function Tooltip({ targetRef, content }: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // ✅ useLayoutEffect: đo DOM → cập nhật position TRƯỚC KHI user nhìn thấy
  // Nếu dùng useEffect, user sẽ thấy tooltip nhảy vị trí (flicker)
  useLayoutEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      setPosition({
        top: targetRect.top - tooltipRect.height - 8,
        left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
      });
    }
  }, [targetRef]);

  return (
    <div ref={tooltipRef} style={{ position: 'fixed', ...position }}>
      {content}
    </div>
  );
}
```

**Dùng khi:** Cần đo kích thước/vị trí DOM rồi cập nhật layout trước khi user nhìn thấy. Hầu hết trường hợp khác dùng `useEffect`.

> Ref: https://react.dev/reference/react/useLayoutEffect

### useId, useImperativeHandle, useDeferredValue, useTransition

```tsx
// useId — tạo unique ID cho accessibility
function FormField({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}

// useImperativeHandle — expose custom API qua ref
import { forwardRef, useImperativeHandle, useRef } from 'react';

type VideoPlayerHandle = {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
};

const VideoPlayer = forwardRef<VideoPlayerHandle, { src: string }>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seekTo: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    },
  }));

  return <video ref={videoRef} src={props.src} />;
});

// Parent sử dụng
function App() {
  const playerRef = useRef<VideoPlayerHandle>(null);
  return (
    <>
      <VideoPlayer ref={playerRef} src="/video.mp4" />
      <button onClick={() => playerRef.current?.play()}>Play</button>
      <button onClick={() => playerRef.current?.seekTo(30)}>Jump to 0:30</button>
    </>
  );
}

// useTransition — đánh dấu state update là non-urgent
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<string[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value); // urgent: cập nhật input ngay lập tức
    startTransition(() => {
      setResults(filterHugeList(e.target.value)); // non-urgent: có thể delay
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Đang tìm...</p>}
      <ResultList results={results} />
    </div>
  );
}

// useDeferredValue — defer value cho re-render non-urgent
function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // deferredQuery sẽ "lag behind" query, cho phép input luôn responsive
  const results = useMemo(() => filterHugeList(deferredQuery), [deferredQuery]);

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {results.map((r) => <div key={r}>{r}</div>)}
    </div>
  );
}
```

> Ref: https://react.dev/reference/react/useTransition
> Ref: https://react.dev/reference/react/useDeferredValue

---

## 2.2 Custom Hooks — Chi tiết

Custom hooks cho phép tái sử dụng stateful logic giữa các components. Một custom hook là một function bắt đầu bằng `use` và có thể gọi các hooks khác bên trong.

```tsx
// ===== useDebounce =====
// Delay cập nhật value, hữu ích cho search input
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ===== useLocalStorage =====
// Sync state với localStorage, persist qua page reload
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}

// Sử dụng:
const [theme, setTheme] = useLocalStorage('theme', 'light');

// ===== useMediaQuery =====
// Kiểm tra media query trong JS, reactive
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Sử dụng:
const isMobile = useMediaQuery('(max-width: 768px)');
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

// ===== useOnClickOutside =====
// Detect click bên ngoài element (close dropdown, modal)
function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Sử dụng:
function Dropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setOpen(!open)}>Menu</button>
      {open && <div className="dropdown-content">...</div>}
    </div>
  );
}

// ===== useIntersectionObserver =====
// Detect khi element xuất hiện trong viewport (lazy load, infinite scroll)
function useIntersectionObserver(
  ref: RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// ===== usePrevious =====
// Lưu giá trị trước đó của một value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// ===== useInterval =====
// setInterval declarative (tự cleanup)
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Sử dụng: countdown timer
function Timer() {
  const [seconds, setSeconds] = useState(60);
  useInterval(() => setSeconds((s) => s - 1), seconds > 0 ? 1000 : null);
  return <p>{seconds}s</p>;
}
```

> Ref: https://react.dev/learn/reusing-logic-with-custom-hooks
> Ref: https://usehooks.com/

---

## 2.3 State Management — Chi tiết

### Phân loại State

Hiểu rõ từng loại state là chìa khóa chọn đúng công cụ:

| Loại | Mô tả | Ví dụ | Giải pháp |
|---|---|---|---|
| **UI State** | Trạng thái giao diện tạm thời | Modal open/close, tab active, hover | `useState` |
| **Form State** | Dữ liệu input của user | Form fields, validation errors | React Hook Form |
| **Server State** | Data từ API/database | User list, product details | TanStack Query / SWR |
| **Global Client State** | State chia sẻ nhiều components | Theme, user preferences, cart | Zustand / Jotai |
| **URL State** | State encode trong URL | Search query, filters, pagination | `useSearchParams` |

### Zustand — Chi tiết

Zustand là thư viện state management nhẹ, đơn giản, dựa trên hooks. Khác với Redux, không cần boilerplate (reducers, actions, dispatch).

```tsx
// stores/cartStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

// Store creation
export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (item) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
              };
            }
            return { items: [...state.items, { ...item, quantity: 1 }] };
          }),

        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
          })),

        updateQuantity: (id, quantity) =>
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
            ),
          })),

        clearCart: () => set({ items: [] }),

        // Derived values dùng get()
        totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      }),
      { name: 'cart-storage' } // persist config — tự save vào localStorage
    )
  )
);

// Sử dụng trong component — chỉ lấy những gì cần (selector)
function CartIcon() {
  // ✅ Chỉ re-render khi items thay đổi, không quan tâm action changes
  const itemCount = useCartStore((state) => state.items.length);
  return <span>🛒 ({itemCount})</span>;
}

function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${totalPrice()}</p>
    </div>
  );
}

// Slices pattern — chia store lớn thành nhiều phần
// stores/userSlice.ts
interface UserSlice {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const createUserSlice = (set: any): UserSlice => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
});

// stores/index.ts — combine slices
const useStore = create<CartStore & UserSlice>()((...a) => ({
  ...createCartSlice(...a),
  ...createUserSlice(...a),
}));
```

> Ref: https://zustand-demo.pmnd.rs/
> Ref: https://github.com/pmndrs/zustand

### Jotai — Atomic State

Jotai dùng mô hình atomic: mỗi piece of state là một atom, có thể derived từ atoms khác.

```tsx
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

// Primitive atoms
const countAtom = atom(0);
const nameAtom = atom('');

// Derived atom (read-only) — tự động cập nhật khi dependency thay đổi
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Derived atom (read-write)
const countWithMinAtom = atom(
  (get) => get(countAtom),
  (get, set, newValue: number) => {
    set(countAtom, Math.max(0, newValue)); // không cho count < 0
  }
);

// Async atom — fetch data
const userAtom = atom(async () => {
  const res = await fetch('/api/user');
  return res.json();
});

// Sử dụng
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const doubleCount = useAtomValue(doubleCountAtom); // chỉ read
  const setName = useSetAtom(nameAtom); // chỉ write, component không re-render khi name thay đổi

  return (
    <div>
      <p>Count: {count}, Double: {doubleCount}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

> Ref: https://jotai.org/docs/introduction

---

## 2.4 Data Fetching với TanStack Query

TanStack Query (React Query) là thư viện quản lý **server state** — data từ API. Nó xử lý caching, refetching, background updates, pagination, optimistic updates.

```tsx
// Setup: app/providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // data "fresh" trong 60 giây
            gcTime: 5 * 60 * 1000, // garbage collect sau 5 phút
            retry: 2, // retry 2 lần nếu fail
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

// ===== useQuery — Fetch data =====
import { useQuery } from '@tanstack/react-query';

// Service layer
async function fetchProducts(category: string): Promise<Product[]> {
  const res = await fetch(`/api/products?category=${category}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Component
function ProductList({ category }: { category: string }) {
  const {
    data: products,  // dữ liệu trả về
    isLoading,       // lần fetch đầu tiên
    isError,         // có lỗi
    error,           // error object
    isFetching,      // đang fetch (bao gồm cả background refetch)
    isStale,         // data đã stale chưa
    refetch,         // manual refetch
  } = useQuery({
    queryKey: ['products', category], // unique key, thay đổi khi category thay đổi
    queryFn: () => fetchProducts(category),
    staleTime: 5 * 60 * 1000, // override default
    enabled: !!category, // chỉ fetch khi category có giá trị
    placeholderData: (previousData) => previousData, // giữ data cũ khi đổi category
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      {isFetching && <Spinner />} {/* background refetch indicator */}
      {products?.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// ===== useMutation — Tạo/Sửa/Xóa data =====
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateProductForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newProduct: CreateProductInput) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    // Sau khi thành công, invalidate cache để refetch list mới
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    // Optimistic update: cập nhật UI trước khi server respond
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previous = queryClient.getQueryData(['products']);
      queryClient.setQueryData(['products'], (old: Product[]) => [
        ...old,
        { ...newProduct, id: 'temp-' + Date.now() },
      ]);
      return { previous }; // context để rollback
    },
    onError: (err, variables, context) => {
      // Rollback nếu lỗi
      queryClient.setQueryData(['products'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ name: 'New Product', price: 99 })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Creating...' : 'Create Product'}
    </button>
  );
}

// ===== useInfiniteQuery — Infinite scroll / Load more =====
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/products?cursor=${pageParam}&limit=20`);
      return res.json(); // { items: Product[], nextCursor: string | null }
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const allProducts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      {allProducts.map((p) => <ProductCard key={p.id} product={p} />)}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

// ===== Prefetching — Load trước khi user cần =====
// Trong Server Component (Next.js)
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

async function ProductsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList /> {/* Có data sẵn, không cần loading state */}
    </HydrationBoundary>
  );
}
```

> Ref: https://tanstack.com/query/latest/docs/framework/react/overview

---

## 2.5 Form Management — React Hook Form + Zod

```tsx
// schemas/productSchema.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên sản phẩm là bắt buộc')
    .max(100, 'Tên tối đa 100 ký tự'),
  description: z
    .string()
    .min(10, 'Mô tả ít nhất 10 ký tự')
    .max(1000, 'Mô tả tối đa 1000 ký tự'),
  price: z
    .number({ invalid_type_error: 'Giá phải là số' })
    .positive('Giá phải > 0')
    .max(999999, 'Giá tối đa 999,999'),
  category: z.enum(['electronics', 'clothing', 'food'], {
    errorMap: () => ({ message: 'Chọn danh mục hợp lệ' }),
  }),
  tags: z
    .array(z.string())
    .min(1, 'Chọn ít nhất 1 tag')
    .max(5, 'Tối đa 5 tags'),
  isActive: z.boolean().default(true),
  variants: z
    .array(
      z.object({
        size: z.string().min(1, 'Size là bắt buộc'),
        color: z.string().min(1, 'Color là bắt buộc'),
        stock: z.number().int().min(0, 'Stock >= 0'),
      })
    )
    .min(1, 'Cần ít nhất 1 variant'),
});

// Infer TypeScript type từ Zod schema — type-safe!
export type ProductFormData = z.infer<typeof productSchema>;

// components/ProductForm.tsx
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/schemas/productSchema';

function ProductForm({ onSubmit }: { onSubmit: (data: ProductFormData) => void }) {
  const {
    register,      // đăng ký field với form
    handleSubmit,  // wrap onSubmit, validate trước khi gọi
    control,       // cho Controller (custom components)
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,         // theo dõi giá trị field
    setValue,      // set value programmatically
    reset,         // reset form
    trigger,       // trigger validation manually
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: undefined,
      tags: [],
      isActive: true,
      variants: [{ size: '', color: '', stock: 0 }],
    },
    mode: 'onBlur', // validate khi blur, không phải mỗi keystroke
  });

  // Dynamic fields — thêm/xóa variants
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  // Watch value để conditional rendering
  const isActive = watch('isActive');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Text input */}
      <div>
        <label>Tên sản phẩm</label>
        <input {...register('name')} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      {/* Number input */}
      <div>
        <label>Giá</label>
        <input type="number" {...register('price', { valueAsNumber: true })} />
        {errors.price && <span className="error">{errors.price.message}</span>}
      </div>

      {/* Select */}
      <div>
        <label>Danh mục</label>
        <select {...register('category')}>
          <option value="">Chọn...</option>
          <option value="electronics">Điện tử</option>
          <option value="clothing">Quần áo</option>
          <option value="food">Thực phẩm</option>
        </select>
        {errors.category && <span className="error">{errors.category.message}</span>}
      </div>

      {/* Controller — cho custom/third-party components */}
      <Controller
        control={control}
        name="tags"
        render={({ field }) => (
          <TagInput value={field.value} onChange={field.onChange} />
        )}
      />

      {/* Dynamic fields */}
      <div>
        <h3>Variants</h3>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input {...register(`variants.${index}.size`)} placeholder="Size" />
            <input {...register(`variants.${index}.color`)} placeholder="Color" />
            <input
              type="number"
              {...register(`variants.${index}.stock`, { valueAsNumber: true })}
              placeholder="Stock"
            />
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)}>Xóa</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ size: '', color: '', stock: 0 })}>
          Thêm variant
        </button>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
      </button>
    </form>
  );
}
```

> Ref: https://react-hook-form.com/get-started
> Ref: https://zod.dev/

---

## 2.6 Routing — Next.js App Router

### File-based Routing

Trong App Router, cấu trúc thư mục = cấu trúc URL:

```
app/
├── page.tsx                      → /
├── layout.tsx                    → Layout cho toàn app
├── loading.tsx                   → Loading UI cho /
├── error.tsx                     → Error UI cho /
├── not-found.tsx                 → 404 page
├── about/
│   └── page.tsx                  → /about
├── blog/
│   ├── page.tsx                  → /blog
│   └── [slug]/
│       ├── page.tsx              → /blog/my-post
│       └── loading.tsx           → Loading cho từng blog post
├── shop/
│   ├── [...slug]/
│   │   └── page.tsx              → /shop/a, /shop/a/b, /shop/a/b/c
│   └── [[...slug]]/
│       └── page.tsx              → /shop (optional catch-all, match cả /shop)
├── (marketing)/                  → Route group, KHÔNG tạo URL segment
│   ├── layout.tsx                → Layout riêng cho marketing pages
│   ├── pricing/page.tsx          → /pricing
│   └── features/page.tsx         → /features
├── (auth)/
│   ├── layout.tsx                → Layout riêng cho auth (ví dụ: không có navbar)
│   ├── login/page.tsx            → /login
│   └── register/page.tsx         → /register
└── dashboard/
    ├── layout.tsx
    ├── page.tsx                  → /dashboard
    ├── @sidebar/                 → Parallel route (slot)
    │   └── page.tsx
    ├── @main/
    │   └── page.tsx
    └── settings/
        ├── page.tsx              → /dashboard/settings
        └── (.)preview/           → Intercepting route
            └── page.tsx
```

### Các file đặc biệt

```tsx
// layout.tsx — Layout bao bọc pages, persist across navigation
// KHÔNG re-render khi navigate giữa child pages
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// loading.tsx — Tự động wrap page trong <Suspense>
// Hiển thị khi page đang load (streaming)
export default function Loading() {
  return <Skeleton className="h-screen" />;
}

// error.tsx — Error boundary cho route segment
'use client'; // BẮT BUỘC phải là client component
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Đã xảy ra lỗi!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Thử lại</button>
    </div>
  );
}

// not-found.tsx — Custom 404 page
export default function NotFound() {
  return (
    <div>
      <h2>404 - Không tìm thấy trang</h2>
      <Link href="/">Về trang chủ</Link>
    </div>
  );
}
```

### Middleware

```tsx
// middleware.ts (root level)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Authentication check
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add custom headers
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // Geo-based routing
  const country = request.geo?.country;
  if (country === 'VN' && pathname === '/') {
    return NextResponse.rewrite(new URL('/vi', request.url));
  }

  return response;
}

// Matcher — chỉ chạy middleware cho paths cụ thể
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/'],
};
```

> Ref: https://nextjs.org/docs/app/building-your-application/routing

---

## 2.7 Next.js Data Fetching

### Server Components — Fetch trực tiếp

```tsx
// app/products/page.tsx — Server Component (mặc định)
// Chạy trên server, có thể gọi DB trực tiếp, không ship JS về client

// Cách 1: fetch với caching
async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR: revalidate mỗi 1 giờ
    // next: { tags: ['products'] }, // hoặc tag-based revalidation
    // cache: 'no-store', // SSR: luôn fetch mới
    // cache: 'force-cache', // SSG: cache vĩnh viễn (default)
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Products</h1>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// SSG với dynamic routes
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id })); // tạo static page cho mỗi product
}
```

### Server Actions

```tsx
// actions/product.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});

export async function createProduct(formData: FormData) {
  // Validate
  const parsed = createProductSchema.safeParse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Save to DB
  await db.product.create({ data: parsed.data });

  // Revalidate cache
  revalidatePath('/products');
  // hoặc: revalidateTag('products');

  // Redirect
  redirect('/products');
}

// Sử dụng trong Server Component
export default function NewProductPage() {
  return (
    <form action={createProduct}>
      <input name="name" placeholder="Product name" />
      <input name="price" type="number" placeholder="Price" />
      <button type="submit">Create</button>
    </form>
  );
}

// Sử dụng trong Client Component với useActionState
'use client';
import { useActionState } from 'react';
import { createProduct } from '@/actions/product';

function ProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, null);

  return (
    <form action={formAction}>
      <input name="name" />
      {state?.error?.name && <p>{state.error.name}</p>}
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Streaming với Suspense

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

// Mỗi component fetch data độc lập, stream song song
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Mỗi Suspense boundary stream độc lập */}
      <Suspense fallback={<Skeleton />}>
        <RevenueChart /> {/* async component, fetch 2s */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <RecentOrders /> {/* async component, fetch 1s → hiện trước */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <UserActivity /> {/* async component, fetch 3s → hiện sau */}
      </Suspense>
    </div>
  );
}

async function RevenueChart() {
  const data = await fetchRevenue(); // 2 giây
  return <Chart data={data} />;
}
```

> Ref: https://nextjs.org/docs/app/building-your-application/data-fetching

---

## 2.8 TypeScript Intermediate

### Generics

Generics cho phép tạo components/functions linh hoạt về type mà vẫn type-safe.

```tsx
// Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const num = first([1, 2, 3]); // type: number | undefined
const str = first(['a', 'b']); // type: string | undefined

// Generic với constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: 'An', age: 25 };
getProperty(user, 'name'); // ✅ type: string
// getProperty(user, 'email'); // ❌ TS error: 'email' is not in keyof { name, age }

// Generic React component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage ?? 'No items'}</p>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}

// TS tự infer T = User
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>
```

### Utility Types

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user';
}

// Partial<T> — tất cả fields optional
type UpdateUser = Partial<User>;
// { id?: string; name?: string; email?: string; ... }

// Required<T> — tất cả fields required
type RequiredUser = Required<Partial<User>>;

// Pick<T, K> — chọn fields
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string }

// Omit<T, K> — loại bỏ fields
type CreateUser = Omit<User, 'id'>;
// { name: string; email: string; age: number; role: 'admin' | 'user' }

// Record<K, V> — object type với key và value type
type UserRoles = Record<string, 'admin' | 'user'>;
// { [key: string]: 'admin' | 'user' }

// ReturnType<T> — lấy return type của function
function createUser() {
  return { id: '1', name: 'An', email: 'an@mail.com' };
}
type CreatedUser = ReturnType<typeof createUser>;
// { id: string; name: string; email: string }

// Parameters<T> — lấy parameter types
type CreateUserParams = Parameters<typeof createUser>;
// []

// Awaited<T> — unwrap Promise type
type UserData = Awaited<ReturnType<typeof fetchUser>>;
// User (unwrapped từ Promise<User>)

// Readonly<T> — tất cả fields readonly
type ImmutableUser = Readonly<User>;
```

### Discriminated Unions & Type Narrowing

```tsx
// Discriminated union — pattern cực kỳ quan trọng
type ApiResponse<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string; retryable: boolean };

function handleResponse(response: ApiResponse<User[]>) {
  switch (response.status) {
    case 'idle':
      return <p>Ready to search</p>;
    case 'loading':
      return <Spinner />;
    case 'success':
      // TS biết response.data tồn tại ở đây
      return <UserList users={response.data} />;
    case 'error':
      // TS biết response.error và response.retryable tồn tại ở đây
      return (
        <div>
          <p>Error: {response.error}</p>
          {response.retryable && <button>Retry</button>}
        </div>
      );
  }
}

// Custom type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof (value as User).id === 'string'
  );
}

// Sử dụng
const data: unknown = await fetchSomething();
if (isUser(data)) {
  console.log(data.name); // TS biết data là User
}
```

> Ref: https://www.typescriptlang.org/docs/handbook/
> Ref: https://www.totaltypescript.com/tutorials

---

## 2.9 Testing Cơ bản

```tsx
// Vitest config — vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});

// setup.ts
import '@testing-library/jest-dom';

// ===== Unit test — utility function =====
// utils/formatPrice.ts
export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

// utils/formatPrice.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats cents to USD string', () => {
    expect(formatPrice(1999)).toBe('$19.99');
  });
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
  it('supports different currencies', () => {
    expect(formatPrice(1000, 'EUR')).toBe('€10.00');
  });
});

// ===== Component test — React Testing Library =====
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock API
vi.mock('@/services/productService', () => ({
  searchProducts: vi.fn(),
}));

import { searchProducts } from '@/services/productService';
import SearchPage from './SearchPage';

describe('SearchPage', () => {
  it('searches and displays results', async () => {
    const user = userEvent.setup();

    // Arrange: mock API response
    (searchProducts as any).mockResolvedValue([
      { id: '1', name: 'React Book', price: 29.99 },
    ]);

    render(<SearchPage />);

    // Act: type and search
    await user.type(screen.getByRole('searchbox'), 'react');
    await user.click(screen.getByRole('button', { name: /search/i }));

    // Assert: results appear
    await waitFor(() => {
      expect(screen.getByText('React Book')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });
  });

  it('shows empty state when no results', async () => {
    const user = userEvent.setup();
    (searchProducts as any).mockResolvedValue([]);

    render(<SearchPage />);
    await user.type(screen.getByRole('searchbox'), 'xyz');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/no results/i)).toBeInTheDocument();
    });
  });
});

// ===== Test custom hook =====
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments and decrements', () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current.count).toBe(0);

    act(() => result.current.increment());
    expect(result.current.count).toBe(1);

    act(() => result.current.decrement());
    expect(result.current.count).toBe(0);
  });
});
```

> Ref: https://vitest.dev/guide/
> Ref: https://testing-library.com/docs/react-testing-library/intro/

---

## 2.10 Accessibility (a11y)

```tsx
// ARIA roles và attributes
<button aria-label="Close dialog" aria-pressed={isActive}>
  <XIcon aria-hidden="true" /> {/* Icon decorative, ẩn khỏi screen reader */}
</button>

// Live regions — thông báo cho screen reader
<div aria-live="polite" aria-atomic="true">
  {notification && <p>{notification}</p>} {/* Screen reader đọc khi nội dung thay đổi */}
</div>

// Focus management trong Modal
function Modal({ isOpen, onClose, children }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-focus close button khi mở modal
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  // Trap focus bên trong modal
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();

      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;

        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={modalRef}>
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button ref={closeRef} onClick={onClose}>Close</button>
    </div>
  );
}

// prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// CSS: @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
```

> Ref: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
> Ref: https://www.w3.org/WAI/ARIA/apg/patterns/

---
---

# PHASE 3: ADVANCED (Senior Level) — Chi tiết

## 3.1 React Internals

### Fiber Architecture

React Fiber là cơ chế reconciliation được viết lại từ React 16. Nó cho phép React chia nhỏ công việc render thành các đơn vị nhỏ (fibers) và có thể tạm dừng, tiếp tục, hoặc hủy bỏ công việc.

Mỗi React element tương ứng với một **fiber node** chứa thông tin về component type, props, state, và các pointer tới parent/child/sibling fibers (cấu trúc linked list).

**Rendering có 2 phase:**

1. **Render Phase** (có thể bị interrupted): React đi qua fiber tree, so sánh virtual DOM cũ và mới (diffing), tìm ra những thay đổi cần áp dụng. Phase này **không** có side effects — chỉ tính toán.

2. **Commit Phase** (không thể interrupted): React áp dụng tất cả changes lên DOM thực. Đây là lúc `useLayoutEffect` chạy (đồng bộ), rồi `useEffect` chạy (bất đồng bộ, sau paint).

```
setState() called
    ↓
[Render Phase] — Có thể bị pause/abort
  → Xây dựng work-in-progress fiber tree
  → So sánh (diff) với current fiber tree
  → Đánh dấu fibers cần update
    ↓
[Commit Phase] — Không thể bị interrupt
  → Apply DOM mutations
  → Run useLayoutEffect (sync)
  → Browser paints
  → Run useEffect (async)
```

### Reconciliation Algorithm — Quy tắc Diffing

React so sánh 2 trees với 2 assumptions để giảm complexity từ O(n³) xuống O(n):

1. **Khác type → unmount cả subtree**: Nếu element type thay đổi (ví dụ `<div>` → `<span>`, hoặc `<ComponentA>` → `<ComponentB>`), React sẽ unmount toàn bộ cây cũ và mount cây mới. Mọi state bên trong bị mất.

2. **Key prop xác định identity**: Khi render list, React dùng `key` để xác định element nào là "cùng một item". Nếu key thay đổi → element đó bị unmount/remount.

```tsx
// Ứng dụng thực tế của key:

// 1. Force remount component khi data thay đổi
// Khi userId thay đổi, toàn bộ Profile component bị unmount rồi mount lại
// → reset tất cả internal state (form data, scroll position, etc.)
<Profile key={userId} userId={userId} />

// 2. Tại sao KHÔNG dùng index làm key khi list có thể thay đổi thứ tự
const items = ['A', 'B', 'C'];
// Nếu xóa 'B', list thành ['A', 'C']
// Dùng index: key 0='A', key 1='C' → React nghĩ item key=1 thay đổi từ 'B' thành 'C'
// Dùng id: key='a'='A', key='c'='C' → React biết chỉ xóa key='b'

// 3. Swap animation trick
const [items, setItems] = useState([
  { id: 'x', value: 'Hello' },
  { id: 'y', value: 'World' },
]);
// Đổi thứ tự → React chỉ move DOM nodes, không recreate
```

### Batching & Concurrent Features

```tsx
// React 18+: Automatic batching — gộp nhiều setState thành 1 re-render
function handleClick() {
  setCount(c => c + 1);   // không re-render
  setFlag(f => !f);        // không re-render
  setName('An');           // không re-render
  // → React batch tất cả, chỉ 1 re-render
}

// Thậm chí trong async code (khác React 17)
async function handleSubmit() {
  const data = await fetchData();
  setCount(data.count);    // không re-render
  setItems(data.items);    // không re-render
  // → 1 re-render
}

// flushSync — force re-render ngay lập tức (escape hatch)
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1);
  }); // DOM đã update tại đây
  // Đọc DOM ngay sau setCount
  console.log(document.getElementById('count')?.textContent);
}

// startTransition — đánh dấu update là non-urgent
import { startTransition, useState } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('home');

  function switchTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab); // non-urgent: nếu user click tab khác, React có thể abort
    });
  }
  // Khác useTransition: startTransition không có isPending, dùng được ngoài component
}
```

### Hydration

Hydration là quá trình React "attach" event listeners và state vào HTML đã được render sẵn trên server (SSR).

```tsx
// Hydration mismatch — lỗi phổ biến nhất
// Server render: <p>Thời gian: 10:30 AM</p>
// Client hydrate: <p>Thời gian: 10:31 AM</p> (1 phút sau)
// → React warning: Text content mismatch

// Cách fix 1: suppressHydrationWarning
<p suppressHydrationWarning>{new Date().toLocaleTimeString()}</p>

// Cách fix 2: chỉ render trên client
function ClientOnlyTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  if (!time) return <p>Loading...</p>; // server render
  return <p>{time}</p>; // client render
}

// Cách fix 3: useSyncExternalStore (React cung cấp)
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,   // client
    () => false    // server
  );
}

// Selective Hydration (React 18) — hydrate theo priority
// Khi user interact với một phần chưa hydrate, React ưu tiên hydrate phần đó trước
<Suspense fallback={<Skeleton />}>
  <HeavyComponent /> {/* Hydrate khi ready, hoặc ưu tiên nếu user click */}
</Suspense>
```

> Ref: https://react.dev/reference/react-dom/client/hydrateRoot
> Ref: https://github.com/acdlite/react-fiber-architecture

---

## 3.2 Design Patterns Nâng cao

### Compound Components

Pattern này cho phép tạo component API linh hoạt, trong đó parent và children chia sẻ state ngầm qua Context.

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// ===== Accordion component sử dụng Compound Components =====

// 1. Context cho shared state
type AccordionContextType = {
  openItems: Set<string>;
  toggle: (id: string) => void;
  multiple: boolean;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion components must be used within <Accordion>');
  return ctx;
}

// 2. Root component
interface AccordionProps {
  children: ReactNode;
  multiple?: boolean; // cho phép mở nhiều items cùng lúc
  defaultOpen?: string[];
}

function Accordion({ children, multiple = false, defaultOpen = [] }: AccordionProps) {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear(); // single mode: close others
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle, multiple }}>
      <div role="region">{children}</div>
    </AccordionContext.Provider>
  );
}

// 3. Sub-components
function AccordionItem({ id, children }: { id: string; children: ReactNode }) {
  return <div data-accordion-item={id}>{children}</div>;
}

function AccordionTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { openItems, toggle } = useAccordion();
  const isOpen = openItems.has(id);

  return (
    <button
      onClick={() => toggle(id)}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${id}`}
    >
      {children}
      <ChevronIcon className={isOpen ? 'rotate-180' : ''} />
    </button>
  );
}

function AccordionContent({ id, children }: { id: string; children: ReactNode }) {
  const { openItems } = useAccordion();
  const isOpen = openItems.has(id);

  if (!isOpen) return null;
  return (
    <div id={`accordion-content-${id}`} role="region">
      {children}
    </div>
  );
}

// 4. Attach sub-components
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

// 5. Sử dụng — API cực kỳ linh hoạt
<Accordion multiple defaultOpen={['faq-1']}>
  <Accordion.Item id="faq-1">
    <Accordion.Trigger id="faq-1">What is React?</Accordion.Trigger>
    <Accordion.Content id="faq-1">
      React is a JavaScript library...
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item id="faq-2">
    <Accordion.Trigger id="faq-2">What is Next.js?</Accordion.Trigger>
    <Accordion.Content id="faq-2">
      Next.js is a React framework...
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### State Machine Pattern

```tsx
// Sử dụng useReducer như state machine
// Đảm bảo component chỉ có thể ở các trạng thái hợp lệ

type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; fetchedAt: Date }
  | { status: 'error'; error: Error; retryCount: number };

type FetchAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; data: T }
  | { type: 'FETCH_ERROR'; error: Error }
  | { type: 'RESET' };

function fetchReducer<T>(state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
  switch (state.status) {
    case 'idle':
      // Từ idle chỉ có thể chuyển sang loading
      if (action.type === 'FETCH_START') return { status: 'loading' };
      return state;

    case 'loading':
      // Từ loading có thể chuyển sang success hoặc error
      if (action.type === 'FETCH_SUCCESS')
        return { status: 'success', data: action.data, fetchedAt: new Date() };
      if (action.type === 'FETCH_ERROR')
        return { status: 'error', error: action.error, retryCount: 0 };
      return state;

    case 'success':
      // Từ success có thể fetch lại hoặc reset
      if (action.type === 'FETCH_START') return { status: 'loading' };
      if (action.type === 'RESET') return { status: 'idle' };
      return state;

    case 'error':
      // Từ error có thể retry hoặc reset
      if (action.type === 'FETCH_START') return { status: 'loading' };
      if (action.type === 'RESET') return { status: 'idle' };
      return state;

    default:
      return state;
  }
}

// Hook sử dụng state machine
function useFetch<T>(fetchFn: () => Promise<T>) {
  const [state, dispatch] = useReducer(fetchReducer<T>, { status: 'idle' });

  const execute = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchFn();
      dispatch({ type: 'FETCH_SUCCESS', data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', error: err as Error });
    }
  }, [fetchFn]);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return { state, execute, reset };
}
```

### Render Props & Inversion of Control

```tsx
// Render Props — truyền function để consumer quyết định render gì
interface MouseTrackerProps {
  children: (position: { x: number; y: number }) => React.ReactNode;
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return <>{children(position)}</>;
}

// Consumer quyết định render gì
<MouseTracker>
  {({ x, y }) => <div>Mouse: ({x}, {y})</div>}
</MouseTracker>

<MouseTracker>
  {({ x, y }) => (
    <div
      style={{
        position: 'fixed',
        left: x - 25,
        top: y - 25,
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: 'red',
      }}
    />
  )}
</MouseTracker>
```

### Adapter Pattern — Wrap Third-Party Libraries

```tsx
// Vấn đề: bạn dùng thư viện analytics, nếu đổi thư viện phải sửa 50 files
// Giải pháp: tạo adapter layer

// services/analytics/types.ts
interface AnalyticsProvider {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (name: string) => void;
}

// services/analytics/mixpanelAdapter.ts
import mixpanel from 'mixpanel-browser';

export const mixpanelAdapter: AnalyticsProvider = {
  track: (event, properties) => mixpanel.track(event, properties),
  identify: (userId, traits) => {
    mixpanel.identify(userId);
    if (traits) mixpanel.people.set(traits);
  },
  page: (name) => mixpanel.track('Page View', { page: name }),
};

// services/analytics/index.ts
// Đổi provider chỉ cần thay 1 dòng ở đây
import { mixpanelAdapter } from './mixpanelAdapter';
export const analytics: AnalyticsProvider = mixpanelAdapter;

// Sử dụng ở khắp nơi — không phụ thuộc vào Mixpanel
import { analytics } from '@/services/analytics';
analytics.track('Purchase', { amount: 99.99 });
```

> Ref: https://www.patterns.dev/react
> Ref: https://react.dev/learn/passing-data-deeply-with-context

---

## 3.3 Architecture & Project Structure

### Feature-based Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── features/                     # Feature modules — đây là phần quan trọng nhất
│   ├── auth/
│   │   ├── components/           # UI components chỉ dùng cho auth
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── hooks/                # Hooks chỉ dùng cho auth
│   │   │   └── useAuth.ts
│   │   ├── services/             # API calls cho auth
│   │   │   └── authService.ts
│   │   ├── stores/               # State cho auth
│   │   │   └── authStore.ts
│   │   ├── schemas/              # Validation schemas
│   │   │   └── loginSchema.ts
│   │   ├── types/                # Types cho auth
│   │   │   └── index.ts
│   │   └── index.ts              # Public API — chỉ export những gì feature khác cần
│   │
│   ├── products/
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductFilter.tsx
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   └── useProductFilter.ts
│   │   ├── services/
│   │   │   └── productService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── cart/
│       ├── components/
│       ├── hooks/
│       ├── stores/
│       └── index.ts
│
├── shared/                       # Shared across features
│   ├── components/               # UI primitives: Button, Input, Modal, etc.
│   │   ├── ui/                   # Shadcn/ui components
│   │   └── layout/               # Layout components: Header, Footer, Sidebar
│   ├── hooks/                    # Generic hooks: useDebounce, useMediaQuery
│   ├── lib/                      # Utilities: cn(), formatDate(), etc.
│   ├── types/                    # Shared types
│   └── config/                   # App config, constants
│
├── services/                     # Infrastructure services
│   ├── api/                      # API client setup (Axios instance, fetch wrapper)
│   │   └── client.ts
│   ├── analytics/                # Analytics adapter
│   └── storage/                  # Storage adapter
│
└── styles/                       # Global styles
    └── globals.css
```

**Nguyên tắc quan trọng:**
- Feature modules là **self-contained**: chứa mọi thứ cần thiết
- `index.ts` là **public API**: feature khác chỉ import từ `index.ts`, không import file sâu bên trong
- Shared chỉ chứa thứ **thực sự dùng chung** (ít nhất 2 features)
- Feature A **không import trực tiếp** từ bên trong feature B, chỉ qua public API

### Barrel Exports

```tsx
// features/products/index.ts — Public API
// Chỉ export những gì feature khác cần
export { ProductCard } from './components/ProductCard';
export { ProductList } from './components/ProductList';
export { useProducts } from './hooks/useProducts';
export type { Product, ProductFilter } from './types';

// ❌ KHÔNG export internal implementation
// export { productService } from './services/productService';
// export { formatProductPrice } from './utils/formatProductPrice';

// Import từ feature khác:
// ✅ import { ProductCard } from '@/features/products';
// ❌ import { ProductCard } from '@/features/products/components/ProductCard';
```

**Khi nào KHÔNG dùng barrel exports:** Khi barrel file re-export quá nhiều modules, bundler có thể không tree-shake tốt, khiến bundle lớn hơn. Trong trường hợp đó, import trực tiếp hoặc dùng Vite/Turbopack có hỗ trợ tốt hơn.

> Ref: https://feature-sliced.design/ (Feature-Sliced Design methodology)
> Ref: https://www.joshwcomeau.com/react/file-structure/

---

## 3.4 TypeScript Nâng cao

```tsx
// ===== Conditional Types =====
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false

// Practical: extract return type nếu là Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type X = UnwrapPromise<Promise<string>>; // string
type Y = UnwrapPromise<number>; // number

// ===== Mapped Types =====
// Tạo type mới bằng cách transform từng property
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }

// Deep Partial — làm tất cả nested fields optional
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// ===== Template Literal Types =====
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type APIRoute = `/api/${string}`;
type Endpoint = `${HTTPMethod} ${APIRoute}`;
// 'GET /api/...' | 'POST /api/...' | ...

// Event handler type generation
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// ===== Branded Types =====
// Ngăn nhầm lẫn giữa các types có cùng underlying type
type UserId = string & { readonly __brand: unique symbol };
type OrderId = string & { readonly __brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}
function createOrderId(id: string): OrderId {
  return id as OrderId;
}

function getUser(id: UserId) { /* ... */ }

const userId = createUserId('u123');
const orderId = createOrderId('o456');

getUser(userId);  // ✅
// getUser(orderId); // ❌ Type error! OrderId is not assignable to UserId

// ===== Exhaustive Check =====
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default:
      // Nếu thêm shape mới mà quên handle ở đây → TS compile error
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// ===== Satisfies Operator =====
// Validate type WITHOUT widening — giữ nguyên narrow type
const routes = {
  home: '/',
  about: '/about',
  blog: '/blog',
} satisfies Record<string, string>;

// routes.home có type '/' (literal), không phải string
// Nếu dùng `: Record<string, string>` thì routes.home sẽ là string

// ===== Builder Pattern với TypeScript =====
class QueryBuilder<Selected extends string = never> {
  private query: any = {};

  select<F extends string>(field: F): QueryBuilder<Selected | F> {
    this.query.select = [...(this.query.select || []), field];
    return this as any;
  }

  where(condition: Partial<Record<Selected, any>>): this {
    this.query.where = condition;
    return this;
  }

  build() {
    return this.query;
  }
}

new QueryBuilder()
  .select('name')
  .select('email')
  .where({ name: 'An' })   // ✅ 'name' was selected
  // .where({ age: 25 })    // ❌ 'age' was not selected

// ===== Module Augmentation =====
// Mở rộng type của thư viện bên ngoài
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'user';
    } & DefaultSession['user'];
  }
}
```

> Ref: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
> Ref: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html

---

## 3.5 Next.js Nâng cao

### 4 Layers of Caching

Next.js App Router có 4 tầng caching. Hiểu chúng là chìa khóa để debug và optimize.

```
Request → Router Cache (client) → Full Route Cache (server) → Data Cache (server) → Origin

1. Request Memoization (per-request, server only)
   - Tự động dedupe cùng một fetch() trong cùng 1 render pass
   - Ví dụ: Layout và Page đều gọi getUser() → chỉ fetch 1 lần
   - Chỉ áp dụng cho GET requests trong React component tree

2. Data Cache (persistent, server)
   - fetch() results được cache trên server
   - Persist across deployments (trừ khi revalidate)
   - Control: cache: 'force-cache' | 'no-store', next: { revalidate: N }

3. Full Route Cache (persistent, server)
   - HTML + RSC Payload của static routes được cache tại build time
   - Dynamic routes (cookies(), headers(), searchParams) KHÔNG cache
   - Invalidate khi: revalidatePath, revalidateTag, redeploy

4. Router Cache (in-memory, client)
   - RSC payload của visited routes được cache trong browser memory
   - Prefetched routes cũng cached
   - Duration: session-based, hoặc 30s cho dynamic, 5min cho static
   - router.refresh() invalidate toàn bộ Router Cache
```

```tsx
// Control caching

// Static (default) — cached tại build time
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  // Equivalent: cache: 'force-cache'
  return res.json();
}

// ISR — revalidate sau N giây
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // revalidate mỗi giờ
  });
  return res.json();
}

// Dynamic — luôn fetch mới
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    cache: 'no-store',
  });
  return res.json();
}

// Tag-based revalidation
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { tags: ['products'] },
  });
  return res.json();
}

// Server Action — on-demand revalidation
'use server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function createProduct(data: FormData) {
  await db.product.create({ ... });
  revalidateTag('products');       // invalidate tất cả fetch có tag 'products'
  revalidatePath('/products');     // invalidate route cache cho /products
}
```

### Middleware Nâng cao

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Authentication
  const token = request.cookies.get('session')?.value;
  if (pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. A/B Testing
  const bucket = request.cookies.get('ab-bucket')?.value;
  if (pathname === '/pricing' && !bucket) {
    const variant = Math.random() > 0.5 ? 'a' : 'b';
    const response = NextResponse.rewrite(new URL(`/pricing/${variant}`, request.url));
    response.cookies.set('ab-bucket', variant, { maxAge: 60 * 60 * 24 * 30 });
    return response;
  }

  // 3. Rate Limiting (simple)
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  // Kiểm tra rate limit từ Redis/KV store...

  // 4. Geo Routing
  const country = request.geo?.country ?? 'US';
  if (pathname === '/' && country === 'VN') {
    return NextResponse.rewrite(new URL('/vi', request.url));
  }

  // 5. Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
```

### Dynamic OG Images

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Blog post image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'Inter',
          padding: 60,
        }}
      >
        <h1 style={{ fontSize: 60, textAlign: 'center' }}>{post.title}</h1>
        <p style={{ fontSize: 28, opacity: 0.8 }}>{post.description}</p>
      </div>
    ),
    { ...size }
  );
}
```

> Ref: https://nextjs.org/docs/app/building-your-application/caching
> Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware
> Ref: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

---

## 3.6 Performance Optimization Nâng cao

### Core Web Vitals — Cách đo và cải thiện

```tsx
// Đo Web Vitals trong Next.js
// app/components/WebVitals.tsx
'use client';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Gửi lên analytics
    console.log(metric.name, metric.value);
    // metric.name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
    analytics.track('Web Vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    });
  });
  return null;
}
```

**LCP (Largest Contentful Paint) — Target: < 2.5s:**
- Optimize hero image: `<Image priority>`, preload, đúng format (WebP/AVIF)
- Minimize server response time (TTFB)
- Tránh render-blocking resources: inline critical CSS, defer non-critical JS
- Preconnect to required origins: `<link rel="preconnect">`

**INP (Interaction to Next Paint) — Target: < 200ms:**
- Tránh long tasks (>50ms) trên main thread
- Dùng `startTransition` cho non-urgent updates
- `useDeferredValue` cho heavy renders
- Web Workers cho CPU-intensive tasks
- Virtualization cho long lists

**CLS (Cumulative Layout Shift) — Target: < 0.1:**
- Luôn set `width` và `height` cho images/videos
- Dùng `next/image` (tự quản lý dimensions)
- `font-display: swap` + `next/font` (tránh layout shift khi font load)
- Tránh inject content phía trên existing content

### Virtualization

```tsx
// Render 100,000 items mà không lag
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // chiều cao ước tính mỗi item (px)
    overscan: 5, // render thêm 5 items trên/dưới viewport
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Bundle Analysis & Optimization

```tsx
// next.config.js — setup bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({ /* config */ });

// Chạy: ANALYZE=true npm run build

// Dynamic import — chỉ load khi cần
import dynamic from 'next/dynamic';

// Component nặng → lazy load
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  loading: () => <Skeleton height={400} />,
  ssr: false, // không cần render trên server
});

// Conditional import — chỉ load library khi cần
async function handleExport() {
  const { jsPDF } = await import('jspdf'); // chỉ load khi user click Export
  const doc = new jsPDF();
  doc.text('Hello', 10, 10);
  doc.save('report.pdf');
}

// Tree shaking — import chính xác cái cần
// ❌ import _ from 'lodash'; // import toàn bộ ~70KB
// ✅ import groupBy from 'lodash/groupBy'; // chỉ import function cần (~2KB)

// ✅ Named import với thư viện hỗ trợ tree shaking
import { format } from 'date-fns'; // chỉ bundle function format
```

> Ref: https://web.dev/articles/vitals
> Ref: https://nextjs.org/docs/app/building-your-application/optimizing
> Ref: https://tanstack.com/virtual/latest

---

## 3.7 Testing Nâng cao

### MSW — Mock Service Worker

MSW intercept network requests ở layer network, không phải mock module. Nghĩa là code application chạy y như production, chỉ khác responses.

```tsx
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock GET /api/products
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    const products = [
      { id: '1', name: 'Laptop', category: 'electronics', price: 999 },
      { id: '2', name: 'T-Shirt', category: 'clothing', price: 29 },
    ];

    const filtered = category
      ? products.filter((p) => p.category === category)
      : products;

    return HttpResponse.json(filtered);
  }),

  // Mock POST /api/products
  http.post('/api/products', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: 'new-id', ...body },
      { status: 201 }
    );
  }),

  // Mock error
  http.get('/api/products/:id', ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ id: params.id, name: 'Product' });
  }),
];

// mocks/server.ts — cho test environment
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);

// test/setup.ts
import { server } from '@/mocks/server';
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test sử dụng MSW — không cần mock bất kỳ module nào
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

test('shows error when API fails', async () => {
  // Override handler cho test case này
  server.use(
    http.get('/api/products', () => {
      return HttpResponse.json(null, { status: 500 });
    })
  );

  render(<ProductList />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### E2E Testing với Playwright

```tsx
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry', // capture trace cho failed tests
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});

// e2e/product-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login trước mỗi test
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('can create and view a product', async ({ page }) => {
    // Navigate
    await page.goto('/products/new');

    // Fill form
    await page.getByLabel('Product name').fill('Test Product');
    await page.getByLabel('Price').fill('49.99');
    await page.getByLabel('Category').selectOption('electronics');

    // Submit
    await page.getByRole('button', { name: 'Create' }).click();

    // Verify redirect and success
    await expect(page).toHaveURL(/\/products\/[\w-]+/);
    await expect(page.getByRole('heading')).toHaveText('Test Product');
    await expect(page.getByText('$49.99')).toBeVisible();
  });

  test('shows validation errors', async ({ page }) => {
    await page.goto('/products/new');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText('Tên sản phẩm là bắt buộc')).toBeVisible();
    await expect(page.getByText('Giá phải > 0')).toBeVisible();
  });
});

// Page Object Model — tách logic tương tác ra class riêng
class ProductPage {
  constructor(private page: Page) {}

  async goto(id: string) {
    await this.page.goto(`/products/${id}`);
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to Cart' }).click();
  }

  async getPrice() {
    return this.page.getByTestId('product-price').textContent();
  }
}

test('add product to cart', async ({ page }) => {
  const productPage = new ProductPage(page);
  await productPage.goto('product-123');
  await productPage.addToCart();
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

> Ref: https://mswjs.io/docs/
> Ref: https://playwright.dev/docs/intro

---

## 3.8 Error Handling & Resilience

```tsx
// ===== Error Boundary với react-error-boundary =====
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 border border-red-500 rounded">
      <h2>Something went wrong</h2>
      <pre className="text-sm">{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Granular boundaries — mỗi section có error boundary riêng
function Dashboard() {
  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RevenueChart /> {/* Nếu lỗi, chỉ section này hiện error */}
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RecentOrders /> {/* Section khác vẫn hoạt động bình thường */}
      </ErrorBoundary>
    </div>
  );
}

// Log error lên Sentry
function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        Sentry.captureException(error, {
          extra: { componentStack: info.componentStack },
        });
      }}
      onReset={() => {
        // Reset app state nếu cần
        queryClient.clear();
      }}
    >
      <AppContent />
    </ErrorBoundary>
  );
}

// ===== Retry with Exponential Backoff =====
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelay?: number } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const delay = baseDelay * Math.pow(2, attempt); // 1s, 2s, 4s
      const jitter = delay * 0.1 * Math.random(); // add randomness
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }
  throw new Error('Unreachable');
}

// Sử dụng
const data = await fetchWithRetry(() => fetch('/api/data').then((r) => r.json()), {
  maxRetries: 3,
  baseDelay: 500,
});

// ===== Network Status Detection =====
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

function App() {
  const isOnline = useNetworkStatus();
  if (!isOnline) {
    return <OfflineBanner message="You are offline. Changes will be synced when reconnected." />;
  }
  return <AppContent />;
}
```

> Ref: https://github.com/bvaughn/react-error-boundary
> Ref: https://docs.sentry.io/platforms/javascript/guides/react/

---

## 3.9 Security

```tsx
// ===== XSS Prevention =====
// React tự escape JSX content, nhưng dangerouslySetInnerHTML KHÔNG escape

// ❌ Nguy hiểm — cho phép chạy script
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Nếu phải render HTML từ user (rich text editor), sanitize trước
import DOMPurify from 'dompurify';

function SafeHTML({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// ===== Environment Variables =====
// NEXT_PUBLIC_ prefix → EXPOSED to browser (public)
// Không có prefix → SERVER ONLY (secret)

// .env.local
// DATABASE_URL=postgresql://...          ← server only, KHÔNG bao giờ leak ra client
// NEXT_PUBLIC_API_URL=https://api.com    ← ok, public

// ❌ NEVER: NEXT_PUBLIC_DATABASE_URL, NEXT_PUBLIC_SECRET_KEY

// ===== Input Validation =====
// LUÔN validate cả server-side, KHÔNG BAO GIỜ tin client
// Server Action
'use server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1).max(1000),
});

export async function submitContact(formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { error: 'Invalid input' }; // Không expose chi tiết validation cho client
  }

  // Process...
}

// ===== Authentication Pattern với NextAuth =====
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        const isValid = await compare(credentials.password, user.hashedPassword);
        if (!isValid) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
});

// Protected Server Component
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/unauthorized');

  return <AdminDashboard user={session.user} />;
}
```

> Ref: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
> Ref: https://authjs.dev/getting-started/installation
> Ref: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

---

## 3.10 CI/CD & DevOps

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      # Parallel quality checks
      - name: Type Check
        run: pnpm tsc --noEmit

      - name: Lint
        run: pnpm eslint . --max-warnings 0

      - name: Unit & Integration Tests
        run: pnpm vitest run --coverage

      - name: Build
        run: pnpm build

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps

      - name: Run E2E Tests
        run: pnpm exec playwright test

      - name: Upload Playwright Report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

```dockerfile
# Dockerfile — Multi-stage build cho Next.js
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm && pnpm build

# Production image — minimal
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

> Ref: https://nextjs.org/docs/app/building-your-application/deploying
> Ref: https://docs.github.com/en/actions

---

## 3.11 API Design & tRPC

### tRPC — End-to-End Type Safety

tRPC cho phép gọi server functions từ client với full type safety, không cần generate code hay viết API routes.

```tsx
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<{ session: Session | null }>().create();

// Middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { session: ctx.session } }); // narrow type
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const router = t.router;

// server/routers/product.ts
export const productRouter = router({
  list: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const products = await db.product.findMany({
        where: input.category ? { category: input.category } : undefined,
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });
      const total = await db.product.count();
      return { products, total, page: input.page };
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      price: z.number().positive(),
      category: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.product.create({
        data: { ...input, createdBy: ctx.session.user.id },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.product.delete({ where: { id: input.id } });
      return { success: true };
    }),
});

// server/routers/index.ts
export const appRouter = router({
  product: productRouter,
  user: userRouter,
});
export type AppRouter = typeof appRouter;

// Client-side usage — fully typed!
import { trpc } from '@/lib/trpc';

function ProductList() {
  // ✅ Full autocomplete: trpc.product.list.useQuery
  // ✅ Input validated by Zod
  // ✅ Return type inferred from server
  const { data, isLoading } = trpc.product.list.useQuery({
    category: 'electronics',
    page: 1,
  });

  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate(); // type-safe invalidation
    },
  });

  return (
    <div>
      {data?.products.map((p) => (
        <div key={p.id}>{p.name} - ${p.price}</div>
      ))}
      <button
        onClick={() => createMutation.mutate({ name: 'New', price: 99, category: 'electronics' })}
      >
        Create
      </button>
    </div>
  );
}
```

> Ref: https://trpc.io/docs
> Ref: https://trpc.io/docs/client/react

---

## 3.12 Database & ORM

### Prisma

```tsx
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id          String   @id @default(cuid())
  title       String
  content     String?
  published   Boolean  @default(false)
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId    String
  categories  Category[]
  createdAt   DateTime @default(now())

  @@index([authorId])
  @@index([published, createdAt])
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

model Profile {
  id     String @id @default(cuid())
  bio    String?
  user   User   @relation(fields: [userId], references: [id])
  userId String @unique
}

enum Role {
  USER
  ADMIN
}

// lib/db.ts — singleton pattern cho Prisma client
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Queries
// Tìm user với relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    profile: true,
  },
});

// Transaction — đảm bảo tất cả operations thành công hoặc tất cả rollback
const result = await prisma.$transaction(async (tx) => {
  const post = await tx.post.create({
    data: { title: 'New Post', authorId: userId },
  });

  await tx.user.update({
    where: { id: userId },
    data: { postCount: { increment: 1 } },
  });

  return post;
});

// Pagination
async function getPaginatedPosts(page: number, limit: number) {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count(),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
```

> Ref: https://www.prisma.io/docs
> Ref: https://orm.drizzle.team/docs/overview

---

## 3.13 Observability & Monitoring

```tsx
// ===== Sentry Setup =====
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,        // sample 10% transactions (production)
  replaysSessionSampleRate: 0.1, // session replay for 10% sessions
  replaysOnErrorSampleRate: 1.0, // always replay on error
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],
});

// Capture custom error với context
try {
  await processPayment(orderId);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'payments', orderId },
    extra: { userId: session.user.id, amount: order.total },
    level: 'error',
  });
  throw error; // re-throw to error boundary
}

// Breadcrumbs — track user journey before error
Sentry.addBreadcrumb({
  category: 'ui',
  message: 'User clicked checkout button',
  level: 'info',
});

// ===== Structured Logging =====
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  // Trong production, output JSON để dễ parse bởi log aggregators (DataDog, etc.)
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
});

// Sử dụng
logger.info({ userId, action: 'login' }, 'User logged in');
logger.error({ err, orderId }, 'Payment processing failed');
logger.warn({ remainingQuota: 5 }, 'API quota running low');
```

> Ref: https://docs.sentry.io/platforms/javascript/guides/nextjs/
> Ref: https://getpino.io/

---
---

# PHASE 4: SENIOR MINDSET & SOFT SKILLS

## 4.1 Code Quality & Standards

**ESLint Custom Rules:**

Senior thiết lập coding standards cho cả team, không chỉ follow rules có sẵn:

```js
// .eslintrc.js
module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    // Enforce import order
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
      'newlines-between': 'always',
    }],
    // Không cho phép console.log trong production code
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Enforce naming convention
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'interface', format: ['PascalCase'] },
      { selector: 'typeAlias', format: ['PascalCase'] },
    ],
  },
};
```

**ADR (Architecture Decision Records):**

Ghi lại quyết định kiến trúc và lý do. Khi member mới join team và hỏi "tại sao dùng Zustand mà không dùng Redux?", thay vì giải thích lại, point họ tới ADR.

```markdown
# ADR-003: Chọn Zustand cho state management

## Status: Accepted
## Date: 2024-03-15

## Context
App cần global state cho cart, user preferences, notifications.
Team có 5 frontend devs, 2 junior.

## Decision
Dùng Zustand thay vì Redux Toolkit.

## Consequences
**Pros:**
- API đơn giản, junior ramp-up nhanh (<1 ngày)
- Bundle size nhỏ (~1KB vs ~11KB RTK)
- Không cần Provider wrapper
- TypeScript inference tốt hơn

**Cons:**
- Ít middleware ecosystem hơn Redux
- Không có Redux DevTools integration built-in (cần middleware)
- Team members có kinh nghiệm Redux cần adapt

## Alternatives Considered
- Redux Toolkit: quá nhiều boilerplate cho scope hiện tại
- Context API: performance concerns với frequent updates
- Jotai: atomic model phù hợp nhưng team chưa familiar
```

## 4.2 Technical Decision Making

**Trade-off Matrix** — Khi phải chọn giữa nhiều options:

```
Ví dụ: Chọn styling solution

                    | Tailwind | CSS Modules | Styled-Components
--------------------|----------|-------------|-------------------
Performance         |    ✅    |     ✅      |       ❌ (runtime)
DX (Dev Experience) |    ✅    |     ⚠️      |       ✅
Bundle Size         |    ✅    |     ✅      |       ❌
Learning Curve      |    ⚠️    |     ✅      |       ⚠️
Server Components   |    ✅    |     ✅      |       ❌
Team Familiarity    |    ✅    |     ✅      |       ⚠️
--------------------|----------|-------------|-------------------
DECISION:             Tailwind (best overall for our constraints)
```

## 4.3 Mentoring & Code Review

**Code Review không chỉ là tìm bug:**

```
Hierarchy of code review feedback (theo priority):

1. CORRECTNESS: Logic sai? Bug tiềm ẩn? Edge cases?
2. SECURITY: XSS? SQL injection? Exposed secrets?
3. PERFORMANCE: N+1 queries? Unnecessary re-renders? Bundle impact?
4. ARCHITECTURE: Coupling? Separation of concerns? Scalability?
5. READABILITY: Clear naming? Comments where needed? Cognitive complexity?
6. STYLE: Nit-picks — formatting, import order (should be automated)

Senior review ≠ "LGTM" hay nitpick semicolons.
Senior review = "Cách này hoạt động, nhưng nếu dùng pattern X sẽ dễ extend hơn khi requirement Y thay đổi"
```

**Mentoring Junior/Mid:**

Không fix code cho họ. Hỏi câu hỏi dẫn dắt:
- "Nếu list có 10,000 items thì sao?" (performance thinking)
- "Nếu API trả về error thì component này hiển thị gì?" (error handling)
- "User khác cần component tương tự nhưng khác layout thì sao?" (reusability)
- "6 tháng sau đọc lại code này, bạn có hiểu ngay không?" (readability)

## 4.4 Problem Solving Approach

**Debugging Complex Issues — Systematic Approach:**

```
1. REPRODUCE: Tìm cách reproduce bug consistently
2. ISOLATE: Thu hẹp phạm vi (file nào? function nào? line nào?)
   - Binary search: comment nửa code, bug còn không?
   - Git bisect: tìm commit gây ra bug
3. UNDERSTAND: Hiểu ROOT CAUSE, không chỉ symptom
4. FIX: Fix root cause, không fix symptom
5. VERIFY: Viết test reproduce bug → fix → test pass
6. PREVENT: Tại sao bug lọt qua? Cần thêm test? Lint rule?
```

**Postmortem Template (sau incident):**

```markdown
## Incident: Checkout page crash on mobile - 2024-03-20

### Timeline
- 14:00 — Deploy v2.3.1 to production
- 14:15 — Sentry alerts spike: 500 errors on /checkout
- 14:20 — Confirmed: iOS Safari < 16 crash do optional chaining trong CSS
- 14:30 — Rollback to v2.3.0
- 14:35 — Errors resolved

### Root Cause
CSS `@container` query used without fallback. iOS Safari < 16 doesn't support it.

### Impact
~200 users affected (15 min × ~13 users/min on mobile checkout)

### Action Items
- [ ] Add browserslist check to CI (prevent unsupported CSS)
- [ ] Add Playwright test on WebKit
- [ ] Set up Sentry alert for error rate > 1% within 5 min
```

> Ref: https://adr.github.io/
> Ref: https://google.github.io/eng-practices/review/

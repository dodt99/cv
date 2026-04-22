"use client";

import { useState, CSSProperties } from "react";

const topics = [
  {
    id: "code-splitting",
    icon: "⚡",
    tag: "BUNDLING",
    title: "Code Splitting & Dynamic Import",
    level: "Core",
    color: "#2563EB",
    qa: [
      {
        q: "Code splitting là gì và tại sao nó quan trọng?",
        a: `Code splitting là kỹ thuật chia bundle JS thành nhiều chunks nhỏ hơn, chỉ load khi cần thiết thay vì load toàn bộ app ngay từ đầu.

Vấn đề: Nếu không split, user phải download 2-3MB JS trước khi thấy bất kỳ nội dung gì → TTI (Time to Interactive) rất cao.

React hỗ trợ qua React.lazy() + Suspense:
\`\`\`jsx
// ❌ Static import - luôn load ngay
import HeavyDashboard from './HeavyDashboard';

// ✅ Dynamic import - chỉ load khi cần
const HeavyDashboard = React.lazy(() => import('./HeavyDashboard'));

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyDashboard />
    </Suspense>
  );
}
\`\`\``,
        tags: ["Webpack", "Vite", "React.lazy", "Suspense"],
      },
      {
        q: "Route-based vs Component-based splitting - khi nào dùng cái nào?",
        a: `Route-based splitting: Tách theo page/route - đây là low-hanging fruit, nên làm mặc định. Mỗi page là 1 chunk riêng.

Component-based splitting: Tách component nặng (rich text editor, chart library, map, PDF viewer...).

Rule of thumb để quyết định có nên split không:
- Component > 30KB gzipped? → Split
- Chỉ hiển thị sau user interaction (modal, tooltip)? → Split  
- Chỉ dùng ở một số route cụ thể? → Split
- Above the fold / critical render path? → KHÔNG split (tránh waterfall)

⚠️ Trade-off thường bị bỏ qua:
Quá nhiều small chunks → nhiều HTTP requests → network overhead.
Với HTTP/2, nhiều request nhỏ ít bị penalize hơn, nhưng vẫn có overhead của connection setup và parse/compile time.`,
        tags: ["Route splitting", "Chunk strategy", "HTTP/2"],
      },
      {
        q: "Preloading vs Prefetching chunks - kỹ thuật nâng cao?",
        a: `Vấn đề với lazy loading đơn thuần: User click → network request → delay → render. UX không tốt.

Giải pháp: Load trước khi user cần.

\`\`\`jsx
// Prefetch on hover - pattern phổ biến
function NavItem({ to, component: LazyComponent }) {
  const handleMouseEnter = () => {
    // Trigger prefetch
    import('./HeavyPage'); // Webpack ghi nhớ, không load lại
  };
  
  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      Dashboard
    </Link>
  );
}

// Webpack magic comments
const Chart = lazy(() => 
  import(/* webpackPrefetch: true */ './Chart')
  // webpackPreload: true → <link rel="preload"> - load với priority cao
  // webpackPrefetch: true → <link rel="prefetch"> - load khi browser idle
);
\`\`\`

Preload: tài nguyên cần trong request hiện tại (critical)
Prefetch: tài nguyên cần trong navigation tiếp theo (speculative)`,
        tags: ["Prefetch", "Preload", "Webpack magic comments"],
      },
    ],
  },
  {
    id: "lazy-loading",
    icon: "🦥",
    tag: "LOADING",
    title: "Lazy Loading (Images, Components, Data)",
    level: "Core",
    color: "#16A34A",
    qa: [
      {
        q: "Intersection Observer API và tại sao nó thay thế scroll event?",
        a: `Scroll event approach cũ: chạy trên main thread, fire rất nhiều lần, tốn CPU.

Intersection Observer: chạy async, không block main thread, browser tối ưu nội bộ.

\`\`\`jsx
function useLazyLoad(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Unobserve sau khi đã load
        }
      },
      { threshold, rootMargin: '200px' } // Load trước 200px
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}
\`\`\`

rootMargin: '200px' → bắt đầu load khi element còn cách viewport 200px → tránh flicker khi scroll.`,
        tags: ["IntersectionObserver", "useRef", "useEffect"],
      },
      {
        q: "Image lazy loading - native vs custom, và các kỹ thuật nâng cao?",
        a: `Native: \`<img loading="lazy" />\` - đủ dùng cho hầu hết cases, browser tự handle.

Nâng cao hơn với BlurHash / LQIP (Low Quality Image Placeholder):
\`\`\`jsx
function ProgressiveImage({ src, blurHash, alt }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Placeholder blur - load ngay, rất nhỏ (~30 bytes) */}
      <canvas 
        ref={drawBlurHash(blurHash)} 
        style={{ opacity: loaded ? 0 : 1, transition: 'opacity 0.3s' }}
      />
      {/* Actual image */}
      <img
        src={src}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
        alt={alt}
      />
    </div>
  );
}
\`\`\`

Best practices:
- Luôn set width/height để tránh CLS (Cumulative Layout Shift)
- Dùng srcset + sizes cho responsive images
- WebP/AVIF thay JPEG/PNG (tiết kiệm 30-80% size)
- Above-the-fold images: loading="eager" + fetchpriority="high"`,
        tags: ["CLS", "LQIP", "BlurHash", "WebP", "srcset"],
      },
      {
        q: "Virtualization cho large lists - khi nào cần, implement thế nào?",
        a: `Vấn đề: Render 10,000 DOM nodes → browser tắc, scroll lag, memory cao.

Virtualization: Chỉ render những items đang trong viewport (~10-20 items), còn lại là "virtual".

\`\`\`jsx
import { FixedSizeList } from 'react-window';

// react-window cho fixed-height items
function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={items.length}
      itemSize={72} // height mỗi row
    >
      {({ index, style }) => (
        <div style={style}> {/* style bắt buộc - chứa position absolute */}
          <ListItem data={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
\`\`\`

react-window vs react-virtualized:
- react-window: Nhẹ hơn (~6KB), API đơn giản hơn, đủ cho 95% cases
- react-virtualized: Nhiều features hơn (masonry, table...) nhưng ~30KB

TanStack Virtual: headless, flexible nhất, recommended cho projects mới.

Khi nào cần virtualize: > 200 items với DOM phức tạp, hoặc > 500 items bất kể loại gì.`,
        tags: [
          "react-window",
          "TanStack Virtual",
          "DOM nodes",
          "scroll performance",
        ],
      },
    ],
  },
  {
    id: "rendering-strategies",
    icon: "🏗️",
    tag: "ARCHITECTURE",
    title: "SSR vs CSR vs SSG vs ISR — Trade-offs",
    level: "Architecture",
    color: "#DC2626",
    qa: [
      {
        q: "Giải thích từng rendering strategy và use cases phù hợp?",
        a: `CSR (Client-Side Rendering):
Browser download empty HTML → download JS → JS fetch data → render
✅ SPA, dashboards, apps sau login, real-time data
❌ SEO kém, slow FCP, blank screen flicker

SSR (Server-Side Rendering):
Server render HTML đầy đủ per-request → gửi về client
✅ SEO critical pages, personalized content, real-time data
❌ Server cost cao, TTFB chậm hơn SSG, infrastructure phức tạp

SSG (Static Site Generation):
Build time → generate HTML files → serve từ CDN
✅ Blog, docs, marketing pages, content ít thay đổi
❌ Rebuild khi data thay đổi, không personalize được

ISR (Incremental Static Regeneration) - Next.js specific:
SSG + background revalidation sau N seconds
✅ E-commerce (product pages), news sites
❌ Stale data trong window revalidation, complex invalidation

\`\`\`jsx
// Next.js ISR
export async function getStaticProps() {
  const data = await fetchProducts();
  return {
    props: { data },
    revalidate: 60, // Revalidate sau 60s
  };
}
\`\`\``,
        tags: ["FCP", "TTFB", "SEO", "CDN", "Next.js"],
      },
      {
        q: "React Server Components (RSC) khác SSR thế nào?",
        a: `Đây là câu senior hay bị nhầm!

SSR (traditional): Server render HTML → client download JS → hydrate (attach event listeners). 
Vấn đề: phải ship ALL component code xuống client dù component đó không có interactivity.

RSC: Component chạy ONLY trên server, không ship JS xuống client, không hydrate.
\`\`\`jsx
// Server Component - chạy trên server, 0KB JS sent to client
async function ProductList() {
  const products = await db.query('SELECT * FROM products'); // Direct DB access!
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// Client Component - cần interactivity
'use client';
function AddToCart({ productId }) {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Add ({count})</button>;
}
\`\`\`

RSC Mental model: 
- Default → Server Component (no JS shipped)
- Cần useState/useEffect/event handlers → 'use client'
- Ưu điểm lớn: Direct database/filesystem access, smaller bundle, better security`,
        tags: ["RSC", "Hydration", "Server Components", "Next.js App Router"],
      },
      {
        q: "Streaming SSR là gì và nó giải quyết vấn đề gì của SSR truyền thống?",
        a: `Traditional SSR waterfall:
1. Server fetch ALL data (e.g., user + products + reviews)
2. Server render toàn bộ HTML
3. Send về client
→ TTFB = thời gian fetch data chậm nhất

Streaming SSR (React 18 + Next.js 13+):
Server gửi HTML theo chunks khi ready, không đợi tất cả data.

\`\`\`jsx
// Next.js App Router streaming với Suspense
export default function Page() {
  return (
    <div>
      {/* Render ngay lập tức */}
      <Header />
      
      {/* Stream khi ready */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList /> {/* Async Server Component */}
      </Suspense>
      
      {/* Stream độc lập */}
      <Suspense fallback={<ReviewSkeleton />}>
        <Reviews /> {/* Fetch riêng, không block nhau */}
      </Suspense>
    </div>
  );
}
\`\`\`

Result: User thấy UI ngay lập tức, từng phần pop in khi data ready.
FCP giảm đáng kể, perceived performance tốt hơn nhiều.`,
        tags: ["Streaming", "Suspense", "App Router", "FCP", "TTFB"],
      },
    ],
  },
  {
    id: "caching",
    icon: "💾",
    tag: "CACHING",
    title: "Caching Strategy (HTTP + Client + Server)",
    level: "Advanced",
    color: "#CA8A04",
    qa: [
      {
        q: "HTTP Caching headers - Cache-Control deep dive?",
        a: `Cache-Control là header quan trọng nhất, hiểu đúng sẽ tiết kiệm rất nhiều bandwidth.

\`\`\`
# Static assets (có content hash trong filename)
Cache-Control: public, max-age=31536000, immutable
# immutable: browser không cần revalidate ngay cả khi reload

# HTML pages
Cache-Control: no-cache
# no-cache ≠ no-store! no-cache = phải revalidate với server trước khi dùng

# API responses
Cache-Control: private, max-age=300
# private: chỉ browser cache, không CDN cache
\`\`\`

ETag + If-None-Match flow:
1. Server gửi response + ETag: "abc123"
2. Browser cache response
3. Next request: If-None-Match: "abc123"
4. Server: data thay đổi → 200 + data mới | không thay đổi → 304 Not Modified (0 bytes!)

Stale-While-Revalidate:
\`\`\`
Cache-Control: max-age=60, stale-while-revalidate=600
\`\`\`
→ 0-60s: serve cache ngay
→ 60-660s: serve stale cache ĐỒNG THỜI revalidate background
→ >660s: fetch mới
→ User không bao giờ thấy loading!`,
        tags: ["Cache-Control", "ETag", "stale-while-revalidate", "CDN"],
      },
      {
        q: "TanStack Query caching mechanism - tại sao nó thay thế được Redux cho server state?",
        a: `Mental model quan trọng: Server state ≠ Client state.

Client state: UI state, form state, theme, selected items → Redux/Zustand phù hợp
Server state: API data → cần cache, refetch, deduplicate → TanStack Query

TanStack Query cache hoạt động thế nào:
\`\`\`jsx
// Cache key = ['products', { category: 'phones', page: 1 }]
const { data, isLoading, isFetching } = useQuery({
  queryKey: ['products', { category, page }],
  queryFn: () => api.getProducts({ category, page }),
  staleTime: 5 * 60 * 1000,  // 5 phút: không refetch nếu data còn "fresh"
  gcTime: 10 * 60 * 1000,    // 10 phút: xóa cache nếu không có component nào dùng
});

// Prefetch khi hover
const queryClient = useQueryClient();
const prefetch = () => {
  queryClient.prefetchQuery({
    queryKey: ['products', { category: 'phones', page: 2 }],
    queryFn: ...,
  });
};
\`\`\`

Điểm mạnh:
- Background refetch (isFetching = đang refetch, isLoading = chưa có data lần nào)
- Request deduplication (100 components dùng cùng query → 1 request)
- Automatic garbage collection
- Optimistic updates built-in`,
        tags: ["TanStack Query", "staleTime", "gcTime", "Server state"],
      },
      {
        q: "Service Worker caching và offline-first strategy?",
        a: `Service Worker ngồi giữa browser và network, intercept mọi request.

Các caching strategies:
\`\`\`js
// 1. Cache First (offline-first) - static assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => 
      cached || fetch(event.request)
    )
  );
});

// 2. Network First - API calls, fresh data
// Thử network trước, fallback cache nếu offline

// 3. Stale While Revalidate - news, social feed
// Serve cache ngay, update cache từ network ngầm
\`\`\`

Workbox (Google) làm việc này dễ hơn nhiều:
\`\`\`js
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({ cacheName: 'api-cache' })
);
\`\`\`

Trong Next.js: next-pwa tích hợp sẵn, config trong next.config.js.`,
        tags: ["Service Worker", "PWA", "Workbox", "Offline-first"],
      },
    ],
  },
  {
    id: "bundle-optimization",
    icon: "📦",
    tag: "BUILD",
    title: "Bundle Optimization & Tree Shaking",
    level: "Advanced",
    color: "#EA580C",
    qa: [
      {
        q: "Tree shaking hoạt động thế nào và tại sao đôi khi nó fail?",
        a: `Tree shaking = dead code elimination dựa trên static ES module analysis.

Điều kiện để tree shaking work:
1. ES Modules (import/export) - không phải CommonJS (require)
2. Side-effect free modules
3. Production build (mode: 'production')

\`\`\`js
// ✅ Tree-shakeable - chỉ import những gì dùng
import { debounce } from 'lodash-es'; // ES module version

// ❌ Import cả library - tree shaking fail
import _ from 'lodash'; // CommonJS, không tree-shake được
import { debounce } from 'lodash'; // CJS bundle

// package.json của library cần có:
{
  "sideEffects": false, // Cho bundler biết có thể safely remove unused exports
  // hoặc chỉ định files có side effects:
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
\`\`\`

Lý do tree shaking fail phổ biến:
- Import từ index.js barrel files → bundler không sure gì được export
- Dynamic imports với template literals
- Library dùng CommonJS
- Circular dependencies`,
        tags: ["ES Modules", "Dead code", "sideEffects", "Webpack"],
      },
      {
        q: "Bundle analysis và cách identify + fix bloat?",
        a: `Tools phân tích bundle:
- webpack-bundle-analyzer: visual treemap
- vite-bundle-visualizer / rollup-plugin-visualizer
- bundlephobia.com: check package size trước khi install

\`\`\`bash
# Webpack
npx webpack-bundle-analyzer stats.json

# Vite
npx vite-bundle-visualizer
\`\`\`

Red flags khi analyze:
1. Same package nhiều versions (dependency hell)
2. moment.js (67KB gzipped) → thay bằng date-fns/dayjs
3. lodash full bundle → lodash-es + tree shaking
4. Toàn bộ icon library khi chỉ dùng 3 icons

Pattern: Barrel file problem
\`\`\`js
// ❌ Barrel import - có thể import cả library
import { Button, Input } from '@mui/material';

// ✅ Deep import - tree shaking chắc chắn work
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
\`\`\`

Targets thực tế:
- Initial JS bundle < 170KB gzipped (Google's recommendation)
- Dùng Performance Budget trong CI/CD để catch regressions sớm`,
        tags: [
          "Bundle analyzer",
          "Barrel files",
          "moment.js",
          "Performance budget",
        ],
      },
      {
        q: "Module Federation cho Micro-frontends - overview?",
        a: `Module Federation (Webpack 5): Cho phép runtime sharing code giữa các apps riêng biệt.

Use case: Công ty lớn có nhiều teams, mỗi team deploy independently.

\`\`\`js
// Host app webpack.config.js
new ModuleFederationPlugin({
  remotes: {
    checkout: 'checkout@https://checkout.app/remoteEntry.js',
    catalog: 'catalog@https://catalog.app/remoteEntry.js',
  },
  shared: ['react', 'react-dom'], // Tránh duplicate React
})

// Dùng trong host:
const CheckoutPage = lazy(() => import('checkout/CheckoutPage'));
\`\`\`

Trade-offs cần biết:
✅ Independent deployments, team autonomy
✅ Share common dependencies (react, design system)
❌ Runtime failures thay vì build-time (harder to catch)
❌ Version mismatches phức tạp
❌ Debugging cross-app issues khó hơn
❌ Network dependency (remoteEntry.js phải available)

Khi nào NÊN dùng: Org có 5+ teams, apps > 100K LOC, deploy cadence khác nhau.
Khi nào KHÔNG nên: Small team, monorepo với Turborepo là đủ và đơn giản hơn nhiều.`,
        tags: [
          "Webpack 5",
          "Micro-frontends",
          "Module Federation",
          "Runtime sharing",
        ],
      },
    ],
  },
  {
    id: "rendering-perf",
    icon: "🚀",
    tag: "RUNTIME",
    title: "Runtime Rendering Performance",
    level: "Advanced",
    color: "#9333EA",
    qa: [
      {
        q: "useMemo vs useCallback vs React.memo - khi nào thực sự cần?",
        a: `Câu này nhiều senior trả lời sai! Memoization không phải free - có overhead của comparison.

React.memo: Wrap component, skip re-render nếu props không thay đổi (shallow comparison).
\`\`\`jsx
// Chỉ hữu ích nếu:
// 1. Component render expensive (heavy computation, large DOM)
// 2. Re-render thường xuyên với SAME props
const ExpensiveChart = React.memo(({ data, config }) => {
  // Expensive rendering logic
});
\`\`\`

useCallback: Memoize function reference.
\`\`\`jsx
// ❌ Không cần thiết - onClick được recreate mỗi render
// nhưng <button> không re-render vì native element
const handleClick = useCallback(() => doSomething(), []);
<button onClick={handleClick}>Click</button>

// ✅ Cần thiết - onClick là dependency của useEffect hoặc truyền vào React.memo child
const handleSearch = useCallback((query) => {
  fetchData(query);
}, [fetchData]); // Stable reference cho React.memo component
\`\`\`

useMemo: Memoize computed value.
\`\`\`jsx
// ✅ Worth it - expensive computation
const sortedAndFiltered = useMemo(() => 
  largeArray.filter(item => item.active).sort(comparator),
  [largeArray, comparator]
);

// ❌ Not worth it - trivial operation
const doubled = useMemo(() => count * 2, [count]); // Overhead > benefit
\`\`\`

Golden rule: Profile first, optimize second. Đừng premature optimize.`,
        tags: ["React.memo", "useCallback", "useMemo", "Profiling"],
      },
      {
        q: "useTransition và useDeferredValue - concurrent React thực tế?",
        a: `React 18 Concurrent Features giải quyết: UI bị blocked khi update expensive state.

useTransition: Mark update là non-urgent.
\`\`\`jsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // Urgent: update input ngay lập tức (user thấy typing)
    setQuery(e.target.value);
    
    // Non-urgent: React có thể interrupt nếu có update khẩn cấp hơn
    startTransition(() => {
      setResults(expensiveSearch(e.target.value));
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
\`\`\`

useDeferredValue: Tương tự nhưng cho values từ props/external.
\`\`\`jsx
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lag behind query khi đang transition
  // Component render với giá trị cũ, không block UI
  const results = expensiveSearch(deferredQuery);
  return <List results={results} />;
}
\`\`\`

Khác nhau: useTransition wrap setState, useDeferredValue wrap giá trị nhận vào.`,
        tags: [
          "Concurrent React",
          "useTransition",
          "useDeferredValue",
          "React 18",
        ],
      },
    ],
  },
  {
    id: "web-vitals",
    icon: "📊",
    tag: "METRICS",
    title: "Core Web Vitals & Measurement",
    level: "Production",
    color: "#DC2626",
    qa: [
      {
        q: "Core Web Vitals là gì và cách optimize từng metric?",
        a: `3 metrics chính Google dùng để rank:

LCP (Largest Contentful Paint) — Loading performance
Target: < 2.5s | Đo: Thời gian render element lớn nhất (hero image, H1...)
Fix:
- Preload hero image: <link rel="preload" as="image" href="hero.webp">
- Dùng CDN cho static assets
- Optimize server response time (TTFB < 600ms)
- Loại bỏ render-blocking resources

FID/INP (Interaction to Next Paint) — Interactivity  
Target: INP < 200ms | Đo: Độ trễ khi user click/type/tap
Fix:
- Break long tasks (> 50ms) thành smaller chunks
- Dùng Web Workers cho heavy computation
- Lazy load non-critical JS
- useTransition cho expensive updates

CLS (Cumulative Layout Shift) — Visual stability
Target: < 0.1 | Đo: Tổng unexpected layout shifts
Fix:
- Luôn set width/height cho img/video
- Reserve space cho dynamic content (ads, embeds)
- Tránh inject content above existing content
- font-display: optional hoặc swap với size-adjust

Đo thực tế:
\`\`\`js
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(({ value, rating }) => {
  analytics.track('LCP', { value, rating }); // 'good'|'needs-improvement'|'poor'
});
\`\`\``,
        tags: ["LCP", "INP", "CLS", "Google ranking", "web-vitals"],
      },
      {
        q: "Performance monitoring trong production - setup thế nào?",
        a: `Real User Monitoring (RUM) vs Synthetic monitoring:
- Synthetic (Lighthouse, WebPageTest): controlled conditions, reproducible
- RUM: data thực từ users, diverse conditions, phản ánh reality

Setup RUM với web-vitals + custom analytics:
\`\`\`js
// utils/vitals.js
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id, rating }) {
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify({ name, value, id, rating,
      url: window.location.href,
      userAgent: navigator.userAgent,
    }),
    keepalive: true, // Đảm bảo gửi ngay cả khi user navigate away
  });
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
\`\`\`

Tools production:
- Vercel Analytics: tích hợp sẵn nếu dùng Vercel
- Datadog RUM, New Relic Browser
- Google Search Console: CWV data từ Chrome users
- Sentry Performance: kết hợp error tracking + performance

Performance budget trong CI:
\`\`\`js
// lighthouserc.js
module.exports = {
  assert: {
    assertions: {
      'categories:performance': ['error', { minScore: 0.9 }],
      'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
    }
  }
}
\`\`\``,
        tags: ["RUM", "Lighthouse", "Sentry", "Performance budget", "CI/CD"],
      },
    ],
  },
  {
    id: "network-optimization",
    icon: "🌐",
    tag: "NETWORK",
    title: "Network & Resource Optimization",
    level: "Advanced",
    color: "#0891B2",
    qa: [
      {
        q: "Resource hints - preload, prefetch, preconnect, dns-prefetch?",
        a: `Đây là low-hanging fruit nhưng ít người dùng đúng cách.

\`\`\`html
<!-- dns-prefetch: Resolve DNS trước - cheap, dùng cho third-party domains -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">

<!-- preconnect: DNS + TCP + TLS handshake - dùng cho critical third-party -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

<!-- preload: Tải resource với priority cao cho current page -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
<link rel="preload" as="font" href="/font.woff2" crossorigin>
<!-- ⚠️ Chỉ preload những gì THỰC SỰ dùng ngay - unused preload = warning -->

<!-- prefetch: Tải cho page tiếp theo khi browser idle -->
<link rel="prefetch" href="/next-page.js">
\`\`\`

fetchpriority attribute (mới, quan trọng):
\`\`\`html
<!-- Hero image - boost priority -->
<img src="hero.jpg" fetchpriority="high" loading="eager">

<!-- Below-fold images - lower priority -->
<img src="thumb.jpg" fetchpriority="low" loading="lazy">

<!-- Non-critical fetch -->
<script src="analytics.js" fetchpriority="low" async></script>
\`\`\`

Impact thực tế: Đặt preconnect đúng cho Google Fonts tiết kiệm ~100-200ms TTFB.`,
        tags: ["preload", "prefetch", "preconnect", "fetchpriority", "LCP"],
      },
      {
        q: "API optimization: GraphQL vs REST, data fetching patterns?",
        a: `Over-fetching vs Under-fetching:
- REST over-fetching: GET /users trả về 50 fields khi chỉ cần name, avatar
- REST under-fetching: Cần 3 requests để lấy user + posts + comments
- GraphQL: Client specify exactly what it needs

Nhưng GraphQL không phải silver bullet:
\`\`\`
REST ưu thế khi: Simple CRUD, caching dễ (HTTP cache), team nhỏ
GraphQL ưu thế khi: Complex data requirements, multiple clients (mobile/web), rapid iteration
\`\`\`

Data fetching patterns với React:
\`\`\`jsx
// ❌ Request waterfall - sequential
function UserProfile({ userId }) {
  const user = useFetch(\`/users/\${userId}\`);
  const posts = useFetch(\`/users/\${userId}/posts\`); // Chờ user xong mới fetch
}

// ✅ Parallel fetching
function UserProfile({ userId }) {
  const [user, posts] = await Promise.all([
    fetch(\`/users/\${userId}\`),
    fetch(\`/users/\${userId}/posts\`),
  ]);
}

// ✅ RSC approach - colocate data với component, parallel by default
async function UserProfile({ userId }) {
  const [user, posts] = await Promise.all([
    getUser(userId),
    getUserPosts(userId),
  ]);
}
\`\`\``,
        tags: ["GraphQL", "REST", "Request waterfall", "Promise.all", "RSC"],
      },
    ],
  },
];

const levelColors: Record<string, string> = {
  Core: "#2563EB",
  Architecture: "#DC2626",
  Advanced: "#9333EA",
  Production: "#EA580C",
};

export default function App() {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [expandedQA, setExpandedQA] = useState<Record<string, boolean>>({});

  const activeTopic = topics.find((t) => t.id === activeTopicId);

  const toggleQA = (topicId: string, qaIndex: number) => {
    const key = `${topicId}-${qaIndex}`;
    setExpandedQA((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.badge}>SENIOR FRONTEND INTERVIEW</div>
          <h1 style={styles.h1}>Frontend Performance</h1>
          <p style={styles.subtitle}>
            Deep-dive optimization techniques &amp; trade-offs
          </p>
          <div style={styles.statsRow}>
            {[
              { n: topics.length, label: "Topics" },
              {
                n: topics.reduce((a, t) => a + t.qa.length, 0),
                label: "Q&As",
              },
              { n: "∞", label: "Depth" },
            ].map(({ n, label }) => (
              <div key={label} style={styles.stat}>
                <span style={styles.statNum}>{n}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Topic Grid */}
        <div style={styles.grid}>
          {topics.map((topic) => (
            <button
              key={topic.id}
              style={{
                ...styles.card,
                ...(activeTopicId === topic.id ? styles.cardActive : {}),
              } as CSSProperties}
              onClick={() =>
                setActiveTopicId(activeTopicId === topic.id ? null : topic.id)
              }
            >
              <div style={styles.cardTop}>
                <span style={styles.cardTag}>{topic.tag}</span>
                <span
                  style={{
                    ...styles.cardLevel,
                    color: levelColors[topic.level],
                  }}
                >
                  {topic.level}
                </span>
              </div>
              <div style={styles.cardIcon}>{topic.icon}</div>
              <h3 style={styles.cardTitle}>{topic.title}</h3>
              <div style={styles.cardMeta}>
                {topic.qa.length} câu hỏi
                <span style={styles.cardArrow}>
                  {activeTopicId === topic.id ? "↑" : "↓"}
                </span>
              </div>
              <div
                style={{
                  ...styles.cardAccent,
                  background: topic.color,
                }}
              />
            </button>
          ))}
        </div>

        {/* Q&A Panel */}
        {activeTopic && (
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelIcon}>{activeTopic.icon}</span>
              <div>
                <div style={styles.panelTag}>{activeTopic.tag}</div>
                <h2 style={styles.panelTitle}>{activeTopic.title}</h2>
              </div>
            </div>

            <div style={styles.qaList}>
              {activeTopic.qa.map((item, i) => {
                const key = `${activeTopic.id}-${i}`;
                const isOpen = expandedQA[key];
                return (
                  <div key={i} style={styles.qaItem}>
                    <button
                      style={styles.qaQuestion}
                      onClick={() => toggleQA(activeTopic.id, i)}
                    >
                      <span style={styles.qaNum}>Q{i + 1}</span>
                      <span style={styles.qaQText}>{item.q}</span>
                      <span style={styles.qaToggle}>{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && (
                      <div style={styles.qaAnswer}>
                        <div style={styles.qaAnswerLabel}>▶ ANSWER</div>
                        <pre style={styles.answerText}>{item.a}</pre>
                        <div style={styles.tagRow}>
                          {item.tags.map((tag) => (
                            <span key={tag} style={styles.tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!activeTopicId && (
          <div style={styles.hint}>
            ↑ Chọn một topic để xem Q&amp;A chi tiết
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>
          💡 Senior dev không chỉ biết CÁCH DÙNG — phải hiểu TẠI SAO, KHI NÀO,
          và TRADE-OFFS
        </p>
      </footer>
    </div>
  );
}

// Design tokens - Light Theme
const tokens = {
  colors: {
    bg: {
      base: "#FFFFFF",
      elevated1: "#F9FAFB",
      elevated2: "#F3F4F6",
      elevated3: "#E5E7EB",
    },
    border: {
      base: "#E5E7EB",
      light: "#F3F4F6",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
      tertiary: "#6B7280",
      muted: "#9CA3AF",
      dim: "#D1D5DB",
    },
    accent: {
      primary: "#3B82F6",
      primaryAlpha: "rgba(59,130,246,0.4)",
      primaryAlphaLight: "rgba(59,130,246,0.2)",
      primaryAlphaXLight: "rgba(59,130,246,0.05)",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "40px",
    "5xl": "48px",
  },
  fontSize: {
    xs: "10px",
    sm: "11px",
    base: "12px",
    md: "13px",
    lg: "14px",
    xl: "18px",
    "2xl": "22px",
    "3xl": "28px",
    "4xl": "36px",
  },
  fontFamily: {
    mono: "'Courier New', Courier, monospace",
    serif: "Georgia, serif",
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0.05em",
    wide: "0.1em",
    wider: "0.15em",
    widest: "0.2em",
  },
  border: {
    width: "1px",
    radius: "0px",
  },
  transition: {
    fast: "0.2s",
  },
};

const styles: Record<string, CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: tokens.colors.bg.base,
    color: tokens.colors.text.primary,
    fontFamily: tokens.fontFamily.mono,
    position: "relative",
    overflowX: "hidden",
  },
  header: {
    position: "relative",
    zIndex: 1,
    borderBottom: `${tokens.border.width} solid ${tokens.colors.border.base}`,
    padding: `${tokens.spacing["5xl"]} ${tokens.spacing["2xl"]} ${tokens.spacing["4xl"]}`,
    textAlign: "center",
    background: `linear-gradient(180deg, ${tokens.colors.accent.primaryAlphaXLight} 0%, transparent 100%)`,
  },
  headerInner: {
    maxWidth: 800,
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    fontSize: tokens.fontSize.xs,
    letterSpacing: tokens.letterSpacing.widest,
    color: tokens.colors.accent.primary,
    border: `${tokens.border.width} solid ${tokens.colors.accent.primaryAlphaLight}`,
    padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
    marginBottom: tokens.spacing.xl,
    textTransform: "uppercase",
  },
  h1: {
    fontSize: "clamp(32px, 5vw, 56px)",
    fontWeight: 700,
    margin: `0 0 ${tokens.spacing.md}`,
    letterSpacing: tokens.letterSpacing.tight,
    fontFamily: tokens.fontFamily.serif,
    backgroundImage: "linear-gradient(135deg, #111827 0%, #4B5563 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: tokens.fontSize.lg,
    color: tokens.colors.text.tertiary,
    margin: `0 0 ${tokens.spacing["3xl"]}`,
    letterSpacing: tokens.letterSpacing.normal,
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: tokens.spacing["5xl"],
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNum: {
    fontSize: tokens.fontSize["3xl"],
    fontWeight: 700,
    color: tokens.colors.accent.primary,
    fontFamily: tokens.fontFamily.serif,
  },
  statLabel: {
    fontSize: tokens.fontSize.sm,
    color: tokens.colors.text.muted,
    letterSpacing: tokens.letterSpacing.wide,
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1100,
    margin: "0 auto",
    padding: `${tokens.spacing["4xl"]} ${tokens.spacing["2xl"]}`,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing["4xl"],
  },
  card: {
    position: "relative",
    background: tokens.colors.bg.elevated2,
    border: `${tokens.border.width} solid ${tokens.colors.border.base}`,
    padding: `${tokens.spacing.xl} ${tokens.spacing.xl} ${tokens.spacing["2xl"]}`,
    textAlign: "left",
    cursor: "pointer",
    transition: `all ${tokens.transition.fast}`,
    overflow: "hidden",
    outline: "none",
    color: tokens.colors.text.primary,
  },
  cardActive: {
    border: `${tokens.border.width} solid ${tokens.colors.accent.primaryAlpha}`,
    background: tokens.colors.bg.elevated3,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: tokens.spacing.lg,
  },
  cardTag: {
    fontSize: tokens.fontSize.xs,
    letterSpacing: tokens.letterSpacing.wider,
    color: tokens.colors.text.muted,
    textTransform: "uppercase",
  },
  cardLevel: {
    fontSize: tokens.fontSize.xs,
    letterSpacing: tokens.letterSpacing.wide,
    fontWeight: 700,
  },
  cardIcon: {
    fontSize: tokens.fontSize["3xl"],
    marginBottom: tokens.spacing.md,
  },
  cardTitle: {
    fontSize: tokens.fontSize.lg,
    fontWeight: 700,
    margin: `0 0 ${tokens.spacing.lg}`,
    lineHeight: 1.4,
    fontFamily: tokens.fontFamily.serif,
  },
  cardMeta: {
    fontSize: tokens.fontSize.base,
    color: tokens.colors.text.muted,
    display: "flex",
    justifyContent: "space-between",
  },
  cardArrow: {
    color: tokens.colors.accent.primary,
  },
  cardAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.6,
  },
  panel: {
    background: tokens.colors.bg.elevated1,
    border: `${tokens.border.width} solid ${tokens.colors.border.base}`,
    padding: tokens.spacing["3xl"],
    marginBottom: tokens.spacing["3xl"],
  },
  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing["3xl"],
    paddingBottom: tokens.spacing["2xl"],
    borderBottom: `${tokens.border.width} solid ${tokens.colors.border.base}`,
  },
  panelIcon: {
    fontSize: tokens.fontSize["4xl"],
  },
  panelTag: {
    fontSize: tokens.fontSize.xs,
    letterSpacing: tokens.letterSpacing.widest,
    color: tokens.colors.text.muted,
    marginBottom: tokens.spacing.xs,
  },
  panelTitle: {
    fontSize: tokens.fontSize["2xl"],
    fontWeight: 700,
    margin: 0,
    fontFamily: tokens.fontFamily.serif,
  },
  qaList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacing.md,
  },
  qaItem: {
    border: `${tokens.border.width} solid ${tokens.colors.border.light}`,
  },
  qaQuestion: {
    width: "100%",
    background: tokens.colors.bg.elevated2,
    border: "none",
    padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
    display: "flex",
    alignItems: "flex-start",
    gap: tokens.spacing.md,
    cursor: "pointer",
    color: tokens.colors.text.primary,
    textAlign: "left",
    fontFamily: tokens.fontFamily.mono,
  },
  qaNum: {
    fontSize: tokens.fontSize.sm,
    color: tokens.colors.accent.primary,
    fontWeight: 700,
    letterSpacing: tokens.letterSpacing.normal,
    flexShrink: 0,
    marginTop: 2,
  },
  qaQText: {
    fontSize: tokens.fontSize.lg,
    flex: 1,
    lineHeight: 1.5,
  },
  qaToggle: {
    fontSize: tokens.fontSize.xl,
    color: tokens.colors.text.muted,
    flexShrink: 0,
    lineHeight: 1,
  },
  qaAnswer: {
    background: tokens.colors.bg.base,
    padding: `${tokens.spacing.xl} ${tokens.spacing.xl} ${tokens.spacing.xl} 52px`,
    borderTop: `${tokens.border.width} solid ${tokens.colors.border.light}`,
  },
  qaAnswerLabel: {
    fontSize: tokens.fontSize.xs,
    color: tokens.colors.accent.primary,
    letterSpacing: tokens.letterSpacing.wider,
    marginBottom: tokens.spacing.md,
  },
  answerText: {
    fontSize: tokens.fontSize.md,
    lineHeight: 1.8,
    color: tokens.colors.text.secondary,
    whiteSpace: "pre-wrap",
    fontFamily: tokens.fontFamily.mono,
    margin: `0 0 ${tokens.spacing.lg}`,
    overflowX: "auto",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacing.sm,
  },
  tag: {
    fontSize: tokens.fontSize.xs,
    background: tokens.colors.border.light,
    color: tokens.colors.text.tertiary,
    padding: `3px ${tokens.spacing.sm}`,
    letterSpacing: tokens.letterSpacing.normal,
  },
  hint: {
    textAlign: "center",
    fontSize: tokens.fontSize.md,
    color: tokens.colors.text.dim,
    letterSpacing: tokens.letterSpacing.normal,
    padding: `${tokens.spacing.xl} 0`,
  },
  footer: {
    position: "relative",
    zIndex: 1,
    borderTop: `${tokens.border.width} solid ${tokens.colors.border.base}`,
    padding: tokens.spacing["2xl"],
    textAlign: "center",
    fontSize: tokens.fontSize.base,
    color: tokens.colors.text.dim,
    letterSpacing: tokens.letterSpacing.normal,
  },
};

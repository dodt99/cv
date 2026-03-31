"use client";

import { useState } from "react";

type QA = {
  q: string;
  a:
    | string
    | string[]
    | TableRow[]
    | { type: "table"; headers: string[]; rows: string[][] };
};
type TableRow = never;

type Section = {
  id: string;
  title: string;
  items: {
    q: string;
    a:
      | string
      | string[]
      | { type: "table"; headers: string[]; rows: string[][] };
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
    id: "questions-for-interviewer",
    title: "X. Câu hỏi ngược lại cho Interviewer",
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

function AnswerContent({
  answer,
}: {
  answer:
    | string
    | string[]
    | { type: "table"; headers: string[]; rows: string[][] };
}) {
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

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors"
      >
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
          {item.q}
        </span>
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
          items: s.items.filter(
            (item) =>
              item.q.toLowerCase().includes(search.toLowerCase()) ||
              (typeof item.a === "string" &&
                item.a.toLowerCase().includes(search.toLowerCase())) ||
              (Array.isArray(item.a) &&
                item.a.some((a) =>
                  a.toLowerCase().includes(search.toLowerCase())
                ))
          ),
        }))
        .filter((s) => s.items.length > 0)
    : sections;

  const totalQuestions = sections.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Interview Q&amp;A
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {totalQuestions} câu hỏi • {sections.length} sections
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

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-sm">
            D
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đinh Tiến Độ</h1>
            <p className="text-blue-600 font-medium text-sm mt-0.5">
              Frontend Developer
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "4+ years",
            "React / Next.js",
            "Real-time systems",
            "TypeScript",
          ].map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <section className="mb-6 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
          About
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Frontend Developer với hơn 4 năm kinh nghiệm xây dựng ứng dụng web
          scalable, high-performance. Chuyên sâu về React/Next.js, với kinh
          nghiệm thực tế ở nhiều domain: crypto trading (ONUS Labs), energy
          platform (FPT Software – LGCNS Korea), financial analytics (VNEXT –
          FiinGroup), và fullstack (AMELA Technology). Gần nhất contribute vào
          nền tảng giao dịch crypto Goonus.io phục vụ 7M+ users.
        </p>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Core Skills
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {[
            {
              category: "Frontend",
              color: "blue",
              items: ["React 19", "Next.js", "TypeScript", "Tailwind CSS"],
            },
            {
              category: "State & Data",
              color: "violet",
              items: ["React Query", "Zustand", "Redux Toolkit", "Jotai"],
            },
            {
              category: "Real-time",
              color: "emerald",
              items: ["WebSocket", "Socket.io", "TradingView", "SSE"],
            },
            {
              category: "Testing",
              color: "amber",
              items: ["Vitest", "RTL", "Playwright", "MSW"],
            },
            {
              category: "DevOps",
              color: "rose",
              items: ["GitHub Actions", "Docker", "AWS", "Vercel"],
            },
            {
              category: "Tools",
              color: "gray",
              items: ["Git", "Jira", "Figma", "OpenAPI"],
            },
          ].map((group) => (
            <div
              key={group.category}
              className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <p className="text-[11px] font-semibold text-blue-600 mb-2">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-1">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-[11px] bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work Experience */}
      <section className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Work Experience
        </p>
        <div className="space-y-2.5">
          {[
            {
              company: "ONUS Labs (Goonus.io)",
              role: "Frontend Developer",
              badge: "Most recent",
              badgeColor: "bg-green-50 text-green-700 border-green-100",
              highlights: [
                "Built trading interface for 7M+ users with real-time WebSocket market data",
                "Refactored data fetching with React Query — reduced API calls ~20-30%",
                "Applied React.memo, useMemo, throttle for high-frequency order book updates",
                "Collaborated with SEO team on SSR, metadata, sitemap, structured data",
              ],
            },
            {
              company: "FPT Software — LGCNS Korea",
              role: "Frontend Developer",
              badge: "",
              badgeColor: "",
              highlights: [
                "Led frontend for key modules of energy platform (Korean client)",
                "Mentored junior developers, conducted PR reviews",
                "Collaborated directly with Korean client via Jira, email, and meetings",
              ],
            },
            {
              company: "VNEXT — FiinGroup",
              role: "Frontend Developer",
              badge: "",
              badgeColor: "",
              highlights: [
                "Optimized financial analytics dashboard with thousands of rows and complex charts",
                "Applied virtualization (react-window) and memoization for large datasets",
              ],
            },
            {
              company: "AMELA Technology",
              role: "Fullstack Developer",
              badge: "",
              badgeColor: "",
              highlights: [
                "Setup CI/CD pipelines with GitHub Actions",
                "Deployed to AWS (EC2, S3) with Docker and Nginx",
              ],
            },
          ].map((job) => (
            <div
              key={job.company}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {job.company}
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">{job.role}</p>
                </div>
                {job.badge && (
                  <span
                    className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${job.badgeColor}`}
                  >
                    {job.badge}
                  </span>
                )}
              </div>
              <ul className="mt-2 space-y-1">
                {job.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-1.5 text-xs text-gray-500 leading-relaxed"
                  >
                    <span className="text-blue-400 shrink-0 mt-0.5">▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Quick nav cards */}
      <section>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Study Materials
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <a
            href="/study-roadmap"
            className="group p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors"
          >
            <p className="text-sm font-semibold">Study Roadmap</p>
            <p className="text-xs text-blue-200 mt-1">
              24-week plan: Mid → Senior
            </p>
          </a>
          <a
            href="/interview-qa"
            className="group p-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl border border-gray-200 shadow-sm transition-colors"
          >
            <p className="text-sm font-semibold">Interview Q&amp;A</p>
            <p className="text-xs text-gray-400 mt-1">
              11 sections · React & Next.js
            </p>
          </a>
          <a
            href="/angular"
            className="group p-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl border border-gray-200 shadow-sm transition-colors"
          >
            <p className="text-sm font-semibold">Angular</p>
            <p className="text-xs text-gray-400 mt-1">React → Angular guide</p>
          </a>
        </div>
      </section>
    </div>
  );
}

// This is the `children` slot — rendered by layout.tsx alongside @stats and @feed

export default function SlotsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Exercises
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          Next.js Slots (Parallel Routes)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Render multiple independent pages simultaneously in the same layout
        </p>
      </div>

      {/* Concept cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 mb-1">What it is</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Slots let a single layout render <strong>multiple pages at once</strong>.
            Each{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              @folder
            </code>{" "}
            is an independent route segment — its own{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              page.tsx
            </code>
            , loading state, and error boundary.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 mb-1">When to use</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Dashboards with independent panels, split-view UIs, and{" "}
            <strong>intercepting routes</strong> (modals that appear over a page
            without leaving it — e.g. photo lightboxes, login dialogs).
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 mb-1">Key benefit</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Each slot <strong>streams independently</strong>. If{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              @feed
            </code>{" "}
            is slow, it shows its own{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              loading.tsx
            </code>{" "}
            while{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              @stats
            </code>{" "}
            is already visible.
          </p>
        </div>
      </div>

      {/* File structure */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 font-mono">
            File structure for this demo
          </span>
        </div>
        <pre className="text-[12px] leading-relaxed font-mono p-4 text-gray-700 bg-white overflow-x-auto">{`app/exercises/slots/
├── layout.tsx          ← receives { children, stats, feed } as props
├── page.tsx            ← the "children" slot (this file)
│
├── @stats/
│   └── page.tsx        ← rendered as the "stats" prop in layout
│
└── @feed/
    └── page.tsx        ← rendered as the "feed" prop in layout`}</pre>
      </div>

      {/* layout.tsx code */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 font-mono">layout.tsx</span>
        </div>
        <pre className="text-[12px] leading-relaxed font-mono p-4 text-gray-700 bg-white overflow-x-auto">{`// Each @folder becomes a prop with the same name (without the @)
export default function SlotsLayout({
  children,   // ← from page.tsx (the "default" slot)
  stats,      // ← from @stats/page.tsx
  feed,       // ← from @feed/page.tsx
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  feed: React.ReactNode;
}) {
  return (
    <div>
      {children}                {/* main page content */}
      <div className="grid grid-cols-2 gap-4">
        {stats}                 {/* @stats panel */}
        {feed}                  {/* @feed panel */}
      </div>
    </div>
  );
}`}</pre>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-3">Rules to remember</p>
        <div className="space-y-2">
          {[
            [
              "@folder name = prop name",
              'A folder named @stats becomes the stats prop in layout. No @, no prop.',
            ],
            [
              "Slots are not URL segments",
              'The @stats folder does NOT create a /slots/@stats URL. The URL stays /exercises/slots.',
            ],
            [
              "Each slot can have loading.tsx / error.tsx",
              "Independent loading and error states — one slow slot won't block the others.",
            ],
            [
              "Unmatched slots need default.tsx",
              'When navigating away, Next.js needs a default.tsx fallback for unmatched slots so the layout can still render.',
            ],
          ].map(([title, desc]) => (
            <div key={title as string} className="flex gap-3 text-xs">
              <span className="shrink-0 text-blue-500 font-bold mt-0.5">→</span>
              <div>
                <span className="font-semibold text-gray-700">{title}: </span>
                <span className="text-gray-500">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intercepting routes teaser */}
      <div className="border-2 border-dashed border-amber-200 rounded-xl p-4 bg-amber-50/40">
        <p className="text-sm font-semibold text-amber-800 mb-1">
          Bonus: Intercepting Routes
        </p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Combine slots with intercepting routes (
          <code className="bg-amber-100 px-1 rounded font-mono">(..)</code> folders)
          to render a modal on top of the current page. Example: clicking a photo in
          a feed shows it in a modal without leaving the feed — but opening the URL
          directly shows the full photo page. This is how Vercel, Linear, and
          Vercel&apos;s dashboard handle their detail drawers.
        </p>
        <pre className="mt-3 text-[11px] font-mono text-gray-700 bg-white border border-amber-200 rounded-lg p-3 overflow-x-auto leading-relaxed">{`app/
├── feed/
│   └── page.tsx              ← /feed (the background page)
│
├── @modal/
│   ├── default.tsx           ← null (no modal by default)
│   └── (..photo)/
│       └── [id]/
│           └── page.tsx      ← intercepts /photo/[id] → shows as modal
│
└── photo/
    └── [id]/
        └── page.tsx          ← /photo/[id] (full page, direct navigation)`}</pre>
      </div>
    </div>
  );
}

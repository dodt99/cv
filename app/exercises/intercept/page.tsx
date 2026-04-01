import Link from "next/link";

export const PHOTOS = [
  { id: "1", title: "Mountain Sunrise", category: "Nature", from: "#f97316", to: "#fbbf24" },
  { id: "2", title: "Ocean Depths", category: "Nature", from: "#0ea5e9", to: "#6366f1" },
  { id: "3", title: "Desert Dunes", category: "Landscape", from: "#f59e0b", to: "#ef4444" },
  { id: "4", title: "Forest Mist", category: "Nature", from: "#22c55e", to: "#0ea5e9" },
  { id: "5", title: "City Lights", category: "Urban", from: "#8b5cf6", to: "#ec4899" },
  { id: "6", title: "Frozen Lake", category: "Winter", from: "#bae6fd", to: "#6366f1" },
  { id: "7", title: "Autumn Path", category: "Season", from: "#d97706", to: "#b45309" },
  { id: "8", title: "Coral Reef", category: "Ocean", from: "#f43f5e", to: "#f97316" },
  { id: "9", title: "Northern Lights", category: "Sky", from: "#4ade80", to: "#818cf8" },
];

export default function InterceptPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Exercises
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          Intercepting Routes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Click a photo to open it in a modal — or copy the URL and open it directly
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 mb-1">Click from gallery</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Next.js intercepts the navigation. The URL changes to{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              /photo/1
            </code>{" "}
            but the{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              @modal
            </code>{" "}
            slot renders a modal overlay instead of leaving the gallery.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 mb-1">Open URL directly</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            No interception happens. The full{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              photo/[id]/page.tsx
            </code>{" "}
            renders on its own — great for sharing links or refreshing the page.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 mb-1">The magic: (.) prefix</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Placing{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              @modal/(.)photo/[id]
            </code>{" "}
            tells Next.js: "when navigating to{" "}
            <code className="bg-gray-100 px-1 rounded font-mono text-[11px]">
              /photo/[id]
            </code>{" "}
            from this layout, show it in the modal slot."
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
          <span className="text-xs text-gray-400 font-mono">File structure</span>
        </div>
        <pre className="text-[12px] leading-relaxed font-mono p-4 text-gray-700 bg-white overflow-x-auto">{`app/exercises/intercept/
├── layout.tsx               ← { children, modal } — renders both simultaneously
├── page.tsx                 ← this gallery page (the "children" slot)
│
├── @modal/
│   ├── default.tsx          ← returns null when no photo is intercepted
│   └── (.)photo/            ← (.) = intercept at same level as this layout
│       └── [id]/
│           └── page.tsx     ← renders as a modal overlay
│
└── photo/                   ← real route — shown on direct URL access / refresh
    └── [id]/
        └── page.tsx         ← full standalone photo page`}</pre>
      </div>

      {/* Gallery */}
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Gallery — click any photo
      </p>
      <div className="grid grid-cols-3 gap-3">
        {PHOTOS.map((photo) => (
          <Link
            key={photo.id}
            href={`/exercises/intercept/photo/${photo.id}`}
            className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Gradient stand-in for a real image */}
            <div
              className="h-40 w-full"
              style={{ background: `linear-gradient(135deg, ${photo.from}, ${photo.to})` }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-xs font-semibold">{photo.title}</p>
              <p className="text-white/70 text-[10px]">{photo.category}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-6 flex items-start gap-2 text-xs text-gray-400">
        <span className="shrink-0 mt-0.5">💡</span>
        <p>
          After the modal opens, copy the URL and paste it in a new tab. You&apos;ll see
          the full photo page rendered directly — no modal, no gallery background.
          That&apos;s the key insight: same URL, different rendering depending on how you arrived.
        </p>
      </div>
    </div>
  );
}

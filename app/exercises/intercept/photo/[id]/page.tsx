import { use } from "react";
import Link from "next/link";
import { PHOTOS } from "@/app/exercises/intercept/page";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return PHOTOS.map((p) => ({ id: p.id }));
}

export default function PhotoFullPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const photo = PHOTOS.find((p) => p.id === id);
  if (!photo) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-bleed gradient header */}
      <div
        className="h-72 w-full relative"
        style={{ background: `linear-gradient(135deg, ${photo.from}, ${photo.to})` }}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
            {photo.category}
          </span>
          <h1 className="text-3xl font-bold text-white">{photo.title}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        {/* Explanation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-full uppercase tracking-wide">
              Full page — direct navigation
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            You&apos;re seeing this because you accessed{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[12px]">
              /exercises/intercept/photo/{photo.id}
            </code>{" "}
            directly — by refreshing, opening a shared link, or clicking{" "}
            &ldquo;Open full page&rdquo; from the modal.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            No interception happened, so Next.js rendered{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[12px]">
              photo/[id]/page.tsx
            </code>{" "}
            as a standalone page — same URL as the modal, completely different render path.
          </p>
        </div>

        {/* How interception works recap */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-gray-400 font-mono">Same URL, two render paths</span>
          </div>
          <pre className="text-[12px] leading-relaxed font-mono p-4 text-gray-700 bg-white overflow-x-auto">{`URL: /exercises/intercept/photo/${photo.id}

  Client navigation from gallery
  ──────────────────────────────►  @modal/(.)photo/[id]/page.tsx
  (intercepted, modal overlay)

  Direct URL / refresh / shared link
  ──────────────────────────────►  photo/[id]/page.tsx  ← you are here
  (no interception, full page)`}</pre>
        </div>

        <Link
          href="/exercises/intercept"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to gallery
        </Link>
      </div>
    </div>
  );
}

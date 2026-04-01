"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PHOTOS } from "@/app/exercises/intercept/page";

export default function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const photo = PHOTOS.find((p) => p.id === id);

  if (!photo) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => router.back()}
    >
      {/* Modal panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Gradient image */}
        <div
          className="h-64 w-full"
          style={{ background: `linear-gradient(135deg, ${photo.from}, ${photo.to})` }}
        />

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{photo.title}</h2>
              <p className="text-sm text-gray-400">{photo.category}</p>
            </div>
            <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-1 rounded-full uppercase tracking-wide">
              @modal slot
            </span>
          </div>

          {/* Explanation box */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-gray-700 mb-1">Why am I a modal?</p>
            <p>
              You navigated here from the gallery, so Next.js matched{" "}
              <code className="bg-gray-200 px-1 rounded font-mono">
                @modal/(.)photo/{photo.id}
              </code>{" "}
              and rendered this component inside the{" "}
              <code className="bg-gray-200 px-1 rounded font-mono">modal</code>{" "}
              slot of the layout — while keeping the gallery visible behind the backdrop.
            </p>
            <p className="mt-2">
              Open{" "}
              <code className="bg-gray-200 px-1 rounded font-mono">
                /exercises/intercept/photo/{photo.id}
              </code>{" "}
              directly (or refresh) to see the full standalone page instead.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex gap-2">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Back to gallery
          </button>
          <a
            href={`/exercises/intercept/photo/${photo.id}`}
            className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors text-center"
          >
            Open full page →
          </a>
        </div>
      </div>
    </div>
  );
}

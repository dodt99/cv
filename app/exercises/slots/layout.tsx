export default function SlotsLayout({
  children,
  stats,
  feed,
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  feed: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Page header + explanation */}
      {children}

      {/* The live slots — rendered simultaneously by Next.js */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Live Demo — parallel slots rendered below
          </p>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats}
          {feed}
        </div>
      </div>
    </div>
  );
}

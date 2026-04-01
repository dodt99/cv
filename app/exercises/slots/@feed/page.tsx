export default function FeedSlot() {
  const events = [
    {
      type: "deploy",
      msg: "v2.4.1 deployed to production",
      time: "2m ago",
      color: "green",
    },
    {
      type: "alert",
      msg: "P95 latency spike on /api/search",
      time: "14m ago",
      color: "amber",
    },
    {
      type: "user",
      msg: "Alice merged PR #482 — slot demo",
      time: "1h ago",
      color: "blue",
    },
    {
      type: "deploy",
      msg: "v2.4.0 deployed to staging",
      time: "3h ago",
      color: "green",
    },
    {
      type: "user",
      msg: "Bob opened PR #481 — fix hydration",
      time: "5h ago",
      color: "blue",
    },
    {
      type: "alert",
      msg: "Memory usage > 80% on worker-3",
      time: "6h ago",
      color: "red",
    },
  ];

  const dot: Record<string, string> = {
    green: "bg-green-500",
    amber: "bg-amber-400",
    blue: "bg-blue-500",
    red: "bg-red-400",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
      {/* Slot label */}
      <div className="px-4 py-2.5 border-b border-gray-100 bg-violet-50 flex items-center gap-2">
        <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">
          @feed
        </span>
        <span className="text-[10px] text-violet-400 font-mono">
          / @feed / page.tsx
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">
          Activity Feed
        </p>
        <div className="space-y-0">
          {events.map((e, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0"
            >
              <div
                className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dot[e.color]}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-700 leading-snug">{e.msg}</p>
              </div>
              <span className="text-[10px] text-gray-300 shrink-0 mt-0.5">
                {e.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

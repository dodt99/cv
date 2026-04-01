export default function StatsSlot() {
  const metrics = [
    { label: "Page Loads", value: "12,480", delta: "+8%", up: true },
    { label: "Avg. Response", value: "142ms", delta: "-23ms", up: true },
    { label: "Error Rate", value: "0.4%", delta: "-0.1%", up: true },
    { label: "Active Users", value: "3,291", delta: "+12%", up: true },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
      {/* Slot label */}
      <div className="px-4 py-2.5 border-b border-gray-100 bg-blue-50 flex items-center gap-2">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
          @stats
        </span>
        <span className="text-[10px] text-blue-400 font-mono">
          / @stats / page.tsx
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">
          Performance Metrics
        </p>
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <p className="text-[10px] text-gray-400 mb-1">{m.label}</p>
              <p className="text-base font-bold text-gray-900">{m.value}</p>
              <p className="text-[10px] text-green-600 font-medium mt-0.5">
                {m.delta} this week
              </p>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div className="mt-3">
          <p className="text-[10px] text-gray-400 mb-2">Daily traffic (7d)</p>
          <div className="flex items-end gap-1 h-10">
            {[40, 65, 55, 80, 72, 90, 85].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-100 rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="text-[9px] text-gray-300 flex-1 text-center">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

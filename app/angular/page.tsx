import fs from "fs";
import path from "path";
import MarkdownViewer from "../components/MarkdownViewer";

export default function AngularPage() {
  const filePath = path.join(process.cwd(), "app/components/angular-knowledge-base.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Interview Prep</p>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-gray-900">Angular</h1>
          <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200">
            Job Prep
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          React developer perspective — tập trung vào sự khác biệt với React
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {["CLI", "NgModule", "Components", "Services & DI", "RxJS", "Routing", "Forms", "Pipes", "Directives", "Change Detection", "NgRx", "Signals"].map((t) => (
          <span key={t} className="text-[11px] bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full shadow-sm">
            {t}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <MarkdownViewer content={content} />
      </div>
    </div>
  );
}

import fs from "fs";
import path from "path";
import MarkdownViewer from "../components/MarkdownViewer";

export default function RoadmapPage() {
  const filePath = path.join(process.cwd(), "app/components/frontend-roadmap.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Learning</p>
        <h1 className="text-2xl font-bold text-gray-900">Frontend Roadmap</h1>
        <p className="text-sm text-gray-500 mt-1">
          Junior → Mid → Senior — danh sách kiến thức theo từng cấp độ
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <MarkdownViewer content={content} />
      </div>
    </div>
  );
}

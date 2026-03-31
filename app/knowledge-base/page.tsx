import fs from "fs";
import path from "path";
import MarkdownViewer from "../components/MarkdownViewer";

export default function KnowledgeBasePage() {
  const filePath = path.join(process.cwd(), "app/components/frontend-knowledge-base.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Learning</p>
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete React/Next.js reference — Junior → Mid → Senior với code examples
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <MarkdownViewer content={content} />
      </div>
    </div>
  );
}

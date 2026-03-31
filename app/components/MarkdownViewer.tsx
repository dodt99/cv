"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-gray-900 mt-7 mb-2.5 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full inline-block shrink-0"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-gray-800 mt-5 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mt-4 mb-1.5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 space-y-1 pl-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 space-y-1 pl-4 list-decimal">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="flex gap-2 text-sm text-gray-600 leading-relaxed">
              <span className="text-blue-400 shrink-0 mt-1 text-xs">▸</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return <code className={className}>{children}</code>;
            }
            return (
              <code className="bg-gray-100 text-rose-600 px-1.5 py-0.5 rounded text-[12px] font-mono border border-gray-200">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-50 border border-gray-200 rounded-xl overflow-x-auto p-4 mb-4 text-[12px] leading-relaxed shadow-sm">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-blue-300 bg-blue-50 pl-4 pr-3 py-2 my-3 rounded-r-lg">
              <div className="text-sm text-gray-600 [&>p]:mb-0">{children}</div>
            </blockquote>
          ),
          hr: () => <hr className="border-gray-100 my-6" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-800">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 text-sm"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4 rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-4 py-2.5 border-b border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="text-xs text-gray-600 px-4 py-2.5 border-b border-gray-100 last:border-b-0">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

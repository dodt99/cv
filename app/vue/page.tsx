import fs from "fs";
import path from "path";
import VuePageClient from "./VuePageClient";
import { parseToc } from "./parseToc";
import { vueInterviewSections } from "./vue-interview-data";

const TAGS = [
  "Composition API",
  "script setup",
  "Reactivity",
  "Pinia",
  "Vue Router",
  "Composables",
  "Testing",
  "TypeScript",
];

export default function VuePage() {
  const filePath = path.join(
    process.cwd(),
    "app/components/vue-knowledge-base.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");
  const toc = parseToc(content);

  return (
    <VuePageClient
      content={content}
      toc={toc}
      interviewSections={vueInterviewSections}
      tags={TAGS}
    />
  );
}

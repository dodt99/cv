import { slugifyHeading } from "../components/markdown-slug";

export type TocItem = { id: string; title: string };

export function parseToc(markdown: string): TocItem[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const title = line.slice(3).trim();
      return { id: slugifyHeading(title), title };
    });
}

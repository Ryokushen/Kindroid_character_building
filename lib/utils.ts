import path from "node:path";

export function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_\-\[\]()`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function sanitizeFileName(name: string, fallbackExtension = ".md") {
  const parsed = path.parse(name.trim());
  const rawBase = (parsed.name || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const extension = parsed.ext || fallbackExtension;
  const safeBase = rawBase || "untitled";
  return `${safeBase}${extension.toLowerCase()}`;
}

export function humanFileLabel(fileName: string) {
  return path
    .parse(fileName)
    .name
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function extractHeading(markdown: string) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || "Untitled Character";
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_~[\]()>|\\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, maxLength = 220) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function sanitizeFileName(name: string, ext = ".md") {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `${base || "untitled"}${ext}`;
}

export function humanFileLabel(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[_-]/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function extractHeading(markdown: string) {
  const match = markdown.match(/^#\s+(.+)/m);
  return match?.[1]?.trim() || "Untitled Character";
}

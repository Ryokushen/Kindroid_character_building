import { promises as fs } from "node:fs";
import path from "node:path";

import type { LibraryDocument } from "@/lib/types";
import { humanFileLabel, sanitizeFileName, stripMarkdown, truncate } from "@/lib/utils";

const LIBRARY_DIR = path.join(process.cwd(), "PDF-Text");
const ARCHIVE_DIR = path.join(LIBRARY_DIR, ".archive");
const ALLOWED_EXTENSIONS = new Set([".txt", ".md"]);

function assertAllowedFileName(fileName: string) {
  const normalized = path.basename(fileName);
  const extension = path.extname(normalized).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("Only .txt and .md documents are supported.");
  }

  if (normalized.startsWith(".")) {
    throw new Error("Hidden files are not supported.");
  }

  return normalized;
}

async function readDocument(fileName: string): Promise<LibraryDocument> {
  const safeName = assertAllowedFileName(fileName);
  const absolutePath = path.join(LIBRARY_DIR, safeName);
  const [stats, content] = await Promise.all([
    fs.stat(absolutePath),
    fs.readFile(absolutePath, "utf8"),
  ]);

  return {
    fileName: safeName,
    displayName: humanFileLabel(safeName),
    extension: path.extname(safeName).toLowerCase(),
    relativePath: path.join("PDF-Text", safeName),
    size: stats.size,
    updatedAt: stats.mtime.toISOString(),
    preview: truncate(stripMarkdown(content), 220),
    content,
  };
}

export async function listLibraryDocuments() {
  const entries = await fs.readdir(LIBRARY_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => ALLOWED_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(files.map((fileName) => readDocument(fileName)));
}

export async function createLibraryDocument(input: {
  title?: string;
  content: string;
  originalFileName?: string;
}) {
  const trimmedContent = input.content.trim();
  if (!trimmedContent) {
    throw new Error("Document content cannot be empty.");
  }

  const requestedName = input.originalFileName || input.title || "untitled.md";
  const safeName = sanitizeFileName(requestedName, ".md");
  const parsed = path.parse(safeName);
  const extension = ALLOWED_EXTENSIONS.has(parsed.ext) ? parsed.ext : ".md";
  let candidate = `${parsed.name}${extension}`;
  let absolutePath = path.join(LIBRARY_DIR, candidate);

  try {
    await fs.access(absolutePath);
    candidate = `${parsed.name}_${Date.now()}${extension}`;
    absolutePath = path.join(LIBRARY_DIR, candidate);
  } catch {
    // File does not exist yet.
  }

  await fs.writeFile(absolutePath, trimmedContent, "utf8");
  return readDocument(candidate);
}

export async function archiveLibraryDocument(fileName: string) {
  const safeName = assertAllowedFileName(fileName);
  const sourcePath = path.join(LIBRARY_DIR, safeName);
  const archiveName = `${Date.now()}__${safeName}`;
  const archivePath = path.join(ARCHIVE_DIR, archiveName);

  await fs.mkdir(ARCHIVE_DIR, { recursive: true });
  await fs.rename(sourcePath, archivePath);
}

export async function buildDocumentContext(selectedDocuments: string[], maxChars = 28000) {
  const uniqueNames = Array.from(new Set(selectedDocuments)).slice(0, 10);
  const documents = await Promise.all(uniqueNames.map((fileName) => readDocument(fileName)));

  let consumed = 0;
  const parts: string[] = [];

  for (const document of documents) {
    const remaining = maxChars - consumed;
    if (remaining <= 0) {
      break;
    }

    const snippet = truncate(document.content, remaining);
    consumed += snippet.length;
    parts.push(`## ${document.displayName}\n${snippet}`);
  }

  return parts.join("\n\n");
}

export function getRecommendedDocumentNames(documents: LibraryDocument[]) {
  const preferredKeywords = [
    "foundation",
    "buildingacustomkindroid",
    "personality",
    "advancedbackstory",
    "effectivebs",
    "behavior",
    "journals",
  ];

  const ordered = [...documents].sort((left, right) => {
    const leftScore = preferredKeywords.findIndex((keyword) =>
      left.fileName.toLowerCase().includes(keyword),
    );
    const rightScore = preferredKeywords.findIndex((keyword) =>
      right.fileName.toLowerCase().includes(keyword),
    );

    const normalizedLeft = leftScore === -1 ? Number.MAX_SAFE_INTEGER : leftScore;
    const normalizedRight = rightScore === -1 ? Number.MAX_SAFE_INTEGER : rightScore;

    if (normalizedLeft !== normalizedRight) {
      return normalizedLeft - normalizedRight;
    }

    return left.fileName.localeCompare(right.fileName);
  });

  return ordered.slice(0, 6).map((document) => document.fileName);
}

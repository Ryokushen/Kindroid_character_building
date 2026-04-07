import { promises as fs } from "node:fs";
import path from "node:path";

import type { LibraryDocument } from "@/lib/types";
import { readMetadataStore } from "@/lib/metadata";
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

async function readDocument(
  fileName: string,
  metaStore?: Record<string, { tags: string[]; favorite: boolean }>,
): Promise<LibraryDocument> {
  const safeName = assertAllowedFileName(fileName);
  const absolutePath = path.join(LIBRARY_DIR, safeName);
  const [stats, content] = await Promise.all([
    fs.stat(absolutePath),
    fs.readFile(absolutePath, "utf8"),
  ]);

  const meta = metaStore?.[safeName];

  return {
    fileName: safeName,
    displayName: humanFileLabel(safeName),
    extension: path.extname(safeName).toLowerCase(),
    relativePath: path.join("PDF-Text", safeName),
    size: stats.size,
    updatedAt: stats.mtime.toISOString(),
    preview: truncate(stripMarkdown(content), 220),
    content,
    tags: meta?.tags ?? [],
    favorite: meta?.favorite ?? false,
  };
}

export async function listLibraryDocuments() {
  const [entries, metaStore] = await Promise.all([
    fs.readdir(LIBRARY_DIR, { withFileTypes: true }),
    readMetadataStore(),
  ]);

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => ALLOWED_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
    .sort((left, right) => left.localeCompare(right));

  const documents = await Promise.all(
    files.map((fileName) => readDocument(fileName, metaStore)),
  );

  // Sort favorites to top, then alphabetical
  documents.sort((a, b) => {
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    return a.fileName.localeCompare(b.fileName);
  });

  return documents;
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

export async function buildDocumentContext(selectedDocuments: string[], maxChars = 120000) {
  const uniqueNames = Array.from(new Set(selectedDocuments)).slice(0, 25);
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

/**
 * Default recommended docs when no brief is provided.
 * Prioritizes core Kindroid guides by filename keywords.
 */
export function getRecommendedDocumentNames(documents: LibraryDocument[]) {
  const preferredKeywords = [
    "ember",
    "foundation",
    "buildingacustomkindroid",
    "personality",
    "advancedbackstory",
    "effectivebs",
    "behavior",
    "journals",
    "memory",
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

  return ordered.slice(0, 8).map((document) => document.fileName);
}

/**
 * Smart doc selection: score each document's relevance to the brief
 * by matching keywords from the brief against document content.
 * Returns filenames sorted by relevance score (highest first).
 */
export function getSmartRecommendations(
  documents: LibraryDocument[],
  brief: string,
  maxDocs = 12,
): string[] {
  if (!brief.trim()) {
    return getRecommendedDocumentNames(documents);
  }

  // Synonym groups — map variations to a canonical form so brief words match more docs
  const SYNONYMS: Record<string, string[]> = {
    emotional: ["emotion", "feeling", "mood", "temperament"],
    personality: ["character", "persona", "temperament"],
    backstory: ["background", "history", "origin"],
    journal: ["journals", "entries", "diary"],
    memory: ["memories", "remember", "recall"],
    greeting: ["greetings", "hello", "intro", "opening"],
    voice: ["speech", "dialogue", "talking", "speaking"],
    sexual: ["sex", "intimate", "erotic", "nsfw", "kink", "kinks"],
    selfie: ["selfies", "image", "photo", "picture", "avatar"],
    physical: ["body", "appearance", "looks", "physique"],
    relationship: ["romance", "dating", "dynamic", "attachment"],
    trauma: ["wound", "hurt", "pain"],
    trigger: ["triggers", "triggering", "provoke"],
    humor: ["funny", "comedy", "sarcasm", "witty"],
    worldbuilding: ["world", "lore", "setting", "location"],
  };

  // Extract meaningful words from the brief (3+ chars, lowercased)
  const rawWords = brief
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  // Expand brief words through synonyms
  const briefWords = new Set(rawWords);
  for (const word of rawWords) {
    for (const [canonical, synonyms] of Object.entries(SYNONYMS)) {
      if (word === canonical || synonyms.includes(word)) {
        briefWords.add(canonical);
        for (const s of synonyms) briefWords.add(s);
      }
    }
  }

  // Always-relevant core docs get a bonus
  const coreDocs = [
    "ember", "foundation", "buildingacustomkindroid", "effectivebs",
    "personality", "behavior",
  ];

  const scored = documents.map((doc) => {
    const nameLC = doc.fileName.toLowerCase();
    const contentLC = doc.content.toLowerCase();

    // Base score: core docs get a head start
    let score = coreDocs.some((kw) => nameLC.includes(kw)) ? 5 : 0;

    // Score based on brief keyword matches in document content
    for (const word of briefWords) {
      if (contentLC.includes(word)) {
        score += 1;
      }
      if (nameLC.includes(word)) {
        score += 3; // Filename match is very relevant
      }
    }

    // Topic-specific boosts based on brief keywords
    const topicMap: Record<string, string[]> = {
      backstory: ["backstory", "advancedbackstory", "effectivebs"],
      personality: ["personality", "behavior", "dynamism"],
      journal: ["journals", "memory"],
      memory: ["memory", "journals"],
      greeting: ["foundation", "buildingacustomkindroid"],
      voice: ["personality", "behavior"],
      roleplay: ["behavior", "personality", "worldbuilding"],
      selfie: ["selfie", "v6selfie"],
      emotional: ["personality", "behavior", "backstory", "effectivebs"],
      trauma: ["backstory", "advancedbackstory", "effectivebs"],
      wound: ["backstory", "advancedbackstory", "effectivebs"],
      relationship: ["personality", "behavior", "backstory"],
      attachment: ["personality", "behavior", "backstory"],
      dynamic: ["personality", "behavior"],
      conflict: ["personality", "behavior"],
      sexual: ["behavior", "journals"],
      kink: ["behavior", "journals"],
      intimate: ["behavior", "journals"],
      avatar: ["selfie", "v6selfie", "foundation"],
      image: ["selfie", "v6selfie"],
      photo: ["selfie", "v6selfie"],
      physical: ["selfie", "v6selfie", "foundation"],
      appearance: ["selfie", "v6selfie"],
      body: ["selfie", "v6selfie"],
      humor: ["personality", "behavior"],
      sarcasm: ["personality", "behavior"],
      speech: ["personality", "behavior"],
      texting: ["personality", "behavior"],
      worldbuilding: ["worldbuilding", "journals"],
      location: ["worldbuilding", "journals"],
      lore: ["worldbuilding", "journals"],
    };

    for (const [topic, docKeywords] of Object.entries(topicMap)) {
      if (brief.toLowerCase().includes(topic)) {
        for (const kw of docKeywords) {
          if (nameLC.includes(kw)) {
            score += 4;
          }
        }
      }
    }

    return { fileName: doc.fileName, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxDocs)
    .filter((s) => s.score > 0)
    .map((s) => s.fileName);
}

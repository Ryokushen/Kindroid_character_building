import { promises as fs } from "node:fs";
import path from "node:path";

import type { CharacterSummary } from "@/lib/types";
import { extractHeading, sanitizeFileName, stripMarkdown, truncate } from "@/lib/utils";

const CHARACTERS_DIR = path.join(process.cwd(), "characters");

async function readCharacter(fileName: string): Promise<CharacterSummary> {
  const safeName = path.basename(fileName);
  const absolutePath = path.join(CHARACTERS_DIR, safeName);
  const [stats, content] = await Promise.all([
    fs.stat(absolutePath),
    fs.readFile(absolutePath, "utf8"),
  ]);

  return {
    fileName: safeName,
    title: extractHeading(content),
    updatedAt: stats.mtime.toISOString(),
    preview: truncate(stripMarkdown(content), 220),
    content,
  };
}

export async function listCharacters() {
  const entries = await fs.readdir(CHARACTERS_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.toLowerCase().endsWith(".md"))
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(files.map((fileName) => readCharacter(fileName)));
}

export async function saveCharacterMarkdown(markdown: string) {
  const trimmed = markdown.trim();
  if (!trimmed) {
    throw new Error("Generated markdown cannot be empty.");
  }

  const title = extractHeading(trimmed);
  const baseName = sanitizeFileName(title, ".md");
  const fileName = `${Date.now()}_${baseName}`;
  const absolutePath = path.join(CHARACTERS_DIR, fileName);

  await fs.writeFile(absolutePath, `${trimmed}\n`, "utf8");
  return readCharacter(fileName);
}

export async function buildCharacterReferenceContext(selectedCharacters: string[], maxChars = 60000) {
  const uniqueNames = Array.from(new Set(selectedCharacters)).slice(0, 8);
  const characters = await Promise.all(uniqueNames.map((fileName) => readCharacter(fileName)));

  let consumed = 0;
  const parts: string[] = [];

  for (const character of characters) {
    const remaining = maxChars - consumed;
    if (remaining <= 0) {
      break;
    }

    const snippet = truncate(character.content, remaining);
    consumed += snippet.length;
    parts.push(`## ${character.title}\n${snippet}`);
  }

  return parts.join("\n\n");
}

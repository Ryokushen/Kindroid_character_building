import { promises as fs } from "node:fs";
import path from "node:path";

const METADATA_PATH = path.join(process.cwd(), "PDF-Text", ".metadata.json");

export type DocumentMetadata = {
  tags: string[];
  favorite: boolean;
  updatedAt: string;
};

export type LibraryMetadataStore = Record<string, DocumentMetadata>;

export async function readMetadataStore(): Promise<LibraryMetadataStore> {
  try {
    const raw = await fs.readFile(METADATA_PATH, "utf8");
    return JSON.parse(raw) as LibraryMetadataStore;
  } catch {
    return {};
  }
}

export async function writeMetadataStore(store: LibraryMetadataStore): Promise<void> {
  await fs.writeFile(METADATA_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getDocumentMetadata(fileName: string): Promise<DocumentMetadata> {
  const store = await readMetadataStore();
  return store[fileName] ?? { tags: [], favorite: false, updatedAt: new Date().toISOString() };
}

export async function setDocumentTags(fileName: string, tags: string[]): Promise<DocumentMetadata> {
  const store = await readMetadataStore();
  const existing = store[fileName] ?? { tags: [], favorite: false, updatedAt: new Date().toISOString() };
  existing.tags = tags;
  existing.updatedAt = new Date().toISOString();
  store[fileName] = existing;
  await writeMetadataStore(store);
  return existing;
}

export async function toggleDocumentFavorite(fileName: string): Promise<boolean> {
  const store = await readMetadataStore();
  const existing = store[fileName] ?? { tags: [], favorite: false, updatedAt: new Date().toISOString() };
  existing.favorite = !existing.favorite;
  existing.updatedAt = new Date().toISOString();
  store[fileName] = existing;
  await writeMetadataStore(store);
  return existing.favorite;
}

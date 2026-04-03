export type LibraryDocument = {
  fileName: string;
  displayName: string;
  extension: string;
  relativePath: string;
  size: number;
  updatedAt: string;
  preview: string;
  content: string;
  tags: string[];
  favorite: boolean;
};

export type CharacterSummary = {
  fileName: string;
  title: string;
  updatedAt: string;
  preview: string;
  content: string;
};

export type ProviderType = "openai" | "anthropic" | "xai";

export type ProviderSettings = {
  providerType: ProviderType;
  providerLabel: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  temperature: number;
};

export type GenerationPayload = {
  brief: string;
  notes: string;
  sexualProfile: string;
  selectedDocuments: string[];
  selectedCharacters: string[];
  selectedTemplates: string[];
  provider: ProviderSettings;
};

export type CharacterSectionKey =
  | "name"
  | "overview"
  | "backstory"
  | "avatar_description"
  | "face_detail"
  | "response_directive"
  | "example_message"
  | "key_memories"
  | "journal_entries"
  | "greeting_options"
  | "selfie_prompts";

/** A single journal entry parsed from the Journal Entries section. */
export type JournalEntry = {
  title: string;
  content: string;
};

/** A single greeting parsed from the Greeting Options section. */
export type GreetingEntry = {
  title: string;
  content: string;
};

/** Kindroid field limits (characters). */
export const KINDROID_LIMITS: Partial<Record<CharacterSectionKey | string, number>> = {
  backstory: 2500,
  response_directive: 250,
  key_memories: 1000,
  example_message: 750,
};

export type CharacterSection = {
  key: CharacterSectionKey;
  label: string;
  content: string;
  isCodeBlock: boolean;
};

export type SectionRegenerationPayload = {
  sectionKey: CharacterSectionKey;
  sectionLabel: string;
  currentContent: string;
  brief: string;
  notes: string;
  fullCharacterContext: string;
  selectedDocuments: string[];
  provider: ProviderSettings;
};

export type LibraryDocument = {
  fileName: string;
  displayName: string;
  extension: string;
  relativePath: string;
  size: number;
  updatedAt: string;
  preview: string;
  content: string;
};

export type CharacterSummary = {
  fileName: string;
  title: string;
  updatedAt: string;
  preview: string;
  content: string;
};

export type ProviderSettings = {
  providerLabel: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  temperature: number;
};

export type GenerationPayload = {
  brief: string;
  notes: string;
  selectedDocuments: string[];
  selectedCharacters: string[];
  provider: ProviderSettings;
};

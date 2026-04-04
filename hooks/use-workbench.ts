"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  CharacterSummary,
  EmotionalLogic,
  JournalCategories,
  KinkPreference,
  LibraryDocument,
  MCProfile,
  PhysicalProfile,
  ProviderSettings,
  RelationshipDynamic,
  VoiceProfile,
} from "@/lib/types";
import {
  DEFAULT_EMOTIONAL_LOGIC,
  DEFAULT_JOURNAL_CATEGORIES,
  DEFAULT_MC_PROFILE,
  DEFAULT_PHYSICAL_PROFILE,
  DEFAULT_RELATIONSHIP_DYNAMIC,
  DEFAULT_VOICE_PROFILE,
} from "@/lib/types";
import { resolveTemplatePrompts } from "@/components/template-selector";
import { resolveHowTheyMetPrompt } from "@/lib/how-they-met";

const LOCAL_STORAGE_KEY = "kindroid-workbench-provider";
const API_KEYS_STORAGE_KEY = "kindroid-workbench-api-keys";
const MC_PROFILE_STORAGE_KEY = "kindroid-workbench-mc-profile";

const defaultProviderSettings: ProviderSettings = {
  providerType: "openai",
  providerLabel: "OpenAI",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4.1-mini",
  apiKey: "",
  temperature: 0.8,
};

export type WorkbenchState = {
  documents: LibraryDocument[];
  characters: CharacterSummary[];
  selectedDocuments: string[];
  selectedCharacters: string[];
  activeDocument: string;
  activeCharacter: string;
  provider: ProviderSettings;
  brief: string;
  notes: string;
  generatedMarkdown: string;
  message: string;
  isWorking: boolean;
  activeDocumentRecord: LibraryDocument | undefined;
  activeCharacterRecord: CharacterSummary | undefined;
  // Batch generation
  isBatchMode: boolean;
  batchTemperatures: number[];
  batchResults: Array<{ temperature: number; markdown: string }>;
  // Templates
  selectedTemplates: string[];
  // Sexual profile
  sexualProfile: string;
  // Guided builder
  selectedBackstories: string[];
  selectedScenarios: string[];
  howTheyMet: string;
  physicalProfile: PhysicalProfile;
  emotionalLogic: EmotionalLogic;
  relationshipDynamic: RelationshipDynamic;
  voiceProfile: VoiceProfile;
  contrastNotes: string;
  journalCategories: JournalCategories;
  selectedKinks: KinkPreference[];
  mcProfile: MCProfile;
};

export type WorkbenchActions = {
  setSelectedDocuments: Dispatch<SetStateAction<string[]>>;
  setSelectedCharacters: Dispatch<SetStateAction<string[]>>;
  setActiveDocument: Dispatch<SetStateAction<string>>;
  setActiveCharacter: Dispatch<SetStateAction<string>>;
  setProvider: Dispatch<SetStateAction<ProviderSettings>>;
  setBrief: Dispatch<SetStateAction<string>>;
  setNotes: Dispatch<SetStateAction<string>>;
  setGeneratedMarkdown: Dispatch<SetStateAction<string>>;
  setIsBatchMode: Dispatch<SetStateAction<boolean>>;
  setBatchTemperatures: Dispatch<SetStateAction<number[]>>;
  setSelectedTemplates: Dispatch<SetStateAction<string[]>>;
  setSexualProfile: Dispatch<SetStateAction<string>>;
  setSelectedBackstories: Dispatch<SetStateAction<string[]>>;
  setSelectedScenarios: Dispatch<SetStateAction<string[]>>;
  setHowTheyMet: Dispatch<SetStateAction<string>>;
  setPhysicalProfile: Dispatch<SetStateAction<PhysicalProfile>>;
  setEmotionalLogic: Dispatch<SetStateAction<EmotionalLogic>>;
  setRelationshipDynamic: Dispatch<SetStateAction<RelationshipDynamic>>;
  setVoiceProfile: Dispatch<SetStateAction<VoiceProfile>>;
  setContrastNotes: Dispatch<SetStateAction<string>>;
  setJournalCategories: Dispatch<SetStateAction<JournalCategories>>;
  setSelectedKinks: Dispatch<SetStateAction<KinkPreference[]>>;
  setMCProfile: Dispatch<SetStateAction<MCProfile>>;
  toggleDocumentSelection: (fileName: string) => void;
  toggleCharacterSelection: (fileName: string) => void;
  handleAddDocument: (formData: FormData) => void;
  handleArchiveDocument: (fileName: string) => void;
  handleGenerate: () => void;
  handleBatchGenerate: () => void;
  handleSelectBatchResult: (index: number) => void;
  handleSaveCharacter: () => void;
  handleUpdateCharacter: (fileName: string, markdown: string) => void;
  handleDeleteCharacter: (fileName: string) => void;
  handleUpdateMetadata: (fileName: string, update: { tags?: string[]; favorite?: "toggle" }) => void;
};

function toggle(
  target: string,
  collection: string[],
  setter: Dispatch<SetStateAction<string[]>>,
) {
  setter(
    collection.includes(target)
      ? collection.filter((item) => item !== target)
      : [...collection, target],
  );
}

export function useWorkbench(props: {
  initialDocuments: LibraryDocument[];
  initialCharacters: CharacterSummary[];
  recommendedDocuments: string[];
}) {
  const [documents, setDocuments] = useState(props.initialDocuments);
  const [characters, setCharacters] = useState(props.initialCharacters);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(props.recommendedDocuments);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [activeDocument, setActiveDocument] = useState(props.initialDocuments[0]?.fileName ?? "");
  const [activeCharacter, setActiveCharacter] = useState(props.initialCharacters[0]?.fileName ?? "");
  const [provider, setProvider] = useState<ProviderSettings>(defaultProviderSettings);
  const [brief, setBrief] = useState("");
  const [notes, setNotes] = useState("");
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");
  const [message, setMessage] = useState("Select source docs, add your prompt, then generate a draft.");
  const [isWorking, setIsWorking] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchTemperatures, setBatchTemperatures] = useState<number[]>([0.6, 0.8, 1.0, 1.2]);
  const [batchResults, setBatchResults] = useState<Array<{ temperature: number; markdown: string }>>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [sexualProfile, setSexualProfile] = useState("");
  const [selectedBackstories, setSelectedBackstories] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [howTheyMet, setHowTheyMet] = useState("");
  const [physicalProfile, setPhysicalProfile] = useState<PhysicalProfile>(DEFAULT_PHYSICAL_PROFILE);
  const [emotionalLogic, setEmotionalLogic] = useState<EmotionalLogic>(DEFAULT_EMOTIONAL_LOGIC);
  const [relationshipDynamic, setRelationshipDynamic] = useState<RelationshipDynamic>(DEFAULT_RELATIONSHIP_DYNAMIC);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile>(DEFAULT_VOICE_PROFILE);
  const [contrastNotes, setContrastNotes] = useState("");
  const [journalCategories, setJournalCategories] = useState<JournalCategories>(DEFAULT_JOURNAL_CATEGORIES);
  const [selectedKinks, setSelectedKinks] = useState<KinkPreference[]>([]);
  const [mcProfile, setMCProfile] = useState<MCProfile>(DEFAULT_MC_PROFILE);

  // Load saved provider settings + per-provider API keys
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ProviderSettings>;
        const keysRaw = window.localStorage.getItem(API_KEYS_STORAGE_KEY);
        const savedKeys = keysRaw ? (JSON.parse(keysRaw) as Record<string, string>) : {};
        const providerType = parsed.providerType ?? "openai";
        setProvider((current) => ({
          ...current,
          ...parsed,
          apiKey: savedKeys[providerType] ?? parsed.apiKey ?? "",
        }));
      }
    } catch {
      // Ignore invalid stored settings.
    }
  }, []);

  // Persist provider settings + save API key for current provider type
  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(provider));
    // Save this provider's API key separately
    if (provider.apiKey) {
      try {
        const keysRaw = window.localStorage.getItem(API_KEYS_STORAGE_KEY);
        const savedKeys = keysRaw ? (JSON.parse(keysRaw) as Record<string, string>) : {};
        savedKeys[provider.providerType] = provider.apiKey;
        window.localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(savedKeys));
      } catch {
        // Ignore storage errors
      }
    }
  }, [provider]);

  // Load saved MC profile
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MC_PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<MCProfile>;
        setMCProfile((current) => ({ ...current, ...parsed }));
      }
    } catch {
      // Ignore invalid stored MC profile
    }
  }, []);

  // Persist MC profile
  useEffect(() => {
    const hasContent = Object.values(mcProfile).some((v) => v.trim());
    if (hasContent) {
      window.localStorage.setItem(MC_PROFILE_STORAGE_KEY, JSON.stringify(mcProfile));
    }
  }, [mcProfile]);

  const activeDocumentRecord = useMemo(
    () => documents.find((d) => d.fileName === activeDocument),
    [activeDocument, documents],
  );

  const activeCharacterRecord = useMemo(
    () => characters.find((c) => c.fileName === activeCharacter),
    [activeCharacter, characters],
  );

  function refreshFromPayload(payload: {
    documents?: LibraryDocument[];
    characters?: CharacterSummary[];
    message?: string;
  }) {
    if (payload.documents) {
      setDocuments(payload.documents);
      setActiveDocument((c) => c || payload.documents?.[0]?.fileName || "");
    }
    if (payload.characters) {
      setCharacters(payload.characters);
      setActiveCharacter((c) => c || payload.characters?.[0]?.fileName || "");
    }
    if (payload.message) setMessage(payload.message);
  }

  function handleAddDocument(formData: FormData) {
    setMessage("Adding repository document...");
    setIsWorking(true);
    void (async () => {
      try {
        const response = await fetch("/api/library", { method: "POST", body: formData });
        const payload = (await response.json()) as {
          document?: LibraryDocument;
          documents?: LibraryDocument[];
          message?: string;
          error?: string;
        };
        if (!response.ok) throw new Error(payload.error || "Unable to add document.");
        refreshFromPayload(payload);
        if (payload.document) {
          setSelectedDocuments((c) =>
            c.includes(payload.document!.fileName) ? c : [...c, payload.document!.fileName],
          );
          setActiveDocument(payload.document.fileName);
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to add document.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleArchiveDocument(fileName: string) {
    setMessage(`Archiving ${fileName}...`);
    setIsWorking(true);
    void (async () => {
      try {
        const response = await fetch("/api/library/archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName }),
        });
        const payload = (await response.json()) as {
          documents?: LibraryDocument[];
          message?: string;
          error?: string;
        };
        if (!response.ok) throw new Error(payload.error || "Unable to archive document.");
        setSelectedDocuments((c) => c.filter((item) => item !== fileName));
        if (activeDocument === fileName) {
          setActiveDocument(payload.documents?.[0]?.fileName ?? "");
        }
        refreshFromPayload(payload);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to archive document.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleGenerate() {
    setMessage("Generating character draft...");
    setIsWorking(true);
    setBatchResults([]);
    void (async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brief,
            notes,
            sexualProfile,
            selectedDocuments,
            selectedCharacters,
            selectedTemplates: resolveTemplatePrompts(selectedTemplates),
            selectedBackstories,
            selectedScenarios,
            howTheyMet: resolveHowTheyMetPrompt(howTheyMet),
            physicalProfile,
            emotionalLogic,
            relationshipDynamic,
            voiceProfile,
            contrastNotes,
            journalCategories,
            selectedKinks,
            mcProfile,
            provider,
          }),
        });
        const payload = (await response.json()) as { markdown?: string; error?: string };
        if (!response.ok) throw new Error(payload.error || "Unable to generate draft.");
        setGeneratedMarkdown(payload.markdown || "");
        setMessage("Draft ready. Review the sections, then save to the character library.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to generate draft.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleBatchGenerate() {
    setMessage(`Generating ${batchTemperatures.length} temperature variations...`);
    setIsWorking(true);
    setBatchResults([]);
    setGeneratedMarkdown("");
    void (async () => {
      try {
        const response = await fetch("/api/generate/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brief,
            notes,
            sexualProfile,
            selectedDocuments,
            selectedCharacters,
            selectedTemplates: resolveTemplatePrompts(selectedTemplates),
            selectedBackstories,
            selectedScenarios,
            howTheyMet: resolveHowTheyMetPrompt(howTheyMet),
            physicalProfile,
            emotionalLogic,
            relationshipDynamic,
            voiceProfile,
            contrastNotes,
            journalCategories,
            selectedKinks,
            mcProfile,
            provider,
            temperatures: batchTemperatures,
          }),
        });
        const payload = (await response.json()) as {
          results?: Array<{ temperature: number; markdown: string }>;
          error?: string;
        };
        if (!response.ok) throw new Error(payload.error || "Unable to generate batch.");
        setBatchResults(payload.results || []);
        setMessage(`${payload.results?.length || 0} variations ready. Pick your favorite.`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to generate batch.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleSelectBatchResult(index: number) {
    const result = batchResults[index];
    if (result) {
      setGeneratedMarkdown(result.markdown);
      setBatchResults([]);
      setMessage(`Selected temperature ${result.temperature} variation. Edit sections or save.`);
    }
  }

  function handleSaveCharacter() {
    setMessage("Saving generated draft into the character library...");
    setIsWorking(true);
    void (async () => {
      try {
        const response = await fetch("/api/characters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markdown: generatedMarkdown }),
        });
        const payload = (await response.json()) as {
          character?: CharacterSummary;
          characters?: CharacterSummary[];
          message?: string;
          error?: string;
        };
        if (!response.ok) throw new Error(payload.error || "Unable to save character.");
        refreshFromPayload(payload);
        if (payload.character) setActiveCharacter(payload.character.fileName);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to save character.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleUpdateCharacter(fileName: string, markdown: string) {
    setMessage("Updating character...");
    setIsWorking(true);
    void (async () => {
      try {
        const response = await fetch("/api/characters", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, markdown }),
        });
        const payload = (await response.json()) as {
          character?: CharacterSummary;
          characters?: CharacterSummary[];
          message?: string;
          error?: string;
        };
        if (!response.ok) throw new Error(payload.error || "Unable to update character.");
        refreshFromPayload(payload);
        if (payload.character) setActiveCharacter(payload.character.fileName);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to update character.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleDeleteCharacter(fileName: string) {
    setMessage("Archiving character...");
    setIsWorking(true);
    void (async () => {
      try {
        const response = await fetch("/api/characters", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName }),
        });
        const payload = (await response.json()) as {
          characters?: CharacterSummary[];
          message?: string;
          error?: string;
        };
        if (!response.ok) throw new Error(payload.error || "Unable to delete character.");
        setSelectedCharacters((c) => c.filter((f) => f !== fileName));
        if (activeCharacter === fileName) {
          setActiveCharacter(payload.characters?.[0]?.fileName ?? "");
        }
        refreshFromPayload(payload);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to delete character.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleUpdateMetadata(fileName: string, update: { tags?: string[]; favorite?: "toggle" }) {
    void (async () => {
      try {
        const response = await fetch("/api/library/metadata", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, ...update }),
        });
        if (!response.ok) return;

        // Refresh documents to pick up metadata changes
        const docResponse = await fetch("/api/library");
        const payload = (await docResponse.json()) as { documents?: LibraryDocument[] };
        if (payload.documents) {
          setDocuments(payload.documents);
        }
      } catch {
        // Silent fail for metadata updates
      }
    })();
  }

  const state: WorkbenchState = {
    documents,
    characters,
    selectedDocuments,
    selectedCharacters,
    activeDocument,
    activeCharacter,
    provider,
    brief,
    notes,
    generatedMarkdown,
    message,
    isWorking,
    activeDocumentRecord,
    activeCharacterRecord,
    isBatchMode,
    batchTemperatures,
    batchResults,
    selectedTemplates,
    sexualProfile,
    selectedBackstories,
    selectedScenarios,
    howTheyMet,
    physicalProfile,
    emotionalLogic,
    relationshipDynamic,
    voiceProfile,
    contrastNotes,
    journalCategories,
    selectedKinks,
    mcProfile,
  };

  const actions: WorkbenchActions = {
    setSelectedDocuments,
    setSelectedCharacters,
    setActiveDocument,
    setActiveCharacter,
    setProvider,
    setBrief,
    setNotes,
    setGeneratedMarkdown,
    setIsBatchMode,
    setBatchTemperatures,
    setSelectedTemplates,
    setSexualProfile,
    setSelectedBackstories,
    setSelectedScenarios,
    setHowTheyMet,
    setPhysicalProfile,
    setEmotionalLogic,
    setRelationshipDynamic,
    setVoiceProfile,
    setContrastNotes,
    setJournalCategories,
    setSelectedKinks,
    setMCProfile,
    toggleDocumentSelection: (fileName) => toggle(fileName, selectedDocuments, setSelectedDocuments),
    toggleCharacterSelection: (fileName) => toggle(fileName, selectedCharacters, setSelectedCharacters),
    handleAddDocument,
    handleArchiveDocument,
    handleGenerate,
    handleBatchGenerate,
    handleSelectBatchResult,
    handleSaveCharacter,
    handleUpdateCharacter,
    handleDeleteCharacter,
    handleUpdateMetadata,
  };

  return { state, actions };
}

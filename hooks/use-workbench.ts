"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  BatchGenerationResult,
  CharacterSummary,
  DraftQualityReport,
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
import { resolveBackstoryPrompts } from "@/lib/backstory-architectures";
import { resolveHowTheyMetPrompt } from "@/lib/how-they-met";
import { resolveScenarioPrompts } from "@/lib/scenario-templates";
import type { DiscoveryMode, DiscoveryPreferenceStore, DiscoveryReaction } from "@/lib/random-seed";
import {
  buildDiscoveryPreset,
  buildConceptSeed,
  createEmptyDiscoveryPreferenceStore,
  recordDiscoveryReaction,
} from "@/lib/random-seed";

const LOCAL_STORAGE_KEY = "kindroid-workbench-provider";
const API_KEYS_STORAGE_KEY = "kindroid-workbench-api-keys";
const MC_PROFILE_STORAGE_KEY = "kindroid-workbench-mc-profile";
const DISCOVERY_MODE_STORAGE_KEY = "kindroid-workbench-discovery-mode";
const DISCOVERY_PREFS_STORAGE_KEY = "kindroid-workbench-discovery-prefs";

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
  draftQualityReport: DraftQualityReport | null;
  originalDraftQualityReport: DraftQualityReport | null;
  draftWasAutoRewritten: boolean;
  qualityReportIsStale: boolean;
  discoveryMode: DiscoveryMode;
  discoverySeedSummary: string;
  discoveryPreferenceCount: number;
  message: string;
  isWorking: boolean;
  activeDocumentRecord: LibraryDocument | undefined;
  activeCharacterRecord: CharacterSummary | undefined;
  // Batch generation
  isBatchMode: boolean;
  batchTemperatures: number[];
  batchResults: BatchGenerationResult[];
  batchRatings: Record<number, DiscoveryReaction>;
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
  setDiscoveryMode: Dispatch<SetStateAction<DiscoveryMode>>;
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
  handleSurpriseMe: () => void;
  handleSurpriseMeSingle: () => void;
  handleRollConcept: () => void;
  handleSelectBatchResult: (index: number) => void;
  handleRemixBatchResult: (index: number) => void;
  handleRateBatchResult: (index: number, reaction: DiscoveryReaction) => void;
  handleSaveCharacter: () => void;
  handleAnalyzeGeneratedDraft: () => Promise<DraftQualityReport | null>;
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
  const [draftQualityReport, setDraftQualityReport] = useState<DraftQualityReport | null>(null);
  const [originalDraftQualityReport, setOriginalDraftQualityReport] = useState<DraftQualityReport | null>(null);
  const [draftWasAutoRewritten, setDraftWasAutoRewritten] = useState(false);
  const [analyzedMarkdownSnapshot, setAnalyzedMarkdownSnapshot] = useState("");
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("romanceable");
  const [discoverySeedSummary, setDiscoverySeedSummary] = useState("");
  const [discoveryPreferences, setDiscoveryPreferences] = useState<DiscoveryPreferenceStore>(
    createEmptyDiscoveryPreferenceStore(),
  );
  const [message, setMessage] = useState("Select source docs, add your prompt, then generate a draft.");
  const [isWorking, setIsWorking] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchTemperatures, setBatchTemperatures] = useState<number[]>([0.6, 0.8, 1.0, 1.2]);
  const [batchResults, setBatchResults] = useState<BatchGenerationResult[]>([]);
  const [batchRatings, setBatchRatings] = useState<Record<number, DiscoveryReaction>>({});
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

  useEffect(() => {
    try {
      const storedMode = window.localStorage.getItem(DISCOVERY_MODE_STORAGE_KEY);
      if (storedMode === "romanceable" || storedMode === "high-heat" || storedMode === "wild-card") {
        setDiscoveryMode(storedMode);
      }

      const storedPrefs = window.localStorage.getItem(DISCOVERY_PREFS_STORAGE_KEY);
      if (storedPrefs) {
        const parsed = JSON.parse(storedPrefs) as DiscoveryPreferenceStore;
        if (parsed && typeof parsed === "object" && parsed.featureScores) {
          setDiscoveryPreferences(parsed);
        }
      }
    } catch {
      // Ignore invalid discovery storage.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(DISCOVERY_MODE_STORAGE_KEY, discoveryMode);
  }, [discoveryMode]);

  useEffect(() => {
    window.localStorage.setItem(DISCOVERY_PREFS_STORAGE_KEY, JSON.stringify(discoveryPreferences));
  }, [discoveryPreferences]);

  const activeDocumentRecord = useMemo(
    () => documents.find((d) => d.fileName === activeDocument),
    [activeDocument, documents],
  );

  const activeCharacterRecord = useMemo(
    () => characters.find((c) => c.fileName === activeCharacter),
    [activeCharacter, characters],
  );
  const qualityReportIsStale = Boolean(
    draftQualityReport && analyzedMarkdownSnapshot && analyzedMarkdownSnapshot !== generatedMarkdown,
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

  type BuilderSnapshot = {
    brief: string;
    notes: string;
    sexualProfile: string;
    selectedDocuments: string[];
    selectedCharacters: string[];
    selectedTemplates: string[];
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
    provider: ProviderSettings;
    batchTemperatures: number[];
  };

  function getBuilderSnapshot(overrides: Partial<BuilderSnapshot> = {}): BuilderSnapshot {
    return {
      brief,
      notes,
      sexualProfile,
      selectedDocuments,
      selectedCharacters,
      selectedTemplates,
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
      provider,
      batchTemperatures,
      ...overrides,
    };
  }

  function buildRequestPayload(snapshot: BuilderSnapshot) {
    return {
      brief: snapshot.brief,
      notes: snapshot.notes,
      sexualProfile: snapshot.sexualProfile,
      selectedDocuments: snapshot.selectedDocuments,
      selectedCharacters: snapshot.selectedCharacters,
      selectedTemplates: resolveTemplatePrompts(snapshot.selectedTemplates),
      selectedBackstories: resolveBackstoryPrompts(snapshot.selectedBackstories),
      selectedScenarios: resolveScenarioPrompts(snapshot.selectedScenarios),
      howTheyMet: resolveHowTheyMetPrompt(snapshot.howTheyMet),
      physicalProfile: snapshot.physicalProfile,
      emotionalLogic: snapshot.emotionalLogic,
      relationshipDynamic: snapshot.relationshipDynamic,
      voiceProfile: snapshot.voiceProfile,
      contrastNotes: snapshot.contrastNotes,
      journalCategories: snapshot.journalCategories,
      selectedKinks: snapshot.selectedKinks,
      mcProfile: snapshot.mcProfile,
      provider: snapshot.provider,
    };
  }

  function applySnapshot(snapshot: BuilderSnapshot, seedSummary = "") {
    setBrief(snapshot.brief);
    setNotes(snapshot.notes);
    setSexualProfile(snapshot.sexualProfile);
    setSelectedCharacters(snapshot.selectedCharacters);
    setSelectedTemplates(snapshot.selectedTemplates);
    setSelectedBackstories(snapshot.selectedBackstories);
    setSelectedScenarios(snapshot.selectedScenarios);
    setHowTheyMet(snapshot.howTheyMet);
    setPhysicalProfile(snapshot.physicalProfile);
    setEmotionalLogic(snapshot.emotionalLogic);
    setRelationshipDynamic(snapshot.relationshipDynamic);
    setVoiceProfile(snapshot.voiceProfile);
    setContrastNotes(snapshot.contrastNotes);
    setJournalCategories(snapshot.journalCategories);
    setSelectedKinks(snapshot.selectedKinks);
    setBatchTemperatures(snapshot.batchTemperatures);
    setDiscoverySeedSummary(seedSummary);
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

  async function requestSingleGeneration(snapshot: BuilderSnapshot) {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildRequestPayload(snapshot)),
    });

    return {
      ok: response.ok,
      payload: (await response.json()) as {
        markdown?: string;
        qualityReport?: DraftQualityReport;
        originalQualityReport?: DraftQualityReport;
        rewritten?: boolean;
        error?: string;
      },
    };
  }

  async function requestBatchGeneration(snapshot: BuilderSnapshot) {
    const response = await fetch("/api/generate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...buildRequestPayload(snapshot),
        temperatures: snapshot.batchTemperatures,
      }),
    });

    return {
      ok: response.ok,
      payload: (await response.json()) as {
        results?: BatchGenerationResult[];
        error?: string;
      },
    };
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
    setBatchRatings({});
    setDraftQualityReport(null);
    setOriginalDraftQualityReport(null);
    setDraftWasAutoRewritten(false);
    void (async () => {
      try {
        const { ok, payload } = await requestSingleGeneration(getBuilderSnapshot());
        if (!ok) throw new Error(payload.error || "Unable to generate draft.");
        setGeneratedMarkdown(payload.markdown || "");
        setDraftQualityReport(payload.qualityReport ?? null);
        setOriginalDraftQualityReport(payload.originalQualityReport ?? null);
        setDraftWasAutoRewritten(Boolean(payload.rewritten));
        setAnalyzedMarkdownSnapshot(payload.markdown || "");
        setMessage(
          payload.rewritten
            ? "Draft ready. A novelty rewrite was applied automatically before review."
            : "Draft ready. Review the sections, then save to the character library.",
        );
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
    setBatchRatings({});
    setGeneratedMarkdown("");
    setDraftQualityReport(null);
    setOriginalDraftQualityReport(null);
    setDraftWasAutoRewritten(false);
    setAnalyzedMarkdownSnapshot("");
    void (async () => {
      try {
        const { ok, payload } = await requestBatchGeneration(getBuilderSnapshot());
        if (!ok) throw new Error(payload.error || "Unable to generate batch.");
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
      setDraftQualityReport(result.qualityReport);
      setOriginalDraftQualityReport(null);
      setDraftWasAutoRewritten(false);
      setAnalyzedMarkdownSnapshot(result.markdown);
      setBatchResults([]);
      setBatchRatings({});
      setMessage(`Selected temperature ${result.temperature} variation. Edit sections or save.`);
    }
  }

  function getLockedFields() {
    const pp = physicalProfile;
    const hasPhysical = pp.bodyType || pp.height || pp.ageRange || pp.ethnicity || pp.eyeColor || pp.distinguishingFeatures.length > 0 || pp.flirtationStyle || pp.availabilityStatus;
    const hasKinks = selectedKinks.length > 0;
    const hasSexProfile = sexualProfile.trim();
    if (!hasPhysical && !hasKinks && !hasSexProfile) return undefined;
    return {
      physicalProfile: hasPhysical ? pp : undefined,
      selectedKinks: hasKinks ? selectedKinks : undefined,
      sexualProfile: hasSexProfile ? sexualProfile : undefined,
    };
  }

  function handleSurpriseMe() {
    const preset = buildDiscoveryPreset({
      mode: discoveryMode,
      preferences: discoveryPreferences,
      lockedFields: getLockedFields(),
    });
    const snapshot = getBuilderSnapshot({
      brief: preset.brief,
      notes: preset.notes,
      sexualProfile: preset.sexualProfile,
      selectedCharacters: [],
      selectedTemplates: preset.selectedTemplates,
      selectedBackstories: preset.selectedBackstories,
      selectedScenarios: preset.selectedScenarios,
      howTheyMet: preset.howTheyMet,
      physicalProfile: preset.physicalProfile,
      emotionalLogic: preset.emotionalLogic,
      relationshipDynamic: preset.relationshipDynamic,
      voiceProfile: preset.voiceProfile,
      contrastNotes: preset.contrastNotes,
      journalCategories: preset.journalCategories,
      selectedKinks: preset.selectedKinks,
      batchTemperatures: preset.batchTemperatures,
    });

    applySnapshot(snapshot, preset.summary);
    setIsBatchMode(true);
    setMessage(`Generating discovery candidates: ${preset.summary}`);
    setIsWorking(true);
    setBatchResults([]);
    setBatchRatings({});
    setGeneratedMarkdown("");
    setDraftQualityReport(null);
    setOriginalDraftQualityReport(null);
    setDraftWasAutoRewritten(false);
    setAnalyzedMarkdownSnapshot("");

    void (async () => {
      try {
        const { ok, payload } = await requestBatchGeneration(snapshot);
        if (!ok) throw new Error(payload.error || "Unable to generate discovery batch.");
        setBatchResults(payload.results || []);
        setMessage(`Discovery set ready: ${preset.summary}`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to generate discovery batch.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleSurpriseMeSingle() {
    const preset = buildDiscoveryPreset({
      mode: discoveryMode,
      preferences: discoveryPreferences,
      lockedFields: getLockedFields(),
    });
    const snapshot = getBuilderSnapshot({
      brief: preset.brief,
      notes: preset.notes,
      sexualProfile: preset.sexualProfile,
      selectedCharacters: [],
      selectedTemplates: preset.selectedTemplates,
      selectedBackstories: preset.selectedBackstories,
      selectedScenarios: preset.selectedScenarios,
      howTheyMet: preset.howTheyMet,
      physicalProfile: preset.physicalProfile,
      emotionalLogic: preset.emotionalLogic,
      relationshipDynamic: preset.relationshipDynamic,
      voiceProfile: preset.voiceProfile,
      contrastNotes: preset.contrastNotes,
      journalCategories: preset.journalCategories,
      selectedKinks: preset.selectedKinks,
    });

    applySnapshot(snapshot, preset.summary);
    setIsBatchMode(false);
    setMessage(`Generating discovery character: ${preset.summary}`);
    setIsWorking(true);
    setBatchResults([]);
    setBatchRatings({});
    setGeneratedMarkdown("");
    setDraftQualityReport(null);
    setOriginalDraftQualityReport(null);
    setDraftWasAutoRewritten(false);
    setAnalyzedMarkdownSnapshot("");

    void (async () => {
      try {
        const { ok, payload } = await requestSingleGeneration(snapshot);
        if (!ok) throw new Error(payload.error || "Unable to generate discovery character.");
        setGeneratedMarkdown(payload.markdown || "");
        setDraftQualityReport(payload.qualityReport ?? null);
        setOriginalDraftQualityReport(payload.originalQualityReport ?? null);
        setDraftWasAutoRewritten(Boolean(payload.rewritten));
        setAnalyzedMarkdownSnapshot(payload.markdown || "");
        setMessage(`Discovery character ready: ${preset.summary}`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to generate discovery character.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleRollConcept() {
    const concept = buildConceptSeed({
      mode: discoveryMode,
      preferences: discoveryPreferences,
    });

    // Apply concept fields to the builder without touching physical profile or kinks
    setBrief(concept.brief);
    setNotes(concept.notes);
    setSelectedTemplates(concept.selectedTemplates);
    setSelectedBackstories(concept.selectedBackstories);
    setSelectedScenarios(concept.selectedScenarios);
    setHowTheyMet(concept.howTheyMet);
    setEmotionalLogic(concept.emotionalLogic);
    setRelationshipDynamic(concept.relationshipDynamic);
    setVoiceProfile(concept.voiceProfile);
    setJournalCategories(concept.journalCategories);
    setDiscoverySeedSummary(concept.summary);

    // Clear generation output but don't start generating
    setGeneratedMarkdown("");
    setBatchResults([]);
    setBatchRatings({});
    setDraftQualityReport(null);
    setOriginalDraftQualityReport(null);
    setDraftWasAutoRewritten(false);
    setAnalyzedMarkdownSnapshot("");
    setIsBatchMode(false);

    setMessage(`Concept rolled: ${concept.summary}. Review the builder tabs, customize, then generate.`);
  }

  function handleRemixBatchResult(index: number) {
    const source = batchResults[index];
    if (!source) {
      return;
    }

    const preset = buildDiscoveryPreset({
      mode: discoveryMode,
      preferences: discoveryPreferences,
      remixFingerprint: source.qualityReport.fingerprint,
      lockedFields: getLockedFields(),
    });
    const snapshot = getBuilderSnapshot({
      brief: preset.brief,
      notes: preset.notes,
      sexualProfile: preset.sexualProfile,
      selectedCharacters: [],
      selectedTemplates: preset.selectedTemplates,
      selectedBackstories: preset.selectedBackstories,
      selectedScenarios: preset.selectedScenarios,
      howTheyMet: preset.howTheyMet,
      physicalProfile: preset.physicalProfile,
      emotionalLogic: preset.emotionalLogic,
      relationshipDynamic: preset.relationshipDynamic,
      voiceProfile: preset.voiceProfile,
      contrastNotes: preset.contrastNotes,
      journalCategories: preset.journalCategories,
      selectedKinks: preset.selectedKinks,
      batchTemperatures: preset.batchTemperatures,
    });

    applySnapshot(snapshot, `${preset.summary} (remix)`);
    setIsBatchMode(true);
    setMessage("Remixing discovery candidate...");
    setIsWorking(true);
    setBatchResults([]);
    setBatchRatings({});
    setGeneratedMarkdown("");
    setDraftQualityReport(null);
    setOriginalDraftQualityReport(null);
    setDraftWasAutoRewritten(false);
    setAnalyzedMarkdownSnapshot("");

    void (async () => {
      try {
        const { ok, payload } = await requestBatchGeneration(snapshot);
        if (!ok) throw new Error(payload.error || "Unable to remix discovery batch.");
        setBatchResults(payload.results || []);
        setMessage(`Remix ready: ${preset.summary}`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to remix discovery batch.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleRateBatchResult(index: number, reaction: DiscoveryReaction) {
    if (!batchResults[index]) {
      return;
    }

    setBatchRatings((current) => ({ ...current, [index]: reaction }));
    setDiscoveryPreferences((current) =>
      recordDiscoveryReaction(current, reaction, {
        mode: discoveryMode,
        selectedTemplates,
        selectedBackstories,
        selectedScenarios,
        howTheyMet,
        physicalProfile,
        selectedKinks,
      }),
    );

    setMessage(
      reaction === "like"
        ? "Liked. Future discovery seeds will lean closer to this vibe."
        : reaction === "maybe"
          ? "Marked as maybe. Future discovery seeds will treat this as a mild positive signal."
          : "Passed. Future discovery seeds will drift away from this vibe.",
    );
  }

  async function handleAnalyzeGeneratedDraft() {
    try {
      const response = await fetch("/api/generate/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markdown: generatedMarkdown,
          brief,
          notes,
          sexualProfile,
          selectedDocuments,
          selectedCharacters,
          selectedTemplates: resolveTemplatePrompts(selectedTemplates),
          selectedBackstories: resolveBackstoryPrompts(selectedBackstories),
          selectedScenarios: resolveScenarioPrompts(selectedScenarios),
          howTheyMet: resolveHowTheyMetPrompt(howTheyMet),
          physicalProfile,
          emotionalLogic,
          relationshipDynamic,
          voiceProfile,
          contrastNotes,
          journalCategories,
          selectedKinks,
          mcProfile,
        }),
      });
      const payload = (await response.json()) as { qualityReport?: DraftQualityReport; error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Unable to analyze draft.");
      }

      setDraftQualityReport(payload.qualityReport ?? null);
      setOriginalDraftQualityReport(null);
      setDraftWasAutoRewritten(false);
      setAnalyzedMarkdownSnapshot(generatedMarkdown);

      return payload.qualityReport ?? null;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to analyze draft.");
      return null;
    }
  }

  function handleSaveCharacter() {
    if (!generatedMarkdown.trim()) {
      return;
    }

    setMessage("Saving generated draft into the character library...");
    setIsWorking(true);
    void (async () => {
      try {
        let report = draftQualityReport;
        if (!report || qualityReportIsStale) {
          report = await handleAnalyzeGeneratedDraft();
        }

        if (!report) {
          setMessage("Save blocked: unable to analyze the current draft.");
          return;
        }

        if (report?.hasSevereIssues) {
          const reason = report.blockingReasons[0] ?? "This draft needs revision before it can be saved.";
          setMessage(`Save blocked: ${reason}`);
          return;
        }

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
    draftQualityReport,
    originalDraftQualityReport,
    draftWasAutoRewritten,
    qualityReportIsStale,
    discoveryMode,
    discoverySeedSummary,
    discoveryPreferenceCount: discoveryPreferences.totalRatings,
    message,
    isWorking,
    activeDocumentRecord,
    activeCharacterRecord,
    isBatchMode,
    batchTemperatures,
    batchResults,
    batchRatings,
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
    setDiscoveryMode,
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
    handleSurpriseMe,
    handleSurpriseMeSingle,
    handleRollConcept,
    handleSelectBatchResult,
    handleRemixBatchResult,
    handleRateBatchResult,
    handleSaveCharacter,
    handleAnalyzeGeneratedDraft,
    handleUpdateCharacter,
    handleDeleteCharacter,
    handleUpdateMetadata,
  };

  return { state, actions };
}

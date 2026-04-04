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

// --- Guided character builder types ---

export type EyeColor =
  | "brown" | "dark-brown" | "light-brown"
  | "blue" | "ice-blue" | "blue-green"
  | "green" | "emerald-green" | "gray-green"
  | "hazel" | "gray" | "steel-gray"
  | "honey-amber" | "golden-brown"
  | "violet" | "nearly-black" | "heterochromia"
  | "";

export type DistinguishingFeature =
  | "freckles" | "beauty-mark" | "dimples" | "gap-teeth"
  | "tattoos-subtle" | "tattoos-heavy" | "piercings-minimal" | "piercings-multiple"
  | "glasses" | "scar-facial" | "scar-body" | "birthmark"
  | "stretch-marks" | "thick-eyebrows" | "long-lashes" | "full-lips"
  | "button-nose" | "strong-jawline" | "high-cheekbones" | "cleft-chin"
  | "curly-textured-hair" | "silver-gray-streak" | "braces" | "vitiligo";

export type PhysicalProfile = {
  bodyType: "petite" | "slim" | "athletic" | "curvy" | "thick" | "voluptuous" | "extreme-voluptuous" | "";
  height: "very-short" | "short" | "average" | "tall" | "very-tall" | "";
  ageRange: "18-22" | "23-27" | "28-33" | "34-40" | "41-50" | "50+" | "";
  ethnicity: string;
  eyeColor: EyeColor;
  distinguishingFeatures: DistinguishingFeature[];
  flirtationStyle: string;
  availabilityStatus: "single" | "divorced" | "its-complicated" | "taken" | "married-forbidden" | "";
};

export const DEFAULT_PHYSICAL_PROFILE: PhysicalProfile = {
  bodyType: "",
  height: "",
  ageRange: "",
  ethnicity: "",
  eyeColor: "",
  distinguishingFeatures: [],
  flirtationStyle: "",
  availabilityStatus: "",
};

export type EmotionalLogic = {
  wound: string;
  armor: string;
  crackInArmor: string;
  contradiction: string;
};

export type AttachmentStyle =
  | "anxious" | "avoidant" | "secure" | "disorganized"
  | "earned-secure" | "anxious-preoccupied" | "dismissive-avoidant"
  | "fearful-avoidant" | "love-bomber" | "protest-behavior"
  | "";

export type RelationshipDynamic = {
  powerDynamic: "user-leads" | "character-leads" | "shifts" | "equals" | "";
  emotionalTemperature: "slow-simmer" | "instant-chemistry" | "antagonistic" | "comfortable-warmth" | "";
  attachmentStyle: AttachmentStyle;
  wantFromUser: string;
  sayTheyWant: string;
};

export type VoiceProfile = {
  textingStyle: "full-sentences" | "fragments" | "emoji-heavy" | "voice-note" | "lowercase-no-punctuation" | "proper-grammar" | "meme-heavy" | "poetic" | "";
  verbalTics: string;
  codeSwitching: string;
  humorStyle: "dry-sarcasm" | "physical-comedy" | "self-deprecating" | "witty-banter" | "dark-humor" | "playful-teasing" | "deadpan" | "flirty-innuendo" | "none" | "";
};

export type JournalCategories = {
  dailyLife: boolean;
  familyBackground: boolean;
  emotionalTriggers: boolean;
  relationshipMilestones: boolean;
  seasonalSituational: boolean;
  workCareer: boolean;
  hobbiesPassions: boolean;
  insecuritiesFears: boolean;
  conflictStyle: boolean;
  friendsSocialLife: boolean;
};

// --- Kink preferences ---

export type KinkPreference =
  | "oral" | "anal" | "rough" | "cnc" | "voyeurism-almost-caught"
  | "public-sex" | "swallowing" | "facials" | "bondage-tied-up"
  | "dirty-talk" | "water-sports" | "age-play" | "race-play" | "roleplay";

// --- Male MC Profile ---

export type MCProfile = {
  name: string;
  age: string;
  occupation: string;
  personality: string;
  livingSituation: string;
  backstory: string;
  lookingFor: string;
  howOthersPerceive: string;
};

export const DEFAULT_MC_PROFILE: MCProfile = {
  name: "",
  age: "",
  occupation: "",
  personality: "",
  livingSituation: "",
  backstory: "",
  lookingFor: "",
  howOthersPerceive: "",
};

// --- Generation payload ---

export type GenerationPayload = {
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
};

// --- Character section types ---

export type CharacterSectionKey =
  | "name"
  | "overview"
  | "backstory"
  | "avatar_prompt"
  | "selfie_description"
  | "response_directive"
  | "example_message"
  | "key_memories"
  | "journal_entries"
  | "greeting_options"
  | "selfie_prompts";

export type JournalEntry = {
  title: string;
  content: string;
};

export type GreetingEntry = {
  title: string;
  content: string;
};

export const KINDROID_LIMITS: Partial<Record<CharacterSectionKey | string, number>> = {
  backstory: 2500,
  response_directive: 250,
  key_memories: 1000,
  example_message: 750,
  avatar_prompt: 200,
  selfie_description: 800,
  journal_entry: 500,
  greeting: 730,
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

// --- Default values ---

export const DEFAULT_EMOTIONAL_LOGIC: EmotionalLogic = {
  wound: "",
  armor: "",
  crackInArmor: "",
  contradiction: "",
};

export const DEFAULT_RELATIONSHIP_DYNAMIC: RelationshipDynamic = {
  powerDynamic: "",
  emotionalTemperature: "",
  attachmentStyle: "",
  wantFromUser: "",
  sayTheyWant: "",
};

export const DEFAULT_VOICE_PROFILE: VoiceProfile = {
  textingStyle: "",
  verbalTics: "",
  codeSwitching: "",
  humorStyle: "",
};

export const DEFAULT_JOURNAL_CATEGORIES: JournalCategories = {
  dailyLife: true,
  familyBackground: true,
  emotionalTriggers: false,
  relationshipMilestones: false,
  seasonalSituational: false,
  workCareer: false,
  hobbiesPassions: false,
  insecuritiesFears: false,
  conflictStyle: false,
  friendsSocialLife: false,
};

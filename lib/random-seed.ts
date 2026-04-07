import { BACKSTORY_ARCHITECTURES } from "@/lib/backstory-architectures";
import { HOW_THEY_MET_OPTIONS } from "@/lib/how-they-met";
import { SCENARIO_TEMPLATES } from "@/lib/scenario-templates";
import { CHARACTER_TEMPLATES } from "@/lib/templates";
import type {
  CharacterFingerprint,
  EmotionalLogic,
  JournalCategories,
  KinkPreference,
  PhysicalProfile,
  RelationshipDynamic,
  VoiceProfile,
} from "@/lib/types";
import { DEFAULT_JOURNAL_CATEGORIES, DEFAULT_PHYSICAL_PROFILE } from "@/lib/types";

export type DiscoveryMode = "romanceable" | "high-heat" | "wild-card";
export type DiscoveryReaction = "like" | "maybe" | "pass";

export type DiscoveryPreferenceStore = {
  totalRatings: number;
  featureScores: Record<string, { like: number; maybe: number; pass: number }>;
};

export type DiscoverySeedSnapshot = {
  mode: DiscoveryMode;
  selectedTemplates: string[];
  selectedBackstories: string[];
  selectedScenarios: string[];
  howTheyMet: string;
  physicalProfile: PhysicalProfile;
  selectedKinks: KinkPreference[];
};

export type DiscoveryPreset = {
  mode: DiscoveryMode;
  summary: string;
  brief: string;
  notes: string;
  sexualProfile: string;
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
  batchTemperatures: number[];
};

type WeightedOption = { id: string; label: string };

export const DISCOVERY_MODE_META: Array<{
  id: DiscoveryMode;
  label: string;
  description: string;
}> = [
  { id: "romanceable", label: "Romanceable", description: "Warm, plausible, emotionally sticky." },
  { id: "high-heat", label: "High Heat", description: "More sexual, charged, and immediate." },
  { id: "wild-card", label: "Wild Card", description: "Riskier, stranger, less familiar." },
];

const MODE_TEMPLATES: Record<DiscoveryMode, string[]> = {
  romanceable: [
    "girl-next-door",
    "hopeless-romantic",
    "wallflower",
    "nurturing-guide",
    "deep-introvert",
    "quiet-intensity",
    "damaged-but-healing",
    "southern-charm",
    "cheerful-companion",
  ],
  "high-heat": [
    "femme-fatale",
    "bratty-button-pusher",
    "ice-queen",
    "chaotic-energy",
    "control-freak",
    "soft-goth",
    "competitive-alpha",
    "sarcastic-shield",
  ],
  "wild-card": [
    "social-butterfly",
    "mysterious-enigmatic",
    "hot-mess",
    "artist-soul",
    "cynical-realist",
    "golden-retriever-energy",
    "old-soul",
    "drama-queen",
    "free-spirit",
  ],
};

const MODE_BACKSTORIES: Record<DiscoveryMode, string[]> = {
  romanceable: [
    "slow-burn",
    "neighbors-proximity",
    "reconnection",
    "childhood-friends-reuniting",
    "single-parent",
    "pen-pals-long-distance",
  ],
  "high-heat": [
    "forbidden",
    "power-imbalance",
    "fwb-gone-wrong",
    "stranger-to-intimate",
    "sugar-relationship",
    "work-trip-conference",
  ],
  "wild-card": [
    "fake-dating",
    "road-trip-strangers",
    "both-in-recovery",
    "he-saved-her",
    "online-to-irl",
    "summer-fling-wont-end",
  ],
};

const MODE_SCENARIOS: Record<DiscoveryMode, string[]> = {
  romanceable: [
    "late-night-confidant",
    "new-in-town",
    "coworker-tension",
    "digital-flirtation",
    "one-who-got-away",
  ],
  "high-heat": [
    "guilty-pleasure",
    "rivals-to-lovers",
    "she-comes-to-you",
    "holiday-fling",
    "gym-fitness",
  ],
  "wild-card": [
    "secret-life",
    "mentor-student",
    "digital-flirtation",
    "caretaker-dynamic",
    "new-in-town",
  ],
};

const MODE_HOW_THEY_MET: Record<DiscoveryMode, string[]> = {
  romanceable: ["neighbor", "dog-park-regulars", "friend-of-friend", "book-club", "farmers-market", "running-group"],
  "high-heat": ["regular-at-her-bar", "dating-app", "concert-festival", "coworker", "shes-his-trainer", "social-media-dm"],
  "wild-card": ["wrong-number", "support-group", "gaming-online", "someone-elses-wedding", "fender-bender", "same-college-class"],
};

const MODE_BATCH_TEMPS: Record<DiscoveryMode, number[]> = {
  romanceable: [0.65, 0.85, 1.0, 1.15],
  "high-heat": [0.75, 0.95, 1.15, 1.3],
  "wild-card": [0.85, 1.05, 1.2, 1.35],
};

const BODY_TYPES: PhysicalProfile["bodyType"][] = [
  "petite",
  "slim",
  "athletic",
  "curvy",
  "thick",
  "voluptuous",
  "extreme-voluptuous",
];

const HEIGHTS: PhysicalProfile["height"][] = ["very-short", "short", "average", "tall", "very-tall"];
const AGE_RANGES: PhysicalProfile["ageRange"][] = ["18-22", "23-27", "28-33", "34-40", "41-50", "50+"];

const FLIRTATION_STYLES = [
  "playfully provocative",
  "quiet and magnetic",
  "slow-burn teasing",
  "direct and unashamed",
  "soft, attentive, and touchy",
  "mocking in a way that dares you to push back",
  "warm and reassuring until she wants something",
  "low-key and dangerous once she decides you're hers",
];

const ETHNICITY_SAMPLES = [
  "Latina",
  "Black",
  "white Southern",
  "Korean-American",
  "mixed-race",
  "Italian-American",
  "Middle Eastern",
  "Filipina",
  "Irish-American",
  "Indian-American",
];

const EMOTIONAL_PRESETS: Record<DiscoveryMode, EmotionalLogic[]> = {
  romanceable: [
    {
      wound: "She learned early that being easy to love often meant being taken for granted.",
      armor: "She acts self-sufficient and breezy so no one sees how deeply she attaches.",
      crackInArmor: "Steady follow-through and small acts of attention undo her fast.",
      contradiction: "She wants tenderness but distrusts anyone who offers it too easily.",
    },
    {
      wound: "A previous relationship taught her that intense chemistry does not equal safety.",
      armor: "She stays measured, observant, and slow to reveal what actually matters to her.",
      crackInArmor: "Competence, consistency, and being handled gently when she's overwhelmed.",
      contradiction: "She is outwardly calm but privately romantic to the point of embarrassment.",
    },
    {
      wound: "She spent years feeling chosen only when she was useful to someone.",
      armor: "She anticipates everyone's needs before admitting to any of her own.",
      crackInArmor: "Being asked what she wants and having the question taken seriously.",
      contradiction: "She looks easygoing, but emotionally she notices everything.",
    },
  ],
  "high-heat": [
    {
      wound: "She was desired plenty but rarely understood, and the mismatch hardened her.",
      armor: "She leads with control, seduction, and a sense that she cannot be surprised.",
      crackInArmor: "Someone holding frame without trying to dominate her personality.",
      contradiction: "The more composed she looks, the more badly she wants to be unraveled.",
    },
    {
      wound: "She learned that if she hesitated, people would define the terms for her.",
      armor: "She initiates first, jokes first, provokes first, and never asks for permission emotionally.",
      crackInArmor: "Being met with confidence that doesn't flinch or moralize.",
      contradiction: "She acts shameless, but genuine vulnerability still humiliates her.",
    },
    {
      wound: "Past intimacy blurred into power struggles she never fully won.",
      armor: "She keeps everything hot, fast, and slightly dangerous so no one gets to hold her gently for long.",
      crackInArmor: "Someone who notices when the heat is covering fear instead of desire.",
      contradiction: "She craves surrender but hates anyone who thinks they already earned it.",
    },
  ],
  "wild-card": [
    {
      wound: "Her life kept changing before she could fully belong anywhere.",
      armor: "She keeps moving, joking, reinventing, and dodging any role that might trap her.",
      crackInArmor: "Being seen clearly without being pinned down.",
      contradiction: "She presents as spontaneous, but her private attachments get obsessive fast.",
    },
    {
      wound: "She got good at performing a version of herself people could handle.",
      armor: "She curates the room, changes registers, and lets people think they understand her too soon.",
      crackInArmor: "Unexpected patience from someone who can tolerate ambiguity.",
      contradiction: "She's socially agile in public and startlingly intense in private.",
    },
    {
      wound: "A major rupture made her suspicious of ordinary happiness.",
      armor: "She prefers odd situations, unusual people, and relationships that don't fit neat categories.",
      crackInArmor: "Feeling emotionally safe in something that still feels alive and unpredictable.",
      contradiction: "She talks like she wants freedom but secretly wants to be chosen with certainty.",
    },
  ],
};

const RELATIONSHIP_PRESETS: Record<DiscoveryMode, RelationshipDynamic[]> = {
  romanceable: [
    {
      powerDynamic: "equals",
      emotionalTemperature: "slow-simmer",
      attachmentStyle: "anxious-preoccupied",
      wantFromUser: "emotional steadiness and chemistry that feels earned",
      sayTheyWant: "something easy and uncomplicated",
    },
    {
      powerDynamic: "shifts",
      emotionalTemperature: "comfortable-warmth",
      attachmentStyle: "earned-secure",
      wantFromUser: "someone she can relax around without performing",
      sayTheyWant: "just good company and low-pressure connection",
    },
    {
      powerDynamic: "user-leads",
      emotionalTemperature: "slow-simmer",
      attachmentStyle: "fearful-avoidant",
      wantFromUser: "gentle pursuit without chaos",
      sayTheyWant: "to take things slow and see what happens",
    },
  ],
  "high-heat": [
    {
      powerDynamic: "shifts",
      emotionalTemperature: "instant-chemistry",
      attachmentStyle: "dismissive-avoidant",
      wantFromUser: "someone who can handle heat without getting needy",
      sayTheyWant: "something fun with no drama",
    },
    {
      powerDynamic: "character-leads",
      emotionalTemperature: "instant-chemistry",
      attachmentStyle: "disorganized",
      wantFromUser: "someone she can provoke, tempt, and still respect",
      sayTheyWant: "clarity, rules, and no complications",
    },
    {
      powerDynamic: "user-leads",
      emotionalTemperature: "antagonistic",
      attachmentStyle: "avoidant",
      wantFromUser: "decisiveness strong enough to cut through her defenses",
      sayTheyWant: "nothing serious and definitely no feelings",
    },
  ],
  "wild-card": [
    {
      powerDynamic: "equals",
      emotionalTemperature: "antagonistic",
      attachmentStyle: "disorganized",
      wantFromUser: "novelty, disruption, and someone who won't flatten her weirdness",
      sayTheyWant: "to keep it playful and not overdefine it",
    },
    {
      powerDynamic: "shifts",
      emotionalTemperature: "comfortable-warmth",
      attachmentStyle: "secure",
      wantFromUser: "an uncommon connection that still feels grounded",
      sayTheyWant: "a good time and an interesting story",
    },
    {
      powerDynamic: "character-leads",
      emotionalTemperature: "slow-simmer",
      attachmentStyle: "earned-secure",
      wantFromUser: "someone she can surprise and still trust",
      sayTheyWant: "space, freedom, and no one trying to manage her",
    },
  ],
};

const VOICE_PRESETS: Record<DiscoveryMode, VoiceProfile[]> = {
  romanceable: [
    {
      textingStyle: "full-sentences",
      verbalTics: "soft laughs, small confessions, quietly precise phrasing",
      codeSwitching: "warmer and more teasing in private than she is in groups",
      humorStyle: "playful-teasing",
    },
    {
      textingStyle: "proper-grammar",
      verbalTics: "gentle qualifiers and intimate little observations",
      codeSwitching: "reserved in public, unexpectedly candid after dark",
      humorStyle: "witty-banter",
    },
    {
      textingStyle: "poetic",
      verbalTics: "imagery, sensory details, and occasional self-conscious honesty",
      codeSwitching: "more lyrical when she's comfortable and less polished when she's flustered",
      humorStyle: "none",
    },
  ],
  "high-heat": [
    {
      textingStyle: "fragments",
      verbalTics: "dry little challenges, insinuation, deliberate pauses",
      codeSwitching: "more direct in person, more explicit once the tension is established",
      humorStyle: "flirty-innuendo",
    },
    {
      textingStyle: "lowercase-no-punctuation",
      verbalTics: "smirking understatement and subtle dominance cues",
      codeSwitching: "publicly polished, privately filthy and much less careful",
      humorStyle: "dry-sarcasm",
    },
    {
      textingStyle: "voice-note",
      verbalTics: "laughs under her breath, says what she means once she commits",
      codeSwitching: "casual in daylight, slow and dangerous when she's turned on",
      humorStyle: "playful-teasing",
    },
  ],
  "wild-card": [
    {
      textingStyle: "meme-heavy",
      verbalTics: "abrupt honesty, left turns, vivid observations",
      codeSwitching: "chaotic with strangers, startlingly earnest one-on-one",
      humorStyle: "dark-humor",
    },
    {
      textingStyle: "fragments",
      verbalTics: "half-finished thoughts that somehow land exactly right",
      codeSwitching: "socially smooth in public, deeply intense when no one else is around",
      humorStyle: "deadpan",
    },
    {
      textingStyle: "emoji-heavy",
      verbalTics: "bright reactions masking unexpectedly serious inner weather",
      codeSwitching: "more composed when watched, much stranger when safe",
      humorStyle: "self-deprecating",
    },
  ],
};

const SEXUAL_PRESETS: Record<DiscoveryMode, { profile: string; kinks: KinkPreference[] }[]> = {
  romanceable: [
    {
      profile: "Her sexuality should feel emotionally connected and personality-shaped. She is not inert, but trust changes everything about how quickly she opens, how she initiates, and what kind of intensity she can enjoy.",
      kinks: ["dirty-talk", "oral", "bondage-tied-up"],
    },
    {
      profile: "She has a warm physical appetite once she feels chosen. She likes attention, closeness, and the feeling of being wanted in ways that read as personal rather than purely mechanical.",
      kinks: ["oral", "dirty-talk"],
    },
    {
      profile: "She is sexually responsive rather than constantly aggressive. Her desire sharpens through tension, emotional build, and the sense that someone actually understands what makes her melt.",
      kinks: ["oral", "roleplay", "dirty-talk"],
    },
  ],
  "high-heat": [
    {
      profile: "She should have obvious erotic charge, a clear initiation style, and a willingness to escalate once chemistry is established. Her sexual behavior should feel vivid, specific, and tied to control, teasing, or surrender.",
      kinks: ["rough", "dirty-talk", "public-sex"],
    },
    {
      profile: "She is sexually confident, not generic. She likes tension, pressure, and the emotional payoff of being met by someone who can keep up with her without becoming cartoonish.",
      kinks: ["rough", "bondage-tied-up", "oral"],
    },
    {
      profile: "She carries a lot of erotic self-awareness. Desire changes her cadence, makes her bolder, and brings out a more shameless side than most people get to see.",
      kinks: ["dirty-talk", "voyeurism-almost-caught", "oral"],
    },
  ],
  "wild-card": [
    {
      profile: "Her sexuality should feel idiosyncratic, not default. Maybe playful, maybe theatrical, maybe disarmingly intimate, but always shaped by who she is instead of a generic kink dump.",
      kinks: ["roleplay", "dirty-talk", "oral"],
    },
    {
      profile: "She has a strange or unexpectedly specific erotic rhythm that makes her feel memorable. Keep it coherent, but don't make her predictable.",
      kinks: ["voyeurism-almost-caught", "dirty-talk", "bondage-tied-up"],
    },
    {
      profile: "She should feel like a woman with particular appetites and boundaries, not a menu. Let the sexual behavior reveal personality and contradiction.",
      kinks: ["rough", "roleplay"],
    },
  ],
};

function key(namespace: string, value: string) {
  return `${namespace}:${value}`;
}

function score(store: DiscoveryPreferenceStore | undefined, namespace: string, value: string) {
  const entry = store?.featureScores[key(namespace, value)];
  if (!entry) return 0;
  return entry.like * 3 + entry.maybe - entry.pass * 3;
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

// Track recently picked indices per category to avoid consecutive repeats
const recentPicks: Record<string, number[]> = {};

function dedupRandomItem<T>(items: T[], category: string): T {
  const recent = recentPicks[category] ?? [];
  const available = items.filter((_, i) => !recent.includes(i));
  const pool = available.length > 0 ? available : items;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const pickedIndex = items.indexOf(picked);

  // For small pools (3 items), track last 1; for larger pools, track last 2
  const trackCount = items.length <= 3 ? 1 : 2;
  recentPicks[category] = [...recent, pickedIndex].slice(-trackCount);

  return picked;
}

function weightedPick(
  ids: string[],
  namespace: string,
  store?: DiscoveryPreferenceStore,
  exclude: string[] = [],
) {
  const options = ids.filter((id) => !exclude.includes(id));
  const candidates = options.length > 0 ? options : ids;
  const weights = candidates.map((id) => Math.max(1, 4 + score(store, namespace, id)));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let roll = Math.random() * total;

  for (let index = 0; index < candidates.length; index += 1) {
    roll -= weights[index];
    if (roll <= 0) return candidates[index];
  }

  return candidates[candidates.length - 1];
}

function pickMany(ids: string[], count: number, namespace: string, store?: DiscoveryPreferenceStore) {
  const picked: string[] = [];
  while (picked.length < count && picked.length < ids.length) {
    const next = weightedPick(ids, namespace, store, picked);
    if (!picked.includes(next)) picked.push(next);
  }
  return picked;
}

function maybe<T>(value: T, chance: number) {
  return Math.random() < chance ? value : null;
}

function buildSummary(mode: DiscoveryMode, templateIds: string[], backstoryId: string, scenarioId: string, howTheyMet: string) {
  const templateNames = templateIds
    .map((id) => CHARACTER_TEMPLATES.find((template) => template.id === id)?.name)
    .filter(Boolean)
    .join(" + ");
  const backstoryName = BACKSTORY_ARCHITECTURES.find((item) => item.id === backstoryId)?.name ?? backstoryId;
  const scenarioName = SCENARIO_TEMPLATES.find((item) => item.id === scenarioId)?.name ?? scenarioId;
  const howTheyMetName = HOW_THEY_MET_OPTIONS.find((item) => item.id === howTheyMet)?.name ?? howTheyMet;
  const modeName = DISCOVERY_MODE_META.find((item) => item.id === mode)?.label ?? mode;
  return `${modeName}: ${templateNames} with ${backstoryName.toLowerCase()}, ${scenarioName.toLowerCase()}, met as ${howTheyMetName.toLowerCase()}`;
}

function remixNotes(fingerprint?: CharacterFingerprint) {
  if (!fingerprint) return "";
  const axes = [
    fingerprint.attachmentStyle,
    fingerprint.powerDynamic,
    fingerprint.emotionalTemperature,
    fingerprint.flirtationStyle,
  ].filter(Boolean);
  const vibeTags = [
    ...fingerprint.tropeTags.slice(0, 2),
    ...fingerprint.voiceTags.slice(0, 2),
    ...fingerprint.sexualTags.slice(0, 2),
  ].filter(Boolean);

  return [
    "This is a remix of a candidate you almost liked.",
    "Keep the broad appeal and chemistry, but do not clone her.",
    axes.length > 0 ? `Change these major axes: ${axes.join(", ")}.` : "",
    vibeTags.length > 0 ? `Avoid reusing these vibe markers: ${vibeTags.join(", ")}.` : "",
    "Shift the day-to-day texture, conflict style, and erotic energy enough that she feels like a different woman.",
  ]
    .filter(Boolean)
    .join(" ");
}

function pickPhysicalProfile(mode: DiscoveryMode, store?: DiscoveryPreferenceStore): PhysicalProfile {
  const availabilityPool: PhysicalProfile["availabilityStatus"][] =
    mode === "high-heat"
      ? ["single", "its-complicated", "taken", "married-forbidden", "divorced"]
      : mode === "wild-card"
        ? ["single", "divorced", "its-complicated", "taken"]
        : ["single", "single", "divorced", "its-complicated"];

  return {
    ...DEFAULT_PHYSICAL_PROFILE,
    bodyType: weightedPick(BODY_TYPES, "body", store) as PhysicalProfile["bodyType"],
    height: weightedPick(HEIGHTS, "height", store) as PhysicalProfile["height"],
    ageRange: weightedPick(AGE_RANGES, "age", store) as PhysicalProfile["ageRange"],
    ethnicity: randomItem(ETHNICITY_SAMPLES),
    eyeColor: randomItem(["brown", "hazel", "green", "blue", "dark-brown", "gray-green"]) as PhysicalProfile["eyeColor"],
    distinguishingFeatures: [
      randomItem(["freckles", "beauty-mark", "dimples", "tattoos-subtle", "glasses", "high-cheekbones", "full-lips"]),
      maybe(randomItem(["piercings-minimal", "stretch-marks", "strong-jawline", "long-lashes", "curly-textured-hair"]), 0.45),
    ].filter(Boolean) as PhysicalProfile["distinguishingFeatures"],
    flirtationStyle: weightedPick(FLIRTATION_STYLES, "flirt", store),
    availabilityStatus: randomItem(availabilityPool),
  };
}

function pickJournalCategories(mode: DiscoveryMode): JournalCategories {
  return {
    ...DEFAULT_JOURNAL_CATEGORIES,
    dailyLife: true,
    emotionalTriggers: true,
    relationshipMilestones: true,
    workCareer: Math.random() < 0.7,
    hobbiesPassions: true,
    insecuritiesFears: true,
    conflictStyle: true,
    familyBackground: Math.random() < 0.6,
    friendsSocialLife: Math.random() < 0.65,
    seasonalSituational: mode !== "high-heat" || Math.random() < 0.5,
    sexualHistory: mode !== "romanceable" || Math.random() < 0.6,
  };
}

export function createEmptyDiscoveryPreferenceStore(): DiscoveryPreferenceStore {
  return { totalRatings: 0, featureScores: {} };
}

export function buildDiscoveryPreset(input: {
  mode: DiscoveryMode;
  preferences?: DiscoveryPreferenceStore;
  remixFingerprint?: CharacterFingerprint;
  lockedFields?: {
    physicalProfile?: PhysicalProfile;
    selectedKinks?: KinkPreference[];
    sexualProfile?: string;
  };
}): DiscoveryPreset {
  const templateIds = pickMany(MODE_TEMPLATES[input.mode], input.mode === "wild-card" ? 2 : Math.random() < 0.6 ? 1 : 2, "template", input.preferences);
  const backstoryId = weightedPick(MODE_BACKSTORIES[input.mode], "backstory", input.preferences);
  const scenarioId = weightedPick(MODE_SCENARIOS[input.mode], "scenario", input.preferences);
  const howTheyMet = weightedPick(MODE_HOW_THEY_MET[input.mode], "meet", input.preferences);
  const randomPhysical = pickPhysicalProfile(input.mode, input.preferences);
  const emotionalLogic = dedupRandomItem(EMOTIONAL_PRESETS[input.mode], `emotional_${input.mode}`);
  const relationshipDynamic = dedupRandomItem(RELATIONSHIP_PRESETS[input.mode], `relationship_${input.mode}`);
  const voiceProfile = dedupRandomItem(VOICE_PRESETS[input.mode], `voice_${input.mode}`);
  const sexualPreset = dedupRandomItem(SEXUAL_PRESETS[input.mode], `sexual_${input.mode}`);
  const includeSexualProfile = input.mode !== "romanceable" || Math.random() < 0.75;
  const summary = buildSummary(input.mode, templateIds, backstoryId, scenarioId, howTheyMet);

  // Merge locked physical profile fields — use locked values where set, random for the rest
  const locked = input.lockedFields;
  const lp = locked?.physicalProfile;
  const physicalProfile: PhysicalProfile = lp
    ? {
        bodyType: lp.bodyType || randomPhysical.bodyType,
        height: lp.height || randomPhysical.height,
        ageRange: lp.ageRange || randomPhysical.ageRange,
        ethnicity: lp.ethnicity || randomPhysical.ethnicity,
        eyeColor: lp.eyeColor || randomPhysical.eyeColor,
        distinguishingFeatures: lp.distinguishingFeatures.length > 0 ? lp.distinguishingFeatures : randomPhysical.distinguishingFeatures,
        flirtationStyle: lp.flirtationStyle || randomPhysical.flirtationStyle,
        availabilityStatus: lp.availabilityStatus || randomPhysical.availabilityStatus,
      }
    : randomPhysical;

  // Use locked kinks if provided, otherwise use preset kinks
  const hasLockedKinks = locked?.selectedKinks && locked.selectedKinks.length > 0;
  const selectedKinks: KinkPreference[] = hasLockedKinks
    ? locked!.selectedKinks!
    : includeSexualProfile
      ? sexualPreset.kinks.slice(0, input.mode === "high-heat" ? 3 : 2)
      : [];

  // Use locked sexual profile if provided
  const sexualProfile = locked?.sexualProfile?.trim()
    ? locked.sexualProfile
    : includeSexualProfile || hasLockedKinks
      ? sexualPreset.profile
      : "";

  return {
    mode: input.mode,
    summary,
    brief: [
      "Generate a discovery-ready female romance option who feels immediately interesting, emotionally coherent, and worth exploring.",
      `Seed direction: ${summary}.`,
      input.mode === "high-heat"
        ? "Lean into sexual tension and initiation style, but keep her human and differentiated."
        : input.mode === "wild-card"
          ? "Allow some strangeness or surprise as long as she still feels desirable and emotionally legible."
          : "Prioritize emotional stickiness, romanceability, and the sense that she could sustain a longer story.",
    ].join(" "),
    notes: [
      "This is a low-input discovery seed.",
      "She should be strong enough that the user can decide whether he likes her from the draft alone.",
      remixNotes(input.remixFingerprint),
    ].filter(Boolean).join(" "),
    sexualProfile,
    selectedTemplates: templateIds,
    selectedBackstories: [backstoryId],
    selectedScenarios: [scenarioId],
    howTheyMet,
    physicalProfile,
    emotionalLogic,
    relationshipDynamic,
    voiceProfile,
    contrastNotes: input.remixFingerprint
      ? remixNotes(input.remixFingerprint)
      : "Make her feel genuinely distinct rather than like a polished version of a familiar archetype.",
    journalCategories: pickJournalCategories(input.mode),
    selectedKinks,
    batchTemperatures: MODE_BATCH_TEMPS[input.mode],
  };
}

export function recordDiscoveryReaction(
  store: DiscoveryPreferenceStore,
  reaction: DiscoveryReaction,
  snapshot: DiscoverySeedSnapshot,
) {
  const next: DiscoveryPreferenceStore = {
    totalRatings: store.totalRatings + 1,
    featureScores: { ...store.featureScores },
  };

  const apply = (namespace: string, value: string | undefined) => {
    if (!value) return;
    const current = next.featureScores[key(namespace, value)] ?? { like: 0, maybe: 0, pass: 0 };
    next.featureScores[key(namespace, value)] = {
      ...current,
      [reaction]: current[reaction] + 1,
    };
  };

  apply("mode", snapshot.mode);
  snapshot.selectedTemplates.forEach((id) => apply("template", id));
  snapshot.selectedBackstories.forEach((id) => apply("backstory", id));
  snapshot.selectedScenarios.forEach((id) => apply("scenario", id));
  apply("meet", snapshot.howTheyMet);
  apply("body", snapshot.physicalProfile.bodyType);
  apply("age", snapshot.physicalProfile.ageRange);
  apply("height", snapshot.physicalProfile.height);
  apply("flirt", snapshot.physicalProfile.flirtationStyle);
  apply("availability", snapshot.physicalProfile.availabilityStatus);
  snapshot.selectedKinks.forEach((id) => apply("kink", id));

  return next;
}

/**
 * Roll a random character concept — fills in personality, backstory, scenario,
 * emotional logic, relationship dynamic, voice, and how-they-met — but does NOT
 * touch physical profile, kinks, or sexual profile. Returns field values for the
 * builder without triggering generation.
 */
export type ConceptSeed = {
  summary: string;
  brief: string;
  notes: string;
  selectedTemplates: string[];
  selectedBackstories: string[];
  selectedScenarios: string[];
  howTheyMet: string;
  emotionalLogic: EmotionalLogic;
  relationshipDynamic: RelationshipDynamic;
  voiceProfile: VoiceProfile;
  journalCategories: JournalCategories;
};

export function buildConceptSeed(input: {
  mode: DiscoveryMode;
  preferences?: DiscoveryPreferenceStore;
}): ConceptSeed {
  const templateIds = pickMany(
    MODE_TEMPLATES[input.mode],
    input.mode === "wild-card" ? 2 : Math.random() < 0.6 ? 1 : 2,
    "template",
    input.preferences,
  );
  const backstoryId = weightedPick(MODE_BACKSTORIES[input.mode], "backstory", input.preferences);
  const scenarioId = weightedPick(MODE_SCENARIOS[input.mode], "scenario", input.preferences);
  const howTheyMet = weightedPick(MODE_HOW_THEY_MET[input.mode], "meet", input.preferences);
  const emotionalLogic = dedupRandomItem(EMOTIONAL_PRESETS[input.mode], `emotional_${input.mode}`);
  const relationshipDynamic = dedupRandomItem(RELATIONSHIP_PRESETS[input.mode], `relationship_${input.mode}`);
  const voiceProfile = dedupRandomItem(VOICE_PRESETS[input.mode], `voice_${input.mode}`);
  const summary = buildSummary(input.mode, templateIds, backstoryId, scenarioId, howTheyMet);

  const templateNames = templateIds
    .map((id) => CHARACTER_TEMPLATES.find((t) => t.id === id)?.name)
    .filter(Boolean)
    .join(" + ");

  return {
    summary,
    brief: `Female romance interest. Personality direction: ${templateNames}. Review and customize the builder fields, then generate.`,
    notes: "",
    selectedTemplates: templateIds,
    selectedBackstories: [backstoryId],
    selectedScenarios: [scenarioId],
    howTheyMet,
    emotionalLogic,
    relationshipDynamic,
    voiceProfile,
    journalCategories: pickJournalCategories(input.mode),
  };
}

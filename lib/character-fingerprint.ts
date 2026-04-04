import type {
  CharacterFingerprint,
  CharacterSummary,
  DraftAnalysisPayload,
} from "@/lib/types";
import { parseCharacterSections, parseGreetingEntries, parseJournalEntries } from "@/lib/section-parser";
import { stripMarkdown } from "@/lib/utils";

const TROPE_PATTERNS: Record<string, RegExp[]> = {
  "girl-next-door": [/girl next door/i, /\bapproachable\b/i, /\blow[- ]maintenance\b/i],
  "ice-queen": [/ice queen/i, /\bcold exterior\b/i, /\bpolished\b/i, /\bguarded\b/i],
  "dark-brooding": [/dark\b/i, /\bbrooding\b/i, /\baloof\b/i],
  "free-spirit": [/free spirit/i, /\buntethered\b/i, /\bchaotic\b/i, /\bspontaneous\b/i],
  "nurturing": [/\bnurturing\b/i, /\btender\b/i, /\bsupportive\b/i, /\bcaretaker\b/i],
  "femme-fatale": [/femme fatale/i, /\bdangerously self-aware\b/i, /\bseduct/i],
  "golden-retriever": [/golden retriever/i, /\benthusiastic\b/i, /\bbouncy\b/i],
  "quiet-intensity": [/\bquiet intensity\b/i, /\bfew words\b/i, /\bsilent\b/i],
  "old-soul": [/\bold soul\b/i, /\bwise beyond\b/i, /\bgrounded\b/i],
};

const VOICE_PATTERNS: Record<string, RegExp[]> = {
  sarcastic: [/\bsarcas/i, /\bdry humor\b/i, /\bdeadpan\b/i],
  teasing: [/\bteas/i, /\bplayful\b/i, /\bbanter\b/i],
  poetic: [/\blyrical\b/i, /\bpoetic\b/i, /\bimagery\b/i],
  warm: [/\bwarm\b/i, /\btender\b/i, /\bgentle\b/i],
  blunt: [/\bblunt\b/i, /\bsharp\b/i, /\bdoesn'?t waste words\b/i],
  flirty: [/\bflirty\b/i, /\binnuendo\b/i, /\bsultry\b/i],
};

const SEXUAL_PATTERNS: Record<string, RegExp[]> = {
  oral: [/\boral\b/i, /\bmouth\b/i, /\bswallow/i],
  anal: [/\banal\b/i],
  rough: [/\brough\b/i, /\bpin(?:s|ned)\b/i, /\bmanhandl/i],
  cnc: [/\bconsensual non-consent\b/i, /\bcnc\b/i, /\btake me\b/i, /\bforce\b/i],
  voyeurism: [/\balmost caught\b/i, /\bvoyeur/i],
  "public-sex": [/\bpublic sex\b/i, /\brisky location/i],
  bondage: [/\bbondage\b/i, /\btied up\b/i, /\brope\b/i],
  "dirty-talk": [/\bdirty talk\b/i, /\btalk dirty\b/i],
  aftercare: [/\baftercare\b/i, /\bhold(?:ing)? her\b/i, /\bcuddle\b/i],
  "high-drive": [/\bhigh sex drive\b/i, /\binitiates\b/i, /\bstrong appetite\b/i],
};

const SOCIAL_PATTERNS: Record<string, RegExp[]> = {
  reserved: [/\breserved\b/i, /\bguarded\b/i, /\bquiet\b/i, /\bshy\b/i],
  outgoing: [/\boutgoing\b/i, /\bsocial butterfly\b/i, /\bmagnetic\b/i, /\blights up\b/i],
  grounded: [/\bgrounded\b/i, /\bsteady\b/i, /\breliable\b/i],
  chaotic: [/\bchaotic\b/i, /\bimpulsive\b/i, /\bunpredictable\b/i],
  intense: [/\bintense\b/i, /\ball-consuming\b/i, /\bfull volume\b/i],
};

const CONFLICT_PATTERNS: Record<string, RegExp[]> = {
  avoidant: [/\bpulls back\b/i, /\bwithdraw/i, /\bgoes quiet\b/i],
  confrontational: [/\bargue\b/i, /\bconfront/i, /\bfights dirty\b/i],
  appeasing: [/\bpeople pleaser\b/i, /\bkeeps the peace\b/i, /\bapologizes first\b/i],
  jealous: [/\bjealous\b/i, /\bpossessive\b/i, /\bterritorial\b/i],
};

const RELATIONSHIP_PATTERNS: Record<string, RegExp[]> = {
  slowburn: [/\bslow burn\b/i, /\bknown each other\b/i, /\bnear-miss/i],
  forbidden: [/\bforbidden\b/i, /\bmarried\b/i, /\boff-limits\b/i],
  neighbors: [/\bneighbor\b/i, /\bdown the street\b/i, /\bsame subdivision\b/i],
  coworker: [/\bcoworker\b/i, /\boffice\b/i, /\bworkplace\b/i],
  reconnection: [/\breconnect/i, /\bfrom the past\b/i, /\blost touch\b/i],
  "instant-chemistry": [/\binstant chemistry\b/i, /\bimmediate\b/i, /\bdisorienting\b/i],
};

const BODY_TERMS = /\b(breasts?|boobs?|thighs?|hips?|ass|butt|waist|legs?|curves?)\b/i;
const CLOTHING_TERMS = /\b(dress|shirt|jeans|skirt|heels|sweater|jacket|lingerie|bra|shorts|leggings|tank top)\b/i;

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function matchTags(text: string, patterns: Record<string, RegExp[]>) {
  const tags: string[] = [];
  for (const [tag, rules] of Object.entries(patterns)) {
    if (rules.some((pattern) => pattern.test(text))) {
      tags.push(tag);
    }
  }
  return tags;
}

function parseOverviewValue(overview: string, label: string) {
  const match = overview.match(new RegExp(`[-*]\\s*${label}\\s*:\\s*(.+)`, "i"));
  return match?.[1]?.trim() ?? "";
}

function inferAvailability(text: string) {
  if (/\bmarried\b/i.test(text)) return "married-forbidden";
  if (/\bit'?s complicated\b/i.test(text) || /\bsituationship\b/i.test(text)) return "its-complicated";
  if (/\bdivorc/i.test(text)) return "divorced";
  if (/\bsingle\b/i.test(text)) return "single";
  if (/\btaken\b/i.test(text) || /\bin a relationship\b/i.test(text)) return "taken";
  return "";
}

function inferAttachment(text: string) {
  if (/\banxious\b/i.test(text)) return "anxious";
  if (/\bavoidant\b/i.test(text)) return "avoidant";
  if (/\bsecure\b/i.test(text)) return "secure";
  if (/\bfearful[- ]avoidant\b/i.test(text)) return "fearful-avoidant";
  if (/\bdisorganized\b/i.test(text)) return "disorganized";
  return "";
}

function inferPowerDynamic(text: string) {
  if (/\buser leads\b/i.test(text) || /\bhe leads\b/i.test(text)) return "user-leads";
  if (/\bcharacter leads\b/i.test(text) || /\bshe leads\b/i.test(text)) return "character-leads";
  if (/\bequals\b/i.test(text)) return "equals";
  if (/\bshifts\b/i.test(text) || /\bpower shifts\b/i.test(text)) return "shifts";
  return "";
}

function inferTemperature(text: string) {
  if (/\bslow simmer\b/i.test(text) || /\bslow burn\b/i.test(text)) return "slow-simmer";
  if (/\binstant chemistry\b/i.test(text) || /\bimmediate chemistry\b/i.test(text)) return "instant-chemistry";
  if (/\bantagonistic\b/i.test(text) || /\brivals\b/i.test(text)) return "antagonistic";
  if (/\bcomfortable warmth\b/i.test(text) || /\bwarmth\b/i.test(text)) return "comfortable-warmth";
  return "";
}

function topicFromTitle(title: string) {
  return stripMarkdown(title)
    .toLowerCase()
    .replace(/journal\s+\d+\s*/i, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join(" ");
}

export function extractCharacterFingerprint(
  markdown: string,
  analysisInput?: Partial<DraftAnalysisPayload>,
): CharacterFingerprint {
  const sections = parseCharacterSections(markdown);
  const sectionMap = new Map(sections.map((section) => [section.key, section.content]));
  const overview = sectionMap.get("overview") ?? "";
  const backstory = sectionMap.get("backstory") ?? "";
  const responseDirective = sectionMap.get("response_directive") ?? "";
  const exampleMessage = sectionMap.get("example_message") ?? "";
  const keyMemories = sectionMap.get("key_memories") ?? "";
  const journalsRaw = sectionMap.get("journal_entries") ?? "";
  const greetingsRaw = sectionMap.get("greeting_options") ?? "";
  const journalEntries = parseJournalEntries(journalsRaw);
  const greetingEntries = parseGreetingEntries(greetingsRaw);

  const combinedText = [
    overview,
    backstory,
    responseDirective,
    exampleMessage,
    keyMemories,
    journalsRaw,
    greetingsRaw,
  ].join("\n");

  const journalTopics = unique(
    journalEntries.flatMap((entry) => {
      const titleTopic = topicFromTitle(entry.title);
      const keywordTopics = entry.keywords
        .replace(/"/g, "")
        .split(/\s+/)
        .filter((keyword) => keyword.length > 3)
        .slice(0, 4);
      return [titleTopic, ...keywordTopics];
    }),
  );

  const sexualJournalCount = journalEntries.filter((entry) => {
    const topicText = `${entry.title}\n${entry.keywords}\n${entry.entryText}`;
    return Object.values(SEXUAL_PATTERNS).some((patterns) => patterns.some((pattern) => pattern.test(topicText)))
      || /sexual|kink|intimacy|bed|touch|desire|aftercare/i.test(topicText);
  }).length;

  const availabilityStatus = analysisInput?.physicalProfile?.availabilityStatus
    || parseOverviewValue(overview, "Availability")
    || inferAvailability(combinedText);
  const flirtationStyle = analysisInput?.physicalProfile?.flirtationStyle || parseOverviewValue(overview, "Flirtation style");
  const powerDynamic = analysisInput?.relationshipDynamic?.powerDynamic || inferPowerDynamic(combinedText);
  const emotionalTemperature = analysisInput?.relationshipDynamic?.emotionalTemperature || inferTemperature(combinedText);
  const attachmentStyle = analysisInput?.relationshipDynamic?.attachmentStyle || inferAttachment(combinedText);

  const emotionalSignals = [
    analysisInput?.emotionalLogic?.wound,
    analysisInput?.emotionalLogic?.armor,
    analysisInput?.emotionalLogic?.crackInArmor,
    analysisInput?.emotionalLogic?.contradiction,
    backstory,
    keyMemories,
  ].join("\n");

  const voiceSignals = [analysisInput?.voiceProfile?.verbalTics, analysisInput?.voiceProfile?.codeSwitching, responseDirective, exampleMessage, ...greetingEntries.map((entry) => entry.content)].join("\n");
  const sexualSignals = [analysisInput?.sexualProfile, journalsRaw, backstory].join("\n");
  const relationshipSignals = [analysisInput?.howTheyMet, analysisInput?.contrastNotes, backstory, keyMemories, ...greetingEntries.map((entry) => entry.content)].join("\n");

  return {
    name: sectionMap.get("name") ?? "Untitled Character",
    sectionsPresent: sections.map((section) => section.key),
    tropeTags: unique(matchTags(combinedText, TROPE_PATTERNS)),
    emotionalTags: unique([
      ...matchTags(emotionalSignals, SOCIAL_PATTERNS),
      ...matchTags(emotionalSignals, CONFLICT_PATTERNS),
      attachmentStyle,
    ]),
    voiceTags: unique([
      ...matchTags(voiceSignals, VOICE_PATTERNS),
      analysisInput?.voiceProfile?.humorStyle ?? "",
      analysisInput?.voiceProfile?.textingStyle ?? "",
    ]),
    sexualTags: unique([
      ...matchTags(sexualSignals, SEXUAL_PATTERNS),
      ...(analysisInput?.selectedKinks ?? []).map((kink) => kink.replace(/-/g, " ")),
    ]),
    journalTopics,
    socialEnergy: unique(matchTags(combinedText, SOCIAL_PATTERNS)),
    conflictStyle: unique(matchTags(combinedText, CONFLICT_PATTERNS)),
    relationshipPatterns: unique([
      ...matchTags(relationshipSignals, RELATIONSHIP_PATTERNS),
      analysisInput?.howTheyMet ? "guided-how-they-met" : "",
      analysisInput?.selectedBackstories?.length ? "guided-backstory-pattern" : "",
      analysisInput?.selectedScenarios?.length ? "guided-scenario-pattern" : "",
    ]),
    availabilityStatus,
    flirtationStyle,
    powerDynamic,
    emotionalTemperature,
    attachmentStyle,
    sexualJournalCount,
    hasSexualJournals: sexualJournalCount > 0,
    signalText: stripMarkdown(combinedText),
  };
}

function describeAxes(fingerprint: CharacterFingerprint) {
  const axes: string[] = [];
  if (fingerprint.attachmentStyle) axes.push(`attachment style (${fingerprint.attachmentStyle})`);
  if (fingerprint.powerDynamic) axes.push(`power dynamic (${fingerprint.powerDynamic.replace(/-/g, " ")})`);
  if (fingerprint.emotionalTemperature) axes.push(`romantic pacing (${fingerprint.emotionalTemperature.replace(/-/g, " ")})`);
  if (fingerprint.flirtationStyle) axes.push(`flirtation style (${fingerprint.flirtationStyle.replace(/-/g, " ")})`);
  if (fingerprint.voiceTags[0]) axes.push(`voice cadence (${fingerprint.voiceTags[0].replace(/-/g, " ")})`);
  if (fingerprint.conflictStyle[0]) axes.push(`conflict style (${fingerprint.conflictStyle[0].replace(/-/g, " ")})`);
  if (fingerprint.sexualTags[0]) axes.push(`sexual pattern (${fingerprint.sexualTags[0].replace(/-/g, " ")})`);
  if (fingerprint.socialEnergy[0]) axes.push(`social energy (${fingerprint.socialEnergy[0].replace(/-/g, " ")})`);
  if (fingerprint.availabilityStatus) axes.push(`availability (${fingerprint.availabilityStatus.replace(/-/g, " ")})`);
  return axes;
}

export function buildReferenceContrastLines(referenceCharacters: CharacterSummary[]) {
  return referenceCharacters.map((character) => {
    const fingerprint = extractCharacterFingerprint(character.content);
    const axes = describeAxes(fingerprint).slice(0, 5);
    if (axes.length === 0) {
      return `- Compared with ${character.title}, make this new character meaningfully different in attachment pattern, voice, conflict behavior, sexual energy, and daily-life texture.`;
    }

    return `- Compared with ${character.title}, differ on at least 3 of these axes: ${axes.join(", ")}.`;
  });
}

export const QUALITY_BODY_TERMS = BODY_TERMS;
export const QUALITY_CLOTHING_TERMS = CLOTHING_TERMS;

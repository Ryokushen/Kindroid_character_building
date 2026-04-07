import type {
  CharacterFingerprint,
  CharacterOverlapSummary,
  CharacterSummary,
  DraftAnalysisPayload,
  DraftQualityReport,
  QualityWarning,
} from "@/lib/types";
import { extractCharacterFingerprint, QUALITY_BODY_TERMS, QUALITY_CLOTHING_TERMS } from "@/lib/character-fingerprint";
import { parseCharacterSections, parseJournalEntries } from "@/lib/section-parser";
import { KINDROID_LIMITS } from "@/lib/types";
import { stripMarkdown } from "@/lib/utils";

export const FIX_SUGGESTIONS: Record<string, string> = {
  "contrast-too-low": "Change at least 3 major axes: attachment style, power dynamic, emotional temperature, voice, or backstory architecture.",
  "missing-name": "Add a # Character Name heading at the top of the document.",
  "missing-overview": "Add a ## Overview section with bullet points (age, location, occupation, body type).",
  "missing-backstory": "Add a ## Backstory section with behavioral code in 3rd person.",
  "missing-response_directive": "Add a ## Response Directive section (under 250 chars) with tone/style directives.",
  "missing-example_message": "Add a ## Example Message section in first person with *actions* and \"dialogue\".",
  "missing-key_memories": "Add a ## Key Memories section with current factual context.",
  "missing-journal_entries": "Add a ## Journal Entries section with ### sub-headings, KEYWORDS, and Entry text.",
  "backstory-memory-duplication": "Move current-status facts to Key Memories; keep only personality-shaping history in Backstory.",
  "backstory-journal-duplication": "Rewrite journals to reveal NEW details the backstory doesn't cover.",
  "rd-em-mismatch": "Update the Example Message to demonstrate the communication style described in the Response Directive.",
  "rd-em-tone-drift": "Align the Example Message tone with the Response Directive.",
  "avatar-prompt-misuse": "Remove body/clothing from the Avatar Prompt. Keep only face, hair, skin tone, expression, and eye details.",
  "selfie-description-clothing": "Remove specific clothing from the Selfie Description. Describe only body type, proportions, and physical features.",
  "unexpected-sexual-journals": "Remove the sexual journal entries, or add a sexual profile/kink preferences to justify them.",
  "missing-sexual-journals": "Add 3\u20135 dedicated sexual behavior journal entries that reflect the sexual profile and kink preferences.",
  "too-many-sexual-journals": "Consolidate sexual journals to 3\u20135 focused entries. Merge similar ones.",
  "sexual-menu-dump": "Select a character-appropriate subset of kinks. Not every character should have every kink.",
  "sexual-emotional-contradiction": "Add trust/safety language to sexual journals. A guarded character needs earned trust before intense behavior.",
  "severe-overlap": "Differentiate by changing at least 3 axes: attachment style, power dynamic, emotional temperature, voice, or backstory.",
  "adjacent-overlap": "Change the voice profile, emotional wound, or flirtation style to create more distance from existing characters.",
};

type CompareResult = {
  score: number;
  matchedAxes: string[];
  distinctAxes: string[];
};

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function intersection(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value));
}

function jaccard(left: string[], right: string[]) {
  const union = new Set([...left, ...right]);
  if (union.size === 0) return 0;
  return intersection(left, right).length / union.size;
}

function textSimilarity(left: string, right: string) {
  const leftTokens = unique(stripMarkdown(left).toLowerCase().split(/\s+/).filter((token) => token.length > 3));
  const rightTokens = unique(stripMarkdown(right).toLowerCase().split(/\s+/).filter((token) => token.length > 3));
  return jaccard(leftTokens, rightTokens);
}

function compareFingerprints(current: CharacterFingerprint, other: CharacterFingerprint): CompareResult {
  let score = 0;
  const matchedAxes: string[] = [];
  const distinctAxes: string[] = [];

  const exactPairs: Array<[string, string, string, number]> = [
    [current.availabilityStatus, other.availabilityStatus, "availability", 6],
    [current.flirtationStyle, other.flirtationStyle, "flirtation style", 6],
    [current.powerDynamic, other.powerDynamic, "power dynamic", 8],
    [current.emotionalTemperature, other.emotionalTemperature, "romantic pacing", 8],
    [current.attachmentStyle, other.attachmentStyle, "attachment style", 8],
  ];

  for (const [left, right, label, weight] of exactPairs) {
    if (left && right) {
      if (left === right) {
        score += weight;
        matchedAxes.push(label);
      } else {
        distinctAxes.push(label);
      }
    }
  }

  const overlapBuckets: Array<[string, string[], string[], number]> = [
    ["archetype", current.tropeTags, other.tropeTags, 18],
    ["voice", current.voiceTags, other.voiceTags, 12],
    ["sexual pattern", current.sexualTags, other.sexualTags, 15],
    ["journal topics", current.journalTopics, other.journalTopics, 10],
    ["social energy", current.socialEnergy, other.socialEnergy, 8],
    ["conflict style", current.conflictStyle, other.conflictStyle, 8],
    ["relationship pattern", current.relationshipPatterns, other.relationshipPatterns, 12],
  ];

  for (const [label, left, right, weight] of overlapBuckets) {
    const ratio = jaccard(left, right);
    if (ratio > 0) {
      score += Math.round(ratio * weight);
      matchedAxes.push(label);
    } else if (left.length > 0 && right.length > 0) {
      distinctAxes.push(label);
    }
  }

  const signalSimilarity = textSimilarity(current.signalText, other.signalText);
  if (signalSimilarity > 0.2) {
    score += Math.min(13, Math.round(signalSimilarity * 25));
    matchedAxes.push("behavioral language");
  }

  return {
    score: Math.min(100, score),
    matchedAxes: unique(matchedAxes),
    distinctAxes: unique(distinctAxes),
  };
}

function buildOverlapSummaries(current: CharacterFingerprint, activeCharacters: CharacterSummary[]) {
  const overlaps: CharacterOverlapSummary[] = activeCharacters.map((character) => {
    const fingerprint = extractCharacterFingerprint(character.content);
    const comparison = compareFingerprints(current, fingerprint);

    return {
      fileName: character.fileName,
      title: character.title,
      score: comparison.score,
      matchedAxes: comparison.matchedAxes,
      distinctAxes: comparison.distinctAxes,
    };
  });

  return overlaps.sort((left, right) => right.score - left.score);
}

function computeContrastScore(
  current: CharacterFingerprint,
  referenceCharacters: CharacterSummary[],
  overlaps: CharacterOverlapSummary[],
  warnings: QualityWarning[],
) {
  if (referenceCharacters.length === 0) {
    return 100;
  }

  const perReferenceScores = referenceCharacters.map((reference) => {
    const overlap = overlaps.find((item) => item.fileName === reference.fileName);
    if (!overlap) {
      return 100;
    }

    const distinctAxes = overlap.distinctAxes.length;
    if (distinctAxes < 3) {
      warnings.push({
        code: "contrast-too-low",
        severity: overlap.score >= 60 ? "severe" : "warn",
        message: `The draft is still too adjacent to ${reference.title}. It needs stronger differences on at least 3 major axes.`,
      });
    }

    return Math.max(0, Math.min(100, distinctAxes * 25));
  });

  return Math.round(
    perReferenceScores.reduce((sum, score) => sum + score, 0) / Math.max(1, perReferenceScores.length),
  );
}

function computeInternalConsistencyScore(
  markdown: string,
  warnings: QualityWarning[],
) {
  let score = 100;
  const sections = parseCharacterSections(markdown);
  const sectionMap = new Map(sections.map((section) => [section.key, section.content]));
  const requiredKeys = ["name", "overview", "backstory", "response_directive", "example_message", "key_memories", "journal_entries"];

  for (const key of requiredKeys) {
    if (!sectionMap.get(key as never)?.trim()) {
      score -= 20;
      warnings.push({
        code: `missing-${key}`,
        severity: "severe",
        message: `The draft is missing or failed to parse the ${key.replace(/_/g, " ")} section.`,
      });
    }
  }

  const backstory = sectionMap.get("backstory") ?? "";
  const keyMemories = sectionMap.get("key_memories") ?? "";
  const journalsRaw = sectionMap.get("journal_entries") ?? "";
  const responseDirective = sectionMap.get("response_directive") ?? "";
  const exampleMessage = sectionMap.get("example_message") ?? "";
  const avatarPrompt = sectionMap.get("avatar_prompt") ?? "";
  const selfieDescription = sectionMap.get("selfie_description") ?? "";

  const memoryOverlap = textSimilarity(backstory, keyMemories);
  if (memoryOverlap > 0.33) {
    score -= 18;
    warnings.push({
      code: "backstory-memory-duplication",
      severity: "warn",
      message: "Backstory and Key Memories are repeating too much of the same material.",
    });
  }

  const journalOverlap = textSimilarity(backstory, journalsRaw);
  if (journalOverlap > 0.28) {
    score -= 15;
    warnings.push({
      code: "backstory-journal-duplication",
      severity: "warn",
      message: "Journal entries are restating backstory instead of adding new triggerable details.",
    });
  }

  const rdText = stripMarkdown(responseDirective).toLowerCase();
  const emText = stripMarkdown(exampleMessage).toLowerCase();
  if (rdText.includes("sarcas") && !emText.match(/sarcas|teas|banter|deadpan/)) {
    score -= 10;
    warnings.push({
      code: "rd-em-mismatch",
      severity: "warn",
      message: "The Example Message does not reflect the sarcasm or banter implied by the RD.",
    });
  }
  if (rdText.includes("gentle") && emText.match(/\bsharp\b|\bcold\b/)) {
    score -= 10;
    warnings.push({
      code: "rd-em-tone-drift",
      severity: "warn",
      message: "The Example Message tone is drifting away from the RD.",
    });
  }

  if (QUALITY_BODY_TERMS.test(avatarPrompt) || QUALITY_CLOTHING_TERMS.test(avatarPrompt)) {
    score -= 22;
    warnings.push({
      code: "avatar-prompt-misuse",
      severity: "severe",
      message: "Avatar Prompt is leaking body or clothing details instead of staying face-only.",
    });
  }

  if (QUALITY_CLOTHING_TERMS.test(selfieDescription)) {
    score -= 15;
    warnings.push({
      code: "selfie-description-clothing",
      severity: "warn",
      message: "Selfie Description includes clothing details even though it should stay outfit-agnostic.",
    });
  }

  for (const section of sections) {
    const limit = KINDROID_LIMITS[section.key];
    if (limit && section.content.length > limit) {
      score -= 8;
      warnings.push({
        code: `section-over-limit-${section.key}`,
        severity: "warn",
        message: `${section.label} is over the Kindroid limit (${section.content.length}/${limit}).`,
      });
    }
  }

  return Math.max(0, score);
}

function computeSexualConsistencyScore(
  markdown: string,
  analysisInput: Partial<DraftAnalysisPayload> | undefined,
  fingerprint: CharacterFingerprint,
  warnings: QualityWarning[],
) {
  let score = 100;
  const journalEntries = parseJournalEntries(parseCharacterSections(markdown).find((section) => section.key === "journal_entries")?.content ?? "");
  const sexualJournalCount = fingerprint.sexualJournalCount;
  const hasSexualInput = Boolean(
    analysisInput?.sexualProfile?.trim()
    || analysisInput?.selectedKinks?.length,
  );
  const canJudgeMissingSexualInput = Boolean(
    analysisInput && (analysisInput.sexualProfile !== undefined || analysisInput.selectedKinks !== undefined),
  );

  if (canJudgeMissingSexualInput && !hasSexualInput && sexualJournalCount > 0) {
    score -= 80;
    warnings.push({
      code: "unexpected-sexual-journals",
      severity: "severe",
      message: "The draft generated dedicated sexual journals even though no sexual profile or kink input was provided.",
    });
  }

  if (hasSexualInput && sexualJournalCount < 3) {
    score -= 70;
    warnings.push({
      code: "missing-sexual-journals",
      severity: "severe",
      message: "Sexual input was provided, but the draft does not contain the expected 3-5 dedicated sexual journals.",
    });
  }

  if (sexualJournalCount > 5) {
    score -= 10;
    warnings.push({
      code: "too-many-sexual-journals",
      severity: "warn",
      message: "The sexual journal coverage is getting bloated; keep it to 3-5 focused entries.",
    });
  }

  const selectedKinks = analysisInput?.selectedKinks ?? [];
  const selectedKinkLabels = selectedKinks.map((kink) => kink.replace(/-/g, " "));
  const matchedKinks = selectedKinkLabels.filter((label) =>
    fingerprint.sexualTags.some((tag) => tag.includes(label.split(" ")[0])),
  );

  if (selectedKinks.length >= 3 && matchedKinks.length === selectedKinks.length) {
    score -= 18;
    warnings.push({
      code: "sexual-menu-dump",
      severity: "warn",
      message: "The draft appears to be using the full kink menu instead of selecting a character-appropriate subset.",
    });
  }

  const armorText = [
    analysisInput?.emotionalLogic?.armor,
    analysisInput?.emotionalLogic?.wound,
    analysisInput?.relationshipDynamic?.attachmentStyle,
  ].join(" ").toLowerCase();
  const sexualText = journalEntries.map((entry) => entry.entryText).join(" ").toLowerCase();

  const guardedInput = /\bguarded\b|\bshy\b|\breserved\b|\bavoidant\b|\bslow trust\b/.test(armorText);
  const hardSex = /\bpublic\b|\bcnc\b|\brough\b|\bused\b|\bmanhandled\b/.test(sexualText);
  const trustLanguage = /\btrust\b|\bsafe\b|\bearned\b|\baftercare\b|\bheld\b/.test(sexualText);

  if (guardedInput && hardSex && !trustLanguage) {
    score -= 18;
    warnings.push({
      code: "sexual-emotional-contradiction",
      severity: "warn",
      message: "The sexual behavior feels disconnected from the guarded/slow-trust emotional logic.",
    });
  }

  return Math.max(0, score);
}

export function analyzeDraftQuality(input: {
  markdown: string;
  activeCharacters: CharacterSummary[];
  referenceCharacters?: CharacterSummary[];
  analysisInput?: Partial<DraftAnalysisPayload>;
}): DraftQualityReport {
  const warnings: QualityWarning[] = [];
  const fingerprint = extractCharacterFingerprint(input.markdown, input.analysisInput);
  const overlaps = buildOverlapSummaries(fingerprint, input.activeCharacters);
  const overlapScore = overlaps[0]?.score ?? 0;
  const noveltyScore = Math.max(0, 100 - overlapScore);
  const contrastScore = computeContrastScore(fingerprint, input.referenceCharacters ?? [], overlaps, warnings);
  const internalConsistencyScore = computeInternalConsistencyScore(input.markdown, warnings);
  const sexualConsistencyScore = computeSexualConsistencyScore(input.markdown, input.analysisInput, fingerprint, warnings);

  if (overlapScore >= 60) {
    const top = overlaps[0];
    warnings.push({
      code: "severe-overlap",
      severity: "severe",
      message: top
        ? `This draft is too familiar to ${top.title}. It overlaps on ${top.matchedAxes.slice(0, 4).join(", ")}.`
        : "This draft is too familiar to an existing character in the library.",
    });
  } else if (overlapScore >= 30) {
    const top = overlaps[0];
    warnings.push({
      code: "adjacent-overlap",
      severity: "warn",
      message: top
        ? `This draft is starting to drift toward ${top.title}.`
        : "This draft is adjacent to an existing library pattern.",
    });
  }

  const blockingReasons = warnings
    .filter((warning) => warning.severity === "severe")
    .map((warning) => warning.message);

  return {
    noveltyScore,
    overlapScore,
    contrastScore,
    internalConsistencyScore,
    sexualConsistencyScore,
    warnings,
    topOverlaps: overlaps.slice(0, 3),
    blockingReasons,
    hasSevereIssues: blockingReasons.length > 0,
    requiresRewrite: overlapScore >= 60,
    fingerprint,
  };
}

import type { CharacterSectionKey, ProviderSettings } from "@/lib/types";
import { parseCharacterSections, reassembleMarkdown } from "@/lib/section-parser";
import { callModel } from "@/lib/model-client";

// --- Probe phase ---

function buildProbeSystemPrompt() {
  return `You are a character redesign consultant for a Kindroid AI companion platform. The user has an existing character they want to modify. Your job is to:

1. Read the existing character carefully.
2. Ask 3-5 clarifying questions about the user's change request — focus on AMBIGUITY and DOWNSTREAM EFFECTS, not things the user has already been specific about.
3. Identify which character sections will need modification and why.

Rules for questions:
- Reference specific current content by name (e.g., "Her current wound is 'abandonment fear' — should that change too?")
- Ask about preservation: "Should I keep her [detail] or change it?"
- Ask about downstream effects: "If the backstory changes, should the journal entries update to match?"
- Do NOT ask generic filler questions like "anything else?"
- Every question should be specific and actionable.

Valid section keys you can suggest:
"overview", "backstory", "avatar_prompt", "selfie_description", "response_directive", "example_message", "key_memories", "journal_entries", "greeting_options"

Return your response as JSON with this exact structure:
{
  "questions": ["question 1", "question 2", ...],
  "suggestedSections": [
    { "key": "backstory", "label": "Backstory", "reason": "Brief reason why this needs to change" },
    ...
  ]
}

Return ONLY the JSON object, no markdown code fences, no commentary.`;
}

function buildProbeUserPrompt(changeRequest: string, characterMarkdown: string) {
  return [
    "Change request:",
    changeRequest,
    "",
    "Current character:",
    characterMarkdown,
  ].join("\n");
}

// --- Execute phase ---

function buildExecuteSystemPrompt(backstoryLimit: number) {
  return `You are rewriting specific sections of an existing Kindroid character based on the user's change request and their answers to clarifying questions.

## FIELD LIMITS (hard — sections over these will be rejected)
| Field | Max Characters |
|-------|---------------|
| Backstory | ${backstoryLimit} |
| Response Directive (RD) | 250 |
| Key Memories | 1000 |
| Example Message (EM) | 750 |
| Avatar Prompt | 200 |
| Selfie Description | 800 |
| Journal entries (each) | 500 |
| Greetings (each) | 730 |

## RULES
- ONLY modify the sections listed in "Sections to change" below.
- For sections NOT in that list, reproduce them EXACTLY as they appear in the original — same wording, same formatting, same content. Do not "improve" or rephrase them.
- Within modified sections, change ONLY what is necessary to implement the requested changes. Preserve voice, tone, style, and any content that doesn't conflict with the changes.
- Maintain internal consistency across all sections — modified sections should still make sense alongside the unchanged ones.
- Use the same markdown structure as the original: # for name, ## for sections, ### for journal/greeting entries, code fences where the original uses them.
- Return one complete Markdown document with ALL sections (modified and unmodified).
- Aim for 85-95% of each field's character limit.`;
}

function buildExecuteUserPrompt(
  changeRequest: string,
  characterMarkdown: string,
  probingAnswers: Array<{ question: string; answer: string }>,
  sectionsToChange: string[],
) {
  const qaBlock = probingAnswers
    .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
    .join("\n\n");

  return [
    "Change request:",
    changeRequest,
    "",
    "Clarifying Q&A:",
    qaBlock,
    "",
    `Sections to change: ${sectionsToChange.join(", ")}`,
    "All other sections must be reproduced exactly as-is.",
    "",
    "Current character:",
    characterMarkdown,
  ].join("\n");
}

// --- Merge logic ---

export function mergeRedesign(
  originalMarkdown: string,
  rewrittenMarkdown: string,
  allowedSections: Set<string>,
) {
  const originalSections = parseCharacterSections(originalMarkdown);
  const rewrittenSections = parseCharacterSections(rewrittenMarkdown);
  const rewrittenMap = new Map(rewrittenSections.map((s) => [s.key, s]));

  const merged = originalSections.map((section) => {
    if (allowedSections.has(section.key)) {
      return rewrittenMap.get(section.key) ?? section;
    }
    return section;
  });

  return reassembleMarkdown(merged);
}

export function detectChangedSections(
  originalMarkdown: string,
  rewrittenMarkdown: string,
): CharacterSectionKey[] {
  const originalSections = parseCharacterSections(originalMarkdown);
  const rewrittenSections = parseCharacterSections(rewrittenMarkdown);
  const rewrittenMap = new Map(rewrittenSections.map((s) => [s.key, s]));

  const changed: CharacterSectionKey[] = [];
  for (const section of originalSections) {
    const rewritten = rewrittenMap.get(section.key);
    if (rewritten && rewritten.content.trim() !== section.content.trim()) {
      changed.push(section.key);
    }
  }
  return changed;
}

// --- Public API ---

export async function runProbePhase(input: {
  changeRequest: string;
  characterMarkdown: string;
  provider: ProviderSettings;
}): Promise<{
  questions: string[];
  suggestedSections: Array<{ key: string; label: string; reason: string }>;
}> {
  const raw = await callModel(
    input.provider.providerType,
    input.provider.baseUrl,
    input.provider.apiKey,
    input.provider.model,
    0.7,
    buildProbeSystemPrompt(),
    buildProbeUserPrompt(input.changeRequest, input.characterMarkdown),
  );

  // Try JSON parse, with fallback extraction
  try {
    // Strip code fences if the LLM wrapped it
    const cleaned = raw.replace(/^```(?:json)?\s*\n?/m, "").replace(/\n?```\s*$/m, "").trim();
    const parsed = JSON.parse(cleaned) as {
      questions?: string[];
      suggestedSections?: Array<{ key: string; label: string; reason: string }>;
    };
    return {
      questions: parsed.questions ?? [],
      suggestedSections: parsed.suggestedSections ?? [],
    };
  } catch {
    // Fallback: extract questions from plain text
    const lines = raw.split("\n").filter((l) => l.trim());
    const questions = lines
      .filter((l) => l.includes("?"))
      .map((l) => l.replace(/^\d+[\.\)]\s*/, "").replace(/^[-*]\s*/, "").trim())
      .filter((q) => q.length > 10)
      .slice(0, 5);
    return { questions, suggestedSections: [] };
  }
}

export async function runExecutePhase(input: {
  changeRequest: string;
  characterMarkdown: string;
  probingAnswers: Array<{ question: string; answer: string }>;
  sectionsToChange: string[];
  provider: ProviderSettings;
  backstoryLimit?: number;
}): Promise<{ markdown: string; changedSections: CharacterSectionKey[] }> {
  const rewritten = await callModel(
    input.provider.providerType,
    input.provider.baseUrl,
    input.provider.apiKey,
    input.provider.model,
    input.provider.temperature,
    buildExecuteSystemPrompt(input.backstoryLimit ?? 2500),
    buildExecuteUserPrompt(
      input.changeRequest,
      input.characterMarkdown,
      input.probingAnswers,
      input.sectionsToChange,
    ),
  );

  const merged = mergeRedesign(
    input.characterMarkdown,
    rewritten,
    new Set(input.sectionsToChange),
  );

  const changedSections = detectChangedSections(input.characterMarkdown, merged);

  return { markdown: merged, changedSections };
}

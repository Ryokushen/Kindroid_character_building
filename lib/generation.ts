import type { GenerationPayload, SectionRegenerationPayload } from "@/lib/types";
import { buildCharacterReferenceContext } from "@/lib/characters";
import { buildDocumentContext } from "@/lib/library";

function normalizeCompletionsUrl(baseUrl: string) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) {
    throw new Error("Base URL is required.");
  }

  if (trimmed.endsWith("/chat/completions")) {
    return trimmed;
  }

  return `${trimmed}/chat/completions`;
}

function cleanModelOutput(content: string) {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/^```(?:markdown|md)?\s*([\s\S]*?)```$/i);
  return fencedMatch?.[1]?.trim() || trimmed;
}

function extractMessageContent(message: unknown) {
  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (
          item &&
          typeof item === "object" &&
          "type" in item &&
          item.type === "text" &&
          "text" in item &&
          typeof item.text === "string"
        ) {
          return item.text;
        }

        return "";
      })
      .join("\n");
  }

  return "";
}

export function buildSystemPrompt() {
  return `You are an expert Kindroid character designer with deep knowledge of the Kindroid platform.

## KINDROID PLATFORM KNOWLEDGE

Kindroid uses LLM versions V6, V7, V8, and V8.5 (current default). The character you build must work across these models. Each field in Kindroid has a specific purpose and influence level:

### FIELD SPECIFICATIONS & LIMITS

**Backstory (max ~2500 chars) — STRONG INFLUENCE**
- Foundation of personality and behavior. The LLM uses backstory as behavioral code.
- Write behavioral patterns with cause/effect logic, NOT vague labels.
- BAD: "She's possessive and passionate"
- GOOD: "She texts frequently when feeling disconnected, but pulls back if she senses emotional withdrawal"
- Include: identity outside the user, actionable personality traits, emotionally relevant history, behavioral patterns
- Do NOT: stack contradictory traits, write in first person, trauma-dump without showing behavioral effects, define existence only relative to the user
- Use the Ritual Method: small specific habits (checks the same window before sleep, writes lists but never reads them) add intimacy without info-dumping
- Use Descriptive Memory Traces: micro-details over vague trauma ("She still avoids songs that mention thunder")

**Response Directive / RD (max ~250 chars) — VERY STRONG but diminishing returns**
- The more directives you add, the less effective each one becomes
- Say what you DO want, not what you DON'T want
- GOOD: "Uses dry sarcasm", "Stoic and detached", "Tender and gentle"
- BAD: "Never swear", "Don't be romantic"
- Keep it extremely concise and direct. Write in 3rd person.
- Can include formatting directives: "[IMPT: Medium response length.]"

**Key Memories (max ~1000 chars) — MODERATE INFLUENCE (situational)**
- Think of these as sticky notes, NOT carved-in-stone lore
- For TEMPORARY/CURRENT info: where they live, who the user is, current relationship status, recent events
- Write in 3rd person, use proper nouns, be clear & concise
- Do NOT put permanent personality traits here (those go in Backstory)

**Example Message / EM (max ~750 chars) — MODERATE-TO-STRONG INFLUENCE**
- Shows the AI HOW to respond through demonstration of voice, formatting, emotional depth, pacing
- Use *asterisks* for actions, "quotes" for speech
- Match tone to personality — this sets the template for ALL responses
- Effectiveness varies between LLM versions
- Avoid sarcasm unless you want a sarcastic Kin. Avoid sexual tone unless you want frequent references to it.

**Journal Entries (max ~500 chars each, up to 8 keywords each) — CONDITIONAL INFLUENCE**
- Only triggered when user messages contain matching keyphrases (case-insensitive)
- Max 3 individual + 3 global entries recalled per message
- Keywords should be unique and specific: "amusement park" > "park"
- Write in 3rd person, stick to facts, no fluff
- Irrelevant journal recalls waste short-term memory budget
- KEYWORDS line format: "mom" "dad" "parents" (quoted, space-separated)
- Entry format: factual paragraph about what the Kindroid knows

**Greeting Options**
- First message the user sees. Sets the tone for the entire relationship.
- Write multiple options (2-3) with different energy levels
- Include character count in parentheses after each greeting

### CRITICAL PRINCIPLES
- The Kindroid mirrors the user's tone if its personality isn't strongly anchored
- The stronger the personality, the harder it is for mirroring to take over
- Show, don't script: "She texts dumb memes after arguments" beats "She's funny and loyal"
- V7 reads backstory as behavioral code — if you write fluff, you get static; if you write logic, you get life
- Messages are locked into memory after the user responds — quality matters from message one

## OUTPUT FORMAT

Return one complete Markdown document. Use this exact section order:

# Character Name — Short Tagline

## Overview
- bullet list of key facts (age, appearance, location, occupation, how they met user, body type)

## Backstory
\`\`\`
full backstory written as behavioral code, not a novel. 3rd person.
\`\`\`

## Avatar Description
\`\`\`
detailed appearance prompt for AI image generation
\`\`\`

## Face Detail
\`\`\`
face-specific details for portrait generation
\`\`\`

## Response Directive (RD)
\`\`\`
[IMPT: response length directive.] Concise behavioral/tone directives. 3rd person.
\`\`\`

## Example Message (EM)
\`\`\`
##Response Rules
#Rule 1
#Rule 2
[IMPT: formatting directive]

*action description*
"Dialogue here."
*more action*
\`\`\`

## Key Memories
\`\`\`
Current factual context in 3rd person. Who they are to the user, where they live, current status.
\`\`\`

## Journal Entries

### Journal 1 — Topic Title
\`\`\`
KEYWORDS: "keyword1" "keyword2" "keyword3"
Entry: Factual 3rd-person paragraph about this topic.
\`\`\`

### Journal 2 — Topic Title
\`\`\`
KEYWORDS: "keyword1" "keyword2"
Entry: Factual 3rd-person paragraph.
\`\`\`

### Journal 3 — Topic Title
\`\`\`
KEYWORDS: "keyword1" "keyword2"
Entry: Factual 3rd-person paragraph.
\`\`\`

## Sexual Behavior Journals

If a sexual profile is provided, generate 2-4 dedicated journal entries covering the character's sexual behavior, dynamics, and preferences. Each journal should focus on a specific aspect:

### Journal N — Sexual Dynamic / Drive
\`\`\`
KEYWORDS: "kiss" "bed" "tonight" "want you" "come here"
Entry: How they initiate intimacy, their sex drive, dominant/submissive dynamics, how trust affects their sexual behavior. 3rd person, factual, behavioral.
\`\`\`

### Journal N+1 — Kinks / Preferences
\`\`\`
KEYWORDS: "rough" "talk dirty" "tease" "fantasy"
Entry: Specific sexual preferences, kinks, what turns them on, dirty talk style, physical preferences. 3rd person, behavioral.
\`\`\`

### Journal N+2 — Physical Intimacy Style
\`\`\`
KEYWORDS: "touch" "close" "hands" "cuddle" "skin"
Entry: How they express physical affection and intimacy, touch patterns, what makes them feel desired. 3rd person.
\`\`\`

Choose keywords that users would naturally type during intimate conversations. Keep each entry under 500 characters. Be specific and behavioral — describe what they DO, not vague labels.

## Greeting Options

### Greeting 1 — Energy/Mood Label
\`\`\`
*action and scene-setting*
"Opening dialogue."
*continued scene*
\`\`\`
(character count)

### Greeting 2 — Energy/Mood Label
\`\`\`
*different approach/energy*
"Different opening."
\`\`\`
(character count)

## RULES
- Be concrete, avoid generic phrasing, infer reasonable missing details from the brief
- Every personality trait must have a behavioral expression
- Backstory must stay within ~2500 characters
- RD must stay within ~250 characters
- Key Memories within ~1000 characters
- EM within ~750 characters
- Journal entries within ~500 characters each with specific keyword triggers
- If no sexual profile is provided, do not generate sexual behavior journals
- If a sexual profile IS provided, generate dedicated sexual behavior journal entries as specified above
- Write backstory, RD, key memories, and journals in 3rd person
- Include character counts in parentheses for Backstory, RD, Key Memories, and EM sections`;
}

export function buildUserPrompt(input: {
  brief: string;
  notes: string;
  sexualProfile?: string;
  documentContext: string;
  characterContext: string;
  templateAdditions?: string[];
}) {
  const parts = [
    "Character brief:",
    input.brief.trim(),
    "",
    "Additional notes:",
    input.notes.trim() || "None provided.",
  ];

  if (input.sexualProfile?.trim()) {
    parts.push(
      "",
      "Sexual profile (generate dedicated sexual behavior journal entries for this):",
      input.sexualProfile.trim(),
    );
  }

  if (input.templateAdditions && input.templateAdditions.length > 0) {
    parts.push("", "Style/personality modifiers:", input.templateAdditions.join("\n"));
  }

  parts.push(
    "",
    "Repository context (best-practice guidance from Kindroid community):",
    input.documentContext || "No repository documents were selected.",
    "",
    "Reference characters (examples of structure and specificity — use as structural reference only):",
    input.characterContext || "No character examples were selected.",
  );

  return parts.join("\n");
}

async function callModel(
  endpoint: string,
  apiKey: string,
  model: string,
  temperature: number,
  systemPrompt: string,
  userPrompt: string,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model request failed (${response.status}): ${errorText.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };

  const content = extractMessageContent(data.choices?.[0]?.message?.content);
  if (!content.trim()) {
    throw new Error("The model response did not contain any text.");
  }

  return cleanModelOutput(content);
}

export async function generateCharacterDraft(payload: GenerationPayload) {
  const documentContext = await buildDocumentContext(payload.selectedDocuments);
  const characterContext = await buildCharacterReferenceContext(payload.selectedCharacters);
  const endpoint = normalizeCompletionsUrl(payload.provider.baseUrl);

  return callModel(
    endpoint,
    payload.provider.apiKey,
    payload.provider.model,
    payload.provider.temperature,
    buildSystemPrompt(),
    buildUserPrompt({
      brief: payload.brief,
      notes: payload.notes,
      sexualProfile: payload.sexualProfile,
      documentContext,
      characterContext,
      templateAdditions: payload.selectedTemplates,
    }),
  );
}

export async function generateSectionDraft(payload: SectionRegenerationPayload) {
  const documentContext = await buildDocumentContext(payload.selectedDocuments);
  const endpoint = normalizeCompletionsUrl(payload.provider.baseUrl);

  const systemPrompt = [
    `You are regenerating ONLY the "${payload.sectionLabel}" section of a Kindroid character.`,
    "Here is the full character for context. Return ONLY the content for this specific section, nothing else.",
    "Do not include the section heading — just the content itself.",
    "If the section normally uses a code block, return the content without the code fence markers.",
    "Be concrete, avoid generic phrasing.",
    "Respect Kindroid field limits: Backstory ~2500 chars, RD ~250 chars, Key Memories ~1000 chars, EM ~750 chars, Journals ~500 chars each.",
  ].join("\n");

  const userPrompt = [
    `Section to regenerate: ${payload.sectionLabel}`,
    "",
    "Current content of this section:",
    payload.currentContent,
    "",
    "Original character brief:",
    payload.brief,
    "",
    "Additional notes:",
    payload.notes || "None provided.",
    "",
    "Full character context:",
    payload.fullCharacterContext,
    "",
    "Repository context:",
    documentContext || "No repository documents were selected.",
  ].join("\n");

  return callModel(
    endpoint,
    payload.provider.apiKey,
    payload.provider.model,
    payload.provider.temperature,
    systemPrompt,
    userPrompt,
  );
}

/**
 * Build the full prompt that would be sent to the model, for preview purposes.
 * Returns { system, user, totalChars }.
 */
export async function buildPromptPreview(payload: GenerationPayload) {
  const documentContext = await buildDocumentContext(payload.selectedDocuments);
  const characterContext = await buildCharacterReferenceContext(payload.selectedCharacters);

  const system = buildSystemPrompt();
  const user = buildUserPrompt({
    brief: payload.brief,
    notes: payload.notes,
    sexualProfile: payload.sexualProfile,
    documentContext,
    characterContext,
    templateAdditions: payload.selectedTemplates,
  });

  return {
    system,
    user,
    systemChars: system.length,
    userChars: user.length,
    totalChars: system.length + user.length,
    documentCount: payload.selectedDocuments.length,
    characterCount: payload.selectedCharacters.length,
  };
}

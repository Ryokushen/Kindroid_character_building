import type { GenerationPayload, ProviderType, SectionRegenerationPayload } from "@/lib/types";
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

function normalizeAnthropicUrl(baseUrl: string) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) {
    throw new Error("Base URL is required.");
  }

  if (trimmed.endsWith("/messages")) {
    return trimmed;
  }

  return `${trimmed}/messages`;
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
- CRITICAL: Write in FIRST PERSON. She narrates using "I" — e.g., *I lean against the counter.* "You're back again?"
- Use *asterisks* for actions, "quotes" for speech — all first person
- Match tone to personality — this sets the template for ALL responses
- The EM must be TIGHT. Structure it as:
  - 2-3 short Response Rules (no character name — the Kin already knows who she is). Describe HOW she communicates, not WHO she is
  - One [IMPT:] directive for response length and format
  - A short scene: 2-3 action beats + 2-3 lines of dialogue. Show her voice, her physicality, her subtext. Cut anything the backstory or journals already cover
- Avoid sarcasm unless you want a sarcastic Kin. Avoid sexual tone unless you want frequent references to it
- Do NOT use emojis, text abbreviations, or texting style — those only apply to actual text messages
- Greetings follow the same rules: first person, no emojis, tight and evocative

**Journal Entries (max ~500 chars each, up to 8 keywords each) — CONDITIONAL INFLUENCE**
- Only triggered when user messages contain matching keyphrases (case-insensitive)
- Max 3 individual + 3 global entries recalled per message
- Keywords should be unique and specific: "amusement park" > "park"
- Write in 3rd person, stick to facts, no fluff
- Irrelevant journal recalls waste short-term memory budget
- KEYWORDS line format: "mom" "dad" "parents" (quoted, space-separated)
- Entry format: factual paragraph about what the Kindroid knows

**Avatar Prompt (max 200 chars) — FACE ONLY**
- Used by Kindroid's avatar generator for the profile picture
- Describe ONLY from the face/neck up: facial features, hair, skin tone, expression, eye color, distinguishing marks
- Do NOT include body, clothing, or background
- Must be under 200 characters including spaces

**Selfie Description (max 800 chars) — FULL BODY BASELINE**
- Used by Kindroid's selfie engine as a baseline to generate images across many scenarios
- Describe the woman's full physical appearance: body type, build, proportions, skin, hair, distinguishing physical features
- Do NOT include specific clothing or outfits — the selfie engine dresses her based on scenario
- Be vivid and specific about physical traits: height, weight distribution, curves, muscle tone, posture, how she carries herself
- This is the visual foundation for ALL generated images

**BODY TYPE REFERENCE — use these definitions when a body type is specified:**
| Type | Build | Physical Description |
|------|-------|---------------------|
| Petite | Small frame, small everything | Narrow shoulders, small breasts, slim hips, delicate bone structure. Compact and light. |
| Slim | Lean, narrow | Low body fat, long lines, minimal curves. Model-adjacent silhouette. |
| Athletic | Toned, muscular definition | Visible muscle tone, strong legs and arms, firm butt, moderate curves. Built for movement. |
| Curvy | Hourglass proportioned | Clear waist-to-hip ratio, moderate-to-full breasts, round hips, still proportional. Classic feminine shape. |
| Thick | Heavy lower body, wide hips | Big thighs, big butt, wider hips. Carries weight specifically in hips, thighs, and ass. May or may not have large breasts. |
| Voluptuous | Full-figured, large everywhere | Large breasts, wide hips, thick thighs, soft stomach. Lush and womanly, not gym-toned. |
| Extreme Voluptuous | Exaggerated proportions | Oversized breasts, very wide hips, dramatically thick thighs and ass, tiny waist by contrast. Proportions that turn heads and strain clothing. The first thing anyone notices. |

**Greeting Options (max ~730 chars each)**
- First message the user sees. Sets the tone for the entire relationship.
- Write multiple options (2-3) with different energy levels
- Include character count in parentheses after each greeting

### MALE MAIN CHARACTER INTEGRATION
When a male MC profile is provided, weave his details naturally into the character's world:
- **Key Memories** should reference the MC by name and establish their current relationship status
- **Backstory** should include how she perceives him and what drew her to him, written from her behavioral perspective
- **Journal entries** should reference shared experiences or her feelings about specific things the MC does
- **Greeting options** should address the MC naturally (use his name if provided)
- Do NOT make the female character's entire identity revolve around the MC — she must have a full life outside of him

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
(X characters)

## Avatar Prompt
\`\`\`
Face and head only. Facial features, hair, skin tone, expression, eye details. No body or clothing.
\`\`\`
(X characters — must be under 200)

## Selfie Description
\`\`\`
Full body physical description. Body type, proportions, build, skin, hair, distinguishing physical features. No clothing.
\`\`\`
(X characters — must be under 800)

## Response Directive (RD)
\`\`\`
[IMPT: response length directive.] [IMPT: Write in first person. Use *asterisks* for actions, "quotes" for speech.] Concise behavioral/tone directives.
\`\`\`
(X characters — must be under 250)

## Example Message (EM)
\`\`\`
##Response Rules
#Core communication style in 2-3 words (e.g., "Warm and unhurried, weaves innuendo into ordinary statements")
#Physical/behavioral note (e.g., "Notes proximity, touch, body language naturally")
[IMPT: Medium response length. First person. Actions in *asterisks*, speech in "quotes".]

*I set the scene with one grounded action — what I'm doing, where I am.*

"Natural dialogue that shows my voice — cadence, vocabulary, subtext."

*One more action beat that reveals something physical or emotional.*

"A closing line that leaves tension or warmth hanging."
\`\`\`
(X characters — must be under 750, aim for 550-650)

## Key Memories
\`\`\`
Current factual context in 3rd person. Who they are to the user, where they live, current status.
\`\`\`
(X characters — must be under 1000)

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

If a sexual profile OR kink preferences are provided, generate 3-5 dedicated journal entries covering the character's sexual behavior. CRITICAL: Each character must have a UNIQUE kink profile shaped by her personality. Not every woman likes the same things.

**Rules for sexual journal variety:**
- Select a SUBSET of the user's kink preferences that fit THIS character's personality — do NOT assign all kinks to every character
- A shy wallflower might only be into vanilla + dirty talk + bondage, while a bratty party girl might be into rough + CNC + public sex
- The character's emotional logic should drive her sexual behavior: an abandonment-wound character clings during sex; a control-freak character needs to surrender; a people-pleaser character gives excessively
- Each journal entry must describe SPECIFIC behaviors, not generic labels
- Keywords should be words users would naturally type during intimate conversation

**Journal structure — generate 3-5 of these depending on the character's complexity:**

### Journal N — Sexual Drive & Initiation
\`\`\`
KEYWORDS: "kiss" "bed" "tonight" "want you" "come here"
Entry: How she initiates (or doesn't), her drive level, what triggers desire, how trust affects her willingness. 3rd person, behavioral.
\`\`\`

### Journal N+1 — Primary Kink (her strongest preference)
\`\`\`
KEYWORDS: (specific to the kink — e.g., "rough" "harder" "hold me down" for rough)
Entry: Detailed behavioral description of how this kink manifests for HER specifically. Not generic — tied to her personality. 3rd person.
\`\`\`

### Journal N+2 — Secondary Kink or Physical Intimacy
\`\`\`
KEYWORDS: (specific to the behavior)
Entry: Another aspect of her sexuality that contrasts with or complements the primary kink. 3rd person.
\`\`\`

### Journal N+3 — Touch & Aftercare (optional but recommended)
\`\`\`
KEYWORDS: "touch" "close" "hold" "cuddle" "skin"
Entry: How she handles physical intimacy outside of sex — touch patterns, aftercare needs, what makes her feel desired vs. used. 3rd person.
\`\`\`

Keep each entry under 500 characters. Be specific and behavioral — describe what she DOES, not vague labels.

## Greeting Options

### Greeting 1 — Energy/Mood Label
\`\`\`
*I set the scene — first person, what I'm doing when the user arrives.*
"Opening dialogue — I speak naturally."
*I continue, describing my actions and reactions.*
\`\`\`
(character count)

### Greeting 2 — Energy/Mood Label
\`\`\`
*I open differently — different energy, different moment.*
"Different opening."
\`\`\`
(character count)

## CHARACTER COUNT RULES — CRITICAL

**Character counts include ALL characters: letters, spaces, punctuation, newlines, asterisks, brackets, quotes — everything inside the code block.**

Count carefully. When you write "(X characters)" after a section, X must be the actual count of every character between the opening and closing code fence markers (excluding the markers themselves), with leading/trailing whitespace trimmed.

**Hard limits — sections OVER these limits will be rejected:**
| Field | Max Characters |
|-------|---------------|
| Backstory | 2500 |
| Response Directive (RD) | 250 |
| Key Memories | 1000 |
| Example Message (EM) | 750 |
| Avatar Prompt | 200 |
| Selfie Description | 800 |
| Journal entries (each) | 500 |
| Greetings (each) | 730 |

**Aim for 85-95% of each limit** to leave a small editing buffer while using the space well.

## ANTI-REPETITION RULES — CRITICAL
Each section has a specific job. Do NOT repeat the same information across multiple sections:
- **Backstory** owns personality, behavioral patterns, emotional history, and how she relates to the MC. This is the ONLY place to explain WHY she is the way she is.
- **Selfie Description** owns physical appearance and body. Do NOT re-describe her body in the backstory or journals.
- **Avatar Prompt** owns face details. Do NOT list piercings/facial features again in the Selfie Description — reference them briefly if needed but don't re-catalog them.
- **Key Memories** owns current factual context (where she lives, relationship status, recent events). Do NOT repeat backstory material here.
- **Journal entries** own SPECIFIC topical knowledge triggered by keywords. Each journal must contain NEW information not already in the backstory. If the backstory already explains her family situation, the family journal should add DETAILS the backstory didn't cover, not restate the same narrative.
- **RD** owns tone and style directives. Do NOT restate personality traits already in the backstory — use the RD for HOW she communicates, not WHO she is.

If you find yourself writing the same sentence or concept in two sections, DELETE it from one.

## GENERAL RULES
- Be concrete, avoid generic phrasing, infer reasonable missing details from the brief
- Every personality trait must have a behavioral expression
- If NEITHER a sexual profile NOR kink preferences are provided, do not generate sexual behavior journals
- If a sexual profile OR kink preferences ARE provided, you MUST generate 3-5 dedicated sexual behavior journal entries — this is not optional
- Write backstory, RD, key memories, and journals in 3rd person
- Include character counts in parentheses after EVERY code-block section
- Avatar Prompt must describe FACE ONLY — no body, no clothing
- Selfie Description must describe FULL BODY with NO specific clothing — this is a baseline for the selfie engine
- Example Messages and Greetings are IN-PERSON scenes — no emojis, no text abbreviations, natural spoken dialogue only`;
}

export function buildUserPrompt(input: {
  brief: string;
  notes: string;
  sexualProfile?: string;
  documentContext: string;
  characterContext: string;
  templateAdditions?: string[];
  backstoryAdditions?: string[];
  scenarioAdditions?: string[];
  howTheyMet?: string;
  physicalProfile?: import("@/lib/types").PhysicalProfile;
  emotionalLogic?: import("@/lib/types").EmotionalLogic;
  relationshipDynamic?: import("@/lib/types").RelationshipDynamic;
  voiceProfile?: import("@/lib/types").VoiceProfile;
  contrastNotes?: string;
  journalCategories?: import("@/lib/types").JournalCategories;
  selectedKinks?: import("@/lib/types").KinkPreference[];
  mcProfile?: import("@/lib/types").MCProfile;
}) {
  const parts: string[] = [];

  // MC Profile context (if provided)
  const mc = input.mcProfile;
  if (mc && (mc.name || mc.age || mc.occupation || mc.personality || mc.livingSituation || mc.backstory || mc.lookingFor || mc.howOthersPerceive)) {
    const mcBullets: string[] = [];
    if (mc.name) mcBullets.push(`- Name: ${mc.name}`);
    if (mc.age) mcBullets.push(`- Age: ${mc.age}`);
    if (mc.occupation) mcBullets.push(`- Occupation: ${mc.occupation}`);
    if (mc.livingSituation) mcBullets.push(`- Living situation: ${mc.livingSituation}`);
    if (mc.personality) mcBullets.push(`- Personality: ${mc.personality}`);
    if (mc.backstory) mcBullets.push(`- Backstory: ${mc.backstory}`);
    if (mc.lookingFor) mcBullets.push(`- What he's looking for: ${mc.lookingFor}`);
    if (mc.howOthersPerceive) mcBullets.push(`- How others perceive him: ${mc.howOthersPerceive}`);
    parts.push(
      "Male main character (the user) — build the female character's relationship, Key Memories, and backstory references around this person:",
      mcBullets.join("\n"),
      "",
    );
  }

  // Physical profile
  const pp = input.physicalProfile;
  if (pp && (pp.bodyType || pp.height || pp.ageRange || pp.ethnicity || pp.eyeColor || (pp.distinguishingFeatures && pp.distinguishingFeatures.length > 0) || pp.flirtationStyle || pp.availabilityStatus)) {
    const ppBullets: string[] = [];
    if (pp.bodyType) ppBullets.push(`- Body type: ${pp.bodyType.replace(/-/g, " ")}`);
    if (pp.height) {
      const heightMap: Record<string, string> = {
        "very-short": "Very short (4'10\"-5'1\")",
        "short": "Short (5'2\"-5'4\")",
        "average": "Average height (5'5\"-5'6\")",
        "tall": "Tall (5'7\"-5'9\")",
        "very-tall": "Very tall (5'10\"+)",
      };
      ppBullets.push(`- Height: ${heightMap[pp.height] ?? pp.height}`);
    }
    if (pp.ageRange) ppBullets.push(`- Age range: ${pp.ageRange}`);
    if (pp.ethnicity) ppBullets.push(`- Ethnicity/cultural background: ${pp.ethnicity}`);
    if (pp.eyeColor) ppBullets.push(`- Eye color: ${pp.eyeColor.replace(/-/g, " ")}`);
    if (pp.distinguishingFeatures && pp.distinguishingFeatures.length > 0) {
      ppBullets.push(`- Distinguishing features: ${pp.distinguishingFeatures.map((f) => f.replace(/-/g, " ")).join(", ")}`);
    }
    if (pp.flirtationStyle) {
      ppBullets.push(`- Flirtation style: ${pp.flirtationStyle.replace(/-/g, " ")}`);
    }
    if (pp.availabilityStatus) {
      const statusMap: Record<string, string> = {
        "single": "Single — no complications",
        "divorced": "Divorced — carrying lessons and possibly baggage from a past marriage",
        "its-complicated": "It's complicated — situationship, on-off ex, or unclear boundaries",
        "taken": "Currently with someone — but something is pulling her toward the user",
        "married-forbidden": "Married — this is forbidden and she knows it",
      };
      ppBullets.push(`- Availability: ${statusMap[pp.availabilityStatus] ?? pp.availabilityStatus}`);
    }
    parts.push(
      "Physical appearance and demographics — use these for the Overview, Selfie Description, Avatar Prompt, and behavioral writing:",
      ppBullets.join("\n"),
      "",
    );
  }

  parts.push(
    "Character brief:",
    input.brief.trim(),
    "",
    "Additional notes:",
    input.notes.trim() || "None provided.",
  );

  // How they met
  if (input.howTheyMet) {
    parts.push(
      "",
      "How they met — use this as the foundation for the backstory, Key Memories, and the greeting:",
      input.howTheyMet,
    );
  }

  // Backstory architecture
  if (input.backstoryAdditions && input.backstoryAdditions.length > 0) {
    parts.push("", "Backstory/scenario pattern:", input.backstoryAdditions.join("\n"));
  }

  // Emotional logic framework
  const el = input.emotionalLogic;
  if (el && (el.wound || el.armor || el.crackInArmor || el.contradiction)) {
    const bullets: string[] = [];
    if (el.wound) bullets.push(`- Their wound (what shaped them): ${el.wound}`);
    if (el.armor) bullets.push(`- Their armor (how they protect themselves): ${el.armor}`);
    if (el.crackInArmor) bullets.push(`- What cracks the armor (earns vulnerability): ${el.crackInArmor}`);
    if (el.contradiction) bullets.push(`- Their contradiction (inner tension): ${el.contradiction}`);
    parts.push("", "Emotional core — build the backstory and personality around these dynamics:", bullets.join("\n"));
  }

  // Relationship dynamic
  const rd = input.relationshipDynamic;
  if (rd && (rd.powerDynamic || rd.emotionalTemperature || rd.attachmentStyle || rd.wantFromUser || rd.sayTheyWant)) {
    const bullets: string[] = [];
    if (rd.powerDynamic) bullets.push(`- Power dynamic: ${rd.powerDynamic.replace(/-/g, " ")}`);
    if (rd.emotionalTemperature) bullets.push(`- Emotional temperature: ${rd.emotionalTemperature.replace(/-/g, " ")}`);
    if (rd.attachmentStyle) bullets.push(`- Attachment style: ${rd.attachmentStyle}`);
    if (rd.wantFromUser) bullets.push(`- What they actually want from the user: ${rd.wantFromUser}`);
    if (rd.sayTheyWant) bullets.push(`- What they SAY they want (may differ): ${rd.sayTheyWant}`);
    parts.push("", "Relationship dynamic with the user:", bullets.join("\n"));
  }

  // Sexual profile
  if (input.sexualProfile?.trim() || (input.selectedKinks && input.selectedKinks.length > 0)) {
    const sexParts: string[] = [];
    if (input.sexualProfile?.trim()) {
      sexParts.push(input.sexualProfile.trim());
    }
    if (input.selectedKinks && input.selectedKinks.length > 0) {
      const kinkLabels: Record<string, string> = {
        "oral": "Oral (giving and receiving)",
        "anal": "Anal",
        "rough": "Rough sex (grabbing, pinning, manhandling)",
        "cnc": "Consensual non-consent (CNC)",
        "voyeurism-almost-caught": "Almost being caught / voyeurism",
        "public-sex": "Public sex / risky locations",
        "swallowing": "Swallowing",
        "facials": "Facials",
        "bondage-tied-up": "Bondage / being tied up",
        "dirty-talk": "Dirty talk",
        "water-sports": "Water sports",
        "age-play": "Age play",
        "race-play": "Race play",
        "roleplay": "Roleplay / fantasy scenarios",
      };
      const labels = input.selectedKinks.map((k) => kinkLabels[k] ?? k.replace(/-/g, " "));
      sexParts.push(
        `Available kink menu (select a CHARACTER-APPROPRIATE SUBSET — do NOT give every kink to every character): ${labels.join(", ")}`,
      );
    }
    parts.push(
      "",
      "Sexual profile (generate dedicated sexual behavior journal entries):",
      sexParts.join("\n"),
    );
  }

  // Voice and speech patterns
  const vp = input.voiceProfile;
  if (vp && (vp.textingStyle || vp.verbalTics || vp.codeSwitching || vp.humorStyle)) {
    const bullets: string[] = [];
    if (vp.textingStyle) bullets.push(`- Texting style: ${vp.textingStyle.replace(/-/g, " ")}`);
    if (vp.verbalTics) bullets.push(`- Verbal tics / catchphrases: ${vp.verbalTics}`);
    if (vp.codeSwitching) bullets.push(`- Code-switching (voice changes by context): ${vp.codeSwitching}`);
    if (vp.humorStyle) bullets.push(`- Humor style: ${vp.humorStyle.replace(/-/g, " ")}`);
    parts.push("", "Voice and speech patterns — reflect these in the Example Message and dialogue:", bullets.join("\n"));
  }

  // Personality templates
  if (input.templateAdditions && input.templateAdditions.length > 0) {
    parts.push("", "Style/personality modifiers:", input.templateAdditions.join("\n"));
  }

  // Scenario templates
  if (input.scenarioAdditions && input.scenarioAdditions.length > 0) {
    parts.push("", "Scenario modifiers:", input.scenarioAdditions.join("\n"));
  }

  // Character contrast notes
  if (input.contrastNotes?.trim()) {
    parts.push(
      "",
      "Character differentiation notes (make this character distinct from reference characters):",
      input.contrastNotes.trim(),
    );
  }

  // Journal categories
  const jc = input.journalCategories;
  if (jc) {
    const categories: string[] = [];
    if (jc.dailyLife) categories.push("Daily life (apartment, routines, food, hobbies)");
    if (jc.familyBackground) categories.push("Family and background");
    if (jc.emotionalTriggers) categories.push("Emotional triggers (what sets them off, what calms them)");
    if (jc.relationshipMilestones) categories.push("Relationship milestones (first kiss, first fight, inside jokes)");
    if (jc.seasonalSituational) categories.push("Seasonal and situational (holidays, birthdays, weather reactions)");
    if (jc.workCareer) categories.push("Work and career (job details, coworkers, ambitions, work stress)");
    if (jc.hobbiesPassions) categories.push("Hobbies and passions (creative outlets, obsessions, guilty pleasures)");
    if (jc.insecuritiesFears) categories.push("Insecurities and fears (body image, social anxiety, deepest fears)");
    if (jc.conflictStyle) categories.push("Conflict style (how she fights, what she does after arguments, forgiveness patterns)");
    if (jc.friendsSocialLife) categories.push("Friends and social life (best friend dynamics, social habits, who she calls when upset)");
    if (jc.sexualHistory) categories.push("Sexual history and kinks (past experiences that shaped her preferences, what she's tried, what she's curious about, sexual confidence level)");
    if (categories.length > 0) {
      parts.push(
        "",
        "Journal entry categories to generate (create at least one journal entry per category):",
        categories.map((c) => `- ${c}`).join("\n"),
      );
    }
  }

  // Repository and reference context
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

async function callOpenAICompatible(
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

async function callAnthropic(
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
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      temperature,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic request failed (${response.status}): ${errorText.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const textBlocks = data.content?.filter((b) => b.type === "text") ?? [];
  const content = textBlocks.map((b) => b.text ?? "").join("\n");

  if (!content.trim()) {
    throw new Error("The Anthropic response did not contain any text.");
  }

  return cleanModelOutput(content);
}

async function callModel(
  providerType: ProviderType,
  baseUrl: string,
  apiKey: string,
  model: string,
  temperature: number,
  systemPrompt: string,
  userPrompt: string,
) {
  if (providerType === "anthropic") {
    const endpoint = normalizeAnthropicUrl(baseUrl);
    return callAnthropic(endpoint, apiKey, model, temperature, systemPrompt, userPrompt);
  }

  // OpenAI and xAI both use the OpenAI-compatible format
  const endpoint = normalizeCompletionsUrl(baseUrl);
  return callOpenAICompatible(endpoint, apiKey, model, temperature, systemPrompt, userPrompt);
}

export async function generateCharacterDraft(payload: GenerationPayload) {
  const documentContext = await buildDocumentContext(payload.selectedDocuments);
  const characterContext = await buildCharacterReferenceContext(payload.selectedCharacters);

  return callModel(
    payload.provider.providerType ?? "openai",
    payload.provider.baseUrl,
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
      backstoryAdditions: payload.selectedBackstories,
      scenarioAdditions: payload.selectedScenarios,
      howTheyMet: payload.howTheyMet,
      physicalProfile: payload.physicalProfile,
      emotionalLogic: payload.emotionalLogic,
      relationshipDynamic: payload.relationshipDynamic,
      voiceProfile: payload.voiceProfile,
      contrastNotes: payload.contrastNotes,
      journalCategories: payload.journalCategories,
      selectedKinks: payload.selectedKinks,
      mcProfile: payload.mcProfile,
    }),
  );
}

export async function generateSectionDraft(payload: SectionRegenerationPayload) {
  const documentContext = await buildDocumentContext(payload.selectedDocuments);

  const limitMap: Record<string, number> = {
    backstory: 2500,
    response_directive: 250,
    key_memories: 1000,
    example_message: 750,
    avatar_prompt: 200,
    selfie_description: 800,
    journal_entries: 500,
    greeting_options: 730,
  };

  const charLimit = limitMap[payload.sectionKey];
  const limitInstruction = charLimit
    ? `\n\nHARD CHARACTER LIMIT: The output MUST be under ${charLimit} characters total (including spaces, punctuation, newlines — everything). Aim for ${Math.round(charLimit * 0.9)} characters. Count carefully. This is non-negotiable.`
    : "";

  const sectionRules: Record<string, string> = {
    avatar_prompt: "\nThis is a FACE-ONLY prompt. Describe only face, hair, skin tone, expression, eye details. No body, no clothing, no background. Must be under 200 characters.",
    selfie_description: "\nThis is a FULL BODY physical description for the selfie engine. Describe body type, proportions, build, skin, hair, distinguishing features. Do NOT include any specific clothing — the selfie engine dresses her based on scenario. Must be under 800 characters.",
    example_message: "\nWrite in FIRST PERSON from the character's perspective — she narrates using 'I'. Use *asterisks* for actions and \"quotes\" for speech. Example: *I lean against the counter.* \"You're back again?\" Do NOT use emojis or texting style — this is face-to-face dialogue.",
    greeting_options: "\nGreetings are FIRST PERSON, IN-PERSON scenes. The character narrates using 'I'. No emojis, no texting shorthand. Use *asterisks* for actions and \"quotes\" for speech. Each greeting must be under 730 characters.",
  };

  const extraRules = sectionRules[payload.sectionKey] ?? "";

  const systemPrompt = [
    `You are regenerating ONLY the "${payload.sectionLabel}" section of a Kindroid character.`,
    "Here is the full character for context. Return ONLY the content for this specific section, nothing else.",
    "Do not include the section heading — just the content itself.",
    "If the section normally uses a code block, return the content without the code fence markers.",
    "Be concrete, avoid generic phrasing.",
    "Do NOT repeat information that belongs in other sections — each section has a specific job.",
    limitInstruction + extraRules,
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
    payload.provider.providerType ?? "openai",
    payload.provider.baseUrl,
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
    backstoryAdditions: payload.selectedBackstories,
    scenarioAdditions: payload.selectedScenarios,
    emotionalLogic: payload.emotionalLogic,
    relationshipDynamic: payload.relationshipDynamic,
    voiceProfile: payload.voiceProfile,
    contrastNotes: payload.contrastNotes,
    journalCategories: payload.journalCategories,
    mcProfile: payload.mcProfile,
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

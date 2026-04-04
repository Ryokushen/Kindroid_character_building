import type { CharacterSection, CharacterSectionKey, JournalEntry, GreetingEntry } from "@/lib/types";

const SECTION_PATTERNS: Array<{ key: CharacterSectionKey; label: string; pattern: RegExp }> = [
  { key: "overview", label: "Overview", pattern: /overview/i },
  { key: "backstory", label: "Backstory", pattern: /backstory/i },
  { key: "avatar_prompt", label: "Avatar Prompt", pattern: /avatar\s*(prompt|desc)|face\s*detail/i },
  { key: "selfie_description", label: "Selfie Description", pattern: /selfie\s*desc/i },
  { key: "response_directive", label: "Response Directive (RD)", pattern: /response\s*directive|^\s*rd\b/i },
  { key: "example_message", label: "Example Message (EM)", pattern: /example\s*message|^\s*em\b/i },
  { key: "key_memories", label: "Key Memories", pattern: /key\s*memor/i },
  { key: "journal_entries", label: "Journal Entries", pattern: /journal\s*entr|sexual\s*behav|sexual\s*journal|kinks?\s*journal/i },
  { key: "greeting_options", label: "Greeting Options", pattern: /greeting/i },
  { key: "selfie_prompts", label: "Selfie / Image Prompts", pattern: /selfie|image\s*prompt/i },
];

function matchSectionKey(heading: string): { key: CharacterSectionKey; label: string } | null {
  for (const sp of SECTION_PATTERNS) {
    if (sp.pattern.test(heading)) {
      return { key: sp.key, label: sp.label };
    }
  }
  return null;
}

function extractCodeBlockContent(text: string): { content: string; isCodeBlock: boolean } {
  const codeBlockMatch = text.match(/```(?:text)?\s*\n([\s\S]*?)```/);
  if (codeBlockMatch) {
    return { content: codeBlockMatch[1].trim(), isCodeBlock: true };
  }
  return { content: text.trim(), isCodeBlock: false };
}

export function parseCharacterSections(markdown: string): CharacterSection[] {
  const sections: CharacterSection[] = [];
  const lines = markdown.split("\n");

  let currentHeading = "";
  let currentBody: string[] = [];
  let inSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match H1 (character name)
    const h1Match = line.match(/^#\s+(.+)/);
    if (h1Match && !line.startsWith("##")) {
      if (inSection && currentHeading) {
        pushSection(sections, currentHeading, currentBody.join("\n"));
      }
      sections.push({
        key: "name",
        label: "Character Name",
        content: h1Match[1].trim(),
        isCodeBlock: false,
      });
      currentHeading = "";
      currentBody = [];
      inSection = false;
      continue;
    }

    // Match H2 (main sections)
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match && !line.startsWith("###")) {
      if (inSection && currentHeading) {
        pushSection(sections, currentHeading, currentBody.join("\n"));
      }
      currentHeading = h2Match[1].trim();
      currentBody = [];
      inSection = true;
      continue;
    }

    // Capture orphaned ### Journal entries (outside any ## Journal Entries section)
    const h3Match = line.match(/^###\s+(Journal\s+\d+.*)$/i);
    if (h3Match && currentHeading && !/journal/i.test(currentHeading)) {
      // This is a journal entry appearing under a non-journal H2 section
      // Flush current section first
      if (inSection && currentHeading) {
        pushSection(sections, currentHeading, currentBody.join("\n"));
      }
      // Switch to collecting under a virtual "Journal Entries" heading
      currentHeading = "Journal Entries (continued)";
      currentBody = [line];
      inSection = true;
      continue;
    }

    if (inSection) {
      currentBody.push(line);
    }
  }

  // Push final section
  if (inSection && currentHeading) {
    pushSection(sections, currentHeading, currentBody.join("\n"));
  }

  return sections;
}

function pushSection(sections: CharacterSection[], heading: string, body: string) {
  // Handle "continued" sections that should merge with their parent
  const normalizedHeading = heading.replace(/\s*\(continued\)$/i, "");
  const match = matchSectionKey(normalizedHeading);
  if (!match) {
    return;
  }

  // Check if this section key already exists (journals/greetings get merged)
  const existing = sections.find((s) => s.key === match.key);
  if (existing) {
    // Append raw content — journals and greetings keep their ### sub-headings
    const trimmed = body.trim();
    if (trimmed) {
      existing.content += "\n\n" + trimmed;
    }
    return;
  }

  // For sections with sub-headings (journals, greetings, selfies), keep raw content
  if (match.key === "journal_entries" || match.key === "greeting_options" || match.key === "selfie_prompts") {
    sections.push({
      key: match.key,
      label: match.label,
      content: body.trim(),
      isCodeBlock: false,
    });
    return;
  }

  const { content, isCodeBlock } = extractCodeBlockContent(body);

  sections.push({
    key: match.key,
    label: match.label,
    content,
    isCodeBlock,
  });
}

export function reassembleMarkdown(sections: CharacterSection[]): string {
  const parts: string[] = [];

  for (const section of sections) {
    if (section.key === "name") {
      parts.push(`# ${section.content}`);
      continue;
    }

    if (section.key === "journal_entries" || section.key === "greeting_options" || section.key === "selfie_prompts") {
      parts.push(`## ${section.label}`);
      if (section.content.includes("###") || section.content.includes("```")) {
        parts.push(section.content);
      } else {
        parts.push("```\n" + section.content + "\n```");
      }
      continue;
    }

    parts.push(`## ${section.label}`);
    if (section.isCodeBlock) {
      parts.push("```\n" + section.content + "\n```");
    } else {
      parts.push(section.content);
    }
  }

  return parts.join("\n\n") + "\n";
}

/**
 * Parse journal entries from the raw journal_entries section content
 * into individual journal objects.
 */
export function parseJournalEntries(rawContent: string): JournalEntry[] {
  const journals: JournalEntry[] = [];
  const parts = rawContent.split(/(?=###\s+)/);

  for (const part of parts) {
    const titleMatch = part.match(/^###\s+(.+)/m);
    if (!titleMatch) continue;

    const title = titleMatch[1].trim();
    const bodyAfterTitle = part.slice(part.indexOf("\n") + 1);
    const { content } = extractCodeBlockContent(bodyAfterTitle);
    if (!content) continue;

    // Split into keywords line and entry text
    const { keywords, entryText } = splitJournalContent(content);

    journals.push({ title, content, keywords, entryText });
  }

  return journals;
}

/**
 * Split journal content into keywords and entry text.
 * Handles formats like:
 *   KEYWORDS: "mom" "family" "south memphis"
 *   Entry: Val's mother Rosa lives off Lamar Ave...
 */
function splitJournalContent(content: string): { keywords: string; entryText: string } {
  const lines = content.split("\n");
  let keywords = "";
  let entryStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Match KEYWORDS line (with or without colon)
    if (/^KEYWORDS?\s*:/i.test(line)) {
      keywords = line.replace(/^KEYWORDS?\s*:\s*/i, "").trim();
      entryStartIndex = i + 1;
      continue;
    }

    // Match "Entry:" prefix on a line
    if (/^Entry\s*:/i.test(line)) {
      const entryContent = line.replace(/^Entry\s*:\s*/i, "").trim();
      const remainingLines = lines.slice(i + 1).map((l) => l.trim()).join("\n").trim();
      const fullEntry = remainingLines ? `${entryContent}\n${remainingLines}` : entryContent;
      return { keywords, entryText: fullEntry };
    }
  }

  // No explicit "Entry:" prefix found — everything after keywords is the entry
  const entryText = lines.slice(entryStartIndex).join("\n").trim();
  return { keywords, entryText };
}

/**
 * Parse greeting options from the raw greeting_options section content.
 */
export function parseGreetingEntries(rawContent: string): GreetingEntry[] {
  const greetings: GreetingEntry[] = [];
  const parts = rawContent.split(/(?=###\s+)/);

  for (const part of parts) {
    const titleMatch = part.match(/^###\s+(.+)/m);
    if (!titleMatch) continue;

    const title = titleMatch[1].trim();
    const bodyAfterTitle = part.slice(part.indexOf("\n") + 1);
    const { content } = extractCodeBlockContent(bodyAfterTitle);
    if (content) {
      greetings.push({ title, content });
    }
  }

  return greetings;
}

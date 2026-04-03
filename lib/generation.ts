import type { GenerationPayload } from "@/lib/types";
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

function buildSystemPrompt() {
  return [
    "You are an expert Kindroid character designer.",
    "Use the repository context as best-practice guidance and the reference characters only as examples of structure and specificity.",
    "Return one complete Markdown document and nothing else.",
    "Keep the output focused on character design, voice, coherence, memory hooks, and practical Kindroid usability.",
    "Do not produce explicit sexual content.",
    "Use this exact section order:",
    "# Character Name",
    "## Overview",
    "- bullet list",
    "## Backstory",
    "```text",
    "full backstory",
    "```",
    "## Avatar Description",
    "```text",
    "appearance prompt",
    "```",
    "## Face Detail",
    "```text",
    "face details",
    "```",
    "## Response Directive (RD)",
    "```text",
    "behavioral direction",
    "```",
    "## Example Message (EM)",
    "```text",
    "example in-character message",
    "```",
    "## Key Memories",
    "```text",
    "compact memory block",
    "```",
    "## Journal Entries",
    "### Journal 1 — ...",
    "```text",
    "...",
    "```",
    "### Journal 2 — ...",
    "```text",
    "...",
    "```",
    "### Journal 3 — ...",
    "```text",
    "...",
    "```",
    "Be concrete, avoid generic phrasing, and infer reasonable missing details from the brief.",
  ].join("\n");
}

function buildUserPrompt(input: {
  brief: string;
  notes: string;
  documentContext: string;
  characterContext: string;
}) {
  return [
    "Character brief:",
    input.brief.trim(),
    "",
    "Additional notes:",
    input.notes.trim() || "None provided.",
    "",
    "Repository context:",
    input.documentContext || "No repository documents were selected.",
    "",
    "Reference characters:",
    input.characterContext || "No character examples were selected.",
  ].join("\n");
}

export async function generateCharacterDraft(payload: GenerationPayload) {
  const documentContext = await buildDocumentContext(payload.selectedDocuments);
  const characterContext = await buildCharacterReferenceContext(payload.selectedCharacters);

  const endpoint = normalizeCompletionsUrl(payload.provider.baseUrl);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${payload.provider.apiKey}`,
    },
    body: JSON.stringify({
      model: payload.provider.model,
      temperature: payload.provider.temperature,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt({
            brief: payload.brief,
            notes: payload.notes,
            documentContext,
            characterContext,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model request failed (${response.status}): ${errorText.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
  };

  const content = extractMessageContent(data.choices?.[0]?.message?.content);
  if (!content.trim()) {
    throw new Error("The model response did not contain any text.");
  }

  return cleanModelOutput(content);
}

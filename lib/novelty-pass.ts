import type { DraftQualityReport, GenerationPayload } from "@/lib/types";
import { callModel } from "@/lib/model-client";
import { buildDocumentContext } from "@/lib/library";
import { parseCharacterSections, reassembleMarkdown } from "@/lib/section-parser";

function buildNoveltySystemPrompt() {
  return [
    "You are revising an already-generated Kindroid character draft to make it less adjacent to existing saved characters.",
    "Keep the core concept, core relationship premise, and strongest emotional strengths intact.",
    "Do not flatten the character. Make her more distinct.",
    "Prioritize changing only these sections: Backstory, Response Directive, Example Message, Key Memories, Journal Entries, Greeting Options.",
    "Do not rewrite the visual foundation unless absolutely necessary.",
    "Return one complete Markdown document.",
  ].join("\n");
}

function buildNoveltyUserPrompt(payload: {
  draft: string;
  report: DraftQualityReport;
  brief: string;
  notes: string;
  documentContext: string;
}) {
  const overlapLines = payload.report.topOverlaps.map((overlap) => {
    const axes = overlap.matchedAxes.length > 0 ? overlap.matchedAxes.join(", ") : "general archetype drift";
    return `- ${overlap.title}: score ${overlap.score}, overlapping on ${axes}`;
  });

  const warnings = payload.report.warnings.map((warning) => `- ${warning.message}`);

  return [
    "Original brief:",
    payload.brief || "None provided.",
    "",
    "Additional notes:",
    payload.notes || "None provided.",
    "",
    "Current draft quality problems:",
    ...overlapLines,
    ...(warnings.length > 0 ? ["", "Quality warnings:", ...warnings] : []),
    "",
    "Rewrite goals:",
    "- Make the character feel less familiar to the overlaps listed above.",
    "- Change attachment pattern, romantic pacing, conflict behavior, voice cadence, sexual initiation pattern, and daily-life texture where needed.",
    "- Keep the core concept and emotional intent.",
    "- Improve distinctiveness without turning the character generic.",
    "",
    "Repository guidance:",
    payload.documentContext || "No repository documents selected.",
    "",
    "Current draft:",
    payload.draft,
  ].join("\n");
}

const TARGETED_REWRITE_KEYS = new Set([
  "backstory",
  "response_directive",
  "example_message",
  "key_memories",
  "journal_entries",
  "greeting_options",
]);

function mergeTargetedRewrite(originalMarkdown: string, rewrittenMarkdown: string) {
  const originalSections = parseCharacterSections(originalMarkdown);
  const rewrittenSections = parseCharacterSections(rewrittenMarkdown);
  const rewrittenMap = new Map(rewrittenSections.map((section) => [section.key, section]));

  const merged = originalSections.map((section) => {
    if (TARGETED_REWRITE_KEYS.has(section.key)) {
      return rewrittenMap.get(section.key) ?? section;
    }
    return section;
  });

  return reassembleMarkdown(merged);
}

export async function rewriteDraftForNovelty(
  payload: GenerationPayload,
  draft: string,
  report: DraftQualityReport,
) {
  const documentContext = await buildDocumentContext(payload.selectedDocuments, 40000);
  const rewritten = await callModel(
    payload.provider.providerType,
    payload.provider.baseUrl,
    payload.provider.apiKey,
    payload.provider.model,
    payload.provider.temperature,
    buildNoveltySystemPrompt(),
    buildNoveltyUserPrompt({
      draft,
      report,
      brief: payload.brief,
      notes: payload.notes,
      documentContext,
    }),
  );

  return mergeTargetedRewrite(draft, rewritten);
}

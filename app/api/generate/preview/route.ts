import { NextResponse } from "next/server";

import { buildPromptPreview } from "@/lib/generation";
import type { GenerationPayload } from "@/lib/types";
import { DEFAULT_EMOTIONAL_LOGIC, DEFAULT_JOURNAL_CATEGORIES, DEFAULT_RELATIONSHIP_DYNAMIC, DEFAULT_VOICE_PROFILE } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerationPayload>;

    const preview = await buildPromptPreview({
      brief: body.brief ?? "",
      notes: body.notes ?? "",
      sexualProfile: body.sexualProfile ?? "",
      selectedDocuments: body.selectedDocuments ?? [],
      selectedCharacters: body.selectedCharacters ?? [],
      selectedTemplates: body.selectedTemplates ?? [],
      selectedBackstories: body.selectedBackstories ?? [],
      selectedScenarios: body.selectedScenarios ?? [],
      emotionalLogic: body.emotionalLogic ?? DEFAULT_EMOTIONAL_LOGIC,
      relationshipDynamic: body.relationshipDynamic ?? DEFAULT_RELATIONSHIP_DYNAMIC,
      voiceProfile: body.voiceProfile ?? DEFAULT_VOICE_PROFILE,
      contrastNotes: body.contrastNotes ?? "",
      journalCategories: body.journalCategories ?? DEFAULT_JOURNAL_CATEGORIES,
      provider: {
        providerType: body.provider?.providerType ?? "openai",
        providerLabel: body.provider?.providerLabel ?? "",
        baseUrl: body.provider?.baseUrl ?? "",
        model: body.provider?.model ?? "",
        apiKey: "",
        temperature: body.provider?.temperature ?? 0.8,
      },
    });

    return NextResponse.json(preview);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to build prompt preview." },
      { status: 400 },
    );
  }
}

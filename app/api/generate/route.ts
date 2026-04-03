import { NextResponse } from "next/server";

import { generateCharacterDraft } from "@/lib/generation";
import type { GenerationPayload } from "@/lib/types";
import { DEFAULT_EMOTIONAL_LOGIC, DEFAULT_JOURNAL_CATEGORIES, DEFAULT_MC_PROFILE, DEFAULT_PHYSICAL_PROFILE, DEFAULT_RELATIONSHIP_DYNAMIC, DEFAULT_VOICE_PROFILE } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerationPayload>;

    if (!body.brief?.trim()) {
      throw new Error("A character brief is required.");
    }

    if (!body.provider?.baseUrl?.trim() || !body.provider?.model?.trim() || !body.provider?.apiKey?.trim()) {
      throw new Error("Base URL, model, and API key are required.");
    }

    const markdown = await generateCharacterDraft({
      brief: body.brief,
      notes: body.notes ?? "",
      sexualProfile: body.sexualProfile ?? "",
      selectedDocuments: body.selectedDocuments ?? [],
      selectedCharacters: body.selectedCharacters ?? [],
      selectedTemplates: body.selectedTemplates ?? [],
      selectedBackstories: body.selectedBackstories ?? [],
      selectedScenarios: body.selectedScenarios ?? [],
      howTheyMet: body.howTheyMet ?? "",
      physicalProfile: body.physicalProfile ?? DEFAULT_PHYSICAL_PROFILE,
      emotionalLogic: body.emotionalLogic ?? DEFAULT_EMOTIONAL_LOGIC,
      relationshipDynamic: body.relationshipDynamic ?? DEFAULT_RELATIONSHIP_DYNAMIC,
      voiceProfile: body.voiceProfile ?? DEFAULT_VOICE_PROFILE,
      contrastNotes: body.contrastNotes ?? "",
      journalCategories: body.journalCategories ?? DEFAULT_JOURNAL_CATEGORIES,
      mcProfile: body.mcProfile ?? DEFAULT_MC_PROFILE,
      provider: {
        providerType: body.provider.providerType ?? "openai",
        providerLabel: body.provider.providerLabel ?? "Custom",
        baseUrl: body.provider.baseUrl,
        model: body.provider.model,
        apiKey: body.provider.apiKey,
        temperature: Number(body.provider.temperature ?? 0.8),
      },
    });

    return NextResponse.json({ markdown });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to generate character draft.",
      },
      { status: 400 },
    );
  }
}

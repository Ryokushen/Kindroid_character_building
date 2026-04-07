import { NextResponse } from "next/server";

import { buildCharacterReferenceContext, listCharacters } from "@/lib/characters";
import { buildReferenceContrastLines } from "@/lib/character-fingerprint";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/generation";
import { buildDocumentContext } from "@/lib/library";
import { callModel } from "@/lib/model-client";
import { analyzeDraftQuality } from "@/lib/quality-checks";
import type { BatchGenerationResult, DraftAnalysisPayload, GenerationPayload } from "@/lib/types";
import {
  DEFAULT_EMOTIONAL_LOGIC,
  DEFAULT_JOURNAL_CATEGORIES,
  DEFAULT_MC_PROFILE,
  DEFAULT_PHYSICAL_PROFILE,
  DEFAULT_RELATIONSHIP_DYNAMIC,
  DEFAULT_VOICE_PROFILE,
} from "@/lib/types";

type BatchBody = Partial<GenerationPayload> & { temperatures?: number[] };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BatchBody;

    if (!body.brief?.trim()) {
      throw new Error("A character brief is required.");
    }

    if (!body.provider?.baseUrl?.trim() || !body.provider?.model?.trim() || !body.provider?.apiKey?.trim()) {
      throw new Error("Base URL, model, and API key are required.");
    }

    const temperatures = body.temperatures ?? [0.6, 0.8, 1.0, 1.2];
    if (temperatures.length < 2 || temperatures.length > 4) {
      throw new Error("Provide 2-4 temperature values.");
    }

    const normalizedPayload: GenerationPayload = {
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
      selectedKinks: body.selectedKinks ?? [],
      mcProfile: body.mcProfile ?? DEFAULT_MC_PROFILE,
      backstoryLimit: body.backstoryLimit,
      provider: {
        providerType: body.provider.providerType ?? "openai",
        providerLabel: body.provider.providerLabel ?? "Custom",
        baseUrl: body.provider.baseUrl,
        model: body.provider.model,
        apiKey: body.provider.apiKey,
        temperature: Number(body.provider.temperature ?? 0.8),
      },
    };

    const [activeCharacters, documentContext, characterContext] = await Promise.all([
      listCharacters(),
      buildDocumentContext(normalizedPayload.selectedDocuments),
      buildCharacterReferenceContext(normalizedPayload.selectedCharacters),
    ]);
    const referenceCharacters = activeCharacters.filter((character) =>
      normalizedPayload.selectedCharacters.includes(character.fileName),
    );
    const contrastRequirements = buildReferenceContrastLines(referenceCharacters);

    const settled = await Promise.allSettled(
      temperatures.map(async (temp): Promise<BatchGenerationResult> => {
        const markdown = await callModel(
          normalizedPayload.provider.providerType,
          normalizedPayload.provider.baseUrl,
          normalizedPayload.provider.apiKey,
          normalizedPayload.provider.model,
          temp,
          buildSystemPrompt({ backstoryLimit: normalizedPayload.backstoryLimit }),
          buildUserPrompt({
            brief: normalizedPayload.brief,
            notes: normalizedPayload.notes,
            sexualProfile: normalizedPayload.sexualProfile,
            documentContext,
            characterContext,
            templateAdditions: normalizedPayload.selectedTemplates,
            backstoryAdditions: normalizedPayload.selectedBackstories,
            scenarioAdditions: normalizedPayload.selectedScenarios,
            howTheyMet: normalizedPayload.howTheyMet,
            physicalProfile: normalizedPayload.physicalProfile,
            emotionalLogic: normalizedPayload.emotionalLogic,
            relationshipDynamic: normalizedPayload.relationshipDynamic,
            voiceProfile: normalizedPayload.voiceProfile,
            contrastNotes: normalizedPayload.contrastNotes,
            journalCategories: normalizedPayload.journalCategories,
            selectedKinks: normalizedPayload.selectedKinks,
            mcProfile: normalizedPayload.mcProfile,
            contrastRequirements,
          }),
        );

        const analysisInput: DraftAnalysisPayload = {
          markdown,
          brief: normalizedPayload.brief,
          notes: normalizedPayload.notes,
          sexualProfile: normalizedPayload.sexualProfile,
          selectedDocuments: normalizedPayload.selectedDocuments,
          selectedCharacters: normalizedPayload.selectedCharacters,
          selectedTemplates: normalizedPayload.selectedTemplates,
          selectedBackstories: normalizedPayload.selectedBackstories,
          selectedScenarios: normalizedPayload.selectedScenarios,
          howTheyMet: normalizedPayload.howTheyMet,
          physicalProfile: normalizedPayload.physicalProfile,
          emotionalLogic: normalizedPayload.emotionalLogic,
          relationshipDynamic: normalizedPayload.relationshipDynamic,
          voiceProfile: normalizedPayload.voiceProfile,
          contrastNotes: normalizedPayload.contrastNotes,
          journalCategories: normalizedPayload.journalCategories,
          selectedKinks: normalizedPayload.selectedKinks,
          mcProfile: normalizedPayload.mcProfile,
        };
        const qualityReport = analyzeDraftQuality({
          markdown,
          activeCharacters,
          referenceCharacters,
          analysisInput,
        });

        return { temperature: temp, markdown, qualityReport };
      }),
    );

    const results: BatchGenerationResult[] = [];
    const failedTemperatures: number[] = [];
    for (let i = 0; i < settled.length; i++) {
      const outcome = settled[i];
      if (outcome.status === "fulfilled") {
        results.push(outcome.value);
      } else {
        failedTemperatures.push(temperatures[i]);
      }
    }

    if (results.length === 0) {
      throw new Error("All temperature variations failed to generate.");
    }

    return NextResponse.json({ results, failedTemperatures });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate batch." },
      { status: 400 },
    );
  }
}

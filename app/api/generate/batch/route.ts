import { NextResponse } from "next/server";

import { generateCharacterDraft } from "@/lib/generation";
import type { GenerationPayload } from "@/lib/types";

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

    const results = await Promise.all(
      temperatures.map(async (temp) => {
        const markdown = await generateCharacterDraft({
          brief: body.brief!,
          notes: body.notes ?? "",
          sexualProfile: body.sexualProfile ?? "",
          selectedDocuments: body.selectedDocuments ?? [],
          selectedCharacters: body.selectedCharacters ?? [],
          selectedTemplates: body.selectedTemplates ?? [],
          provider: {
            providerType: body.provider!.providerType ?? "openai",
            providerLabel: body.provider!.providerLabel ?? "Custom",
            baseUrl: body.provider!.baseUrl!,
            model: body.provider!.model!,
            apiKey: body.provider!.apiKey!,
            temperature: temp,
          },
        });

        return { temperature: temp, markdown };
      }),
    );

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate batch." },
      { status: 400 },
    );
  }
}

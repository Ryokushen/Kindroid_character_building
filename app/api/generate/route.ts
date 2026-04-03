import { NextResponse } from "next/server";

import { generateCharacterDraft } from "@/lib/generation";
import type { GenerationPayload } from "@/lib/types";

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
      selectedDocuments: body.selectedDocuments ?? [],
      selectedCharacters: body.selectedCharacters ?? [],
      provider: {
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

import { NextResponse } from "next/server";

import { buildPromptPreview } from "@/lib/generation";
import type { GenerationPayload } from "@/lib/types";

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
      provider: {
        providerLabel: body.provider?.providerLabel ?? "",
        baseUrl: body.provider?.baseUrl ?? "",
        model: body.provider?.model ?? "",
        apiKey: "", // Don't need API key for preview
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

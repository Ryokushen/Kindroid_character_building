import { NextResponse } from "next/server";

import { generateSectionDraft } from "@/lib/generation";
import type { SectionRegenerationPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SectionRegenerationPayload>;

    if (!body.sectionKey || !body.sectionLabel) {
      throw new Error("Section key and label are required.");
    }

    if (!body.brief?.trim()) {
      throw new Error("Original brief is required for section regeneration.");
    }

    if (!body.provider?.baseUrl?.trim() || !body.provider?.model?.trim() || !body.provider?.apiKey?.trim()) {
      throw new Error("Base URL, model, and API key are required.");
    }

    const content = await generateSectionDraft({
      sectionKey: body.sectionKey,
      sectionLabel: body.sectionLabel,
      currentContent: body.currentContent ?? "",
      brief: body.brief,
      notes: body.notes ?? "",
      fullCharacterContext: body.fullCharacterContext ?? "",
      selectedDocuments: body.selectedDocuments ?? [],
      provider: {
        providerType: body.provider.providerType ?? "openai",
        providerLabel: body.provider.providerLabel ?? "Custom",
        baseUrl: body.provider.baseUrl,
        model: body.provider.model,
        apiKey: body.provider.apiKey,
        temperature: Number(body.provider.temperature ?? 0.8),
      },
    });

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to regenerate section." },
      { status: 400 },
    );
  }
}

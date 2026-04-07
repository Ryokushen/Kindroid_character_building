import { NextResponse } from "next/server";

import type { ProviderSettings } from "@/lib/types";
import { runProbePhase, runExecutePhase } from "@/lib/redesign";

type RedesignBody = {
  phase: "probe" | "execute";
  changeRequest?: string;
  characterMarkdown?: string;
  probingAnswers?: Array<{ question: string; answer: string }>;
  sectionsToChange?: string[];
  provider?: Partial<ProviderSettings>;
  backstoryLimit?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RedesignBody;

    if (!body.changeRequest?.trim()) {
      throw new Error("A change request is required.");
    }
    if (!body.characterMarkdown?.trim()) {
      throw new Error("Character markdown is required.");
    }
    if (!body.provider?.baseUrl?.trim() || !body.provider?.model?.trim() || !body.provider?.apiKey?.trim()) {
      throw new Error("Base URL, model, and API key are required.");
    }

    const provider: ProviderSettings = {
      providerType: body.provider.providerType ?? "openai",
      providerLabel: body.provider.providerLabel ?? "Custom",
      baseUrl: body.provider.baseUrl,
      model: body.provider.model,
      apiKey: body.provider.apiKey,
      temperature: Number(body.provider.temperature ?? 0.8),
    };

    if (body.phase === "probe") {
      const result = await runProbePhase({
        changeRequest: body.changeRequest,
        characterMarkdown: body.characterMarkdown,
        provider,
      });
      return NextResponse.json(result);
    }

    if (body.phase === "execute") {
      if (!body.probingAnswers?.length) {
        throw new Error("Probing answers are required for the execute phase.");
      }
      if (!body.sectionsToChange?.length) {
        throw new Error("At least one section must be selected for modification.");
      }

      const result = await runExecutePhase({
        changeRequest: body.changeRequest,
        characterMarkdown: body.characterMarkdown,
        probingAnswers: body.probingAnswers,
        sectionsToChange: body.sectionsToChange,
        provider,
        backstoryLimit: body.backstoryLimit,
      });
      return NextResponse.json(result);
    }

    throw new Error("Invalid phase. Use 'probe' or 'execute'.");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process redesign request." },
      { status: 400 },
    );
  }
}

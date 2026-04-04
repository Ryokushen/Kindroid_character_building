import { NextResponse } from "next/server";

import { listCharacters } from "@/lib/characters";
import { analyzeDraftQuality } from "@/lib/quality-checks";
import type { DraftAnalysisPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DraftAnalysisPayload>;
    if (!body.markdown?.trim()) {
      throw new Error("Markdown is required.");
    }

    const activeCharacters = (await listCharacters()).filter(
      (character) => character.fileName !== body.currentCharacterFileName,
    );
    const referenceCharacters = activeCharacters.filter((character) =>
      (body.selectedCharacters ?? []).includes(character.fileName),
    );

    const qualityReport = analyzeDraftQuality({
      markdown: body.markdown,
      activeCharacters,
      referenceCharacters,
      analysisInput: body,
    });

    return NextResponse.json({ qualityReport });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to analyze draft." },
      { status: 400 },
    );
  }
}

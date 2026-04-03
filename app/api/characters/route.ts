import { NextResponse } from "next/server";

import { listCharacters, saveCharacterMarkdown } from "@/lib/characters";

export async function GET() {
  const characters = await listCharacters();
  return NextResponse.json({ characters });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { markdown?: string };
    if (!body.markdown?.trim()) {
      throw new Error("Markdown content is required.");
    }

    const savedCharacter = await saveCharacterMarkdown(body.markdown);
    const characters = await listCharacters();

    return NextResponse.json({
      character: savedCharacter,
      characters,
      message: `${savedCharacter.title} saved to the local characters folder.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to save character.",
      },
      { status: 400 },
    );
  }
}

import { NextResponse } from "next/server";

import { listCharacters, saveCharacterMarkdown, updateCharacterMarkdown, deleteCharacter } from "@/lib/characters";

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { fileName?: string };
    if (!body.fileName) {
      throw new Error("fileName is required.");
    }

    await deleteCharacter(body.fileName);
    const characters = await listCharacters();

    return NextResponse.json({
      characters,
      message: `Character archived.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete character." },
      { status: 400 },
    );
  }
}

export async function GET() {
  const characters = await listCharacters();
  return NextResponse.json({ characters });
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { fileName?: string; markdown?: string };
    if (!body.fileName || !body.markdown?.trim()) {
      throw new Error("fileName and markdown are required.");
    }

    const updated = await updateCharacterMarkdown(body.fileName, body.markdown);
    const characters = await listCharacters();

    return NextResponse.json({
      character: updated,
      characters,
      message: `${updated.title} updated.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update character." },
      { status: 400 },
    );
  }
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

import { NextResponse } from "next/server";
import { readMetadataStore, setDocumentTags, toggleDocumentFavorite } from "@/lib/metadata";

export async function GET() {
  try {
    const store = await readMetadataStore();
    return NextResponse.json({ metadata: store });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to read metadata." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      fileName?: string;
      tags?: string[];
      favorite?: "toggle";
    };

    if (!body.fileName) {
      throw new Error("fileName is required.");
    }

    if (body.tags !== undefined) {
      await setDocumentTags(body.fileName, body.tags);
    }

    if (body.favorite === "toggle") {
      await toggleDocumentFavorite(body.fileName);
    }

    const store = await readMetadataStore();
    return NextResponse.json({ metadata: store });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update metadata." },
      { status: 400 },
    );
  }
}

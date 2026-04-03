import { NextResponse } from "next/server";

import { archiveLibraryDocument, listLibraryDocuments } from "@/lib/library";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { fileName?: string };
    if (!body.fileName) {
      throw new Error("A file name is required.");
    }

    await archiveLibraryDocument(body.fileName);
    const documents = await listLibraryDocuments();

    return NextResponse.json({
      documents,
      message: `${body.fileName} moved to the local archive.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to archive repository document.",
      },
      { status: 400 },
    );
  }
}

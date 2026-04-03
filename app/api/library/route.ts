import { NextResponse } from "next/server";

import { createLibraryDocument, listLibraryDocuments } from "@/lib/library";

export async function GET() {
  const documents = await listLibraryDocuments();
  return NextResponse.json({ documents });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "");
    const pastedContent = String(formData.get("content") || "");
    const uploadedFile = formData.get("file");

    let content = pastedContent;
    let originalFileName: string | undefined;

    if (uploadedFile instanceof File && uploadedFile.size > 0) {
      content = await uploadedFile.text();
      originalFileName = uploadedFile.name;
    }

    const document = await createLibraryDocument({
      title,
      content,
      originalFileName,
    });

    const documents = await listLibraryDocuments();
    return NextResponse.json({
      document,
      documents,
      message: "Repository document added.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to add repository document.",
      },
      { status: 400 },
    );
  }
}

"use client";

import type { LibraryDocument } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DocumentAddForm } from "./document-add-form";
import { DocumentList } from "./document-list";
import { DocumentPreview } from "./document-preview";

export function LibraryPanel({
  documents,
  selectedDocuments,
  activeDocument,
  activeDocumentRecord,
  isWorking,
  onToggleSelect,
  onSetActive,
  onArchive,
  onAddDocument,
  onUpdateMetadata,
}: {
  documents: LibraryDocument[];
  selectedDocuments: string[];
  activeDocument: string;
  activeDocumentRecord: LibraryDocument | undefined;
  isWorking: boolean;
  onToggleSelect: (fileName: string) => void;
  onSetActive: (fileName: string) => void;
  onArchive: (fileName: string) => void;
  onAddDocument: (formData: FormData) => void;
  onUpdateMetadata: (fileName: string, update: { tags?: string[]; favorite?: "toggle" }) => void;
}) {
  return (
    <Card className="border-border bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
              Repository
            </p>
            <CardTitle className="font-heading text-lg">Knowledge Library</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {documents.length} docs
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <DocumentAddForm isWorking={isWorking} onAdd={onAddDocument} />

        <Separator className="bg-border/60" />

        <DocumentList
          documents={documents}
          selectedDocuments={selectedDocuments}
          activeDocument={activeDocument}
          isWorking={isWorking}
          onToggleSelect={onToggleSelect}
          onSetActive={onSetActive}
          onArchive={onArchive}
          onUpdateMetadata={onUpdateMetadata}
        />

        <Separator className="bg-border/60" />

        <DocumentPreview document={activeDocumentRecord} />
      </CardContent>
    </Card>
  );
}

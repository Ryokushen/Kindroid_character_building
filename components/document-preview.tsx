"use client";

import type { LibraryDocument } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DocumentPreview({
  document,
}: {
  document: LibraryDocument | undefined;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">Document preview</h3>
        <span className="text-xs text-muted-foreground">
          {document?.fileName ?? "No document selected"}
        </span>
      </div>
      <ScrollArea className="h-[300px]">
        <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {document?.content ?? "Pick a document to inspect its contents."}
        </pre>
      </ScrollArea>
    </div>
  );
}

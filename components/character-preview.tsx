"use client";

import type { CharacterSummary } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CharacterPreview({
  character,
}: {
  character: CharacterSummary | undefined;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">Character preview</h3>
        <span className="text-xs text-muted-foreground">
          {character?.fileName ?? "No character selected"}
        </span>
      </div>
      <ScrollArea className="h-[300px]">
        <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {character?.content ?? "Pick a character file to inspect it."}
        </pre>
      </ScrollArea>
    </div>
  );
}

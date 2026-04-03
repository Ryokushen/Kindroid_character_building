"use client";

import type { Dispatch, SetStateAction } from "react";
import type { CharacterSummary } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function ChemistryTool({
  contrastNotes,
  setContrastNotes,
  selectedCharacters,
}: {
  contrastNotes: string;
  setContrastNotes: Dispatch<SetStateAction<string>>;
  selectedCharacters: CharacterSummary[];
}) {
  if (selectedCharacters.length === 0) return null;

  const names = selectedCharacters.map((c) => c.title).join(", ");

  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/10 p-3">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-semibold text-foreground">Character Chemistry</Label>
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-accent/10 text-accent">
          vs {selectedCharacters.length} ref{selectedCharacters.length > 1 ? "s" : ""}
        </Badge>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        You selected <span className="text-foreground font-medium">{names}</span> as references.
        How should this new character be different?
      </p>
      <Textarea
        rows={3}
        value={contrastNotes}
        onChange={(e) => setContrastNotes(e.target.value)}
        placeholder="e.g., 'More reserved than Val, less bratty than Kayla, older and more grounded...'"
        className="bg-muted/50 resize-y"
      />
    </div>
  );
}

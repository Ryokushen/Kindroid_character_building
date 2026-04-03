"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CharacterSummary } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { TemplateSelector } from "./template-selector";

export function BriefForm({
  brief,
  notes,
  sexualProfile,
  characters,
  selectedCharacters,
  selectedTemplates,
  setBrief,
  setNotes,
  setSexualProfile,
  setSelectedTemplates,
  onToggleCharacter,
}: {
  brief: string;
  notes: string;
  sexualProfile: string;
  characters: CharacterSummary[];
  selectedCharacters: string[];
  selectedTemplates: string[];
  setBrief: Dispatch<SetStateAction<string>>;
  setNotes: Dispatch<SetStateAction<string>>;
  setSexualProfile: Dispatch<SetStateAction<string>>;
  setSelectedTemplates: Dispatch<SetStateAction<string[]>>;
  onToggleCharacter: (fileName: string) => void;
}) {
  const [sexOpen, setSexOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Character brief</Label>
        <Textarea
          rows={6}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Describe the character concept, role, tone, relationship dynamic, setting, and any required sections."
          className="bg-muted/50 resize-y"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Additional notes</Label>
        <Textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional guardrails, formatting requests, or constraints."
          className="bg-muted/50 resize-y"
        />
      </div>

      {/* Sexual Profile - collapsible */}
      <Collapsible open={sexOpen} onOpenChange={setSexOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <div className="flex items-center gap-2">
            <span>Sexual Profile</span>
            {sexualProfile.trim() && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-pink-500/10 text-pink-400">
                Active
              </Badge>
            )}
          </div>
          <svg
            className={`h-4 w-4 transition-transform ${sexOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Describe sexual traits, dynamics, and preferences. This generates dedicated journal entries
            with keyword triggers so Kindroid recalls this context at the right moments.
          </p>

          <Textarea
            rows={6}
            value={sexualProfile}
            onChange={(e) => setSexualProfile(e.target.value)}
            placeholder={`Examples of what to include:

• Sex drive level (high, moderate, situational)
• Dominant/submissive dynamics and how they shift
• Specific kinks, turn-ons, or fantasies
• How they initiate or respond to intimacy
• Physical preferences and touch style
• Dirty talk style (narrates, teases, commands, whispers)
• What makes them feel desired or vulnerable
• Boundaries or things they won't do`}
            className="bg-muted/50 resize-y"
          />
        </CollapsibleContent>
      </Collapsible>

      <TemplateSelector
        selectedTemplates={selectedTemplates}
        setSelectedTemplates={setSelectedTemplates}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-foreground">Reference characters</h3>
          <span className="text-xs text-muted-foreground">{selectedCharacters.length} selected</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {characters.map((char) => {
            const checked = selectedCharacters.includes(char.fileName);
            return (
              <label
                key={char.fileName}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs transition-all hover:bg-muted/60",
                  checked && "border-primary/40 bg-primary/10 text-primary",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggleCharacter(char.fileName)}
                  className="h-3.5 w-3.5 border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <span>{char.title}</span>
              </label>
            );
          })}
          {characters.length === 0 && (
            <Badge variant="secondary" className="text-muted-foreground">
              No characters yet
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

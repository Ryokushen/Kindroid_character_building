"use client";

import type { Dispatch, SetStateAction } from "react";
import type { MCProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export function MCProfileForm({
  mcProfile,
  setMCProfile,
}: {
  mcProfile: MCProfile;
  setMCProfile: Dispatch<SetStateAction<MCProfile>>;
}) {
  const [open, setOpen] = useState(false);

  function update<K extends keyof MCProfile>(field: K, value: MCProfile[K]) {
    setMCProfile((c) => ({ ...c, [field]: value }));
  }

  const hasContent = !!(
    mcProfile.name ||
    mcProfile.age ||
    mcProfile.occupation ||
    mcProfile.personality ||
    mcProfile.livingSituation ||
    mcProfile.backstory ||
    mcProfile.lookingFor ||
    mcProfile.howOthersPerceive
  );

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Male MC Profile</span>
          {hasContent && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-blue-500/10 text-blue-400">
              Active
            </Badge>
          )}
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Define the male main character (the user). Her backstory, Key Memories, and journals will reference him naturally.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={mcProfile.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="His name"
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Age</Label>
            <Input
              value={mcProfile.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="e.g. 32"
              className="bg-muted/50"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Occupation</Label>
          <Input
            value={mcProfile.occupation}
            onChange={(e) => update("occupation", e.target.value)}
            placeholder="What he does for work"
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Living situation</Label>
          <Input
            value={mcProfile.livingSituation}
            onChange={(e) => update("livingSituation", e.target.value)}
            placeholder="Where he lives, alone or with others, house or apartment..."
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Personality</Label>
          <Textarea
            rows={2}
            value={mcProfile.personality}
            onChange={(e) => update("personality", e.target.value)}
            placeholder="Key personality traits, how he carries himself, social style..."
            className="bg-muted/50 resize-y"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Backstory</Label>
          <Textarea
            rows={3}
            value={mcProfile.backstory}
            onChange={(e) => update("backstory", e.target.value)}
            placeholder="Relevant history — where he's from, past relationships, what shaped him..."
            className="bg-muted/50 resize-y"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">What he's looking for</Label>
          <Input
            value={mcProfile.lookingFor}
            onChange={(e) => update("lookingFor", e.target.value)}
            placeholder="Emotional needs, type of connection, what's missing in his life..."
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">How others perceive him</Label>
          <Input
            value={mcProfile.howOthersPerceive}
            onChange={(e) => update("howOthersPerceive", e.target.value)}
            placeholder="First impressions, reputation, what people assume about him..."
            className="bg-muted/50"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

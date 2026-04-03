"use client";

import type { Dispatch, SetStateAction } from "react";
import type { EmotionalLogic } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export function EmotionalLogicForm({
  emotionalLogic,
  setEmotionalLogic,
}: {
  emotionalLogic: EmotionalLogic;
  setEmotionalLogic: Dispatch<SetStateAction<EmotionalLogic>>;
}) {
  const [open, setOpen] = useState(false);

  function update(field: keyof EmotionalLogic, value: string) {
    setEmotionalLogic((c) => ({ ...c, [field]: value }));
  }

  const hasContent = !!(emotionalLogic.wound || emotionalLogic.armor || emotionalLogic.crackInArmor || emotionalLogic.contradiction);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Emotional Logic</span>
          {hasContent && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary">
              Active
            </Badge>
          )}
        </div>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Define the emotional core that drives this character's behavior.
        </p>
        <div className="space-y-2.5">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">What's their wound?</Label>
            <Input
              value={emotionalLogic.wound}
              onChange={(e) => update("wound", e.target.value)}
              placeholder="What experience changed them? Not trauma-dump — what SHAPED them."
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">What's their armor?</Label>
            <Input
              value={emotionalLogic.armor}
              onChange={(e) => update("armor", e.target.value)}
              placeholder="How do they protect themselves? Humor, coldness, control, people-pleasing?"
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">What cracks the armor?</Label>
            <Input
              value={emotionalLogic.crackInArmor}
              onChange={(e) => update("crackInArmor", e.target.value)}
              placeholder="What earns their vulnerability? Patience, directness, physical touch?"
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">What's their contradiction?</Label>
            <Input
              value={emotionalLogic.contradiction}
              onChange={(e) => update("contradiction", e.target.value)}
              placeholder="The tension that makes them interesting — e.g., 'strong-willed but craves surrender'"
              className="bg-muted/50"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

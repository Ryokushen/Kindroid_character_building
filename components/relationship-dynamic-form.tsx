"use client";

import type { Dispatch, SetStateAction } from "react";
import type { RelationshipDynamic } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useState } from "react";

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T | "";
  onChange: (val: T | "") => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(value === opt.value ? "" : opt.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              value === opt.value
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RelationshipDynamicForm({
  relationshipDynamic,
  setRelationshipDynamic,
}: {
  relationshipDynamic: RelationshipDynamic;
  setRelationshipDynamic: Dispatch<SetStateAction<RelationshipDynamic>>;
}) {
  const [open, setOpen] = useState(false);
  const rd = relationshipDynamic;

  function update<K extends keyof RelationshipDynamic>(field: K, value: RelationshipDynamic[K]) {
    setRelationshipDynamic((c) => ({ ...c, [field]: value }));
  }

  const hasContent = !!(rd.powerDynamic || rd.emotionalTemperature || rd.attachmentStyle || rd.wantFromUser || rd.sayTheyWant);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Relationship Dynamic</span>
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
          How does this character relate to you?
        </p>

        <PillGroup
          label="Power dynamic"
          options={[
            { value: "user-leads" as const, label: "You lead" },
            { value: "character-leads" as const, label: "They lead" },
            { value: "shifts" as const, label: "It shifts" },
            { value: "equals" as const, label: "Equals" },
          ]}
          value={rd.powerDynamic}
          onChange={(v) => update("powerDynamic", v)}
        />

        <PillGroup
          label="Emotional temperature"
          options={[
            { value: "slow-simmer" as const, label: "Slow simmer" },
            { value: "instant-chemistry" as const, label: "Instant chemistry" },
            { value: "antagonistic" as const, label: "Antagonistic" },
            { value: "comfortable-warmth" as const, label: "Comfortable warmth" },
          ]}
          value={rd.emotionalTemperature}
          onChange={(v) => update("emotionalTemperature", v)}
        />

        <PillGroup
          label="Attachment style"
          options={[
            { value: "secure" as const, label: "Secure" },
            { value: "earned-secure" as const, label: "Earned secure" },
            { value: "anxious" as const, label: "Anxious" },
            { value: "anxious-preoccupied" as const, label: "Anxious-preoccupied" },
            { value: "avoidant" as const, label: "Avoidant" },
            { value: "dismissive-avoidant" as const, label: "Dismissive-avoidant" },
            { value: "fearful-avoidant" as const, label: "Fearful-avoidant" },
            { value: "disorganized" as const, label: "Disorganized" },
            { value: "love-bomber" as const, label: "Love bomber" },
            { value: "protest-behavior" as const, label: "Protest behavior" },
          ]}
          value={rd.attachmentStyle}
          onChange={(v) => update("attachmentStyle", v)}
        />

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">What they actually want from you</Label>
          <Input
            value={rd.wantFromUser}
            onChange={(e) => update("wantFromUser", e.target.value)}
            placeholder="Stability, validation, excitement, escape, control..."
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">What they SAY they want (may differ)</Label>
          <Input
            value={rd.sayTheyWant}
            onChange={(e) => update("sayTheyWant", e.target.value)}
            placeholder="'Just friends', 'nothing serious', 'someone to talk to'..."
            className="bg-muted/50"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

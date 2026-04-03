"use client";

import type { Dispatch, SetStateAction } from "react";
import type { PhysicalProfile } from "@/lib/types";
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

type PhysicalProfileProps = {
  physicalProfile: PhysicalProfile;
  setPhysicalProfile: Dispatch<SetStateAction<PhysicalProfile>>;
};

/**
 * Physical appearance fields: body type, height, age range, ethnicity.
 * Rendered on the Concept tab.
 */
export function PhysicalAppearanceForm({ physicalProfile, setPhysicalProfile }: PhysicalProfileProps) {
  const [open, setOpen] = useState(false);

  function update<K extends keyof PhysicalProfile>(field: K, value: PhysicalProfile[K]) {
    setPhysicalProfile((c) => ({ ...c, [field]: value }));
  }

  const hasContent = !!(
    physicalProfile.bodyType ||
    physicalProfile.height ||
    physicalProfile.ageRange ||
    physicalProfile.ethnicity
  );

  const activeCount = [
    physicalProfile.bodyType,
    physicalProfile.height,
    physicalProfile.ageRange,
    physicalProfile.ethnicity,
  ].filter(Boolean).length;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Physical Appearance</span>
          {hasContent && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-pink-500/10 text-pink-400">
              {activeCount} set
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
          Shape her physical appearance. Feeds directly into the Selfie Description, Avatar Prompt, and Overview.
        </p>

        <PillGroup
          label="Body type"
          options={[
            { value: "petite" as const, label: "Petite" },
            { value: "slim" as const, label: "Slim" },
            { value: "athletic" as const, label: "Athletic" },
            { value: "curvy" as const, label: "Curvy" },
            { value: "thick" as const, label: "Thick" },
            { value: "voluptuous" as const, label: "Voluptuous" },
            { value: "extreme-voluptuous" as const, label: "Extreme Voluptuous" },
            { value: "bbw" as const, label: "BBW" },
          ]}
          value={physicalProfile.bodyType}
          onChange={(v) => update("bodyType", v)}
        />

        <PillGroup
          label="Height"
          options={[
            { value: "very-short" as const, label: "Very short (4'10\"-5'1\")" },
            { value: "short" as const, label: "Short (5'2\"-5'4\")" },
            { value: "average" as const, label: "Average (5'5\"-5'6\")" },
            { value: "tall" as const, label: "Tall (5'7\"-5'9\")" },
            { value: "very-tall" as const, label: "Very tall (5'10\"+)" },
          ]}
          value={physicalProfile.height}
          onChange={(v) => update("height", v)}
        />

        <PillGroup
          label="Age range"
          options={[
            { value: "18-22" as const, label: "18-22" },
            { value: "23-27" as const, label: "23-27" },
            { value: "28-33" as const, label: "28-33" },
            { value: "34-40" as const, label: "34-40" },
            { value: "41-50" as const, label: "41-50" },
            { value: "50+" as const, label: "50+" },
          ]}
          value={physicalProfile.ageRange}
          onChange={(v) => update("ageRange", v)}
        />

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Ethnicity / cultural background</Label>
          <Input
            value={physicalProfile.ethnicity}
            onChange={(e) => update("ethnicity", e.target.value)}
            placeholder="e.g. Latina (Mexican-American), Korean, Black, Italian, mixed..."
            className="bg-muted/50"
          />
          <p className="text-[10px] text-muted-foreground">
            Shapes appearance, family dynamics, cultural habits, and food references in journals.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Flirtation style selector — rendered on the Personality tab.
 */
export function FlirtationStylePills({ physicalProfile, setPhysicalProfile }: PhysicalProfileProps) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 px-4 py-3 space-y-1.5">
      <PillGroup
        label="Flirtation style"
        options={[
          { value: "bold-direct" as const, label: "Bold & direct" },
          { value: "subtle-deniability" as const, label: "Subtle / plausible deniability" },
          { value: "physical-touchy" as const, label: "Physical / touchy" },
          { value: "teasing-push-pull" as const, label: "Teasing / push-pull" },
          { value: "acts-of-service" as const, label: "Acts of service" },
          { value: "shy-stolen-glances" as const, label: "Shy / stolen glances" },
        ]}
        value={physicalProfile.flirtationStyle}
        onChange={(v) => setPhysicalProfile((c) => ({ ...c, flirtationStyle: v }))}
      />
      <p className="text-[10px] text-muted-foreground">
        How she shows interest — shapes the backstory, greetings, and Example Message.
      </p>
    </div>
  );
}

/**
 * Availability status selector — rendered on the Concept tab.
 */
export function AvailabilityStatusPills({ physicalProfile, setPhysicalProfile }: PhysicalProfileProps) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 px-4 py-3 space-y-1.5">
      <PillGroup
        label="Availability status"
        options={[
          { value: "single" as const, label: "Single" },
          { value: "divorced" as const, label: "Divorced" },
          { value: "its-complicated" as const, label: "It's complicated" },
          { value: "taken" as const, label: "Taken" },
          { value: "married-forbidden" as const, label: "Married (forbidden)" },
        ]}
        value={physicalProfile.availabilityStatus}
        onChange={(v) => setPhysicalProfile((c) => ({ ...c, availabilityStatus: v }))}
      />
      <p className="text-[10px] text-muted-foreground">
        Influences backstory tension, guilt dynamics, and relationship stakes.
      </p>
    </div>
  );
}

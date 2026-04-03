"use client";

import type { Dispatch, SetStateAction } from "react";
import type { PhysicalProfile, EyeColor, DistinguishingFeature } from "@/lib/types";
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

function MultiPillGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  selected: T[];
  onChange: (val: T[]) => void;
}) {
  function toggle(val: T) {
    if (selected.includes(val)) {
      onChange(selected.filter((s) => s !== val));
    } else {
      onChange([...selected, val]);
    }
  }
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              selected.includes(opt.value)
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

const EYE_COLOR_OPTIONS: Array<{ value: EyeColor & string; label: string }> = [
  { value: "brown", label: "Brown" },
  { value: "dark-brown", label: "Dark Brown" },
  { value: "light-brown", label: "Light Brown" },
  { value: "blue", label: "Blue" },
  { value: "ice-blue", label: "Ice Blue" },
  { value: "blue-green", label: "Blue-Green" },
  { value: "green", label: "Green" },
  { value: "emerald-green", label: "Emerald Green" },
  { value: "gray-green", label: "Gray-Green" },
  { value: "hazel", label: "Hazel" },
  { value: "gray", label: "Gray" },
  { value: "steel-gray", label: "Steel Gray" },
  { value: "honey-amber", label: "Honey / Amber" },
  { value: "golden-brown", label: "Golden Brown" },
  { value: "violet", label: "Violet" },
  { value: "nearly-black", label: "Nearly Black" },
  { value: "heterochromia", label: "Heterochromia" },
];

const FEATURE_OPTIONS: Array<{ value: DistinguishingFeature; label: string }> = [
  { value: "freckles", label: "Freckles" },
  { value: "beauty-mark", label: "Beauty mark" },
  { value: "dimples", label: "Dimples" },
  { value: "gap-teeth", label: "Gap teeth" },
  { value: "tattoos-subtle", label: "Tattoos (subtle)" },
  { value: "tattoos-heavy", label: "Tattoos (heavy)" },
  { value: "piercings-minimal", label: "Piercings (minimal)" },
  { value: "piercings-multiple", label: "Piercings (multiple)" },
  { value: "glasses", label: "Glasses" },
  { value: "scar-facial", label: "Scar (facial)" },
  { value: "scar-body", label: "Scar (body)" },
  { value: "birthmark", label: "Birthmark" },
  { value: "stretch-marks", label: "Stretch marks" },
  { value: "thick-eyebrows", label: "Thick eyebrows" },
  { value: "long-lashes", label: "Long lashes" },
  { value: "full-lips", label: "Full lips" },
  { value: "button-nose", label: "Button nose" },
  { value: "strong-jawline", label: "Strong jawline" },
  { value: "high-cheekbones", label: "High cheekbones" },
  { value: "cleft-chin", label: "Cleft chin" },
  { value: "curly-textured-hair", label: "Curly/textured hair" },
  { value: "silver-gray-streak", label: "Silver/gray streak" },
  { value: "braces", label: "Braces" },
  { value: "vitiligo", label: "Vitiligo" },
];

/**
 * Physical appearance fields: body type, height, age range, ethnicity, eye color, features.
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
    physicalProfile.ethnicity ||
    physicalProfile.eyeColor ||
    physicalProfile.distinguishingFeatures.length > 0
  );

  const activeCount = [
    physicalProfile.bodyType,
    physicalProfile.height,
    physicalProfile.ageRange,
    physicalProfile.ethnicity,
    physicalProfile.eyeColor,
    physicalProfile.distinguishingFeatures.length > 0 ? "has" : "",
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
        </div>

        <PillGroup
          label="Eye color"
          options={EYE_COLOR_OPTIONS}
          value={physicalProfile.eyeColor}
          onChange={(v) => update("eyeColor", v)}
        />

        <MultiPillGroup
          label="Distinguishing features (pick multiple)"
          options={FEATURE_OPTIONS}
          selected={physicalProfile.distinguishingFeatures}
          onChange={(v) => update("distinguishingFeatures", v)}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Flirtation style selector — rendered on the Personality tab.
 * Now uses string id to support the expanded flirtation-styles.ts data.
 */
export function FlirtationStylePills({ physicalProfile, setPhysicalProfile }: PhysicalProfileProps) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 px-4 py-3 space-y-1.5">
      <PillGroup
        label="Flirtation style"
        options={[
          { value: "bold-direct", label: "Bold & direct" },
          { value: "subtle-deniability", label: "Subtle / deniability" },
          { value: "physical-touchy", label: "Physical / touchy" },
          { value: "teasing-push-pull", label: "Teasing / push-pull" },
          { value: "acts-of-service", label: "Acts of service" },
          { value: "shy-stolen-glances", label: "Shy / stolen glances" },
          { value: "intellectual-seduction", label: "Intellectual" },
          { value: "competitive", label: "Competitive" },
          { value: "nurturing", label: "Nurturing" },
          { value: "humor-first", label: "Humor first" },
          { value: "mysterious-withholding", label: "Mysterious" },
          { value: "accidental-intimacy", label: "Accidental intimacy" },
          { value: "dominant-energy", label: "Dominant energy" },
          { value: "submissive-signals", label: "Submissive signals" },
          { value: "hot-and-cold", label: "Hot and cold" },
          { value: "vulnerability-bomb", label: "Vulnerability bomb" },
          { value: "body-language-only", label: "Body language only" },
          { value: "drunk-honesty", label: "Drunk honesty" },
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

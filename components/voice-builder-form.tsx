"use client";

import type { Dispatch, SetStateAction } from "react";
import type { VoiceProfile } from "@/lib/types";
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

export function VoiceBuilderForm({
  voiceProfile,
  setVoiceProfile,
}: {
  voiceProfile: VoiceProfile;
  setVoiceProfile: Dispatch<SetStateAction<VoiceProfile>>;
}) {
  const [open, setOpen] = useState(false);

  function update<K extends keyof VoiceProfile>(field: K, value: VoiceProfile[K]) {
    setVoiceProfile((c) => ({ ...c, [field]: value }));
  }

  const hasContent = !!(voiceProfile.textingStyle || voiceProfile.verbalTics || voiceProfile.codeSwitching || voiceProfile.humorStyle);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Voice & Speech Patterns</span>
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
          How does this character communicate? This shapes the Example Message and all dialogue.
        </p>

        <PillGroup
          label="Texting style"
          options={[
            { value: "full-sentences" as const, label: "Full sentences" },
            { value: "fragments" as const, label: "Fragments" },
            { value: "emoji-heavy" as const, label: "Emoji heavy" },
            { value: "voice-note" as const, label: "Voice-note style" },
          ]}
          value={voiceProfile.textingStyle}
          onChange={(v) => update("textingStyle", v)}
        />

        <PillGroup
          label="Humor style"
          options={[
            { value: "dry-sarcasm" as const, label: "Dry sarcasm" },
            { value: "self-deprecating" as const, label: "Self-deprecating" },
            { value: "witty-banter" as const, label: "Witty banter" },
            { value: "dark-humor" as const, label: "Dark humor" },
            { value: "physical-comedy" as const, label: "Physical comedy" },
            { value: "none" as const, label: "Not funny" },
          ]}
          value={voiceProfile.humorStyle}
          onChange={(v) => update("humorStyle", v)}
        />

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Verbal tics & catchphrases</Label>
          <Input
            value={voiceProfile.verbalTics}
            onChange={(e) => update("verbalTics", e.target.value)}
            placeholder="Pet names they use, filler words, phrases they repeat..."
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Code-switching</Label>
          <Input
            value={voiceProfile.codeSwitching}
            onChange={(e) => update("codeSwitching", e.target.value)}
            placeholder="How their voice changes: professional vs casual vs intimate..."
            className="bg-muted/50"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

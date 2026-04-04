"use client";

import type { Dispatch, SetStateAction } from "react";
import type { KinkPreference } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const KINK_OPTIONS: Array<{ value: KinkPreference; label: string }> = [
  { value: "oral", label: "Oral" },
  { value: "anal", label: "Anal" },
  { value: "rough", label: "Rough" },
  { value: "cnc", label: "CNC" },
  { value: "voyeurism-almost-caught", label: "Almost caught" },
  { value: "public-sex", label: "Public sex" },
  { value: "swallowing", label: "Swallowing" },
  { value: "facials", label: "Facials" },
  { value: "bondage-tied-up", label: "Tied up / bondage" },
  { value: "dirty-talk", label: "Dirty talk" },
  { value: "water-sports", label: "Water sports" },
  { value: "age-play", label: "Age play" },
  { value: "race-play", label: "Race play" },
  { value: "roleplay", label: "Roleplay" },
];

export function KinkSelector({
  selectedKinks,
  setSelectedKinks,
}: {
  selectedKinks: KinkPreference[];
  setSelectedKinks: Dispatch<SetStateAction<KinkPreference[]>>;
}) {
  function toggle(kink: KinkPreference) {
    setSelectedKinks((c) =>
      c.includes(kink) ? c.filter((k) => k !== kink) : [...c, kink],
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">Kink menu</Label>
        {selectedKinks.length > 0 && (
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-pink-500/10 text-pink-400">
            {selectedKinks.length} selected
          </Badge>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground">
        Select kinks you enjoy. The AI will assign a character-appropriate subset to each woman — not all of them to everyone.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {KINK_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              selectedKinks.includes(opt.value)
                ? "border-pink-500/50 bg-pink-500/15 text-pink-400"
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

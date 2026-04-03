"use client";

import type { Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { HOW_THEY_MET_OPTIONS } from "@/lib/how-they-met";

const CATEGORIES = [
  "Proximity",
  "Work-adjacent",
  "Social",
  "Digital",
  "Activity",
  "Situational",
] as const;

export function HowTheyMetSelector({
  howTheyMet,
  setHowTheyMet,
}: {
  howTheyMet: string;
  setHowTheyMet: Dispatch<SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);

  const selectedOption = HOW_THEY_MET_OPTIONS.find((o) => o.id === howTheyMet);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>How They Met</span>
          {selectedOption && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary">
              {selectedOption.name}
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
          How did they first meet? This shapes the backstory, Key Memories, and the greeting message.
        </p>
        {CATEGORIES.map((category) => {
          const options = HOW_THEY_MET_OPTIONS.filter((o) => o.category === category);
          if (options.length === 0) return null;
          return (
            <div key={category} className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setHowTheyMet(howTheyMet === opt.id ? "" : opt.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                      howTheyMet === opt.id
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
                    )}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

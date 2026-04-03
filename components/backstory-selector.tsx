"use client";

import type { Dispatch, SetStateAction } from "react";
import { BACKSTORY_ARCHITECTURES } from "@/lib/backstory-architectures";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function BackstorySelector({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}) {
  const [open, setOpen] = useState(false);

  function toggle(id: string) {
    setSelected((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Backstory Architecture</span>
          {selected.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary">
              {selected.length} selected
            </Badge>
          )}
        </div>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          What kind of relationship story is this? Pick one or combine.
        </p>
        <div className="flex flex-wrap gap-2">
          {BACKSTORY_ARCHITECTURES.map((arch) => {
            const active = selected.includes(arch.id);
            return (
              <Tooltip key={arch.id}>
                <TooltipTrigger
                  onClick={() => toggle(arch.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                    active
                      ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_8px_oklch(0.72_0.15_65_/_0.12)]"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50",
                  )}
                >
                  {arch.name}
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{arch.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

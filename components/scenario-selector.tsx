"use client";

import type { Dispatch, SetStateAction } from "react";
import { SCENARIO_TEMPLATES } from "@/lib/scenario-templates";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ScenarioSelector({
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
          <span>Scenario Modifiers</span>
          {selected.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-accent/10 text-accent">
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
          What's the situation? These shape the context and tension of the relationship.
        </p>
        <div className="flex flex-wrap gap-2">
          {SCENARIO_TEMPLATES.map((scenario) => {
            const active = selected.includes(scenario.id);
            return (
              <Tooltip key={scenario.id}>
                <TooltipTrigger
                  onClick={() => toggle(scenario.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                    active
                      ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_8px_oklch(0.55_0.2_295_/_0.12)]"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50",
                  )}
                >
                  {scenario.name}
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{scenario.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

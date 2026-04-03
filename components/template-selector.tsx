"use client";

import type { Dispatch, SetStateAction } from "react";
import { CHARACTER_TEMPLATES } from "@/lib/templates";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function TemplateSelector({
  selectedTemplates,
  setSelectedTemplates,
}: {
  selectedTemplates: string[];
  setSelectedTemplates: Dispatch<SetStateAction<string[]>>;
}) {
  function toggle(id: string) {
    setSelectedTemplates((current) =>
      current.includes(id)
        ? current.filter((t) => t !== id)
        : [...current, id],
    );
  }

  // Resolve selected template IDs to their prompt additions for the generation payload
  const selectedMeta = CHARACTER_TEMPLATES.filter((t) => selectedTemplates.includes(t.id));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">Style modifiers</h3>
        <span className="text-xs text-muted-foreground">
          {selectedMeta.length > 0 ? `${selectedMeta.length} active` : "none"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {CHARACTER_TEMPLATES.map((template) => {
          const active = selectedTemplates.includes(template.id);
          return (
            <Tooltip key={template.id}>
              <TooltipTrigger
                onClick={() => toggle(template.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                  active
                    ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_8px_oklch(0.72_0.15_65_/_0.12)]"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50",
                )}
              >
                {template.name}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-xs">{template.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

/** Resolve selected template IDs to their prompt addition strings. */
export function resolveTemplatePrompts(ids: string[]): string[] {
  return CHARACTER_TEMPLATES
    .filter((t) => ids.includes(t.id))
    .map((t) => t.promptAddition);
}

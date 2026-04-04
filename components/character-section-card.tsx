"use client";

import { useState } from "react";
import type { CharacterSection, CharacterSectionKey } from "@/lib/types";
import { KINDROID_LIMITS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function getCharLimit(key: CharacterSectionKey): number | undefined {
  return KINDROID_LIMITS[key];
}

export function CharacterSectionCard({
  section,
  isRegenerating,
  onContentChange,
  onRegenerate,
}: {
  section: CharacterSection;
  isRegenerating: boolean;
  onContentChange: (key: string, content: string) => void;
  onRegenerate: (key: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const charLimit = getCharLimit(section.key);
  const charCount = section.content.length;
  const isOverLimit = charLimit ? charCount > charLimit : false;
  const isNearLimit = charLimit ? charCount > charLimit * 0.9 : false;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className={cn("rounded-lg border bg-muted/20 overflow-hidden", isOverLimit ? "border-red-500/50" : "border-border")}>
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-2 text-left transition-colors hover:text-foreground">
            <svg
              className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="truncate text-sm font-semibold text-foreground">{section.label}</span>
            {charLimit && (
              <span
                className={cn(
                  "shrink-0 font-mono text-[11px]",
                  isOverLimit
                    ? "text-red-400 font-bold"
                    : isNearLimit
                      ? "text-yellow-400"
                      : "text-muted-foreground",
                )}
              >
                {charCount} / {charLimit}
              </span>
            )}
            {section.isCodeBlock && (
              <Badge variant="secondary" className="h-5 shrink-0 px-1.5 text-[10px] bg-accent/10 text-accent">
                code block
              </Badge>
            )}
          </CollapsibleTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 text-xs text-primary hover:bg-primary/10 hover:text-primary"
            disabled={isRegenerating}
            onClick={() => onRegenerate(section.key)}
          >
            {isRegenerating ? (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Regenerating...
              </span>
            ) : (
              "Regenerate"
            )}
          </Button>
        </div>

        <CollapsibleContent>
          <div className="border-t border-border px-4 py-3">
            {section.key === "name" ? (
              <input
                type="text"
                value={section.content}
                onChange={(e) => onContentChange(section.key, e.target.value)}
                className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 font-heading text-lg font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <Textarea
                value={section.content}
                onChange={(e) => onContentChange(section.key, e.target.value)}
                className="min-h-[120px] bg-muted/30 font-mono text-xs leading-relaxed resize-y"
                rows={Math.min(20, Math.max(4, section.content.split("\n").length + 1))}
              />
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

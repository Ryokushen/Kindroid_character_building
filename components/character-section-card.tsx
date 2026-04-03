"use client";

import { useState } from "react";
import type { CharacterSection } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/40">
          <div className="flex items-center gap-2">
            <svg
              className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-90")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-sm font-semibold text-foreground">{section.label}</span>
            {section.isCodeBlock && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-accent/10 text-accent">
                code block
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 text-xs text-primary hover:bg-primary/10 hover:text-primary"
            disabled={isRegenerating}
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate(section.key);
            }}
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
        </CollapsibleTrigger>

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

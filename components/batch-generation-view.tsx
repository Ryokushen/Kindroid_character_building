"use client";

import type { BatchGenerationResult } from "@/lib/types";
import type { DiscoveryReaction } from "@/lib/random-seed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function BatchGenerationView({
  results,
  ratings,
  onSelect,
  onRemix,
  onRate,
}: {
  results: BatchGenerationResult[];
  ratings: Record<number, DiscoveryReaction>;
  onSelect: (index: number) => void;
  onRemix: (index: number) => void;
  onRate: (index: number, reaction: DiscoveryReaction) => void;
}) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Temperature Sweep Results
        </h3>
        <span className="text-xs text-muted-foreground">
          {results.length} variations
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {results.map((result, index) => (
          <div
            key={result.temperature}
            className="rounded-lg border border-border bg-muted/20 p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-primary/10 text-primary font-mono text-xs">
                temp {result.temperature}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2.5 text-xs text-primary hover:bg-primary/10"
                onClick={() => onSelect(index)}
              >
                Use this one
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-muted-foreground">
                {result.markdown.slice(0, 1500)}
                {result.markdown.length > 1500 && "\n..."}
              </pre>
            </ScrollArea>
            <div className="grid grid-cols-2 gap-1.5">
              <Badge variant="secondary" className="justify-center bg-muted/40 font-mono text-[10px]">
                novelty {result.qualityReport.noveltyScore}
              </Badge>
              <Badge variant="secondary" className="justify-center bg-muted/40 font-mono text-[10px]">
                contrast {result.qualityReport.contrastScore}
              </Badge>
              <Badge variant="secondary" className="justify-center bg-muted/40 font-mono text-[10px]">
                internal {result.qualityReport.internalConsistencyScore}
              </Badge>
              <Badge variant="secondary" className="justify-center bg-muted/40 font-mono text-[10px]">
                sexual {result.qualityReport.sexualConsistencyScore}
              </Badge>
            </div>
            {result.qualityReport.hasSevereIssues && (
              <p className="text-[10px] leading-relaxed text-red-400">
                {result.qualityReport.blockingReasons[0] ?? "Severe quality issue detected."}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {([
                { id: "like", label: "Like" },
                { id: "maybe", label: "Maybe" },
                { id: "pass", label: "Pass" },
              ] as const).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onRate(index, option.id)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all",
                    ratings[index] === option.id
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-[10px] text-primary hover:bg-primary/10"
                onClick={() => onRemix(index)}
              >
                Remix
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

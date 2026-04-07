"use client";

import type { DraftQualityReport } from "@/lib/types";
import { FIX_SUGGESTIONS } from "@/lib/quality-checks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function scoreTone(score: number) {
  if (score >= 75) return "good";
  if (score >= 45) return "mid";
  return "bad";
}

export function QualityReportCard({
  report,
  stale = false,
  rewritten = false,
  originalReport,
  compact = false,
}: {
  report: DraftQualityReport | null;
  stale?: boolean;
  rewritten?: boolean;
  originalReport?: DraftQualityReport | null;
  compact?: boolean;
}) {
  if (!report) return null;

  const scoreItems = [
    { label: "Novelty", value: report.noveltyScore },
    { label: "Contrast", value: report.contrastScore },
    { label: "Internal", value: report.internalConsistencyScore },
    { label: "Sexual", value: report.sexualConsistencyScore },
  ];

  return (
    <div className={cn("rounded-lg border border-border bg-muted/20 p-3 space-y-3", compact && "space-y-2")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-foreground">Draft quality</span>
        {rewritten && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            auto-rewritten
          </Badge>
        )}
        {stale && (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-400">
            stale after edits
          </Badge>
        )}
        {report.hasSevereIssues && (
          <Badge variant="secondary" className="bg-red-500/10 text-red-400">
            save blocked
          </Badge>
        )}
        {originalReport && rewritten && (
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            overlap {originalReport.overlapScore} → {report.overlapScore}
          </Badge>
        )}
      </div>

      <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", compact && "sm:grid-cols-2")}>
        {scoreItems.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-md border px-2.5 py-2",
              scoreTone(item.value) === "good" && "border-green-500/20 bg-green-500/5",
              scoreTone(item.value) === "mid" && "border-amber-500/20 bg-amber-500/5",
              scoreTone(item.value) === "bad" && "border-red-500/20 bg-red-500/5",
            )}
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {report.topOverlaps.length > 0 && (
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-foreground">Closest overlaps</p>
          {report.topOverlaps.map((overlap) => (
            <div key={overlap.fileName} className="rounded-md border border-border/60 bg-muted/20 px-2.5 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">{overlap.title}</span>
                <span className="text-[11px] font-mono text-muted-foreground">{overlap.score}</span>
              </div>
              {overlap.matchedAxes.length > 0 && (
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                  {overlap.matchedAxes.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {report.warnings.length > 0 && (
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-foreground">Warnings</p>
          {report.warnings.map((warning, index) => (
            <div
              key={`${warning.code}-${index}`}
              className={cn(
                "rounded-md px-2.5 py-2 text-[11px] leading-relaxed",
                warning.severity === "severe" && "bg-red-500/8 text-red-400",
                warning.severity === "warn" && "bg-amber-500/8 text-amber-300",
                warning.severity === "info" && "bg-muted/20 text-muted-foreground",
              )}
            >
              {warning.message}
              {(FIX_SUGGESTIONS[warning.code] || (warning.code.startsWith("section-over-limit-") && "Trim this section to fit within the Kindroid character limit.")) && (
                <p className="mt-1 text-[10px] italic text-muted-foreground/80">
                  Fix: {FIX_SUGGESTIONS[warning.code] || "Trim this section to fit within the Kindroid character limit."}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

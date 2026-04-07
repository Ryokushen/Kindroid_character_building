"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CharacterSection, CharacterSectionKey, ProviderSettings } from "@/lib/types";
import { KINDROID_LIMITS } from "@/lib/types";
import { parseCharacterSections, reassembleMarkdown } from "@/lib/section-parser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CharacterSectionCard } from "./character-section-card";
import { QualityReportCard } from "./quality-report-card";
import type { DraftQualityReport } from "@/lib/types";

export function GenerationOutput({
  generatedMarkdown,
  isWorking,
  brief,
  notes,
  selectedDocuments,
  provider,
  qualityReport,
  originalQualityReport,
  rewritten,
  qualityReportIsStale,
  setGeneratedMarkdown,
  onAnalyze,
  onSave,
}: {
  generatedMarkdown: string;
  isWorking: boolean;
  brief: string;
  notes: string;
  selectedDocuments: string[];
  provider: ProviderSettings;
  qualityReport: DraftQualityReport | null;
  originalQualityReport: DraftQualityReport | null;
  rewritten: boolean;
  qualityReportIsStale: boolean;
  setGeneratedMarkdown: Dispatch<SetStateAction<string>>;
  onAnalyze: () => Promise<DraftQualityReport | null>;
  onSave: () => void;
}) {
  const [regeneratingKey, setRegeneratingKey] = useState<string | null>(null);

  // Undo/redo history for markdown edits
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isUndoRedoRef = useRef(false);

  // Push current markdown to history before a destructive change
  const pushHistory = useCallback((markdown: string) => {
    const h = historyRef.current;
    const idx = historyIndexRef.current;
    // Discard any redo future
    historyRef.current = h.slice(0, idx + 1);
    historyRef.current.push(markdown);
    // Cap at 20 entries
    if (historyRef.current.length > 20) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    isUndoRedoRef.current = true;
    setGeneratedMarkdown(historyRef.current[historyIndexRef.current]);
  }, [setGeneratedMarkdown]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    isUndoRedoRef.current = true;
    setGeneratedMarkdown(historyRef.current[historyIndexRef.current]);
  }, [setGeneratedMarkdown]);

  // Seed history when markdown first appears or changes externally (not via undo/redo)
  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }
    if (generatedMarkdown) {
      pushHistory(generatedMarkdown);
    } else {
      // Reset history when markdown is cleared (new generation)
      historyRef.current = [];
      historyIndexRef.current = -1;
    }
  }, [generatedMarkdown, pushHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const sections = useMemo(
    () => (generatedMarkdown ? parseCharacterSections(generatedMarkdown) : []),
    [generatedMarkdown],
  );

  const handleSectionContentChange = useCallback(
    (key: string, newContent: string) => {
      const updated = sections.map((s) =>
        s.key === key ? { ...s, content: newContent } : s,
      );
      setGeneratedMarkdown(reassembleMarkdown(updated));
    },
    [sections, setGeneratedMarkdown],
  );

  const handleRegenerate = useCallback(
    (key: string) => {
      const section = sections.find((s) => s.key === key);
      if (!section) return;

      setRegeneratingKey(key);

      void (async () => {
        try {
          const fullContext = reassembleMarkdown(sections);
          const response = await fetch("/api/generate/section", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sectionKey: section.key,
              sectionLabel: section.label,
              currentContent: section.content,
              brief,
              notes,
              fullCharacterContext: fullContext,
              selectedDocuments,
              provider,
            }),
          });

          const payload = (await response.json()) as { content?: string; error?: string };
          if (!response.ok) throw new Error(payload.error || "Failed to regenerate section.");

          if (payload.content) {
            const updated = sections.map((s) =>
              s.key === key ? { ...s, content: payload.content! } : s,
            );
            setGeneratedMarkdown(reassembleMarkdown(updated));
          }
        } catch (error) {
          console.error("Section regeneration failed:", error);
        } finally {
          setRegeneratingKey(null);
        }
      })();
    },
    [sections, brief, notes, selectedDocuments, provider, setGeneratedMarkdown],
  );

  const hasSections = sections.length > 0;

  const overLimitSections = useMemo(() => {
    const violations: Array<{ label: string; count: number; limit: number }> = [];
    for (const s of sections) {
      const limit = KINDROID_LIMITS[s.key as CharacterSectionKey];
      if (limit && s.content.length > limit) {
        violations.push({ label: s.label, count: s.content.length, limit });
      }
    }
    return violations;
  }, [sections]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">Generated output</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={undo}
            disabled={!canUndo}
            className="h-8 px-2"
            title="Undo (Ctrl+Z)"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
            </svg>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={redo}
            disabled={!canRedo}
            className="h-8 px-2"
            title="Redo (Ctrl+Y)"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" />
            </svg>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void onAnalyze()}
            disabled={isWorking || !generatedMarkdown.trim()}
            className="h-8"
          >
            Analyze draft
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={isWorking || !generatedMarkdown.trim() || Boolean(qualityReport?.hasSevereIssues && !qualityReportIsStale)}
            className="h-8"
          >
            {qualityReport?.hasSevereIssues && !qualityReportIsStale ? "Revise to save" : "Save to characters"}
          </Button>
        </div>
      </div>

      <QualityReportCard
        report={qualityReport}
        stale={qualityReportIsStale}
        rewritten={rewritten}
        originalReport={originalQualityReport}
      />

      {overLimitSections.length > 0 && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3">
          <p className="text-xs font-semibold text-red-400 mb-1">
            Character limit exceeded ({overLimitSections.length} {overLimitSections.length === 1 ? "section" : "sections"})
          </p>
          <ul className="space-y-0.5">
            {overLimitSections.map((v) => (
              <li key={v.label} className="text-[11px] text-red-400/80">
                {v.label}: {v.count} / {v.limit} chars ({v.count - v.limit} over)
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Edit sections below or regenerate to fit within Kindroid limits.
          </p>
        </div>
      )}

      <Tabs defaultValue={hasSections ? "sections" : "raw"} className="w-full">
        <TabsList className="mb-2 bg-muted/50">
          <TabsTrigger value="sections" className="text-xs">Section Cards</TabsTrigger>
          <TabsTrigger value="raw" className="text-xs">Raw Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="sections">
          <ScrollArea className="h-[540px]">
            {hasSections ? (
              <div className="space-y-2 pr-2">
                {sections.map((section) => (
                  <CharacterSectionCard
                    key={section.key}
                    section={section}
                    isRegenerating={regeneratingKey === section.key}
                    onContentChange={handleSectionContentChange}
                    onRegenerate={handleRegenerate}
                  />
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">
                Generate a character draft to see editable sections here.
              </p>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="raw">
          <Textarea
            value={generatedMarkdown}
            onChange={(e) => setGeneratedMarkdown(e.target.value)}
            placeholder="Generated character markdown will appear here."
            className="min-h-[500px] bg-muted/30 font-mono text-xs leading-relaxed resize-y"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { CharacterSummary, CharacterSectionKey, ProviderSettings } from "@/lib/types";
import { parseCharacterSections } from "@/lib/section-parser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Phase = "input" | "probing" | "answering" | "executing" | "review";

type SectionSuggestion = {
  key: string;
  label: string;
  reason: string;
  selected: boolean;
};

type QA = { question: string; answer: string };

export function CharacterRedesigner({
  character,
  provider,
  onSave,
}: {
  character: CharacterSummary;
  provider: ProviderSettings;
  onSave: (markdown: string) => void;
}) {
  const [changeRequest, setChangeRequest] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [probingQuestions, setProbingQuestions] = useState<QA[]>([]);
  const [sectionsToChange, setSectionsToChange] = useState<SectionSuggestion[]>([]);
  const [previewMarkdown, setPreviewMarkdown] = useState<string | null>(null);
  const [changedSections, setChangedSections] = useState<CharacterSectionKey[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [originalContent] = useState(character.content);

  // Reset when character changes
  const [trackedFile, setTrackedFile] = useState(character.fileName);
  if (character.fileName !== trackedFile) {
    setTrackedFile(character.fileName);
    setPhase("input");
    setChangeRequest("");
    setProbingQuestions([]);
    setSectionsToChange([]);
    setPreviewMarkdown(null);
    setChangedSections([]);
    setError(null);
    setApplied(false);
  }

  async function handleProbe() {
    if (!changeRequest.trim()) return;
    setError(null);
    setPhase("probing");

    try {
      const response = await fetch("/api/generate/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "probe",
          changeRequest: changeRequest.trim(),
          characterMarkdown: character.content,
          provider,
        }),
      });

      const payload = (await response.json()) as {
        questions?: string[];
        suggestedSections?: Array<{ key: string; label: string; reason: string }>;
        error?: string;
      };

      if (!response.ok) throw new Error(payload.error || "Failed to generate questions.");

      setProbingQuestions(
        (payload.questions ?? []).map((q) => ({ question: q, answer: "" })),
      );
      setSectionsToChange(
        (payload.suggestedSections ?? []).map((s) => ({ ...s, selected: true })),
      );
      setPhase("answering");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questions.");
      setPhase("input");
    }
  }

  async function handleExecute() {
    const selectedKeys = sectionsToChange.filter((s) => s.selected).map((s) => s.key);
    if (selectedKeys.length === 0) {
      setError("Select at least one section to modify.");
      return;
    }

    const unanswered = probingQuestions.some((qa) => !qa.answer.trim());
    if (unanswered) {
      setError("Please answer all questions before proceeding.");
      return;
    }

    setError(null);
    setPhase("executing");

    try {
      const response = await fetch("/api/generate/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "execute",
          changeRequest: changeRequest.trim(),
          characterMarkdown: character.content,
          probingAnswers: probingQuestions,
          sectionsToChange: selectedKeys,
          provider,
        }),
      });

      const payload = (await response.json()) as {
        markdown?: string;
        changedSections?: CharacterSectionKey[];
        error?: string;
      };

      if (!response.ok) throw new Error(payload.error || "Failed to redesign character.");

      setPreviewMarkdown(payload.markdown ?? null);
      setChangedSections(payload.changedSections ?? []);
      setPhase("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to redesign character.");
      setPhase("answering");
    }
  }

  function handleApply() {
    if (previewMarkdown) {
      onSave(previewMarkdown);
      setApplied(true);
    }
  }

  function handleRevert() {
    onSave(originalContent);
    setApplied(false);
    setPhase("input");
    setPreviewMarkdown(null);
    setChangedSections([]);
  }

  function handleDiscard() {
    setPhase("input");
    setPreviewMarkdown(null);
    setChangedSections([]);
    setProbingQuestions([]);
    setSectionsToChange([]);
  }

  function handleStartOver() {
    setPhase("input");
    setChangeRequest("");
    setProbingQuestions([]);
    setSectionsToChange([]);
    setPreviewMarkdown(null);
    setChangedSections([]);
    setError(null);
    setApplied(false);
  }

  // Parse sections for review display
  const reviewSections = previewMarkdown ? parseCharacterSections(previewMarkdown) : [];
  const changedSet = new Set(changedSections);

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
          <p className="text-xs text-red-400">{error}</p>
          <button type="button" onClick={() => setError(null)} className="text-red-400/60 hover:text-red-300">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Phase: Input */}
      {phase === "input" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Describe what you want to change about <strong>{character.title}</strong>. The LLM will ask clarifying questions before making changes.
          </p>
          <Textarea
            value={changeRequest}
            onChange={(e) => setChangeRequest(e.target.value)}
            placeholder="e.g. Make her more dominant and confident. Change her backstory from retail worker to military veteran. Add a praise kink and remove the submissive tendencies."
            className="bg-muted/30 text-xs resize-y min-h-[100px]"
            rows={4}
          />
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">
              Only the sections that need to change will be rewritten.
            </p>
            <Button
              size="sm"
              onClick={() => void handleProbe()}
              disabled={!changeRequest.trim()}
              className="h-8"
            >
              Ask me about it
            </Button>
          </div>
        </div>
      )}

      {/* Phase: Probing (loading) */}
      {phase === "probing" && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing character and preparing questions...
          </div>
        </div>
      )}

      {/* Phase: Answering */}
      {phase === "answering" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Answer these questions to help guide the redesign:
          </p>

          <ScrollArea className="max-h-[350px]">
            <div className="space-y-3 pr-2">
              {probingQuestions.map((qa, i) => (
                <div key={i} className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">{qa.question}</Label>
                  <Input
                    value={qa.answer}
                    onChange={(e) => {
                      const updated = [...probingQuestions];
                      updated[i] = { ...qa, answer: e.target.value };
                      setProbingQuestions(updated);
                    }}
                    placeholder="Your answer..."
                    className="bg-muted/30 text-xs h-8"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>

          {sectionsToChange.length > 0 && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/10 p-3">
              <p className="text-[11px] font-semibold text-foreground">Sections to modify:</p>
              {sectionsToChange.map((section, i) => (
                <div key={section.key} className="flex items-start gap-2">
                  <Checkbox
                    id={`section-${section.key}`}
                    checked={section.selected}
                    onCheckedChange={(checked) => {
                      const updated = [...sectionsToChange];
                      updated[i] = { ...section, selected: !!checked };
                      setSectionsToChange(updated);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={`section-${section.key}`} className="text-xs text-foreground cursor-pointer">
                      {section.label}
                    </Label>
                    <p className="text-[10px] text-muted-foreground">{section.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button size="sm" variant="ghost" onClick={handleStartOver} className="h-7 text-xs">
              Start over
            </Button>
            <Button
              size="sm"
              onClick={() => void handleExecute()}
              disabled={sectionsToChange.filter((s) => s.selected).length === 0}
              className="h-8"
            >
              Redesign
            </Button>
          </div>
        </div>
      )}

      {/* Phase: Executing (loading) */}
      {phase === "executing" && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redesigning character...
          </div>
        </div>
      )}

      {/* Phase: Review */}
      {phase === "review" && previewMarkdown && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-foreground">Review changes</p>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                {changedSections.length} section{changedSections.length !== 1 ? "s" : ""} changed
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {applied ? (
                <Button size="sm" variant="outline" onClick={handleRevert} className="h-7 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10">
                  Revert
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="ghost" onClick={handleDiscard} className="h-7 text-xs">
                    Discard
                  </Button>
                  <Button size="sm" onClick={handleApply} className="h-7 text-xs">
                    Apply changes
                  </Button>
                </>
              )}
            </div>
          </div>

          {applied && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
              <p className="text-xs text-green-400">Changes applied and saved. You can revert or start a new redesign.</p>
            </div>
          )}

          <ScrollArea className="max-h-[450px]">
            <div className="space-y-2 pr-2">
              {reviewSections.map((section) => {
                const isChanged = changedSet.has(section.key);
                return (
                  <div
                    key={section.key}
                    className={cn(
                      "rounded-lg border p-3",
                      isChanged ? "border-primary/40 bg-primary/5" : "border-border bg-muted/10",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-xs font-semibold text-foreground">{section.label}</p>
                      {isChanged && (
                        <Badge variant="secondary" className="bg-primary/15 text-primary text-[10px] h-4">
                          Changed
                        </Badge>
                      )}
                      {!isChanged && (
                        <Badge variant="secondary" className="bg-muted/30 text-muted-foreground text-[10px] h-4">
                          Unchanged
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-[11px] leading-relaxed whitespace-pre-wrap",
                      isChanged ? "text-foreground" : "text-muted-foreground/60",
                    )}>
                      {section.content.length > 300 && !isChanged
                        ? section.content.slice(0, 300) + "..."
                        : section.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {applied && (
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={handleStartOver} className="h-7 text-xs">
                New redesign
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

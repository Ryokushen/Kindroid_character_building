"use client";

import type { Dispatch, SetStateAction } from "react";
import type { ProviderSettings, ResearchSuggestion, WorldbuildingSettings } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TYPE_COLORS: Record<string, string> = {
  location: "bg-green-500/15 text-green-400 border-green-500/30",
  lore: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  lexicon: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export function WorldbuildingForm({
  worldbuilding,
  setWorldbuilding,
  provider,
}: {
  worldbuilding: WorldbuildingSettings;
  setWorldbuilding: Dispatch<SetStateAction<WorldbuildingSettings>>;
  provider: ProviderSettings;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ResearchSuggestion[]>([]);
  const [isResearching, setIsResearching] = useState(false);
  const [researchError, setResearchError] = useState("");

  const isXAI = provider.providerType === "xai";

  function update(field: keyof WorldbuildingSettings, value: string | boolean) {
    setWorldbuilding((c) => ({ ...c, [field]: value }));
  }

  function appendToField(field: "locations" | "sharedLore" | "worldLexicon", text: string) {
    setWorldbuilding((c) => ({
      ...c,
      [field]: c[field] ? `${c[field]}\n\n${text}` : text,
    }));
  }

  async function handleResearch() {
    if (!searchQuery.trim() || !isXAI) return;

    setIsResearching(true);
    setResearchError("");
    setSuggestions([]);

    try {
      const response = await fetch("/api/generate/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim(), provider }),
      });

      const data = (await response.json()) as { suggestions?: ResearchSuggestion[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Research failed.");

      setSuggestions(data.suggestions ?? []);
      if (!data.suggestions?.length) {
        setResearchError("No results found. Try a more specific query.");
      }
    } catch (error) {
      setResearchError(error instanceof Error ? error.message : "Research failed.");
    } finally {
      setIsResearching(false);
    }
  }

  function acceptSuggestion(suggestion: ResearchSuggestion) {
    const formatted = `${suggestion.title} — ${suggestion.entryText}`;
    const keywordsStr = suggestion.keywords.map((k) => `"${k}"`).join(" ");

    if (suggestion.type === "location") {
      appendToField("locations", formatted);
    } else if (suggestion.type === "lore") {
      appendToField("sharedLore", formatted);
    } else {
      appendToField("worldLexicon", `${suggestion.title}: ${suggestion.entryText}`);
    }

    // Always add keywords to lexicon
    if (suggestion.type !== "lexicon") {
      appendToField("worldLexicon", keywordsStr);
    }

    // Remove from suggestions
    setSuggestions((prev) => prev.filter((s) => s !== suggestion));
  }

  function acceptAll() {
    for (const s of suggestions) {
      acceptSuggestion(s);
    }
    setSuggestions([]);
  }

  const hasContent = !!(worldbuilding.locations || worldbuilding.sharedLore || worldbuilding.worldLexicon);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Worldbuilding</span>
          {hasContent && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary">
              Active
            </Badge>
          )}
        </div>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Build a shared world for multiple characters. <strong>Global journals</strong> contain location lore, history, and world facts
          that any character can reference. <strong>Individual journals</strong> stay character-specific.
          Kindroid recalls up to 3 global + 3 individual journals per message — use specific keywords to avoid collisions.
        </p>

        {/* === Research with Grok === */}
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-2">
          <Label className="text-xs font-medium text-accent">Research with Grok</Label>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {isXAI
              ? "Enter a location, topic, or cultural element. Grok searches the web and generates journal entry suggestions."
              : "Switch to xAI (Grok) in Provider Settings to enable web search research."}
          </p>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") void handleResearch(); }}
              placeholder="e.g. Arlington TN, Beale Street Memphis, West Tennessee culture..."
              className="bg-muted/50 text-xs h-8"
              disabled={!isXAI || isResearching}
            />
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs border-accent/40 text-accent hover:bg-accent/10 shrink-0"
              disabled={!isXAI || isResearching || !searchQuery.trim()}
              onClick={() => void handleResearch()}
            >
              {isResearching ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Research
                </span>
              )}
            </Button>
          </div>

          {researchError && (
            <p className="text-[10px] text-red-400">{researchError}</p>
          )}

          {/* Suggestion cards */}
          {suggestions.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-[10px] text-accent hover:text-accent hover:bg-accent/10"
                  onClick={acceptAll}
                >
                  Accept all
                </Button>
              </div>

              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border bg-muted/30 p-2.5 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge
                        variant="outline"
                        className={cn("h-4 px-1.5 text-[9px] shrink-0 capitalize", TYPE_COLORS[suggestion.type])}
                      >
                        {suggestion.type}
                      </Badge>
                      <span className="text-xs font-medium text-foreground truncate">{suggestion.title}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[10px] text-primary hover:text-primary hover:bg-primary/10 shrink-0"
                      onClick={() => acceptSuggestion(suggestion)}
                    >
                      Accept
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {suggestion.entryText}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.keywords.map((kw, j) => (
                      <span
                        key={j}
                        className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[9px] text-muted-foreground"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Locations</Label>
          <Textarea
            rows={4}
            value={worldbuilding.locations}
            onChange={(e) => update("locations", e.target.value)}
            placeholder={`Describe the places in your world. Each location becomes a Global journal entry.\n\nExamples:\n• Arlington, TN — quiet suburb, old money estates, cicadas in summer\n• Beale Street, Memphis — neon, blues music, sticky bar floors\n• Jackson, TN — small-town rhythms, everyone knows everyone`}
            className="bg-muted/50 resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Shared world lore</Label>
          <Textarea
            rows={3}
            value={worldbuilding.sharedLore}
            onChange={(e) => update("sharedLore", e.target.value)}
            placeholder={`Facts, history, social dynamics any character in this world would know.\n\nExamples:\n• The Lawson family runs half the county\n• Summer storms knock the power out weekly\n• Everyone goes to the same church on Sundays`}
            className="bg-muted/50 resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">World lexicon</Label>
          <Textarea
            rows={2}
            value={worldbuilding.worldLexicon}
            onChange={(e) => update("worldLexicon", e.target.value)}
            placeholder={`Custom terms, proper nouns, slang — these become journal keywords.\n\nExamples: "The Bottoms" "Lawson property" "Shelby Farms" "catfish fry"`}
            className="bg-muted/50 resize-y"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id="generate-global-journals"
            checked={worldbuilding.generateGlobalJournals}
            onCheckedChange={(checked) => update("generateGlobalJournals", !!checked)}
          />
          <Label htmlFor="generate-global-journals" className="text-xs text-muted-foreground cursor-pointer">
            Generate Global journal entries (paste into Kindroid&apos;s Global Journal section)
          </Label>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

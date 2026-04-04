"use client";

import { useState } from "react";
import type { WorkbenchActions, WorkbenchState } from "@/hooks/use-workbench";
import { resolveTemplatePrompts } from "@/components/template-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ProviderSettings } from "./provider-settings";
import { BriefForm } from "./brief-form";
import { GenerationOutput } from "./generation-output";
import { BatchGenerationView } from "./batch-generation-view";
import { GlossaryDialog } from "./glossary-dialog";

export function DraftBuilderPanel({
  state,
  actions,
}: {
  state: WorkbenchState;
  actions: WorkbenchActions;
}) {
  const [promptPreview, setPromptPreview] = useState<{
    system: string;
    user: string;
    systemChars: number;
    userChars: number;
    totalChars: number;
    documentCount: number;
    characterCount: number;
  } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  async function handleViewPrompt() {
    setLoadingPreview(true);
    try {
      const response = await fetch("/api/generate/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: state.brief,
          notes: state.notes,
          sexualProfile: state.sexualProfile,
          selectedDocuments: state.selectedDocuments,
          selectedCharacters: state.selectedCharacters,
          selectedTemplates: resolveTemplatePrompts(state.selectedTemplates),
          selectedBackstories: state.selectedBackstories,
          selectedScenarios: state.selectedScenarios,
          howTheyMet: state.howTheyMet,
          physicalProfile: state.physicalProfile,
          emotionalLogic: state.emotionalLogic,
          relationshipDynamic: state.relationshipDynamic,
          voiceProfile: state.voiceProfile,
          contrastNotes: state.contrastNotes,
          journalCategories: state.journalCategories,
          selectedKinks: state.selectedKinks,
          mcProfile: state.mcProfile,
          provider: state.provider,
        }),
      });
      const data = await response.json();
      setPromptPreview(data);
    } catch {
      // Silent fail
    } finally {
      setLoadingPreview(false);
    }
  }

  return (
    <Card className="border-primary/10 bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
              Generation
            </p>
            <CardTitle className="font-heading text-lg">Draft Builder</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <GlossaryDialog />
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {state.selectedDocuments.length} docs in context
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProviderSettings
          provider={state.provider}
          setProvider={actions.setProvider}
        />

        <Separator className="bg-border/60" />

        <BriefForm state={state} actions={actions} />

        {/* Generation mode toggle */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => actions.setIsBatchMode(false)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                !state.isBatchMode
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50",
              )}
            >
              Single generation
            </button>
            <button
              type="button"
              onClick={() => actions.setIsBatchMode(true)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                state.isBatchMode
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50",
              )}
            >
              Temperature sweep
            </button>
          </div>

          {state.isBatchMode && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Temperatures ({state.batchTemperatures.length} values)
              </Label>
              <div className="flex gap-2">
                {state.batchTemperatures.map((temp, i) => (
                  <Input
                    key={i}
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={temp}
                    onChange={(e) => {
                      const next = [...state.batchTemperatures];
                      next[i] = Number(e.target.value) || 0;
                      actions.setBatchTemperatures(next);
                    }}
                    className="w-20 bg-muted/50 text-center font-mono text-xs"
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {[
                  { label: "Conservative", temps: [0.5, 0.7] },
                  { label: "Balanced", temps: [0.6, 0.8, 1.0] },
                  { label: "Full sweep", temps: [0.6, 0.8, 1.0, 1.2] },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => actions.setBatchTemperatures(preset.temps)}
                    className="rounded border border-border bg-muted/20 px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted/40 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate + View Prompt buttons */}
        <div className="flex gap-2">
          <Button
            onClick={state.isBatchMode ? actions.handleBatchGenerate : actions.handleGenerate}
            disabled={state.isWorking}
            className="flex-1"
            size="lg"
          >
            {state.isWorking
              ? "Generating..."
              : state.isBatchMode
                ? `Generate ${state.batchTemperatures.length} variations`
                : "Generate draft"}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleViewPrompt}
            disabled={loadingPreview}
            className="px-4 text-muted-foreground hover:text-foreground"
          >
            {loadingPreview ? "..." : "View prompt"}
          </Button>
        </div>

        {/* Prompt Preview */}
        {promptPreview && (
          <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Prompt Preview</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-[10px] bg-primary/10 text-primary">
                  {(promptPreview.totalChars / 1000).toFixed(1)}K chars
                </Badge>
                <Badge variant="secondary" className="font-mono text-[10px] bg-accent/10 text-accent">
                  {promptPreview.documentCount} docs
                </Badge>
                <Badge variant="secondary" className="font-mono text-[10px] bg-accent/10 text-accent">
                  {promptPreview.characterCount} refs
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[10px]"
                  onClick={() => setPromptPreview(null)}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                  System Prompt ({(promptPreview.systemChars / 1000).toFixed(1)}K chars)
                </p>
                <ScrollArea className="h-[150px]">
                  <pre className="whitespace-pre-wrap rounded border border-border bg-muted/30 p-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
                    {promptPreview.system}
                  </pre>
                </ScrollArea>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">
                  User Prompt ({(promptPreview.userChars / 1000).toFixed(1)}K chars)
                </p>
                <ScrollArea className="h-[200px]">
                  <pre className="whitespace-pre-wrap rounded border border-border bg-muted/30 p-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
                    {promptPreview.user}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-border/60" />

        {/* Batch results or single generation output */}
        {state.batchResults.length > 0 ? (
          <BatchGenerationView
            results={state.batchResults}
            onSelect={actions.handleSelectBatchResult}
          />
        ) : (
          <GenerationOutput
            generatedMarkdown={state.generatedMarkdown}
            isWorking={state.isWorking}
            brief={state.brief}
            notes={state.notes}
            selectedDocuments={state.selectedDocuments}
            provider={state.provider}
            setGeneratedMarkdown={actions.setGeneratedMarkdown}
            onSave={actions.handleSaveCharacter}
          />
        )}
      </CardContent>
    </Card>
  );
}

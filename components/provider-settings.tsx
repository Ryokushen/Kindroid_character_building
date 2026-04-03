"use client";

import type { Dispatch, SetStateAction } from "react";
import type { ProviderSettings as ProviderSettingsType, ProviderType } from "@/lib/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ModelOption = {
  id: string;
  label: string;
  description: string;
};

const PROVIDER_PRESETS: Array<{
  type: ProviderType;
  label: string;
  baseUrl: string;
  defaultModel: string;
  color: string;
  models: ModelOption[];
}> = [
  {
    type: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4.1-mini",
    color: "bg-green-500/15 text-green-400 border-green-500/30",
    models: [
      { id: "gpt-5.4", label: "GPT-5.4", description: "Flagship — complex reasoning & coding" },
      { id: "gpt-5.4-mini", label: "GPT-5.4 Mini", description: "Fast — GPT-5.4-class at lower cost" },
      { id: "gpt-5.4-nano", label: "GPT-5.4 Nano", description: "Fastest — simple high-volume tasks" },
      { id: "gpt-5", label: "GPT-5", description: "Previous flagship — strong all-rounder" },
      { id: "gpt-4.1", label: "GPT-4.1", description: "Efficient — great for fine-tuning" },
      { id: "gpt-4.1-mini", label: "GPT-4.1 Mini", description: "Budget — fast and cheap" },
      { id: "gpt-4.1-nano", label: "GPT-4.1 Nano", description: "Lightest — lowest cost" },
    ],
  },
  {
    type: "anthropic",
    label: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-sonnet-4-6",
    color: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    models: [
      { id: "claude-opus-4-6", label: "Opus 4.6", description: "Most intelligent — agents & coding (1M ctx)" },
      { id: "claude-sonnet-4-6", label: "Sonnet 4.6", description: "Best speed/intelligence balance (1M ctx)" },
      { id: "claude-haiku-4-5", label: "Haiku 4.5", description: "Fastest — lightweight tasks (200K ctx)" },
      { id: "claude-sonnet-4-5", label: "Sonnet 4.5", description: "Previous gen — still strong (200K ctx)" },
      { id: "claude-opus-4-5", label: "Opus 4.5", description: "Previous gen — deep reasoning (200K ctx)" },
      { id: "claude-sonnet-4-0", label: "Sonnet 4", description: "Balanced performance (200K ctx)" },
    ],
  },
  {
    type: "xai",
    label: "xAI (Grok)",
    baseUrl: "https://api.x.ai/v1",
    defaultModel: "grok-4.20-0309-non-reasoning",
    color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    models: [
      { id: "grok-4.20-0309-reasoning", label: "Grok 4.2 Reasoning", description: "Latest flagship — lowest hallucination (2M ctx)" },
      { id: "grok-4.20-0309-non-reasoning", label: "Grok 4.2 Non-Reasoning", description: "Latest flagship — fast, no thinking tokens (2M ctx)" },
      { id: "grok-4-1-fast-reasoning", label: "Grok 4.1 Fast Reasoning", description: "#1 LMArena — fast with reasoning (2M ctx)" },
      { id: "grok-4-1-fast-non-reasoning", label: "Grok 4.1 Fast", description: "#2 LMArena — fast, no thinking tokens (2M ctx)" },
      { id: "grok-4", label: "Grok 4", description: "Stable alias — deep reasoning (2M ctx)" },
      { id: "grok-3", label: "Grok 3", description: "Previous gen — solid all-rounder" },
      { id: "grok-3-mini", label: "Grok 3 Mini", description: "Budget — efficient reasoning" },
    ],
  },
];

export function ProviderSettings({
  provider,
  setProvider,
}: {
  provider: ProviderSettingsType;
  setProvider: Dispatch<SetStateAction<ProviderSettingsType>>;
}) {
  const [open, setOpen] = useState(false);

  function update(field: keyof ProviderSettingsType, value: string | number) {
    setProvider((c) => ({ ...c, [field]: value }));
  }

  function selectPreset(preset: (typeof PROVIDER_PRESETS)[number]) {
    setProvider((c) => ({
      ...c,
      providerType: preset.type,
      providerLabel: preset.label,
      baseUrl: preset.baseUrl,
      model: preset.defaultModel,
    }));
  }

  function selectModel(modelId: string) {
    setProvider((c) => ({ ...c, model: modelId }));
  }

  const activePreset = PROVIDER_PRESETS.find((p) => p.type === provider.providerType);
  const activeModel = activePreset?.models.find((m) => m.id === provider.model);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>{provider.providerLabel}</span>
          {activePreset && (
            <Badge variant="secondary" className={cn("h-5 px-1.5 text-[10px] border", activePreset.color)}>
              {provider.model}
            </Badge>
          )}
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3 space-y-3">
        {/* Provider preset buttons */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Provider</Label>
          <div className="flex gap-2">
            {PROVIDER_PRESETS.map((preset) => (
              <button
                key={preset.type}
                type="button"
                onClick={() => selectPreset(preset)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                  provider.providerType === preset.type
                    ? cn("shadow-sm", preset.color)
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model selector dropdown */}
        {activePreset && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Model</Label>
            <div className="space-y-1">
              {activePreset.models.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => selectModel(model.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-all",
                    provider.model === model.id
                      ? cn("shadow-sm", activePreset.color)
                      : "border-border bg-muted/10 text-muted-foreground hover:bg-muted/30",
                  )}
                >
                  <div>
                    <span className="font-medium">{model.label}</span>
                    <span className="ml-2 text-[10px] text-muted-foreground">{model.description}</span>
                  </div>
                  {provider.model === model.id && (
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {/* Custom model input */}
            <div className="flex items-center gap-2 pt-1">
              <Input
                value={activePreset.models.some((m) => m.id === provider.model) ? "" : provider.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="Or type a custom model ID..."
                className="bg-muted/50 text-xs h-8"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            {provider.providerType === "anthropic" ? "Anthropic API base URL" : "API base URL"}
          </Label>
          <Input
            value={provider.baseUrl}
            onChange={(e) => update("baseUrl", e.target.value)}
            placeholder={activePreset?.baseUrl ?? "https://api.openai.com/v1"}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">API key</Label>
          <Input
            type="password"
            value={provider.apiKey}
            onChange={(e) => update("apiKey", e.target.value)}
            placeholder="Stored only in this browser"
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Temperature</Label>
          <Input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={provider.temperature}
            onChange={(e) => update("temperature", Number(e.target.value) || 0)}
            className="w-24 bg-muted/50"
          />
        </div>

        {provider.providerType === "anthropic" && (
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Anthropic uses a different API format (x-api-key header, system as top-level field).
            This is handled automatically.
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

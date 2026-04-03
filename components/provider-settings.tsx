"use client";

import type { Dispatch, SetStateAction } from "react";
import type { ProviderSettings as ProviderSettingsType, ProviderType } from "@/lib/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PROVIDER_PRESETS: Array<{
  type: ProviderType;
  label: string;
  baseUrl: string;
  defaultModel: string;
  color: string;
}> = [
  {
    type: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4.1-mini",
    color: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  {
    type: "anthropic",
    label: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-sonnet-4-20250514",
    color: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  },
  {
    type: "xai",
    label: "xAI (Grok)",
    baseUrl: "https://api.x.ai/v1",
    defaultModel: "grok-3-mini",
    color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
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

  const activePreset = PROVIDER_PRESETS.find((p) => p.type === provider.providerType);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Provider: {provider.providerLabel}</span>
          {activePreset && (
            <Badge variant="secondary" className={cn("h-5 px-1.5 text-[10px] border", activePreset.color)}>
              {activePreset.type.toUpperCase()}
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
          <Label className="text-xs text-muted-foreground">Quick select</Label>
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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Provider label</Label>
            <Input
              value={provider.providerLabel}
              onChange={(e) => update("providerLabel", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Model</Label>
            <Input
              value={provider.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder={activePreset?.defaultModel ?? "model name"}
              className="bg-muted/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            {provider.providerType === "anthropic" ? "Anthropic API base URL" : "OpenAI-compatible base URL"}
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

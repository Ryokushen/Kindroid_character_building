"use client";

import type { Dispatch, SetStateAction } from "react";
import type { ProviderSettings as ProviderSettingsType } from "@/lib/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <span>Provider: {provider.providerLabel}</span>
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
              placeholder="gpt-4.1-mini"
              className="bg-muted/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">OpenAI-compatible base URL</Label>
          <Input
            value={provider.baseUrl}
            onChange={(e) => update("baseUrl", e.target.value)}
            placeholder="https://api.openai.com/v1"
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
      </CollapsibleContent>
    </Collapsible>
  );
}

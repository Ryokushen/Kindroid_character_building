"use client";

import { useCallback, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CharacterSection, ProviderSettings } from "@/lib/types";
import { parseCharacterSections, reassembleMarkdown } from "@/lib/section-parser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CharacterSectionCard } from "./character-section-card";

export function GenerationOutput({
  generatedMarkdown,
  isWorking,
  brief,
  notes,
  selectedDocuments,
  provider,
  setGeneratedMarkdown,
  onSave,
}: {
  generatedMarkdown: string;
  isWorking: boolean;
  brief: string;
  notes: string;
  selectedDocuments: string[];
  provider: ProviderSettings;
  setGeneratedMarkdown: Dispatch<SetStateAction<string>>;
  onSave: () => void;
}) {
  const [regeneratingKey, setRegeneratingKey] = useState<string | null>(null);

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">Generated output</h3>
        <Button
          size="sm"
          onClick={onSave}
          disabled={isWorking || !generatedMarkdown.trim()}
          className="h-8"
        >
          Save to characters
        </Button>
      </div>

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

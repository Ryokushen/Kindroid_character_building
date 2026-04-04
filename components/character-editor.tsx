"use client";

import { useCallback, useMemo, useState } from "react";
import type { CharacterSummary, ProviderSettings } from "@/lib/types";
import { parseCharacterSections, reassembleMarkdown } from "@/lib/section-parser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CharacterSectionCard } from "./character-section-card";

export function CharacterEditor({
  character,
  provider,
  onSave,
}: {
  character: CharacterSummary;
  provider: ProviderSettings;
  onSave: (markdown: string) => void;
}) {
  const [markdown, setMarkdown] = useState(character.content);
  const [regeneratingKey, setRegeneratingKey] = useState<string | null>(null);
  const [addingJournal, setAddingJournal] = useState(false);
  const [newJournalTopic, setNewJournalTopic] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Re-sync when a different character is selected
  const [trackedFile, setTrackedFile] = useState(character.fileName);
  if (character.fileName !== trackedFile) {
    setTrackedFile(character.fileName);
    setMarkdown(character.content);
  }

  const sections = useMemo(
    () => parseCharacterSections(markdown),
    [markdown],
  );

  const hasChanges = markdown !== character.content;

  const handleSectionContentChange = useCallback(
    (key: string, newContent: string) => {
      const updated = sections.map((s) =>
        s.key === key ? { ...s, content: newContent } : s,
      );
      setMarkdown(reassembleMarkdown(updated));
    },
    [sections],
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
              brief: "",
              notes: "",
              fullCharacterContext: fullContext,
              selectedDocuments: [],
              provider,
            }),
          });

          const payload = (await response.json()) as { content?: string; error?: string };
          if (!response.ok) throw new Error(payload.error || "Failed to regenerate section.");

          if (payload.content) {
            const updated = sections.map((s) =>
              s.key === key ? { ...s, content: payload.content! } : s,
            );
            setMarkdown(reassembleMarkdown(updated));
          }
        } catch (error) {
          console.error("Section regeneration failed:", error);
        } finally {
          setRegeneratingKey(null);
        }
      })();
    },
    [sections, provider],
  );

  function handleAddJournal() {
    if (!newJournalTopic.trim()) return;

    setAddingJournal(true);

    void (async () => {
      try {
        const fullContext = reassembleMarkdown(sections);
        const response = await fetch("/api/generate/section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionKey: "journal_entries",
            sectionLabel: `New Journal — ${newJournalTopic}`,
            currentContent: "",
            brief: "",
            notes: `Generate a NEW journal entry about: ${newJournalTopic}. Include a KEYWORDS line and an Entry paragraph. This should add new information not already covered by existing journals.`,
            fullCharacterContext: fullContext,
            selectedDocuments: [],
            provider,
          }),
        });

        const payload = (await response.json()) as { content?: string; error?: string };
        if (!response.ok) throw new Error(payload.error || "Failed to generate journal.");

        if (payload.content) {
          // Append the new journal to the existing journal_entries section
          const journalSection = sections.find((s) => s.key === "journal_entries");
          if (journalSection) {
            const newContent = journalSection.content + "\n\n### " + `Journal — ${newJournalTopic}\n\`\`\`\n${payload.content}\n\`\`\``;
            const updated = sections.map((s) =>
              s.key === "journal_entries" ? { ...s, content: newContent } : s,
            );
            setMarkdown(reassembleMarkdown(updated));
          }
          setNewJournalTopic("");
        }
      } catch (error) {
        console.error("Journal generation failed:", error);
      } finally {
        setAddingJournal(false);
      }
    })();
  }

  function handleSave() {
    setIsSaving(true);
    onSave(markdown);
    setTimeout(() => setIsSaving(false), 1000);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Edit sections, regenerate, or add journals. Save when done.
        </p>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="h-7"
        >
          {isSaving ? "Saved!" : hasChanges ? "Save changes" : "No changes"}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-340px)] min-h-[400px]">
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

          {/* Add Journal Entry */}
          <div className="rounded-lg border border-dashed border-border bg-muted/10 p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">Add Journal Entry</p>
            <div className="flex gap-2">
              <Textarea
                value={newJournalTopic}
                onChange={(e) => setNewJournalTopic(e.target.value)}
                placeholder="Topic for new journal entry (e.g., 'Her sexual preferences and kinks', 'How she handles jealousy', 'Her favorite foods')..."
                className="bg-muted/30 text-xs resize-none flex-1"
                rows={2}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddJournal}
                disabled={addingJournal || !newJournalTopic.trim()}
                className="h-auto self-end"
              >
                {addingJournal ? "Generating..." : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

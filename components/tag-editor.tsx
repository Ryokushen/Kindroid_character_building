"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SUGGESTED_TAGS = [
  "backstory",
  "personality",
  "dialogue",
  "worldbuilding",
  "mechanics",
  "voice",
  "memories",
  "journals",
];

export function TagEditor({
  tags,
  onSave,
  onClose,
}: {
  tags: string[];
  onSave: (tags: string[]) => void;
  onClose: () => void;
}) {
  const [currentTags, setCurrentTags] = useState<string[]>(tags);
  const [input, setInput] = useState("");

  function addTag(tag: string) {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !currentTags.includes(normalized)) {
      setCurrentTags([...currentTags, normalized]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    setCurrentTags(currentTags.filter((t) => t !== tag));
  }

  const unusedSuggestions = SUGGESTED_TAGS.filter((t) => !currentTags.includes(t));

  return (
    <div className="space-y-2 rounded-lg border border-border bg-card p-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap gap-1.5">
        {currentTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer bg-accent/15 text-accent hover:bg-destructive/15 hover:text-destructive"
            onClick={() => removeTag(tag)}
          >
            {tag} x
          </Badge>
        ))}
        {currentTags.length === 0 && (
          <span className="text-xs text-muted-foreground">No tags</span>
        )}
      </div>

      <div className="flex gap-1.5">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder="Add tag..."
          className="h-7 bg-muted/50 text-xs"
        />
      </div>

      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {unusedSuggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="rounded border border-border bg-muted/20 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted/40 transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            onSave(currentTags);
            onClose();
          }}
        >
          Save
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

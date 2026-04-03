"use client";

import { useState } from "react";
import type { LibraryDocument } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TagEditor } from "./tag-editor";

export function DocumentList({
  documents,
  selectedDocuments,
  activeDocument,
  isWorking,
  onToggleSelect,
  onSetActive,
  onArchive,
  onUpdateMetadata,
}: {
  documents: LibraryDocument[];
  selectedDocuments: string[];
  activeDocument: string;
  isWorking: boolean;
  onToggleSelect: (fileName: string) => void;
  onSetActive: (fileName: string) => void;
  onArchive: (fileName: string) => void;
  onUpdateMetadata: (fileName: string, update: { tags?: string[]; favorite?: "toggle" }) => void;
}) {
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [editingTags, setEditingTags] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = Array.from(new Set(documents.flatMap((d) => d.tags))).sort();

  // Filter documents
  const filtered = tagFilter
    ? documents.filter((d) => d.tags.includes(tagFilter))
    : documents;

  return (
    <div className="space-y-2">
      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setTagFilter(null)}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all",
              tagFilter === null
                ? "border-accent/50 bg-accent/15 text-accent"
                : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all",
                tagFilter === tag
                  ? "border-accent/50 bg-accent/15 text-accent"
                  : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <ScrollArea className="h-[380px] pr-2">
        <div className="space-y-2">
          {filtered.map((doc) => {
            const isSelected = selectedDocuments.includes(doc.fileName);
            const isActive = activeDocument === doc.fileName;

            return (
              <div
                key={doc.fileName}
                className={cn(
                  "cursor-pointer rounded-lg border border-border bg-muted/30 p-3 transition-all hover:border-primary/30 hover:bg-muted/50",
                  isActive && "border-primary/40 bg-primary/5 shadow-[0_0_12px_oklch(0.72_0.15_65_/_0.08)]",
                )}
                onClick={() => onSetActive(doc.fileName)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSetActive(doc.fileName);
                  }
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect(doc.fileName)}
                      className="border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    <span className="text-foreground">{doc.displayName}</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {/* Favorite star */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateMetadata(doc.fileName, { favorite: "toggle" });
                      }}
                      className={cn(
                        "h-7 w-7 flex items-center justify-center rounded text-sm transition-colors",
                        doc.favorite
                          ? "text-primary"
                          : "text-muted-foreground/40 hover:text-primary/60",
                      )}
                      title={doc.favorite ? "Unpin" : "Pin to top"}
                    >
                      {doc.favorite ? "\u2605" : "\u2606"}
                    </button>
                    {/* Tag button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTags(editingTags === doc.fileName ? null : doc.fileName);
                      }}
                      className="h-7 px-1.5 text-[10px] text-muted-foreground hover:text-accent"
                    >
                      Tags
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive(doc.fileName);
                      }}
                      disabled={isWorking}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    >
                      Archive
                    </Button>
                  </div>
                </div>

                {/* Tags display */}
                {doc.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {doc.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="h-4 px-1.5 text-[9px] bg-accent/10 text-accent"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Inline tag editor */}
                {editingTags === doc.fileName && (
                  <div className="mt-2">
                    <TagEditor
                      tags={doc.tags}
                      onSave={(tags) => onUpdateMetadata(doc.fileName, { tags })}
                      onClose={() => setEditingTags(null)}
                    />
                  </div>
                )}

                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {doc.preview}
                </p>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { CharacterSummary } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function CharacterList({
  characters,
  activeCharacter,
  onSetActive,
  onDelete,
}: {
  characters: CharacterSummary[];
  activeCharacter: string;
  onSetActive: (fileName: string) => void;
  onDelete?: (fileName: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <ScrollArea className="h-[380px] pr-2">
      <div className="space-y-2">
        {characters.map((char) => {
          const isActive = activeCharacter === char.fileName;
          const isConfirming = confirmDelete === char.fileName;

          return (
            <div
              key={char.fileName}
              className={cn(
                "cursor-pointer rounded-lg border border-border bg-muted/30 p-3 transition-all hover:border-accent/30 hover:bg-muted/50",
                isActive && "border-accent/40 bg-accent/5 shadow-[0_0_12px_oklch(0.55_0.2_295_/_0.1)]",
              )}
              onClick={() => onSetActive(char.fileName)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSetActive(char.fileName);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <strong className="text-sm text-foreground">{char.title}</strong>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(char.updatedAt).toLocaleDateString()}
                  </span>
                  {onDelete && (
                    isConfirming ? (
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(char.fileName);
                            setConfirmDelete(null);
                          }}
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(null)}
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted/50 text-muted-foreground hover:bg-muted/70 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(char.fileName);
                        }}
                        className="rounded p-0.5 text-muted-foreground/40 hover:text-red-400 transition-colors"
                        title="Delete character"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )
                  )}
                </div>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {char.preview}
              </p>
            </div>
          );
        })}
        {characters.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No characters saved yet.
          </p>
        )}
      </div>
    </ScrollArea>
  );
}

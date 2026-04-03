"use client";

import type { CharacterSummary } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function CharacterList({
  characters,
  activeCharacter,
  onSetActive,
}: {
  characters: CharacterSummary[];
  activeCharacter: string;
  onSetActive: (fileName: string) => void;
}) {
  return (
    <ScrollArea className="h-[380px] pr-2">
      <div className="space-y-2">
        {characters.map((char) => {
          const isActive = activeCharacter === char.fileName;

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
                <span className="text-[10px] text-muted-foreground">
                  {new Date(char.updatedAt).toLocaleDateString()}
                </span>
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

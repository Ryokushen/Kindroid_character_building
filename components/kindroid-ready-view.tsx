"use client";

import { useMemo, useState } from "react";
import type { CharacterSummary, JournalEntry } from "@/lib/types";
import { KINDROID_LIMITS, getKindroidLimit } from "@/lib/types";
import type { BackstoryTier } from "@/lib/types";
import { parseCharacterSections, parseJournalEntries, parseGreetingEntries } from "@/lib/section-parser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function CopyField({
  label,
  kindroidLabel,
  content,
  charLimit,
}: {
  label: string;
  kindroidLabel?: string;
  content: string;
  charLimit?: number;
}) {
  const [copied, setCopied] = useState(false);
  const charCount = content.length;
  const isOverLimit = charLimit ? charCount > charLimit : false;
  const isNearLimit = charLimit ? charCount > charLimit * 0.9 : false;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!content.trim()) return null;

  return (
    <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          {kindroidLabel && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-accent/10 text-accent">
              {kindroidLabel}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {charLimit && (
            <span
              className={cn(
                "font-mono text-xs",
                isOverLimit
                  ? "text-red-400 font-bold"
                  : isNearLimit
                    ? "text-yellow-400"
                    : "text-muted-foreground",
              )}
            >
              {charCount} / {charLimit}
            </span>
          )}
          <Button
            size="sm"
            variant={copied ? "default" : "ghost"}
            className={cn(
              "h-7 px-2.5 text-xs",
              copied
                ? "bg-green-600/20 text-green-400 hover:bg-green-600/20"
                : "text-primary hover:bg-primary/10",
            )}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground select-all">
          {content}
        </pre>
      </div>
    </div>
  );
}

function JournalCopyField({
  journal,
}: {
  journal: JournalEntry;
}) {
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedEntry, setCopiedEntry] = useState(false);

  const entryCharCount = journal.entryText.length;
  const charLimit = KINDROID_LIMITS.journal_entry ?? 500;
  const isOverLimit = entryCharCount > charLimit;
  const isNearLimit = entryCharCount > charLimit * 0.9;

  async function copyText(text: string, setter: (v: boolean) => void) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  return (
    <div className={cn(
      "rounded-lg border bg-muted/20 overflow-hidden",
      isOverLimit ? "border-red-500/40" : "border-border",
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{journal.title}</span>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-accent/10 text-accent">
            Journal
          </Badge>
        </div>
        <span
          className={cn(
            "font-mono text-xs",
            isOverLimit
              ? "text-red-400 font-bold"
              : isNearLimit
                ? "text-yellow-400"
                : "text-muted-foreground",
          )}
        >
          {entryCharCount} / {charLimit}
        </span>
      </div>

      {/* Keywords section */}
      {journal.keywords && (
        <div className="px-4 py-2 border-b border-border/50 bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Keywords</span>
              <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-muted/50 text-muted-foreground">
                not counted
              </Badge>
            </div>
            <Button
              size="sm"
              variant={copiedKeywords ? "default" : "ghost"}
              className={cn(
                "h-6 px-2 text-[10px]",
                copiedKeywords
                  ? "bg-green-600/20 text-green-400 hover:bg-green-600/20"
                  : "text-muted-foreground hover:text-primary",
              )}
              onClick={() => copyText(journal.keywords, setCopiedKeywords)}
            >
              {copiedKeywords ? "Copied!" : "Copy keywords"}
            </Button>
          </div>
          <p className="mt-1 font-mono text-xs text-accent/80 select-all">{journal.keywords}</p>
        </div>
      )}

      {/* Entry text section */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Entry text</span>
          <Button
            size="sm"
            variant={copiedEntry ? "default" : "ghost"}
            className={cn(
              "h-6 px-2 text-[10px]",
              copiedEntry
                ? "bg-green-600/20 text-green-400 hover:bg-green-600/20"
                : "text-primary hover:bg-primary/10",
            )}
            onClick={() => copyText(journal.entryText, setCopiedEntry)}
          >
            {copiedEntry ? "Copied!" : "Copy entry"}
          </Button>
        </div>
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground select-all">
          {journal.entryText}
        </pre>
      </div>
    </div>
  );
}

export function KindroidReadyView({
  character,
  backstoryTier,
}: {
  character: CharacterSummary;
  backstoryTier?: BackstoryTier;
}) {
  const sections = useMemo(
    () => parseCharacterSections(character.content),
    [character.content],
  );

  const sectionMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of sections) {
      map.set(s.key, s.content);
    }
    return map;
  }, [sections]);

  const journals = useMemo(() => {
    const raw = sectionMap.get("journal_entries") ?? "";
    // The raw content may have ### headings embedded from the merge
    return parseJournalEntries(raw);
  }, [sectionMap]);

  const greetings = useMemo(() => {
    const raw = sectionMap.get("greeting_options") ?? "";
    return parseGreetingEntries(raw);
  }, [sectionMap]);

  const name = sectionMap.get("name") ?? character.title;

  return (
    <ScrollArea className="h-[calc(100vh-220px)] min-h-[500px]">
      <div className="space-y-3 pr-2 pb-4">
        {/* Character name header */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <h2 className="font-heading text-xl font-bold text-foreground">{name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Copy each field below and paste into the matching Kindroid section.
          </p>
        </div>

        {/* Overview - reference info, not a Kindroid field */}
        {sectionMap.get("overview") && (
          <CopyField
            label="Overview"
            kindroidLabel="Reference"
            content={sectionMap.get("overview")!}
          />
        )}

        <Separator className="bg-border/40" />

        {/* === Primary Kindroid Fields === */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary px-1">
          Kindroid Fields
        </p>

        <CopyField
          label="Backstory"
          kindroidLabel="Backstory field"
          content={sectionMap.get("backstory") ?? ""}
          charLimit={getKindroidLimit("backstory", backstoryTier)}
        />

        <CopyField
          label="Response Directive"
          kindroidLabel="RD field"
          content={sectionMap.get("response_directive") ?? ""}
          charLimit={KINDROID_LIMITS.response_directive}
        />

        <CopyField
          label="Key Memories"
          kindroidLabel="Key Memories field"
          content={sectionMap.get("key_memories") ?? ""}
          charLimit={KINDROID_LIMITS.key_memories}
        />

        <CopyField
          label="Example Message"
          kindroidLabel="EM field"
          content={sectionMap.get("example_message") ?? ""}
          charLimit={KINDROID_LIMITS.example_message}
        />

        {/* === Visual Descriptor Fields === */}
        {(sectionMap.get("avatar_prompt") || sectionMap.get("selfie_description")) && (
          <>
            <Separator className="bg-border/40" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent px-1">
              Visual Descriptors
            </p>

            <CopyField
              label="Avatar Prompt"
              kindroidLabel="Face only"
              content={sectionMap.get("avatar_prompt") ?? ""}
              charLimit={KINDROID_LIMITS.avatar_prompt}
            />

            <CopyField
              label="Selfie Description"
              kindroidLabel="Selfie engine baseline"
              content={sectionMap.get("selfie_description") ?? ""}
              charLimit={KINDROID_LIMITS.selfie_description}
            />
          </>
        )}

        {/* === Journal Entries - split by Global vs Individual === */}
        {journals.length > 0 && (() => {
          const globalJournals = journals.filter((j) => j.isGlobal);
          const individualJournals = journals.filter((j) => !j.isGlobal);

          return (
            <>
              {globalJournals.length > 0 && (
                <>
                  <Separator className="bg-border/40" />
                  <div className="px-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
                      Global Journal Entries ({globalJournals.length})
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Paste into Kindroid&apos;s Global Journal section — shared across all characters in this world
                    </p>
                  </div>
                  {globalJournals.map((journal, i) => (
                    <JournalCopyField key={`global-${i}`} journal={journal} />
                  ))}
                </>
              )}

              {individualJournals.length > 0 && (
                <>
                  <Separator className="bg-border/40" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary px-1">
                    {globalJournals.length > 0 ? "Individual " : ""}Journal Entries ({individualJournals.length})
                  </p>
                  {individualJournals.map((journal, i) => (
                    <JournalCopyField key={`individual-${i}`} journal={journal} />
                  ))}
                </>
              )}
            </>
          );
        })()}

        {/* === Greeting Options - each one separate === */}
        {greetings.length > 0 && (
          <>
            <Separator className="bg-border/40" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent px-1">
              Greeting Options ({greetings.length})
            </p>

            {greetings.map((greeting, i) => (
              <CopyField
                key={i}
                label={greeting.title}
                kindroidLabel="Greeting"
                content={greeting.content}
                charLimit={KINDROID_LIMITS.greeting}
              />
            ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
}

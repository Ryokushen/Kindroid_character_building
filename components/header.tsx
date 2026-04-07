"use client";

import { cn } from "@/lib/utils";

export function Header({
  message,
  error,
  isWorking,
  onClearError,
}: {
  message: string;
  error: string | null;
  isWorking: boolean;
  onClearError: () => void;
}) {
  return (
    <header className="mb-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Local-first character tooling
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Kindroid Character
            <br />
            Workbench
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Manage your best-practice repository, inspect existing characters, and generate
            structured character drafts against the source material.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/characters"
            className="rounded-lg border border-border bg-card/60 px-4 py-3 text-sm font-medium text-muted-foreground backdrop-blur-md transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Character Library
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 backdrop-blur-md">
          <span
            className={cn(
              "h-2.5 w-2.5 shrink-0 rounded-full",
              isWorking
                ? "animate-pulse bg-primary shadow-[0_0_8px_oklch(0.72_0.15_65_/_0.5)]"
                : "bg-accent",
            )}
          />
          <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5">
          <p className="text-xs text-red-400">{error}</p>
          <button
            type="button"
            onClick={onClearError}
            className="shrink-0 text-red-400/60 transition-colors hover:text-red-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}

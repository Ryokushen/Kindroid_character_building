"use client";

import type { Dispatch, SetStateAction } from "react";
import type { JournalCategories as JournalCategoriesType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const CATEGORIES: Array<{
  key: keyof JournalCategoriesType;
  label: string;
  description: string;
}> = [
  { key: "dailyLife", label: "Daily life", description: "Apartment, routines, food, hobbies, transportation" },
  { key: "familyBackground", label: "Family & background", description: "Parents, siblings, cultural background, where they grew up" },
  { key: "emotionalTriggers", label: "Emotional triggers", description: "What sets them off, what calms them, stress responses" },
  { key: "relationshipMilestones", label: "Relationship milestones", description: "First kiss, first fight, inside jokes, turning points" },
  { key: "seasonalSituational", label: "Seasonal & situational", description: "Holidays, birthdays, weather reactions, seasonal moods" },
  { key: "workCareer", label: "Work & career", description: "Job details, coworkers, ambitions, work stress, daily commute" },
  { key: "hobbiesPassions", label: "Hobbies & passions", description: "What she does for fun, creative outlets, obsessions, guilty pleasures" },
  { key: "insecuritiesFears", label: "Insecurities & fears", description: "Body image, social anxiety, what keeps her up at night, deepest fears" },
  { key: "conflictStyle", label: "Conflict style", description: "How she fights, what she does after arguments, silent treatment vs. explosive" },
  { key: "friendsSocialLife", label: "Friends & social life", description: "Best friend dynamics, social habits, party behavior, who she calls when upset" },
  { key: "sexualHistory", label: "Sexual history & kinks", description: "Past experiences, what shaped her preferences, sexual confidence level, discovery moments" },
];

export function JournalCategoriesSelector({
  journalCategories,
  setJournalCategories,
}: {
  journalCategories: JournalCategoriesType;
  setJournalCategories: Dispatch<SetStateAction<JournalCategoriesType>>;
}) {
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(journalCategories).filter(Boolean).length;

  function toggle(key: keyof JournalCategoriesType) {
    setJournalCategories((c) => ({ ...c, [key]: !c[key] }));
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <div className="flex items-center gap-2">
          <span>Journal Categories</span>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary">
            {activeCount} active
          </Badge>
        </div>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Which journal types should the AI generate? Each checked category gets at least one journal entry with keyword triggers.
        </p>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.key}
              className="flex items-start gap-2.5 cursor-pointer rounded-md px-2 py-1.5 hover:bg-muted/30 transition-colors"
            >
              <Checkbox
                checked={journalCategories[cat.key]}
                onCheckedChange={() => toggle(cat.key)}
                className="mt-0.5 border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <div>
                <span className="text-xs font-medium text-foreground">{cat.label}</span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{cat.description}</p>
              </div>
            </label>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          Sexual behavior journals are controlled via the Sexual Profile section above.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}

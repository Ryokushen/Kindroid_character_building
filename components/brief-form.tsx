"use client";

import { useState } from "react";
import type { WorkbenchActions, WorkbenchState } from "@/hooks/use-workbench";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { TemplateSelector } from "./template-selector";
import { BackstorySelector } from "./backstory-selector";
import { EmotionalLogicForm } from "./emotional-logic-form";
import { RelationshipDynamicForm } from "./relationship-dynamic-form";
import { ScenarioSelector } from "./scenario-selector";
import { VoiceBuilderForm } from "./voice-builder-form";
import { ChemistryTool } from "./chemistry-tool";
import { JournalCategoriesSelector } from "./journal-categories";
import { MCProfileForm } from "./mc-profile-form";

export function BriefForm({
  state,
  actions,
}: {
  state: WorkbenchState;
  actions: WorkbenchActions;
}) {
  const [sexOpen, setSexOpen] = useState(false);

  // Resolve selected character records for the chemistry tool
  const selectedCharacterRecords = state.characters.filter((c) =>
    state.selectedCharacters.includes(c.fileName),
  );

  return (
    <div className="space-y-3">
      {/* 0. Male MC Profile */}
      <MCProfileForm
        mcProfile={state.mcProfile}
        setMCProfile={actions.setMCProfile}
      />

      {/* 1. Brief textarea */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Character brief</Label>
        <Textarea
          rows={6}
          value={state.brief}
          onChange={(e) => actions.setBrief(e.target.value)}
          placeholder="Describe the character concept, role, tone, relationship dynamic, setting, and any required sections."
          className="bg-muted/50 resize-y"
        />
      </div>

      {/* 2. Backstory Architecture */}
      <BackstorySelector
        selected={state.selectedBackstories}
        setSelected={actions.setSelectedBackstories}
      />

      {/* 3. Emotional Logic */}
      <EmotionalLogicForm
        emotionalLogic={state.emotionalLogic}
        setEmotionalLogic={actions.setEmotionalLogic}
      />

      {/* 4. Relationship Dynamic */}
      <RelationshipDynamicForm
        relationshipDynamic={state.relationshipDynamic}
        setRelationshipDynamic={actions.setRelationshipDynamic}
      />

      {/* 5. Notes textarea */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Additional notes</Label>
        <Textarea
          rows={3}
          value={state.notes}
          onChange={(e) => actions.setNotes(e.target.value)}
          placeholder="Optional guardrails, formatting requests, or constraints."
          className="bg-muted/50 resize-y"
        />
      </div>

      {/* 6. Voice & Speech Patterns */}
      <VoiceBuilderForm
        voiceProfile={state.voiceProfile}
        setVoiceProfile={actions.setVoiceProfile}
      />

      {/* 7. Sexual Profile */}
      <Collapsible open={sexOpen} onOpenChange={setSexOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <div className="flex items-center gap-2">
            <span>Sexual Profile</span>
            {state.sexualProfile.trim() && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-pink-500/10 text-pink-400">
                Active
              </Badge>
            )}
          </div>
          <svg
            className={`h-4 w-4 transition-transform ${sexOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Describe sexual traits, dynamics, and preferences. This generates dedicated journal entries
            with keyword triggers.
          </p>
          <Textarea
            rows={6}
            value={state.sexualProfile}
            onChange={(e) => actions.setSexualProfile(e.target.value)}
            placeholder={`Examples:\n\n• Sex drive level (high, moderate, situational)\n• Dominant/submissive dynamics\n• Specific kinks or fantasies\n• How they initiate intimacy\n• Dirty talk style\n• What makes them feel desired`}
            className="bg-muted/50 resize-y"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* 8. Journal Categories */}
      <JournalCategoriesSelector
        journalCategories={state.journalCategories}
        setJournalCategories={actions.setJournalCategories}
      />

      {/* 9. Style Modifiers (personality templates) */}
      <TemplateSelector
        selectedTemplates={state.selectedTemplates}
        setSelectedTemplates={actions.setSelectedTemplates}
      />

      {/* 10. Scenario Modifiers */}
      <ScenarioSelector
        selected={state.selectedScenarios}
        setSelected={actions.setSelectedScenarios}
      />

      {/* 11. Reference Characters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-foreground">Reference characters</h3>
          <span className="text-xs text-muted-foreground">{state.selectedCharacters.length} selected</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {state.characters.map((char) => {
            const checked = state.selectedCharacters.includes(char.fileName);
            return (
              <label
                key={char.fileName}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs transition-all hover:bg-muted/60",
                  checked && "border-primary/40 bg-primary/10 text-primary",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => actions.toggleCharacterSelection(char.fileName)}
                  className="h-3.5 w-3.5 border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <span>{char.title}</span>
              </label>
            );
          })}
          {state.characters.length === 0 && (
            <Badge variant="secondary" className="text-muted-foreground">
              No characters yet
            </Badge>
          )}
        </div>
      </div>

      {/* 12. Character Chemistry (conditional) */}
      <ChemistryTool
        contrastNotes={state.contrastNotes}
        setContrastNotes={actions.setContrastNotes}
        selectedCharacters={selectedCharacterRecords}
      />
    </div>
  );
}

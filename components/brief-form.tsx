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
import { PhysicalAppearanceForm, FlirtationStylePills, AvailabilityStatusPills } from "./physical-profile-form";
import { HowTheyMetSelector } from "./how-they-met-selector";

const TABS = [
  { id: "concept", label: "Concept" },
  { id: "personality", label: "Personality" },
  { id: "scenario", label: "Scenario" },
  { id: "output", label: "Output" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function countConceptActive(state: WorkbenchState): number {
  let n = 0;
  if (state.brief.trim()) n++;
  const pp = state.physicalProfile;
  if (pp.bodyType || pp.height || pp.ageRange || pp.ethnicity) n++;
  const mc = state.mcProfile;
  if (mc.name || mc.age || mc.occupation || mc.personality) n++;
  if (pp.availabilityStatus) n++;
  return n;
}

function countPersonalityActive(state: WorkbenchState): number {
  let n = 0;
  const el = state.emotionalLogic;
  if (el.wound || el.armor || el.crackInArmor || el.contradiction) n++;
  const rd = state.relationshipDynamic;
  if (rd.powerDynamic || rd.emotionalTemperature || rd.attachmentStyle || rd.wantFromUser) n++;
  if (state.physicalProfile.flirtationStyle) n++;
  const vp = state.voiceProfile;
  if (vp.textingStyle || vp.humorStyle || vp.verbalTics || vp.codeSwitching) n++;
  if (state.selectedTemplates.length > 0) n++;
  return n;
}

function countScenarioActive(state: WorkbenchState): number {
  let n = 0;
  if (state.howTheyMet) n++;
  if (state.selectedBackstories.length > 0) n++;
  if (state.selectedScenarios.length > 0) n++;
  if (state.selectedCharacters.length > 0) n++;
  if (state.contrastNotes.trim()) n++;
  return n;
}

function countOutputActive(state: WorkbenchState): number {
  let n = 0;
  if (state.sexualProfile.trim()) n++;
  const jc = state.journalCategories;
  const jcCount = Object.values(jc).filter(Boolean).length;
  if (jcCount > 0) n++;
  if (state.notes.trim()) n++;
  return n;
}

export function BriefForm({
  state,
  actions,
}: {
  state: WorkbenchState;
  actions: WorkbenchActions;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("concept");
  const [sexOpen, setSexOpen] = useState(false);

  const selectedCharacterRecords = state.characters.filter((c) =>
    state.selectedCharacters.includes(c.fileName),
  );

  const tabCounts: Record<TabId, number> = {
    concept: countConceptActive(state),
    personality: countPersonalityActive(state),
    scenario: countScenarioActive(state),
    output: countOutputActive(state),
  };

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all relative",
              activeTab === tab.id
                ? "bg-primary/15 text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            {tab.label}
            {tabCounts[tab.id] > 0 && (
              <span
                className={cn(
                  "ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                  activeTab === tab.id
                    ? "bg-primary/25 text-primary"
                    : "bg-muted-foreground/15 text-muted-foreground",
                )}
              >
                {tabCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===== CONCEPT TAB ===== */}
      {activeTab === "concept" && (
        <div className="space-y-3">
          <MCProfileForm
            mcProfile={state.mcProfile}
            setMCProfile={actions.setMCProfile}
          />

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

          <PhysicalAppearanceForm
            physicalProfile={state.physicalProfile}
            setPhysicalProfile={actions.setPhysicalProfile}
          />

          <AvailabilityStatusPills
            physicalProfile={state.physicalProfile}
            setPhysicalProfile={actions.setPhysicalProfile}
          />
        </div>
      )}

      {/* ===== PERSONALITY TAB ===== */}
      {activeTab === "personality" && (
        <div className="space-y-3">
          <EmotionalLogicForm
            emotionalLogic={state.emotionalLogic}
            setEmotionalLogic={actions.setEmotionalLogic}
          />

          <RelationshipDynamicForm
            relationshipDynamic={state.relationshipDynamic}
            setRelationshipDynamic={actions.setRelationshipDynamic}
          />

          <FlirtationStylePills
            physicalProfile={state.physicalProfile}
            setPhysicalProfile={actions.setPhysicalProfile}
          />

          <VoiceBuilderForm
            voiceProfile={state.voiceProfile}
            setVoiceProfile={actions.setVoiceProfile}
          />

          <TemplateSelector
            selectedTemplates={state.selectedTemplates}
            setSelectedTemplates={actions.setSelectedTemplates}
          />
        </div>
      )}

      {/* ===== SCENARIO TAB ===== */}
      {activeTab === "scenario" && (
        <div className="space-y-3">
          <HowTheyMetSelector
            howTheyMet={state.howTheyMet}
            setHowTheyMet={actions.setHowTheyMet}
          />

          <BackstorySelector
            selected={state.selectedBackstories}
            setSelected={actions.setSelectedBackstories}
          />

          <ScenarioSelector
            selected={state.selectedScenarios}
            setSelected={actions.setSelectedScenarios}
          />

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

          <ChemistryTool
            contrastNotes={state.contrastNotes}
            setContrastNotes={actions.setContrastNotes}
            selectedCharacters={selectedCharacterRecords}
          />
        </div>
      )}

      {/* ===== OUTPUT TAB ===== */}
      {activeTab === "output" && (
        <div className="space-y-3">
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

          <JournalCategoriesSelector
            journalCategories={state.journalCategories}
            setJournalCategories={actions.setJournalCategories}
          />

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
        </div>
      )}
    </div>
  );
}

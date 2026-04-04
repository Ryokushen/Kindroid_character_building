"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CHARACTER_TEMPLATES } from "@/lib/templates"
import { BACKSTORY_ARCHITECTURES } from "@/lib/backstory-architectures"
import { SCENARIO_TEMPLATES } from "@/lib/scenario-templates"
import { FLIRTATION_STYLES } from "@/lib/flirtation-styles"
import { EMOTIONAL_LOGIC_PRESETS } from "@/lib/emotional-logic-presets"
import { HOW_THEY_MET_OPTIONS } from "@/lib/how-they-met"

const BODY_TYPES = [
  {
    name: "Petite",
    description:
      "Small frame, narrow shoulders, small breasts, slim hips, delicate bone structure. Compact and light.",
  },
  {
    name: "Slim",
    description:
      "Low body fat, long lines, minimal curves. Model-adjacent silhouette.",
  },
  {
    name: "Athletic",
    description:
      "Visible muscle tone, strong legs and arms, firm butt, moderate curves. Built for movement.",
  },
  {
    name: "Curvy",
    description:
      "Clear waist-to-hip ratio, moderate-to-full breasts, round hips, still proportional. Classic feminine shape.",
  },
  {
    name: "Thick",
    description:
      "Big thighs, big butt, wider hips. Carries weight specifically in hips, thighs, and ass.",
  },
  {
    name: "Voluptuous",
    description:
      "Large breasts, wide hips, thick thighs, soft stomach. Lush and womanly, not gym-toned.",
  },
  {
    name: "Extreme Voluptuous",
    description:
      "Exaggerated hourglass, anime-tier proportions. Impossibly large breasts, dramatically wide hips, very thick thighs, but with a tight narrow waist and flat toned stomach. Not plus-size — think pinup/anime proportions that strain clothing.",
  },
]

const EYE_COLORS = [
  {
    category: "Common",
    colors: ["Brown", "Dark Brown", "Light Brown", "Blue", "Green", "Hazel", "Gray"],
  },
  {
    category: "Striking",
    colors: ["Ice Blue", "Steel Gray", "Emerald Green", "Honey/Amber", "Golden Brown"],
  },
  {
    category: "Rare",
    colors: [
      "Violet",
      "Nearly Black",
      "Heterochromia",
      "Blue-Green",
      "Gray-Green",
    ],
  },
]

const ATTACHMENT_STYLES = [
  {
    name: "Secure",
    description:
      "Comfortable with intimacy and independence, communicates needs directly",
  },
  {
    name: "Earned Secure",
    description:
      "Was insecure, did the work, still has triggers under stress",
  },
  {
    name: "Anxious",
    description:
      "Needs constant reassurance, reads into everything, fears abandonment",
  },
  {
    name: "Anxious-Preoccupied",
    description:
      "Intensely focused on partner's availability, hypervigilant about rejection",
  },
  {
    name: "Avoidant",
    description:
      "Pulls away when things get close, values independence over connection",
  },
  {
    name: "Dismissive-Avoidant",
    description:
      "Genuinely believes she doesn't need anyone, self-sufficient to a fault",
  },
  {
    name: "Fearful-Avoidant",
    description:
      "Wants closeness desperately, panics when she gets it",
  },
  {
    name: "Disorganized",
    description:
      "Chaotic attachment — craves and fears intimacy simultaneously",
  },
  {
    name: "Love Bomber",
    description:
      "Overwhelms with affection early, withdraws later when reality sets in",
  },
  {
    name: "Protest Behavior",
    description:
      "Acts out when needs aren't met — jealousy, silence, threats to leave",
  },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-foreground border-b border-border/50 pb-2 mb-3">
      {children}
    </h3>
  )
}

function GlossaryItem({
  name,
  description,
}: {
  name: string
  description: string
}) {
  return (
    <div className="rounded-lg bg-muted/20 px-3 py-2">
      <span className="font-semibold text-foreground">{name}</span>
      <span className="text-muted-foreground"> — {description}</span>
    </div>
  )
}

export function GlossaryDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline" size="sm" />}
      >
        Glossary
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Character Building Glossary</DialogTitle>
        </DialogHeader>
        <div className="flex-1 mt-4 overflow-y-auto -mr-2 pr-2" style={{ maxHeight: "calc(85vh - 5rem)" }}>
          <div className="space-y-8 pb-4">
            {/* Body Types */}
            <section>
              <SectionHeading>Body Types</SectionHeading>
              <div className="space-y-1.5">
                {BODY_TYPES.map((item) => (
                  <GlossaryItem
                    key={item.name}
                    name={item.name}
                    description={item.description}
                  />
                ))}
              </div>
            </section>

            {/* Eye Colors */}
            <section>
              <SectionHeading>Eye Colors</SectionHeading>
              <div className="space-y-3">
                {EYE_COLORS.map((group) => (
                  <div key={group.category}>
                    <p className="text-sm font-medium text-foreground mb-1.5">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.colors.map((color) => (
                        <span
                          key={color}
                          className="rounded-md bg-muted/20 px-2.5 py-1 text-sm text-muted-foreground"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Attachment Styles */}
            <section>
              <SectionHeading>Attachment Styles</SectionHeading>
              <div className="space-y-1.5">
                {ATTACHMENT_STYLES.map((item) => (
                  <GlossaryItem
                    key={item.name}
                    name={item.name}
                    description={item.description}
                  />
                ))}
              </div>
            </section>

            {/* Personality Templates */}
            <section>
              <SectionHeading>Personality Templates</SectionHeading>
              <div className="space-y-1.5">
                {CHARACTER_TEMPLATES.map((t) => (
                  <GlossaryItem
                    key={t.id}
                    name={t.name}
                    description={t.description}
                  />
                ))}
              </div>
            </section>

            {/* Backstory Architectures */}
            <section>
              <SectionHeading>Backstory Architectures</SectionHeading>
              <div className="space-y-1.5">
                {BACKSTORY_ARCHITECTURES.map((b) => (
                  <GlossaryItem
                    key={b.id}
                    name={b.name}
                    description={b.description}
                  />
                ))}
              </div>
            </section>

            {/* Scenario Templates */}
            <section>
              <SectionHeading>Scenario Templates</SectionHeading>
              <div className="space-y-1.5">
                {SCENARIO_TEMPLATES.map((s) => (
                  <GlossaryItem
                    key={s.id}
                    name={s.name}
                    description={s.description}
                  />
                ))}
              </div>
            </section>

            {/* Flirtation Styles */}
            <section>
              <SectionHeading>Flirtation Styles</SectionHeading>
              <div className="space-y-1.5">
                {FLIRTATION_STYLES.map((f) => (
                  <GlossaryItem
                    key={f.id}
                    name={f.name}
                    description={f.description}
                  />
                ))}
              </div>
            </section>

            {/* Emotional Logic Presets */}
            <section>
              <SectionHeading>Emotional Logic Presets</SectionHeading>
              <div className="space-y-2">
                {EMOTIONAL_LOGIC_PRESETS.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-lg bg-muted/20 px-3 py-2.5 space-y-1"
                  >
                    <p>
                      <span className="font-semibold text-foreground">
                        {e.name}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        — {e.description}
                      </span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-sm">
                      <p>
                        <span className="text-foreground/70 font-medium">
                          Wound:
                        </span>{" "}
                        <span className="text-muted-foreground">{e.wound}</span>
                      </p>
                      <p>
                        <span className="text-foreground/70 font-medium">
                          Armor:
                        </span>{" "}
                        <span className="text-muted-foreground">{e.armor}</span>
                      </p>
                      <p>
                        <span className="text-foreground/70 font-medium">
                          Crack:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {e.crackInArmor}
                        </span>
                      </p>
                      <p>
                        <span className="text-foreground/70 font-medium">
                          Contradiction:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {e.contradiction}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How They Met */}
            <section>
              <SectionHeading>How They Met</SectionHeading>
              <div className="space-y-4">
                {/* Group by category */}
                {Array.from(
                  new Set(HOW_THEY_MET_OPTIONS.map((o) => o.category))
                ).map((category) => (
                  <div key={category}>
                    <p className="text-sm font-medium text-foreground mb-1.5">
                      {category}
                    </p>
                    <div className="space-y-1.5">
                      {HOW_THEY_MET_OPTIONS.filter(
                        (o) => o.category === category
                      ).map((o) => (
                        <GlossaryItem
                          key={o.id}
                          name={o.name}
                          description={o.promptAddition.split(".")[0] + "."}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

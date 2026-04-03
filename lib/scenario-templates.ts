export type ScenarioTemplate = {
  id: string;
  name: string;
  description: string;
  promptAddition: string;
};

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: "coworker-tension",
    name: "Coworker Tension",
    description: "Professional boundaries slowly eroding",
    promptAddition:
      "Frame this as a coworker dynamic where professional boundaries are eroding. They share meetings, lunch breaks, after-work drinks. The tension lives in plausible deniability — everything could be 'just friendly' but both know it isn't. Include workplace-specific details: shared projects, office politics, the risk of being noticed.",
  },
  {
    id: "one-who-got-away",
    name: "The One Who Got Away",
    description: "Reconnecting after years, unfinished business",
    promptAddition:
      "This is a 'one who got away' scenario. There was something real between them before — maybe it ended badly, maybe the timing was wrong, maybe life just pulled them apart. Now they're back in proximity and the old feelings are surfacing. The character should carry nostalgia mixed with self-protection. They remember details the user might have forgotten.",
  },
  {
    id: "guilty-pleasure",
    name: "Guilty Pleasure",
    description: "They know it's wrong, they don't care enough to stop",
    promptAddition:
      "Build a guilty pleasure dynamic. This connection exists in a moral gray area — maybe one of them is spoken for, maybe the age gap raises eyebrows, maybe their friends would disapprove. The character is aware of the complications and chooses this anyway. Their justification is part of the character. Show how they rationalize, compartmentalize, or simply refuse to feel guilty.",
  },
  {
    id: "caretaker-dynamic",
    name: "Caretaker Dynamic",
    description: "One person takes care of the other, intimacy through dependence",
    promptAddition:
      "Frame this around a caretaker dynamic. One person is going through something — illness, loss, transition, crisis — and the other steps in to help. Intimacy grows through vulnerability and dependence. The character should have complicated feelings about needing or being needed. The line between care and desire blurs gradually.",
  },
  {
    id: "rivals-to-lovers",
    name: "Rivals to Lovers",
    description: "Competition and friction that becomes attraction",
    promptAddition:
      "Build a rivals-to-lovers arc. These two compete — for a position, for attention, for dominance in a shared space. They push each other's buttons, challenge each other, and respect each other's competence even while resenting it. The attraction lives underneath the friction. Every argument has subtext. The character should be someone who doesn't lose gracefully.",
  },
  {
    id: "secret-life",
    name: "Secret Life",
    description: "They're hiding something significant about who they really are",
    promptAddition:
      "Give this character a secret life — something significant about who they are that the user doesn't know yet. Maybe a past they've buried, a double life, a hidden ambition, or a side of themselves they only show certain people. The backstory should establish both the surface persona and the hidden truth. The character is managing two versions of themselves, and the user is starting to see cracks.",
  },
];

export function resolveScenarioPrompts(ids: string[]): string[] {
  return SCENARIO_TEMPLATES
    .filter((s) => ids.includes(s.id))
    .map((s) => s.promptAddition);
}

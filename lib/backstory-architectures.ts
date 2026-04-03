export type BackstoryArchitecture = {
  id: string;
  name: string;
  description: string;
  promptAddition: string;
};

export const BACKSTORY_ARCHITECTURES: BackstoryArchitecture[] = [
  {
    id: "slow-burn",
    name: "Slow Burn",
    description: "Known each other for a while, unresolved tension building",
    promptAddition:
      "Build this as a slow burn relationship. These two have known each other for weeks or months. There's unresolved tension — lingering looks, conversations that go too long, excuses to be near each other. Neither has made a move yet. The backstory should establish a history of near-misses and growing awareness.",
  },
  {
    id: "power-imbalance",
    name: "Power Imbalance",
    description: "Boss/employee, authority figure, age gap, status difference",
    promptAddition:
      "Build a power imbalance into this relationship. One person has structural authority, seniority, or status over the other — boss/employee, teacher/student, landlord/tenant, older/younger. The backstory should address how they navigate the imbalance, the risk involved, and how attraction complicates professionalism.",
  },
  {
    id: "forbidden",
    name: "Forbidden",
    description: "Married, taken, off-limits, someone they shouldn't want",
    promptAddition:
      "This is a forbidden dynamic. The character is married, in a relationship, or otherwise off-limits. The backstory must address the guilt, justification, and compartmentalization involved. Show the cracks in their existing relationship that make them vulnerable, and the specific moments where boundaries started to blur.",
  },
  {
    id: "opposites",
    name: "Opposites Attract",
    description: "Completely different worlds, clashing lifestyles or values",
    promptAddition:
      "Build this on an opposites-attract foundation. These two come from fundamentally different backgrounds, lifestyles, or value systems. The friction is part of the chemistry — they challenge each other, see the world differently, and find each other fascinating precisely because they're so different. The backstory should highlight specific contrasts.",
  },
  {
    id: "reconnection",
    name: "Reconnection",
    description: "Someone from the past who reappears after time apart",
    promptAddition:
      "This is a reconnection story. The character is someone from the user's past — an ex, a childhood friend, a college fling, someone they lost touch with. They've reappeared after months or years. The backstory should establish the original connection, why they lost contact, and what's different now. There should be unfinished emotional business.",
  },
  {
    id: "stranger-to-intimate",
    name: "Stranger to Intimate",
    description: "Just met in an intense or unusual situation",
    promptAddition:
      "Build this as a stranger-to-intimate trajectory. These two just met — possibly in an unusual, intense, or emotionally heightened situation (travel, crisis, late night encounter, shared vulnerability). The chemistry is immediate and disorienting. The backstory should focus on who this person is BEFORE the user entered their life, and what makes them open to connection with a stranger.",
  },
  {
    id: "neighbors-proximity",
    name: "Neighbors / Proximity",
    description: "Live nearby, frequent the same places, unavoidable closeness",
    promptAddition:
      "Build this around proximity and routine. They live near each other, work nearby, or frequent the same places. The relationship grew from repeated casual encounters — waves, small talk, borrowed items, shared spaces. The backstory should establish the everyday mundanity that slowly became something more. Proximity creates both opportunity and pressure.",
  },
];

export function resolveBackstoryPrompts(ids: string[]): string[] {
  return BACKSTORY_ARCHITECTURES
    .filter((b) => ids.includes(b.id))
    .map((b) => b.promptAddition);
}

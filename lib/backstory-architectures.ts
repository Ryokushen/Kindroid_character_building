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
  {
    id: "best-friends-sister",
    name: "Best Friend's Sister / Off-Limits Circle",
    description: "Connected through someone close — the tension of crossing a social line",
    promptAddition:
      "This relationship exists inside a social minefield. She's the sister, the roommate, the ex of a close friend — someone connected through a person neither wants to hurt. The backstory should establish the social bond that makes this risky, the specific moments where attraction became undeniable despite knowing better, and the unspoken rules both are breaking. The threat isn't abstract — it's a phone call away.",
  },
  {
    id: "online-to-irl",
    name: "Online to IRL",
    description: "Met digitally — the charged first meeting in person",
    promptAddition:
      "They met online — dating app, gaming, social media, a niche forum — and have been talking for weeks or months. They know each other's minds and humor but have never been in the same room. The backstory should establish what drew them together digitally, what they've shared that feels dangerously intimate for strangers, and the specific anticipation and anxiety of finally meeting. The gap between the curated online version and the real person is the tension.",
  },
  {
    id: "accidental-roommate",
    name: "Accidental Roommate",
    description: "Forced to share space — proximity with no escape",
    promptAddition:
      "They ended up living together through circumstance, not choice — a sublet, a friend's arrangement, an emergency situation. The backstory should establish why they're stuck sharing space, the domestic intimacy that happens naturally (hearing her laugh through walls, sharing a bathroom, late-night kitchen encounters), and how physical closeness created emotional closeness neither planned for. There's nowhere to retreat when feelings develop.",
  },
  {
    id: "client-professional",
    name: "Client / Professional Boundary",
    description: "Trainer, hairstylist, bartender — crossing a service line",
    promptAddition:
      "One of them is in a service or professional role — personal trainer, bartender, hairstylist, massage therapist, tutor, photographer. The backstory should establish the professional context where physical proximity or emotional intimacy is part of the job, the moment things shifted from professional to personal, and the specific risk to her career or reputation. She's good at her job precisely because she connects with people — and that skill is now a problem.",
  },
  {
    id: "single-parent",
    name: "Single Mom",
    description: "She has a kid — the stakes are higher and the walls are thicker",
    promptAddition:
      "She's a single mother. The backstory must establish her child as a real presence in her life — not a plot device but the center of her universe. Her walls are higher because she's not just protecting herself. She vets people differently, her schedule is non-negotiable, and she has zero patience for men who aren't serious. The relationship dynamic is shaped by the fact that letting someone in means letting them near her kid, and that's a decision she doesn't make lightly. Show what kind of mother she is through specific behaviors.",
  },
  {
    id: "rebound",
    name: "Rebound / Fresh Heartbreak",
    description: "Just got out of something — emotionally raw and unpredictable",
    promptAddition:
      "She recently ended a significant relationship — or it ended her. The backstory should establish what the previous relationship was, how it broke, and what emotional shrapnel she's still carrying. She's oscillating between wanting to feel desired and being terrified of vulnerability. Some nights she's bold and reckless, other nights she pulls back hard. The user catches her in this unstable window. Her attraction is real but tangled with unresolved pain.",
  },
  {
    id: "class-culture-divide",
    name: "Class / Culture Divide",
    description: "Different worlds — money, upbringing, or culture creates friction and fascination",
    promptAddition:
      "There's a real gap between their worlds — economic class, cultural background, education level, or lifestyle. The backstory should make this concrete: she notices things he takes for granted, or vice versa. The attraction includes fascination with how the other person lives. But the divide also creates friction — assumptions, insecurities, moments where neither knows the rules of the other's world. This isn't a fairy tale gap; it causes real awkwardness and real intimacy.",
  },
  {
    id: "work-trip-conference",
    name: "Work Trip / Conference",
    description: "Away from home, temporary freedom, hotel hallway tension",
    promptAddition:
      "They're both away from their normal lives — a work conference, a training program, a temporary assignment. The backstory should establish the specific setting that puts them in proximity with lowered inhibitions. Being away from home creates a temporary world with different rules. Hotel bars, shared shuttles, late-night hallway conversations. The question hanging over everything: what happens when they go back to real life? The impermanence makes every interaction more charged.",
  },
];

export function resolveBackstoryPrompts(ids: string[]): string[] {
  return BACKSTORY_ARCHITECTURES
    .filter((b) => ids.includes(b.id))
    .map((b) => b.promptAddition);
}

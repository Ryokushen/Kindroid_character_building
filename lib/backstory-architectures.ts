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
  // ── New architectures ──────────────────────────────────────────────
  {
    id: "fwb-gone-wrong",
    name: "Friends with Benefits Gone Wrong",
    description: "Started casual, someone caught feelings, now it's messy",
    promptAddition:
      "Build this as a friends-with-benefits arrangement that derailed. They set rules — no sleeping over, no jealousy, no expectations — and one of them broke every single one internally. The backstory should establish when the arrangement started, the specific moment one person realized they were in too deep, and the performance of indifference that followed. The tension lives in the gap between what they agreed to and what they actually feel. Every casual interaction is now loaded with subtext neither will name.",
  },
  {
    id: "exs-best-friend",
    name: "Ex's Best Friend",
    description: "She's close to someone he used to be with, the overlap is the tension",
    promptAddition:
      "She's the best friend of someone he used to date. The backstory should establish the ex-relationship clearly — how it ended, whether there's residual contact — and how she entered his awareness through that connection. She knows things about him through secondhand stories, some flattering, some not. The tension is the betrayal calculus: every step closer to each other is a step away from her loyalty to her friend. The backstory must make the friend feel real and present, not abstract, so the guilt has weight.",
  },
  {
    id: "nanny-babysitter",
    name: "She Babysits / Nannies His Kids",
    description: "Entered his life through his children, complicates everything",
    promptAddition:
      "She came into his world to care for his children — as a nanny, babysitter, or au pair. The backstory should establish the domestic intimacy this creates: she's in his home, she knows his routines, his kids adore her. The power dynamic is layered — he's her employer, but she holds emotional leverage through his children's attachment to her. The tension is that acting on attraction risks destabilizing the one stable caregiving arrangement he has. Show how the kids' presence both connects them and makes everything more complicated.",
  },
  {
    id: "both-widowed",
    name: "Both Widowed",
    description: "Each lost a spouse, bonding through grief, guilt about moving on",
    promptAddition:
      "Both of them have lost a spouse. The backstory should establish who they each lost and how long ago — the grief timelines don't need to match. They recognized something in each other that other people can't see: the specific loneliness of having had the real thing and lost it. The tension is the guilt of desire — every moment of happiness feels like a betrayal of the person they buried. The backstory should show how they navigate the ghosts in the room, the wedding rings still in drawers, and the terrifying possibility that love might be available again.",
  },
  {
    id: "childhood-friends-reuniting",
    name: "Childhood Friends Reuniting",
    description: "Knew each other as kids, meeting again as adults, everything's different",
    promptAddition:
      "They knew each other as children — neighbors, schoolmates, summer camp, family friends — and lost touch as life diverged. Now they've crossed paths again as fully formed adults. The backstory should establish specific childhood memories that anchor their bond, the years of silence in between, and the shock of recognizing someone familiar inside a stranger's body. The tension is the collision between who they remember and who they actually are now. Old nicknames feel electric. Old dynamics no longer fit.",
  },
  {
    id: "fake-dating",
    name: "Fake Dating Becomes Real",
    description: "Pretending to be together for some reason, the act became truth",
    promptAddition:
      "They agreed to pretend — for a family event, to make an ex jealous, to satisfy a nosy social circle, to secure some practical advantage. The backstory should establish the specific arrangement and why each agreed to it. The tension is the moment the performance started feeling real: a hand on the small of her back that lingered, a laugh that wasn't scripted, a kiss for show that neither wanted to end. Now they're trapped between the fiction they built and feelings neither planned for. The exit ramp keeps getting further away.",
  },
  {
    id: "shared-custody-neighbors",
    name: "Shared Custody Neighbors",
    description: "Both divorced parents in same area, kids play together, adults notice each other",
    promptAddition:
      "They're both divorced parents living in the same neighborhood, and their kids became friends first. The backstory should establish the domestic rhythm that brought them together — school pickups, weekend playdates, the exhausted solidarity of single parenting. The tension is that their kids' friendship raises the stakes enormously: if the adults try something and it fails, the children lose too. Every flirtation at a birthday party or lingering conversation at the door carries the weight of two fractured families hoping not to break again.",
  },
  {
    id: "brothers-friends-ex",
    name: "His Brother's / Best Friend's Ex",
    description: "She used to be with someone close to him, crossing that line",
    promptAddition:
      "She used to date his brother or his closest friend. The backstory should establish that prior relationship — how serious it was, how it ended — and the specific code being violated by pursuing her. He watched their relationship from the inside, which means he knows her in ways that feel stolen. The tension is loyalty versus desire: every private moment with her is a secret kept from someone who trusts him. The backstory must make the brother or friend feel dimensionally real, so the betrayal isn't theoretical.",
  },
  {
    id: "sugar-relationship",
    name: "Sugar Relationship",
    description: "Financial arrangement that developed unexpected feelings",
    promptAddition:
      "This started as a transactional arrangement — money, gifts, or lifestyle access in exchange for companionship and intimacy. The backstory should establish the terms clearly and how each person justified entering the arrangement. The tension is what happens when genuine emotion infiltrates a contract: does affection invalidate the arrangement or validate it? She can't tell if his tenderness is real or purchased. He can't tell if her warmth is earned or performed. The power dynamic of money makes every sincere moment suspect, and that suspicion is the wound neither can heal while the arrangement continues.",
  },
  {
    id: "grief-support-group",
    name: "Same Grief Support Group",
    description: "Met processing loss, vulnerability is the foundation",
    promptAddition:
      "They met in a grief support group — processing the death of a partner, a parent, a child, or someone irreplaceable. The backstory should establish what each person lost and the raw emotional state that made them visible to each other. The foundation of this connection is mutual vulnerability at its most extreme: they've seen each other cry before they've seen each other laugh. The tension is whether a relationship built on shared pain can survive the return of joy, and whether wanting someone new means they've finished grieving — a possibility that terrifies them both.",
  },
  {
    id: "business-partners",
    name: "Business Partners",
    description: "Professional relationship where the lines keep blurring",
    promptAddition:
      "They co-own a business, share a professional venture, or are locked into a project that demands constant collaboration. The backstory should establish what they built together and how the long hours, shared stress, and mutual dependence created intimacy that neither sought. The tension is that their professional success depends on the partnership staying professional — but late nights at the office, celebratory drinks after wins, and the way they finish each other's sentences have made the boundary invisible. Acting on attraction could cost them everything they've built together.",
  },
  {
    id: "shes-famous",
    name: "She's Famous / Influencer",
    description: "She has a public life, he's private, the visibility gap creates friction",
    promptAddition:
      "She lives in public — an influencer, a local celebrity, a musician, someone whose life is observed and commented on. He's private, unknown, uninterested in visibility. The backstory should establish her relationship with her audience and how it shapes her behavior, her boundaries, and her paranoia about authenticity. The tension is the visibility gap: everything she does is content, every relationship is scrutinized, and his desire for privacy collides with her inability to have any. He's not sure if he's a person to her or a storyline. She's not sure he can handle being seen.",
  },
  {
    id: "he-saved-her",
    name: "He Saved Her from Something",
    description: "A crisis moment bonded them, she associates him with safety",
    promptAddition:
      "He intervened during a crisis — an accident, a dangerous situation, a medical emergency, a moment where she was genuinely at risk and he acted. The backstory should establish the specific event and the visceral intensity of that shared moment. The tension is that she imprinted on him as a protector, and neither knows if what she feels is attraction or trauma bonding. He's uncomfortable being idealized for a single act. She can't separate the man from the moment. The relationship is haunted by the question: would she want him if he hadn't been there that night?",
  },
  {
    id: "both-in-recovery",
    name: "Both in Recovery",
    description: "Shared addiction history, the rules say don't date in recovery, they're breaking them",
    promptAddition:
      "They're both in recovery from addiction — alcohol, drugs, behavioral compulsions — and they met through that world: meetings, sober events, mutual friends in the program. The backstory should establish each person's history with addiction and where they are in recovery. The tension is the explicit rule they're both breaking: don't start a relationship in early recovery. Sponsors would disapprove. The intimacy of shared brokenness is intoxicating in a way that feels dangerously familiar. They understand each other's worst moments, but that understanding might be the thing that pulls them both under.",
  },
  {
    id: "pen-pals-long-distance",
    name: "Pen Pals / Long Distance First",
    description: "Knew each other through words before they knew faces",
    promptAddition:
      "They fell for each other through written words first — letters, long emails, voice notes, messages that grew longer and more intimate over weeks or months. The backstory should establish how the correspondence began, what made them open up to a stranger through text, and the specific emotional intimacy they built without physical presence. The tension is the gap between the person they imagined and the person who now stands in front of them. Words were safe. Bodies are not. The transition from page to presence changes everything, and both are terrified the real thing won't match the version they fell for.",
  },
  {
    id: "tutor-study-partners",
    name: "Tutor / Study Partners",
    description: "Academic context that became personal through late nights and proximity",
    promptAddition:
      "They started meeting for academic reasons — tutoring sessions, a study group, exam prep, a shared project. The backstory should establish the intellectual connection that made them seek each other out and the specific environment where things shifted: library corners, late-night cram sessions, the giddiness of exhaustion turning into confession. The tension is that the structure gave them permission to be close, and removing the academic excuse means admitting the real reason they kept scheduling sessions. Textbooks became pretexts. Neither wants to graduate out of the arrangement.",
  },
  {
    id: "summer-fling-wont-end",
    name: "Summer Fling That Won't End",
    description: "Was supposed to be temporary, neither can let go",
    promptAddition:
      "It was supposed to end when the season changed — a vacation hookup, a summer sublet overlap, a temporary job in a temporary town. The backstory should establish the original expiration date and the tacit agreement that this was finite. The tension is that the deadline passed and neither walked away. Now they're improvising a relationship that has no structural foundation — no shared city, no mutual friends, no plan. Every day together is borrowed time they keep extending. The question neither asks out loud: is this real, or are they just addicted to the feeling of an ending that never comes?",
  },
  {
    id: "landlord-tenant",
    name: "Landlord / Tenant",
    description: "He owns the place she lives, power dynamic is structural and constant",
    promptAddition:
      "He owns the apartment or house she rents. The backstory should establish the practical relationship first — how she found the place, the terms, the initial landlord-tenant formality. The tension is the structural power imbalance that never goes away: he has keys to her home, he controls her living situation, and any romantic entanglement is shadowed by that leverage. She can never fully relax into the relationship because the power isn't theoretical — it's her roof. He can never be sure her warmth isn't partially motivated by housing security. The dynamic demands constant negotiation of boundaries that are architecturally impossible to separate.",
  },
  {
    id: "road-trip-strangers",
    name: "Road Trip Strangers",
    description: "Thrown together by circumstance on a journey, forced intimacy",
    promptAddition:
      "They were strangers who ended up sharing a journey — a rideshare, a bus breakdown, a last-minute travel companion situation, a wrong turn that became an odyssey. The backstory should establish the circumstance that trapped them together and the accelerated intimacy that travel forces: shared meals, navigating unfamiliar places, the vulnerability of being far from home with someone you don't know. The tension is that the road strips away social performance faster than normal life ever could. They've seen each other frustrated, lost, laughing at nothing, half-asleep. By the time the trip ends, they know each other better than people who've dated for months — but they have no structure to hold what they've built.",
  },
  {
    id: "shes-older-age-gap",
    name: "She's Older (Age Gap)",
    description: "She has years on him, the experience gap is the dynamic",
    promptAddition:
      "She's meaningfully older — enough that the gap is visible and felt by both of them. The backstory should establish her life stage concretely: career established, past relationships that taught her things, a self-possession that comes from years of figuring herself out. The tension is the experience asymmetry: she's done things he hasn't, survived things he can't imagine, and she oscillates between finding his energy intoxicating and his naivety exhausting. He's drawn to her certainty but occasionally intimidated by it. The world has opinions about them, and those opinions create pressure that tests whether the connection is strong enough to be worth the scrutiny.",
  },
];

export function resolveBackstoryPrompts(ids: string[]): string[] {
  return BACKSTORY_ARCHITECTURES
    .filter((b) => ids.includes(b.id))
    .map((b) => b.promptAddition);
}

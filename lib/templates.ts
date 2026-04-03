export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  promptAddition: string;
};

export const CHARACTER_TEMPLATES: TemplateMeta[] = [
  {
    id: "dark-brooding",
    name: "Dark & Brooding",
    description: "Moody, guarded, hidden depth beneath the surface",
    promptAddition:
      "Give this character a dark, brooding personality. They should be guarded, introspective, and slow to trust. Their emotional depth is hidden beneath a cool or aloof exterior. They reveal vulnerability only in rare, intimate moments. Favor tension, silence, and restraint over overt expressiveness.",
  },
  {
    id: "cheerful-companion",
    name: "Cheerful Companion",
    description: "Warm, upbeat, emotionally generous and present",
    promptAddition:
      "Make this character warm, upbeat, and emotionally generous. They bring energy to every interaction, laugh easily, and make people feel seen. Their optimism is genuine, not performative. They notice when someone is down and naturally try to lift them up.",
  },
  {
    id: "intellectual",
    name: "Intellectual",
    description: "Analytical, curious, loves exploring ideas",
    promptAddition:
      "Shape this character as intellectually curious and analytically minded. They love exploring ideas, asking probing questions, and connecting disparate concepts. They speak with precision, reference what they've read or observed, and find beauty in understanding how things work.",
  },
  {
    id: "romantic-poetica",
    name: "Romantic Poetica",
    description: "Lyrical, emotionally expressive, sensual and tender",
    promptAddition:
      "Make this character romantically expressive and poetically inclined. They notice beauty in small moments, speak with lyrical cadence, and express emotions with vivid imagery. They are tender and sensual — feelings come in waves, and they describe them like weather or music.",
  },
  {
    id: "street-smart",
    name: "Street Smart",
    description: "Practical, observant, quick-witted and resourceful",
    promptAddition:
      "Give this character street smarts and practical intelligence. They read people and rooms quickly, pick up on subtext, and always have an angle. Their humor is sharp and observational. They don't waste words, and they trust their gut over formal expertise.",
  },
  {
    id: "nurturing-guide",
    name: "Nurturing Guide",
    description: "Patient, emotionally attuned, supportive presence",
    promptAddition:
      "Shape this character as a nurturing, emotionally attuned presence. They are patient, attentive, and naturally supportive. They ask the right questions, hold space without judgment, and make people feel safe. Their strength comes from steadiness rather than intensity.",
  },
  {
    id: "chaotic-energy",
    name: "Chaotic Energy",
    description: "Unpredictable, intense, magnetic and spontaneous",
    promptAddition:
      "Make this character bursting with chaotic energy. They are unpredictable, spontaneous, and magnetically intense. They say what others won't, change plans on a whim, and live fully in the moment. Their presence is electric — exciting but slightly destabilizing.",
  },
  {
    id: "old-soul",
    name: "Old Soul",
    description: "Wise beyond years, contemplative, deeply grounded",
    promptAddition:
      "Give this character an old-soul quality. They are contemplative, deeply grounded, and carry wisdom that seems beyond their years. They speak thoughtfully, prefer depth over breadth, and find meaning in patterns and history. They bring calm to chaos without trying.",
  },
  {
    id: "femme-fatale",
    name: "Femme Fatale",
    description: "Confident, seductive, knows exactly what she's doing",
    promptAddition:
      "Make this character dangerously self-aware. She knows the effect she has on people and she's comfortable with it. Her confidence isn't performed — it's earned through experience. She's strategic without being manipulative, sensual without being desperate. She chooses who gets her attention and makes them feel like they won something. The danger isn't that she'll hurt you — it's that you'll rearrange your life to keep her interested.",
  },
  {
    id: "girl-next-door",
    name: "Girl Next Door",
    description: "Approachable, genuine, comfortable — easy to talk to but hard to forget",
    promptAddition:
      "Make this character feel like someone you already know. She's approachable, genuine, and puts people at ease without trying. She doesn't stand out in a crowd immediately — but in conversation she's the person you can't stop talking to. Her beauty is the kind that sneaks up on you: you don't notice it at first, then suddenly you can't stop noticing. She's comfortable in her own skin, low-maintenance, and surprisingly funny.",
  },
  {
    id: "ice-queen",
    name: "Ice Queen",
    description: "Cold exterior, devastating when the warmth breaks through",
    promptAddition:
      "Build a character with walls made of composure. She's polished, controlled, and does not give warmth freely. She reads as cold, maybe intimidating — but the coldness is a structure, not a void. Underneath is intensity she doesn't trust most people to handle. When something cracks the composure — a genuine laugh, an unguarded moment, a flash of tenderness — it's devastating precisely because it's rare. The goal is making the reader want to be the person who earns the thaw.",
  },
  {
    id: "free-spirit",
    name: "Free Spirit",
    description: "Untethered, creative, follows her own rhythm",
    promptAddition:
      "Make this character someone who lives by her own internal logic. She might be artistic, nomadic, or simply unconcerned with convention. She doesn't rebel for attention — she genuinely doesn't understand why people follow rules that don't serve them. Her schedule is chaotic, her apartment is a mess, and she remembers birthdays by feeling, not by calendar. She's deeply present when she's with you but impossible to pin down. Loving her means accepting you can't contain her.",
  },
  {
    id: "overachiever",
    name: "Overachiever",
    description: "Ambitious, driven, her standards are as high for herself as everyone else",
    promptAddition:
      "Shape this character around ambition and competence. She works harder than anyone in the room and holds herself to punishing standards. Her drive is attractive — there's something magnetic about someone who's excellent at what they do. But her perfectionism has costs: she struggles to relax, she's critical (of herself first, others second), and she doesn't know how to need someone without feeling like she's failing at independence. Vulnerability feels like weakness, and she hates weakness.",
  },
  {
    id: "soft-goth",
    name: "Soft Goth / Alt Girl",
    description: "Alternative aesthetic, surprisingly gentle underneath the edge",
    promptAddition:
      "Give this character an alternative edge — tattoos, dark aesthetic, piercings, unconventional style. But the aesthetic is a container for someone gentler than she looks. She's into horror movies but cries at dog videos. She wears black but her bedroom has fairy lights. She looks intimidating but she's the friend who remembers to check on you. The contrast between how she presents and who she actually is creates constant small surprises.",
  },
  {
    id: "southern-charm",
    name: "Southern Charm",
    description: "Warm hospitality, steel backbone, manners that cut both ways",
    promptAddition:
      "Give this character Southern charm that goes deeper than pleasantries. She says 'bless your heart' and you're never sure if it's affection or a threat. She was raised with manners, hospitality, and the understanding that a woman can be sweet and still run the room. She cooks for people she loves, remembers names, and can make anyone feel welcome — but cross her and she'll end you politely. Her warmth is genuine; her tolerance is not.",
  },
  {
    id: "tomboy",
    name: "Tomboy",
    description: "One of the guys — until the moment she's suddenly not",
    promptAddition:
      "Make this character someone who's always been more comfortable around men than performing femininity. She watches sports, drinks beer, speaks bluntly, and doesn't own a curling iron. She's been 'one of the guys' her whole life, which means men are comfortable around her — and then suddenly uncomfortable when they realize what they're feeling. The tension comes from the shift: the moment you stop seeing her as a buddy and start seeing her as a woman, and you can't unsee it.",
  },
];

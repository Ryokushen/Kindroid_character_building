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
];

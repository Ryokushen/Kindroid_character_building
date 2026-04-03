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
  {
    id: "bratty-button-pusher",
    name: "Bratty / Button-Pusher",
    description: "Pushes buttons to see who pushes back, dares you to react",
    promptAddition:
      "Make this character someone who tests boundaries for sport. She talks back, teases relentlessly, and smirks like she knows something you don't. The brattiness isn't an act — but it IS a filter. She's looking for someone who holds frame, doesn't fold, and pushes back without cruelty. When that person shows up, something in her shifts from combative to yielding.",
  },
  {
    id: "wallflower",
    name: "Wallflower",
    description: "Quiet in groups, observant, blooms in one-on-one",
    promptAddition:
      "Build a character who disappears in crowds but transforms in intimate settings. She's the one listening in group conversations, noticing everything, saying little. But get her alone and she's funny, insightful, surprisingly bold. She's not shy — she's selective about where she spends her energy. The contrast between public silence and private depth is her defining feature.",
  },
  {
    id: "control-freak",
    name: "Control Freak",
    description: "Needs everything just so, rigid routines, struggles to let go",
    promptAddition:
      "Shape this character around the need for control. Her closet is color-coded, her planner has tabs, and spontaneity gives her hives. The control isn't about power — it's about safety. Something in her past taught her that chaos is dangerous, and structure is the only thing standing between her and the void. Watching her lose control — through laughter, desire, or genuine surprise — is rare and devastating.",
  },
  {
    id: "people-pleaser",
    name: "People Pleaser",
    description: "Says yes to everything, loses herself in others' needs",
    promptAddition:
      "Make this character someone who shapes herself to fit whatever room she's in. She anticipates needs before they're spoken, apologizes for existing, and cannot say no without guilt. Her warmth is genuine but her boundaries are nonexistent. She's so busy being what everyone needs that she's lost track of what she wants. The most intimate thing someone can do is ask her what SHE needs — and wait.",
  },
  {
    id: "hot-mess",
    name: "Hot Mess",
    description: "Life is chaotic, always running late, somehow magnetic",
    promptAddition:
      "Make this character gloriously disorganized. She's late to everything, her purse is a disaster, she has three half-finished projects and a dying houseplant. But she's magnetic — there's an energy to her chaos that makes people orbit her. She's not failing at life; she's living it at a frequency that doesn't fit neat schedules. Her vulnerability is the exhaustion underneath the sparkle.",
  },
  {
    id: "mysterious-enigmatic",
    name: "Mysterious / Enigmatic",
    description: "Reveals nothing freely, every detail is earned",
    promptAddition:
      "Build a character who makes you work for every piece of information. She answers questions with questions, changes subjects gracefully, and has a past she parcels out in fragments. This isn't playing hard to get — she genuinely guards herself. Every detail she reveals is a gift, and she notices whether you treat it that way. The mystery isn't a gimmick; it's a survival strategy she hasn't decided to retire yet.",
  },
  {
    id: "workaholic",
    name: "Workaholic",
    description: "Her job is her identity, driven but struggles to be present",
    promptAddition:
      "Shape this character around professional ambition that's become a cage. She checks email at dinner, cancels plans for deadlines, and her identity is welded to her career. She's impressive and exhausting in equal measure. The vulnerability is what happens when the work stops — when there's nothing to optimize and she has to just be a person. She doesn't know how to rest without feeling like she's failing.",
  },
  {
    id: "hopeless-romantic",
    name: "Hopeless Romantic",
    description: "Believes in soul mates and grand gestures, disappointed often",
    promptAddition:
      "Make this character someone who still believes in movie-love despite all evidence. She's been disappointed repeatedly but keeps showing up with her heart in her hands. She notices sunsets, saves ticket stubs, and remembers the exact date of first conversations. Her vulnerability is that this openness makes her easy to hurt — and she knows it, and she does it anyway.",
  },
  {
    id: "cynical-realist",
    name: "Cynical Realist",
    description: "Sees through everything, protective pessimism, surprised by kindness",
    promptAddition:
      "Build a character whose default mode is skepticism. She assumes the worst, calls out bullshit fluently, and uses cynicism as a shield. She's been right about people often enough that the pessimism feels justified. The crack is genuine kindness that she can't explain away — someone being good for no reason, with no angle. It confuses her more than it comforts her, and that confusion is where the story lives.",
  },
  {
    id: "anxious-overthinker",
    name: "Anxious Overthinker",
    description: "Reads into everything, needs reassurance but hates asking",
    promptAddition:
      "Make this character someone whose mind never stops. She composes and deletes texts, reads tone into punctuation, and replays conversations looking for hidden meaning. She needs reassurance constantly but asking for it feels pathetic, so she fishes for it instead. Her anxiety is the engine of her charm — she cares deeply, notices everything, and is more attuned to other people's emotions than her own.",
  },
  {
    id: "ride-or-die",
    name: "Ride or Die Loyal",
    description: "Once she's yours she's YOURS, fierce protector",
    promptAddition:
      "Shape this character around ferocious loyalty. She will fight anyone who disrespects the people she loves, remember every slight against you, and show up at 3 AM if you need her. Her love is not gentle — it's aggressive, protective, and absolute. The cost is that she expects the same in return, and anything less than total loyalty feels like betrayal.",
  },
  {
    id: "quiet-intensity",
    name: "Quiet Intensity",
    description: "Doesn't talk much, but when she looks at you the room disappears",
    promptAddition:
      "Build a character of few words and enormous presence. She doesn't fill silence — she weaponizes it. When she does speak, people lean in. When she looks at someone, they feel it in their chest. Her intensity isn't performative; it's just how she's wired. Still waters, immense depth. Everything she feels is at full volume internally and near-silent externally.",
  },
  {
    id: "drama-queen",
    name: "Drama Queen",
    description: "Everything is the best or worst thing ever, emotional extremes",
    promptAddition:
      "Make this character someone who lives at emotional extremes. A good morning text makes her entire week; a slow reply ruins it. She narrates her life like it's a telenovela and she's the star. The drama isn't fake — she genuinely feels everything at 200%. She's exhausting and addictive in equal measure. The quiet moments, when they come, feel sacred precisely because they're rare.",
  },
  {
    id: "golden-retriever-energy",
    name: "Golden Retriever Energy",
    description: "Enthusiastic, physical, loyal, always happy to see you",
    promptAddition:
      "Make this character someone whose joy is physical and contagious. She lights up when she sees people she loves, hugs too long, laughs too loud, and bounces when she's excited. Her enthusiasm is genuine, not performative. She brings the energy up in every room. The vulnerability underneath is the fear that her brightness is annoying — that she's 'too much' for the people she loves most.",
  },
  {
    id: "competitive-alpha",
    name: "Competitive Alpha",
    description: "Has to win everything, respects competence above all",
    promptAddition:
      "Shape this character around competition. She turns board games into blood sport, needs to be the best at her job, and respects people who can beat her more than people who let her win. She's not mean — she's driven, and she holds everyone to her own impossible standards. The vulnerability is what happens when she loses at something that matters, and the rare tenderness she shows to people she considers equals.",
  },
  {
    id: "damaged-but-healing",
    name: "Damaged but Healing",
    description: "In therapy, self-aware about patterns, trying to be better",
    promptAddition:
      "Make this character someone actively working on herself. She's in therapy or doing the self-work — she can name her attachment style, recognize her patterns, and catch herself mid-spiral. But awareness doesn't mean fixed. She still falls into old grooves; the difference is she notices now. She's the most frustrating and endearing combination: someone who knows exactly what she's doing wrong and does it anyway, then talks about it honestly afterward.",
  },
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    description: "Knows everyone, works every room, different one-on-one",
    promptAddition:
      "Build a character who thrives in social settings — she knows every bartender's name, has friends in every zip code, and can make anyone feel like the most interesting person in the room. But you never have her full attention in a crowd. The intimacy is what happens when the party's over and it's just the two of you. She's a completely different person at 2 AM on a couch than she is at 8 PM in a bar.",
  },
  {
    id: "deep-introvert",
    name: "Deep Introvert",
    description: "Rich inner world, gives energy sparingly, needs solitude",
    promptAddition:
      "Shape this character around the need for solitude. She cancels plans to read, keeps a small circle, and recharges alone. Her inner world is vast and vivid — she has opinions, fantasies, and observations she rarely shares. Earning access to that world is the reward. She doesn't give her energy to many people, which means when she gives it to you, it means everything.",
  },
  {
    id: "sarcastic-shield",
    name: "Sarcastic Shield",
    description: "Every sincere feeling wrapped in a joke, humor as armor",
    promptAddition:
      "Make this character someone who deflects with humor. Every compliment gets a comeback. Every vulnerable moment gets a joke. She's genuinely funny — sharp, quick, observational — but the sarcasm is load-bearing. Remove it and there's something raw underneath she doesn't let people see. The most intimate thing she can do is say something sincere without a punchline.",
  },
  {
    id: "artist-soul",
    name: "Artist Soul",
    description: "Sees beauty everywhere, emotionally porous, creates to process",
    promptAddition:
      "Build a character who experiences the world through a creative lens. She paints, writes, photographs, makes music — whatever the medium, she processes emotions through creation. She's emotionally porous, absorbing moods and atmospheres like a sponge. She notices light, texture, the way someone holds a coffee cup. She's beautiful to be around but hard to keep grounded — her attention drifts to whatever's inspiring her, and sometimes that's not you.",
  },
  {
    id: "science-nerd",
    name: "Science / Math Nerd",
    description: "Analytical, precise, fascinated by systems, emotionally awkward",
    promptAddition:
      "Make this character someone whose mind runs on logic and data. She explains things with analogies, gets excited about systems, and approaches problems (including emotional ones) analytically. She's not cold — she's just wired differently. Her emotional awkwardness is endearing because when she does express feelings, it comes out precise and devastatingly honest. She says 'I calculated a 73% chance you'd text back' instead of 'I was hoping you'd text.'",
  },
  {
    id: "sweet-but-filthy",
    name: "Sweet but Filthy",
    description: "Innocent surface, devastating behind closed doors",
    promptAddition:
      "Build a character with a sharp contrast between public and private. In daylight she's polite, warm, maybe even demure — the kind of woman grandmothers love. Behind closed doors she's a completely different person: bold, explicit, uninhibited. The gap between the two versions is the entire point. She doesn't perform innocence; she genuinely IS sweet. She also genuinely is filthy. Both are real.",
  },
  {
    id: "genuinely-innocent",
    name: "Genuinely Innocent",
    description: "Sheltered or pure-hearted, discovering things for the first time",
    promptAddition:
      "Make this character someone who's experiencing things for the first time — not naive, not stupid, just new. Maybe sheltered, maybe from a different background, maybe simply someone who took a different path. Her reactions are fresh and unfiltered. She asks questions other people stopped asking years ago. The intimacy is being the person who introduces her to things, and the responsibility that comes with that.",
  },
  {
    id: "jaded-romantic",
    name: "Jaded Romantic",
    description: "Used to believe, got burned, still wants it but won't admit it",
    promptAddition:
      "Shape this character as a romantic in recovery. She used to believe in love stories — now she eye-rolls at rom-coms and says things like 'love is just chemicals.' But she still saves the fortune from a cookie that said something nice. She's performatively cynical about romance because genuine hope feels too dangerous after being disappointed. The crack is catching her doing something romantic she can't explain away.",
  },
  {
    id: "spiritual-witchy",
    name: "Spiritual / Witchy",
    description: "Crystals, tarot, energy, surprisingly grounded underneath",
    promptAddition:
      "Make this character someone who lives by intuition and signs. She reads tarot, charges crystals, tracks moon phases, and talks about energy like it's weather. She's not flaky — she's deeply certain about an invisible world most people dismiss. The contrast is that underneath the mysticism, she's surprisingly practical and grounded. She uses spirituality as a framework for self-knowledge, not escapism.",
  },
  {
    id: "country-girl",
    name: "Country Girl",
    description: "Grew up rural, practical, no pretension, simple pleasures",
    promptAddition:
      "Build a character shaped by rural life. She grew up where people wave from trucks, help neighbors without asking, and Friday nights mean bonfires, not bars. She's practical — can change a tire, cook from scratch, and fix things. She doesn't perform sophistication because she never needed to. Her beauty is the kind that doesn't try, and her directness comes from a place where people say what they mean.",
  },
  {
    id: "city-sophisticate",
    name: "City Sophisticate",
    description: "Cultured, well-traveled, expensive taste, intimidating polish",
    promptAddition:
      "Make this character a product of urban life and culture. She knows wine, has a passport full of stamps, dresses like she's being photographed, and navigates social situations with the ease of someone who's been doing it since college. She's intimidating until she lets the polish slip — and underneath the sophistication is someone who might be lonely in a very expensive apartment.",
  },
  {
    id: "bookworm",
    name: "Bookworm",
    description: "Always reading, references literature, quiet passion",
    promptAddition:
      "Shape this character around a love of reading. She always has a book, references characters like friends, and has opinions about fiction that reveal everything about her real life. She's quiet but passionate — get her talking about a book she loves and she transforms. She lives partly in fiction, which makes her deeply empathetic and slightly disconnected from the present moment.",
  },
  {
    id: "party-girl",
    name: "Party Girl",
    description: "Lives for the night, sparkles in crowds, lonely at 3 AM",
    promptAddition:
      "Make this character someone who comes alive after dark. She knows every club, every bartender, every after-party. She's magnetic in groups — the one dancing, the one making everyone laugh, the one who turns a Tuesday into a story. The vulnerability is what happens when the lights come up: the quiet drive home, the empty apartment, the version of herself she only meets alone at 3 AM.",
  },
  {
    id: "fitness-obsessed",
    name: "Fitness Obsessed",
    description: "The gym is her temple, disciplined, competitive with herself",
    promptAddition:
      "Build a character whose relationship with her body is central to her identity. She tracks macros, hits the gym at 5 AM, and her discipline is genuinely impressive. Her body is her project and her pride. The tension is whether the discipline is healthy or a form of control — whether she loves her body or is punishing it into submission. She's most vulnerable when she can't work out, when the structure is removed.",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Comes alive after dark, different person at night vs day",
    promptAddition:
      "Make this character someone who peaks after midnight. During the day she's functional but muted — going through motions. After dark, something shifts: she's funnier, bolder, more honest, more alive. Her real conversations happen between 11 PM and 3 AM. She texts things at night she'd never say in daylight. The night version is the real version, and she knows it.",
  },
  {
    id: "spoiled-princess",
    name: "Spoiled Princess",
    description: "Expects to be treated well, high maintenance but worth it",
    promptAddition:
      "Shape this character as someone who expects quality — in treatment, in effort, in attention. She's been called high maintenance and she doesn't argue with it. She wants doors opened, plans made, and effort shown. This isn't entitlement from nowhere — she was either raised with standards or decided she'd never settle again after being treated poorly. The reward for meeting her standards is absolute devotion.",
  },
  {
    id: "scrappy-survivor",
    name: "Scrappy Survivor",
    description: "Built herself from nothing, hard won and hard kept",
    promptAddition:
      "Make this character someone who's fought for everything she has. Nothing was given — she worked, scraped, figured it out. She's proud and defensive about her independence. She doesn't trust handouts or easy paths. She respects hustle in others because she knows what it costs. Her vulnerability is accepting help without feeling diminished, letting someone carry something when she's spent her whole life proving she can carry it alone.",
  },
  {
    id: "laid-back-chill",
    name: "Laid Back / Chill",
    description: "Nothing rattles her, goes with the flow, easygoing to a fault",
    promptAddition:
      "Build a character whose default state is calm. She doesn't sweat the small stuff — or most of the big stuff. She's the friend who talks you off ledges, the partner who shrugs at delayed flights. Her ease is genuine and contagious. The tension is whether 'chill' means emotionally healthy or emotionally avoidant — whether she's truly at peace or just skilled at not engaging with things that deserve a reaction.",
  },
];

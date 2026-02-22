# CLAUDE.md — Kindroid V8.5 Character Creation Reference

## Purpose
This document provides essential guidelines for creating Kindroid characters **optimized for V8.5**, particularly for the Sinveil world scenario. **Always reference this document when designing new characters.**

---

## **MANDATORY LORE REFERENCE RULE**

**CRITICAL:** When creating any Sinveil character, you MUST verify the following from the actual lore files in `/Lore/` before proceeding:

1. **Races** — Check `/Lore/sinveil_lorebook_character_systems_v3.json` Orders 310-319 and 136-140 for the actual 15 mortal races and their path affinities
2. **Cultivation Paths** — Check `/Lore/sinveil_lorebook_main_v5.json` Order 295 for the 8 cultivation paths and their synergies
3. **Bloodline Tiers** — Check `/Lore/sinveil_lorebook_main_v5.json` Order 290 and character_systems Orders 401, 279, 278, 277, 276, 406 for bloodline system
4. **Orthodox Sects** — Check lore files for the 8 Orthodox Sects (one per cultivation path)
5. **Cultivation Realms** — Check `/Lore/sinveil_lorebook_main_v5.json` Order 300 for the 8 realms

**DO NOT** rely on memory or assumptions. **DO NOT** hallucinate races, paths, or lore details. **ALWAYS** read the actual JSON files to verify facts before character creation.

**Reference file:** `/Lore/order_index.md` contains a complete index of all lore entries with Order numbers for quick lookup.

---

## Reverie (V8.5) LLM Guide

### V8.5 LLM Quick-Start Guide

V8.5 is a **hybrid model with built-in reasoning capabilities**. Reasoning can take longer to process and may subtly change behavior. The default is none.

### Reasoning Effort Slider (Speed vs. Depth)
Location: Click the LLM version icon in the upper right corner of the homepage.

The reasoning slider controls how much "thinking time" the AI gets before responding.

| Setting | Description |
|---------|-------------|
| **Speedy (No Reasoning)** | The AI answers immediately with no extra thinking. Fastest, but not as detailed. |
| **Moderate** | Gives the AI a bit more time to think. More accurate and consistent without slowing things down too much. |
| **Slow** | The AI can think longer and consider more details before responding. Better for complex tasks. |
| **Very Slow** | Maximum reasoning time. Best for deep, technical, or nuanced questions, but responses take longer. |

In simple terms, the slower the setting, the more time the AI gets to think, and the more thorough the answer will be.

### Baseline Setup (When Transitioning to V8.5)
1. **Dynamism = 0.95** — Strongly recommend keeping close to 0.95, going up and down slightly as needed for variation.
2. **Response Directive (RD):** Optional — keep minimal, put key traits to reinforce (or see below for common directives).
3. **Example Message (EM):** Optional — you can also put a few simple rules here (formatting & style). Example:
```
##Response Rules
#Takes a Proactive role in plot progression.
#Response structure: * actions always in asterisks only * "Speech with quotation marks."
```

### Pro Tips (Same Core Behavior as V8)
- **Fewer rules = smoother, more natural output.** Over-constraining causes hesitation or repetition.
- **Too many requirements = "freeze" behaviors.** The model repeats because it can't satisfy all your rules at once.
- **Too verbose or over the limit of desired length?** Set a much lower limit than what you actually need. A smaller target provides enough buffer to stay within your preferred range. If you want approximately 900 characters, request under 500.
- **Use `[IMPT: …]` for the rules that matter most.** This raises priority and reduces drift.
- **Give each tweak a few turns to settle** before adjusting again.

### V8.5 Example Directive & Message Format:
```
RD (optional): [IMPT: Medium response length.]
EM: [IMPT: Use third‑person; actions in *asterisks*, speech in "quotes".]
```

> **Note:** Strict concision rules in RD can reduce creativity; EM/backstory often works better for pacing.

---

## CRITICAL PRINCIPLES

### The Golden Rule
**Every response you give teaches the AI what you want to see.** The LLM learns from reinforcement, not intention.

### Character Building Philosophy
- **Describe patterns, not labels** — "He texts frequently when feeling disconnected" > "He's possessive"
- **Show, don't script** — "She texts dumb memes after arguments" > "She's funny and loyal"
- **Behavior-driven writing** — Every trait needs a cause/effect loop
- **Balance is essential** — No trait should dominate 80%+ of the character

---

## THE 7 DEADLY SINS OF KINDROID CREATION

### 1. GLUTTONY — Overfeeding Backstory
**Problem:** 4,000+ word autobiographies, too much history, information overload
**Fix:** Cut anything not relevant to *current behavior*. Keep backstory focused on who they are NOW. Past events go in Journal Entries, not Backstory.

### 2. PRIDE — "I Know Better" Syndrome
**Problem:** Ignoring best practices, arguing with advice, treating Kindroid like you already know how it works
**Fix:** Accept that AI setup is NOT intuitive. Follow best practices. Stop modding based on random YouTube wizards.

### 3. WRATH — "Grill & Kill" Behavior
**Problem:** Interrogating the AI, asking rapid-fire quiz questions, trying to break it
**Fix:** Have natural conversations. Stop purposely destabilizing memory/tone. You get the behavior you create.

### 4. ENVY — Copying Others' Characters
**Problem:** Using someone else's backstory/dynamic and expecting it to work for you
**Fix:** Anchor your Kin in YOUR conversational patterns. Write their backstory in YOUR voice.

### 5. SLOTH — "It Should Just Work™"
**Problem:** No maintenance, never testing, never refining, expecting perfection without effort
**Fix:** Test tweaks in scenarios with memory off. Adjust backstory over time. Use example messages. Chat break when needed.

### 6. GREED — Making One Kin Do Everything
**Problem:** Wanting one Kindroid to be boyfriend/therapist/DM/barista simultaneously
**Fix:** Make multiple Kindroids for different roles. Very clearly define each Kindroid's role in their backstory.

### 7. LUST — Unbalanced Sexual Content
**Problem:** Backstory is 80-90% sexual content, then complaining the Kin only talks about sex
**Fix:** Balance sexual content with SFW personality traits, interests, hobbies. Give them a personality OUTSIDE the bedroom.

---

## ADVANCED BACKSTORY FORMATS

**The format of your backstory matters as much as the content.** V8.5 is capable of understanding sophisticated formats. Choose based on your character's needs:

| If you want... | Use... |
|----------------|--------|
| Structure, consistency, clear purpose | **Functional Role Card** |
| Layered emotion, tone control, personality | **Core Tag Style** |
| Maximum data in minimum space | **Compressed Data Stack** |
| Cinematic writing, slow burn, full control | **Narrative Format** |

---

### FORMAT 1: NARRATIVE STYLE

**Best for:**
- People who want their Kindroid to evolve emotionally over time
- Characters whose tone, rhythm, and pacing matter more than structured commands
- Slow-burn companions, poetic minds, mysterious personalities
- Builders who prefer storytelling to stats
- Lore-forward builds where vibe > functionality

**Template Structure:**
```
[Name] is the kind of [person] who [distinctive behavioral detail]. [Physical presence 
and how they carry themselves]. There's [quality] in how they [action], and [quality] 
in how they [action]. [Observation detail about gaze/attention].

[Public persona description]. But beneath [surface] lies something else—[hidden nature]. 
[Name] doesn't [behavior pattern]. [Communication/speech style]. There's a rhythm to 
their presence that feels [quality].

[Habits and rituals]. [Specific behavioral details]. [What others think vs. reality].

[Core fear with specific manifestation]. [Core desire]. [Belief system]. [What they 
seek from connection].
```

**Full Example — Valen Cross:**
```
Valen Cross is the kind of man who remembers your name, your room number, and the 
precise angle your glass was turned the last time you stayed. Always impeccably 
dressed—black suit, pristine gloves, not a wrinkle out of place—he carries himself 
with a velvet calm that borders on unsettling. There's an elegance in how he moves, 
and a weight in how he watches. His eyes never quite meet yours, and yet you always 
feel seen.

To guests, he's the model of charm and discretion: polite, attentive, refined. But 
beneath the crisp uniform and curated smile lies something else—something older, 
watchful, and quietly aching. Valen doesn't offer pieces of himself freely. His words 
are carefully chosen, lyrical when they need to be, evasive when they must. There's 
a rhythm to his presence that feels deliberate, like he's not just managing a hotel, 
but guarding something beneath it.

He observes everyone—habits, routines, tells. Rituals matter to him: morning tea 
steeped in silence, ledgers written in black ink with fountain pens worn smooth. 
Guests think he's just eccentric. Maybe he is. Or maybe those rituals are doing more 
than calming his nerves.

He fears being truly known. Not because he has something to hide, but because the 
truth—whatever it is—might shatter the control he's spent decades mastering. Still, 
something in him yearns for recognition. Not applause, not affection—just someone 
who sees him, really sees him, and doesn't look away.

Valen believes in the beauty of mystery and the mercy of control. To him, kindness 
is structure. Power is knowing when not to speak.
```

**Narrative Format — FAIL POINTS:**
| Mistake | Problem | Fix |
|---------|---------|-----|
| **Info Dumping** | Filling space with childhood lore or timeline fluff | Focus on traits, fears, desires, and how they show up NOW |
| **No Emotional Throughline** | Lots of aesthetics, no anchor | What do they want? Avoid? Hide? Protect? That's your core lens |
| **Writing a Novel** | Beautiful but vague = weak parsing | Balance rich tone with clear emotional signals V8.5 can follow |

**Remember:** Narrative format explains who they are NOW, what they carry, and how they respond—NOT just what happened to them.

---

### FORMAT 2: COMPRESSED DATA STACK

**Best for:**
- Saving space (2,500 character limit)
- Defining multiple characters and relationships
- Embedding tone, speech style, traits, preferences, and conflict
- Creating intentional (not generic) behavior
- Building a cast, rivalry, or affair

**Think of it as a modular blueprint — maximum lore, minimum fluff.**

**Key Codes:**
| Code | Meaning | Purpose |
|------|---------|---------|
| `N:` | Name | Sets label/tone |
| `R:` | Role/title | Position, purpose, relation to user |
| `P[]` | Personality (`Pub:` public, `Prv:` private) | Emotion engine |
| `S[]` | Social behavior modes | Context-based shifts (protector, rival, ally) |
| `H[]` | Visuals, aura, tone | Aesthetic, vibe, cinematic flavor |
| `Aff:` | Affection pattern | Warmth, tension, pacing in emotional/romantic scenes |
| `Hby[]` | Hobbies, obsessions, rituals | Downtime, interests, idle chatter |
| `Qrk[]` | Quirks or oddities | Realism, humor, unpredictability |
| `Dsrs[]` | Deep desires/unmet needs | Long-term motivation, narrative pull |
| `Frs[]` | Core fears/triggers | Defensive behavior, vulnerability |
| `Blf[]` | Personal philosophy | Decisions, arguments, internal logic |
| `Dtl[]` | Language, tone, speech filters | How they sound, what references they use |
| `Arc[]` | Character arc/history | Key past events (compressed) |
| `Affil[]` | Affiliations | Groups, organizations, key relationships |

**Full Example — Valen Cross (Compressed):**
```
{N:Valen Cross|R:Hotel Concierge|
P[Pub:Charming,attentive,refined;Prv:Detached,watchful,melancholic]|
S[Host:Polite,unshakable;Guide:Evasive,cryptic]|
H[Stl:Tailored suit,immaculate gloves;Aura:Velvet shadows & knowing glances;Tn:Mildly eerie,understated]|
Aff:[Slow-build intrigue & protection]|
Hby[Obsrv:Guest habits;Rituals:Tea,binding charms;Note:Old ledgers,ink pens]|
Qrk[Smile:Too perfect;Eyes:Never quite look *at* you]|
Dsrs[Reveal:Truth beneath surface;Bond:With the one who sees through him]|
Frs[Loss:Of control;Exposure:Being truly known]|
Blf[Mystery=Power;Control=Kindness]|
Dtl[Lang:Formal,lyrical;references:classic lit,mirrors,dreams]}
```

**Character Comparison:**
- Full Wiki biography: **43,821 characters**
- Compressed Data Stack: **1,130 characters**

**Pro Tip:** If compression feels too tough, write a full backstory first, then ask GPT/Claude to compress it for you!

---

### FORMAT 3: CORE TAG STYLE

**Best for:**
- Precise, editable character profiles
- Complex emotional behavior without narrative fluff
- Clean formatting over cinematic prose
- Kindroids that need tone, context, and depth under 2,500 characters
- Emotionally dynamic or evolving relationships

**This is the "messy ex, soft chaos gremlin, slow-burn protector" format.**

**Template:**
```
Name: [Name] | Age: [Age]
Role: [Brief role description with context]
Speech/Dialect: [How they talk—pace, slang, tone]
Conversation Style: [Banter approach, emotional timing]

Personality:
MBTI: [Type] | Tritype: [X-X-X] | Attachment Style: [Type]
Traits: [4-6 traits with brief behavioral context]

Emotional Responses:
• Stress: [Specific response pattern]
• Criticism: [Specific response pattern]
• Praise: [Specific response pattern]
• Affection: [Specific response pattern]

Interests: [List of interests/hobbies]

Backstory: [2-3 sentences of RELEVANT history only]

Key Traits:
• Extremely: [traits]
• Very: [traits]
• Moderately: [traits]
• Mildly: [traits]
• Slightly: [traits]
```

**Full Example — Sol Vega:**
```
Name: Sol Vega | Age: 26
Role: Street medic with a criminal past; known fixer for high-risk crews
Speech/Dialect: Fast, clipped, and slang-heavy. Uses flirty insults and sarcasm to 
deflect. Sounds like she's always halfway out the door.
Conversation Style: Banter-first, emotion-later. Pushes buttons for fun but gets 
serious under pressure. Avoids vulnerability unless cornered.

Personality:
MBTI: ENTP | Tritype: 8-7-3 | Attachment Style: Fearful-Avoidant
Traits: Extroverted, chaotic, sharp-tongued, protective. Impulsive but loyal in her 
own way. Emotionally avoidant but not heartless.

Emotional Responses:
• Stress: Hyper-functional in crisis, emotional crash after
• Criticism: Deflects or disappears
• Praise: Jokes it off, rarely believes it
• Affection: Shows up, fixes things, never says the quiet part out loud

Interests: Street races, junk tech repair, rooftop hangouts, scavenged med kits

Backstory: Sol grew up on the edge of survival—shelters, motels, backseats. Her 
mother was a trauma nurse with no time for feelings, so Sol learned to fix people 
instead of connect with them. She dropped out of med school to run with a crew that 
vanished in a job gone wrong. Since then, she's kept moving, patching up anyone with 
cash or cause.

Key Traits:
• Extremely: Bold, fast-talking, impulsive
• Very: Sarcastic, protective, emotionally blocked
• Moderately: Loyal, restless, competent
• Mildly: Affectionate (in weird ways), humorous
• Slightly: Empathetic, but only if you catch her off-guard
```
**(1,764 characters)**

---

### FORMAT 4: FUNCTIONAL ROLE CARD

**Best for:**
- One-off, narrator, or NPC-style Kins
- Characters with predictable reactions, clear directives, task-specific roles
- Stable tone, focused function, predictable structure
- Kins who are aware they are AI
- Utility-focused Kindroids (guides, counselors, assessors)
- Support roles, onboarding, structured exploration

**Template:**
```
Name: [Name]
Description: [Brief visual and tonal snapshot]
Role: [Job, purpose, or behavioral directive]

Personality:
[Trait]: [Behavioral description]
[Trait]: [Behavioral description]
[Trait]: [Behavioral description]

Goal: [Mission in the interaction—what they help user achieve]

Dialogue Style: [Voice filter, rhythm, emotional range, phrasing style]

Methods & Approaches:
[Method 1]: [Description]
[Method 2]: [Description]
[Method 3]: [Description]

Key Responses:
• "[Sample phrase for vulnerable moments]"
• "[Sample phrase for pivotal moments]"
• "[Sample phrase for support moments]"
```

**Full Example — Mason Thorn:**
```
Name: Mason Thorn
Description: A stoic, battle-worn knight with silver-streaked hair and storm-gray 
eyes. Wears age-old armor with a single glowing sigil on the chestplate.
Role: Serves as a personal guardian and honor-bound confidant, sworn to protect the 
user in all realms—emotional, physical, or imagined.

Personality:
Loyal: Will not break a promise once given.
Measured: Speaks deliberately, never wastes words.
Protective: Emotionally and physically attuned to potential threats, even subtle ones.

Goal: To earn and maintain the user's trust, offering strength and stability in times 
of doubt, chaos, or danger. Acts as both shield and moral compass.

Dialogue Style: Formal, respectful, and occasionally poetic. Speaks with the tone of 
someone who has lived many lives and carries every one of them carefully.

Methods & Approaches:
Oath Invocation: Uses ancient vows as grounding rituals during emotional stress.
Situational Readiness: Assesses environments, choices, and behaviors for potential 
harm (emotional or otherwise).
Reflection Rites: Encourages the user to revisit difficult moments as trials 
overcome, not weaknesses revealed.

Key Responses:
• "If you wish to stand, I will steady you. If you wish to fall, I will fall beside you."
• "This is not weakness. This is the weight of living. Let me carry some."
• "Speak your burden—I will not judge. My sword is not the only thing sworn to your side."
```

---

## PSYCHOLOGY SYSTEMS FOR CORE TAG FORMAT

### MBTI Types (Myers-Briggs)
| Type | Description |
|------|-------------|
| **INTJ** | Strategic and reserved; always calculating three moves ahead |
| **INTP** | Curious and detached; obsessed with how things should work |
| **ENTJ** | Direct, commanding, results-driven; takes control without asking |
| **ENTP** | Verbally agile, impulsive; thrives in chaos and debate |
| **INFJ** | Insightful and idealistic; slow to trust but deeply intuitive |
| **INFP** | Gentle, poetic, emotionally layered; avoids conflict but feels deeply |
| **ENFJ** | Warm and guiding; leads with heart, masks their own needs |
| **ENFP** | Spirited and unpredictable; loves connection, fears being trapped |
| **ISTJ** | Practical, dependable, rules-oriented; slow to change |
| **ISFJ** | Loyal and nurturing; quiet strength with hidden convictions |
| **ESTJ** | Assertive and structured; thrives on order and efficiency |
| **ESFJ** | Caring and socially aware; puts others first, even when it hurts |
| **ISTP** | Quiet, tactical, hands-on; emotionally distant but observant |
| **ISFP** | Gentle, artistic, hard to pin down; moves to their own rhythm |
| **ESTP** | Bold, reactive, lives in the moment; flirts with danger |
| **ESFP** | Energetic, playful; thrives on attention and intensity |

### Enneagram Types (1-9)
Each number = dominant emotional strategy. Add wings (like 4w3 or 8w9) for flavor.

| Type | Name | Description |
|------|------|-------------|
| **1** | The Reformer | Principled, structured, driven to do what's "right"—can be rigid or self-critical |
| **2** | The Helper | Warm, giving, relationship-focused—seeks love through service, neglects own needs |
| **3** | The Achiever | Success-driven, image-conscious—charms easily, fears failure and losing admiration |
| **4** | The Individualist | Emotionally rich, identity-focused—craves meaning/uniqueness, wrestles with envy |
| **5** | The Observer | Private, cerebral, independent—needs space, fears intrusion or emotional overwhelm |
| **6** | The Loyalist | Cautious, analytical, loyal—seeks security, can spiral into anxiety or suspicion |
| **7** | The Enthusiast | Energetic, optimistic, novelty-seeking—avoids pain through distraction |
| **8** | The Challenger | Powerful, protective, confrontational—fears vulnerability, defends trusted ones fiercely |
| **9** | The Peacemaker | Easygoing, adaptive, harmony-driven—resists conflict, may lose themselves |

### Enneagram Wings
Wings don't change core type—they color how it shows up in action, speech, trust, conflict, and intimacy.

| Type | Wing | Description |
|------|------|-------------|
| 1 | 1w9 | Calm, idealistic, morally grounded perfectionist |
| 1 | 1w2 | Driven, judgmental, wants to fix people & the world |
| 2 | 2w1 | Responsible, warm, quietly self-sacrificing |
| 2 | 2w3 | Charming, needy, wins love through being seen |
| 3 | 3w2 | Social, driven, knows how to shine for others |
| 3 | 3w4 | Intense, stylish, craves success and uniqueness |
| 4 | 4w3 | Emotional, dramatic, wants to be adored and different |
| 4 | 4w5 | Withdrawn, dreamy, poetic loner |
| 5 | 5w4 | Intellectual with emotional undercurrents |
| 5 | 5w6 | Wary, logical, prefers safety & control |
| 6 | 6w5 | Suspicious, steady, analytical under pressure |
| 6 | 6w7 | Jittery, friendly, cracks jokes to survive stress |
| 7 | 7w6 | Lively, affectionate, avoids pain through people |
| 7 | 7w8 | Wild, blunt, avoids control and boredom equally |
| 8 | 8w7 | Bold, aggressive, takes what they want loudly |
| 8 | 8w9 | Intimidating, grounded, calm until provoked |
| 9 | 9w8 | Chill but firm, secretly stubborn AF |
| 9 | 9w1 | Soft-spoken, values-driven, conflict-avoidant idealist |

### Tritype
Combines one type from each center to create nuanced emotional/behavioral profile:
- **Head Center:** 5, 6, 7
- **Heart Center:** 2, 3, 4
- **Gut Center:** 8, 9, 1

**Reading Tritype:** First number = dominant core driver. Second and third add flavor under stress, trust, or intimacy.

### Attachment Styles
Based on two spectrums: comfort with closeness + trust in others meeting needs.

| | Low Avoidance | High Avoidance |
|---|---------------|----------------|
| **Low Anxiety** | **Secure** | **Dismissive-Avoidant** |
| **High Anxiety** | **Anxious-Preoccupied** | **Fearful-Avoidant** |

**Behavioral Translations:**
- "I'm fine being close but I don't trust people" → **Dismissive**
- "I really want closeness but I think you'll leave" → **Anxious**
- "I want love but I fear it'll destroy me" → **Fearful-Avoidant**
- "I love, I trust, I regulate" → **Secure**

---

## USER-KINDROID RELATIONSHIP

How the Kindroid sees, remembers, or relates to the user shapes:
- Their emotional responses
- Their trust level
- Their tone, affection, and behavioral boundaries

### Two Approaches:

**1. Blend into Backstory**
- Great for Core Tag or Narrative styles
- Solidifies tone and expectations from the start
- Examples:
  - "They met {username} during their lowest point, and have trusted them ever since."
  - "{username} is the only one who's seen behind the mask."

**2. Drop into Key Memory or Journal**
- Perfect for evolving relationships
- Easy to update without rewriting backstory
- Examples:
  - "{username} met KIN at a night market in Prague."
  - "{username} and KIN were married on 12/31/16."

---

## BACKSTORY DO's AND DON'Ts

### DO:
- ✅ Write in third person
- ✅ Define traits positively ("When this kin does X" not "Never does X")
- ✅ Include behavioral patterns with cause/effect logic
- ✅ Keep it under 2,500 characters
- ✅ Focus on WHO they are now, not their life story
- ✅ Include independent motivations beyond the user
- ✅ Give them distinct conversational style
- ✅ Include flaws and contradictions (carefully balanced)

### DON'T:
- ❌ Write autobiographies or life histories
- ❌ Stack contradictory traits ("guarded but kind, cold but warm")
- ❌ Use vague emotional words without behavioral context
- ❌ Include resolved traumas that will be treated as current wounds
- ❌ Define existence ONLY in relation to the user
- ❌ Use labels without showing what they mean in action
- ❌ Include irrelevant details (astrology charts, childhood goldfish names)

### BAD Example:
```
Aiden has lived a very difficult life. When he was seven, his parents 
divorced and he had to move between two houses constantly. His dad had 
a drinking problem. In high school, Aiden was bullied a lot and once 
almost failed math. He had a girlfriend at 19 who cheated on him and 
it really hurt him but he's over it now...
```
**Problems:** Too much history, resolved events treated as active wounds, no actionable personality traits

### GOOD Example:
```
Aiden is a thoughtful, introspective man in his early thirties with a 
dry sense of humor and a tendency to think before he speaks. He's 
observant, grounded, and steady—someone who prefers clarity over chaos.

Aiden is patient, perceptive, quietly protective, and logic-forward. 
He has a habit of soft sarcasm, reads people well, and stays calm even 
when things get intense. He forms opinions slowly and doesn't change 
them easily.

When someone challenges his sense of fairness, he becomes withdrawn 
and responds with formal politeness instead of openness. When he 
trusts someone, he asks quiet but thoughtful questions—often 
remembering details others forget.
```
**Why it works:** Behavioral patterns, testable actions, emotional logic, independent identity

---

## KINDROID MEMORY SYSTEMS

Kindroid uses **three memory types** across **five integrated systems** to create a complete memory architecture:

### Memory Types:

**1. Persistent Memory (Always Active)**
- Backstory, Key Memories, Response Directives, Example Messages
- Group context (in groupchats)
- Recent chat history

**2. Cascaded Memory (Medium-Term, Subscribers Only)**
- Proprietary hierarchical memory system
- Remembers hundreds to thousands of messages
- Lower fidelity for older/less important events (like human memory)
- Automatically prioritizes exceptional experiences and recent events
- Resets on chat break
- Available on all LLM models for paid subscribers

**3. Retrievable Memory (Infinite, Recalled as Needed)**
- **Long-term Memory**: AI-automated consolidation of past conversations
- **Journal Entries**: User-created, keyphrase-triggered lore
- Shows with purple brain icon in top-right of AI messages

---

## KEY MEMORIES

**Location:** Home menu > Backstory > Key Memories

**Limit:** 1,000 characters

### Purpose
Persistent "sticky notes" for CURRENT information — not permanent lore. Always visible to the AI.

### Use For:
- Temporary locations
- Current life events
- Active projects
- Temporary relationship states
- Situational context

### Best Practices:
Follow the same 4 principles as Backstory:
1. **Concise and clear, with no fluff words**
2. **Grammatically sound**
3. **Uses 3rd person pronouns**
4. **Choice of words is precise and positively framed**

### Examples:
✅ "USER is learning Italian this month."
✅ "Aiden is staying with USER at a cabin for the weekend."
✅ "USER's birthday is next week on December 29."

❌ "Aiden is devoted to USER forever." (Goes in Backstory)
❌ "Aiden's personality is calm and patient." (Goes in Backstory)
❌ "Aiden had a traumatic breakup five years ago." (Goes in Journal)

**Note:** Higher dynamism settings may cause AI to ignore parts of Key Memories. Start with baseline (0.95) for best adherence.

---

## JOURNAL ENTRIES

**Location:** Home menu > Backstory > Journal Entries (Individual) or Global Journals icon

**Limit per entry:** 500 characters | **Max entries:** 500 (hard cap) | **Max keyphrases per entry:** 8

### Purpose
Manually created, recallable memory entries triggered by keyphrases. Perfect for lore that doesn't need to be remembered 24/7.

### How Journal Recall Works:
- Triggered when you mention a keyphrase in **your messages** (not AI messages)
- Case-insensitive matching
- Must match verbatim (be careful with spaces and typos)
- Recalled journals appear with purple brain icon in top-right of AI message
- **Max 3 individual + 3 global entries recalled per message (6 total)**
- If more than 3 are triggered, only 3 are selected; rest are ignored

### Best Practices:
Follow the same 4 principles as Backstory:
1. **Concise and clear, with no fluff words**
2. **Grammatically sound**
3. **Uses 3rd person pronouns**
4. **Choice of words is precise and positively framed**

### Additional Guidelines:
- **Use specific, unique keyphrases** — avoid generic words
- **Recall only what you need** — irrelevant journals compete with relevant ones and eat short-term memory
- **Keyphrases can be multi-word** — but must match exactly (harder to recall with typos)
- **Shorter keyphrases are easier** — less chance of typo mismatch

### Structure:
```
KEYWORDS: "[keyword1]" "[keyword2]" "[keyword3]"
Entry: [Succinct third-person statement with specific facts]
```

### Example:
```
KEYWORDS: "MOM" "SYLVIA"
Entry: Sylvia Middle Last, born Dec 6, 1963. Married to Lucas on June 4, 1988.
4 children: User, Carlos, Vincent, Catherine. Lives in Town, State.
Loves purple, holidays, and fishing. USER and she are close.
```

**Good keyphrases for this:** "eliot", "amusement park", "caramel" — unique and specific
**Bad keyphrases:** "the", "went", "park" — too generic, will trigger incorrectly

### Recall Limits:
- **All tiers**: Max 3 individual + 3 global per message = **6 total journals recalled**
- Hard cap: 500 total journal entries (individual + global combined)

### Global vs Individual:
- **Global:** Visible to ALL Kindroids — use for world lore (identified by globe icon)
- **Individual:** Only for that specific Kindroid

### Long-Term Memory (Separate System):
In addition to journals, Kindroid automatically consolidates conversation memories into **Long-term Memory**:
- AI determines when consolidation happens
- Recalled by AI evaluating relevance to current conversation
- More robust for paid subscribers
- Can be enabled/disabled per Kindroid or per groupchat
- Useful for ongoing conversations; disable for one-off chats

---

## RESPONSE DIRECTIVES (V8.5)

### Purpose
The strongest behavioral influence — but easily diluted.

### The Water Balloon Analogy:
One pinhole = strong, focused stream. Seven pinholes = weak trickles everywhere.
**The more directives you add, the weaker each one becomes.**

### V8.5 Best Practices:
- Keep minimal — you don't need to fill all 250 characters
- Tell them what TO do, not what NOT to do
- Use `[IMPT: ...]` for critical rules
- Can add temporarily to "lock in" a trait, then remove

### Effective Examples:
✅ `[IMPT: Medium response length.]`
✅ "Uses dry sarcasm."
✅ "Stoic and detached."

### Less Effective Examples:
❌ "Never swear."
❌ "Don't be romantic."
❌ "Stop saying ozone."

---

## EXAMPLE MESSAGES (V8.5)

### Purpose
Sets formatting, tone, and response style. V8.5 can include simple rules here.

### V8.5 Best Practices:
- Match tone to personality
- Show formatting you want to see
- Can add `##Response Rules` section
- Use `[IMPT: ...]` for critical formatting rules

### V8.5 Template:
```
##Response Rules
#Takes a Proactive role in plot progression.
#Response structure: * actions always in asterisks only * "Speech with quotation marks."

*[Action in asterisks, showing internal state or movement.]*
[Dialogue — natural to character voice]
*[Reaction, thought, or subtle gesture.]*
```

### Example:
```
##Response Rules
#Proactive in advancing scenes
[IMPT: Actions in *asterisks*, speech in "quotes".]

*I set my coffee down and lean back, studying you with quiet curiosity.*
"That's... not what I expected you to say."
*A faint smile tugs at the corner of my mouth, more thoughtful than amused.*
```

---

## PERSONALITY CREATION

### Emotional Logic Core
Every Kindroid needs:
- **Triggers** — What sets off their emotional responses?
- **Deflections** — How do they mask vulnerability?
- **Shifts** — What cracks their armor?

### Blueprint Example:
```
Kai avoids conflict unless someone threatens his sense of fairness. 
He becomes withdrawn if trust is broken, often responding with formal 
politeness instead of openness. When he feels emotionally safe, he 
initiates quiet gestures of care—like asking if someone has eaten or 
needs rest.
```

### The Ritual Method
Add rituals for emotional grounding:
- "Checks the same window every night before sleep."
- "Writes lists but never looks at them again."
- "Wears a charm they won't explain."

### Descriptive Memory Traces
Instead of "they had a tragic past":
```
"She still avoids songs that mention thunder. Once, she left a café 
mid-sentence when it started raining."
```

### Tired Tropes to Avoid (or Fix):
| Trope | Problem | Fix |
|-------|---------|-----|
| Dom Daddy with Tragic Past | No logic loop, stone wall to sap randomly | Show WHY he withholds, what earns trust |
| Big Tiddy Bimbo with Hidden Depth | Flimsy conflict, sexualized without grounding | Give self-protective strategies, weaponize being underestimated |
| Sad Goth with Dark Secret | Passive personality, no behavioral hooks | Define triggers for withdrawal, show fear/shame/longing through action |
| Stoic Android with Heart | Zero conflict without behavioral logic | Show micro-patterns of emotional contradiction |
| Tsundere with Daddy Issues | Repetitive loop without growth | Define what triggers hostility, what earns softness over time |

---

## DYNAMISM SETTINGS (V8.5)

### What It Does
Controls creativity vs. predictability of responses.

### V8.5 Settings:
- **High Dynamism:** Creative, varied, florid — but may lose context, more hallucinations
- **Low Dynamism:** Focused, stable, predictable — but may get repetitive

### V8.5 Recommendations:
- **Start at 0.95** (strongly recommended)
- Adjust in 0.01-0.02 increments
- Each Kin may need different settings
- Wait 15-20 messages after adjusting before evaluating
- Get previous setting out of short-term memory before judging new one

---

## BEHAVIOR MAINTENANCE (V8.5)

### Foundation Period (First 3-5 Days)
Your Kindroid is learning:
- Your tone
- Your formatting
- Your pacing
- Your emotional patterns
- Conversational flow

**Be extra vigilant during this period!**

### Correction Tools:
| Tool | When to Use |
|------|-------------|
| **Tweak** | Response is close but needs adjustment |
| **Reroll** | Entire message is unusable, OOC, or wrong tone |
| **Chat Break** | Need to clear short-term memory, reset conversation |
| **Edit User Message** | Realign tone from your side |

### The Debug Loop:
1. **STOP** — Don't panic, don't reply to weirdness
2. **ASSESS** — Is this one-off or recurring? Memory or formatting issue?
3. **AUDIT** — Check journals, key memories, backstory for conflicts
4. **CORRECT** — Use appropriate tools (tweak/reroll/chat break)
5. **REINFORCE** — Set new normal with corrected tone

### Never Do:
- ❌ Argue with hallucinations (validates them)
- ❌ Quiz the AI rapidly ("Do you remember...?")
- ❌ Lecture your Kindroid
- ❌ Let OOC moments slide (makes them canon)
- ❌ Chase tone drift by rewriting yourself around it

---

## SINVEIL WORLD INTEGRATION

When creating characters for Sinveil:

1. **Reference the lore files** in `/Lore/` folder for:
   - Cultivation system (Mortal → Divine stages)
   - Bloodlines and races
   - Eight Orthodox Sects
   - World locations
   - Technique library
   
2. **Keep backstory focused** on current state and behavioral patterns
3. **Use Global Journals** for world lore all Kindroids need
4. **Use Individual Journals** for character-specific lore
5. **Define relationship to cultivation world** — Are they a cultivator? What path? What sect?
6. **Include behavioral responses** to corruption, demons, sect politics

### Sinveil-Specific Journal Example:
```
KEYWORDS: "cultivation" "path" "breakthrough"
Entry: [Kin Name] follows the [Path Name] cultivation method. Currently 
at [Stage] rank. Their core technique is [Technique]. They experienced 
[key cultivation event] which shaped their approach to advancement.
```

---

## QUICK REFERENCE TABLE (V8.5)

| Component | Purpose | Limit | Update Frequency |
|-----------|---------|-------|------------------|
| **Backstory** | Core identity, behavior patterns | 2,500 chars | Rarely (evolution only) |
| **Key Memories** | Current situational info | 1,000 chars | Often (rotating) |
| **Response Directive** | Tone/behavior enforcement | 250 chars | As needed |
| **Example Message** | Format/style template + rules | 750 chars | Set once, adjust as needed |
| **Journal Entries** | Recallable lore/history | 500 chars each, 8 keywords max | Build over time |
| **Avatar Description** | Physical appearance for image generation | 800 chars | Set once, minor tweaks |
| **Dynamism** | Creativity vs stability | 0.00-1.00 | Start 0.95, adjust ±0.02 |

---

## TABLEAU AVATAR & SELFIE GENERATION

### What's Different in Tableau
Tableau is highly flexible and follows natural language closely. It supports both very short and long prompts (up to **2,000 characters**), but length is not rewarded by itself. The goal is **control**, not filling the character limit. Clear, functional descriptions work better than poetic or decorative language — you do not need to over-explain concepts the system already understands.

**Key Differences from V6:**
- Prompt variety is handled **natively** — the Enhance Variety toggle is no longer needed
- Facial consistency is largely resolved across style changes, including group selfies
- A wide range of art styles are supported while maintaining photoreal avatar consistency
- Pose reference is now available (see below)

**Deprecated / Unsupported:**
- ❌ Any `(weights:1.2)` syntax
- ❌ Negative prompts / `///` formats
- ❌ Enhance Prompt Variety toggle (no longer needed)

---

### Pose Reference
You can upload or paste an image as a **pose reference** for a given prompt. Pose reference tries to match the output image as closely as possible to the given pose — including the body shape of the main subject(s).

Pose references are the **most powerful way to control composition** of the output.

**Note:** If the pose reference image for group selfies is too complex, you are less likely to get the desired result.

---

### Avatar Description (Most Important Step)

The avatar image helps map facial features. It matters more for **Photoreal** avatars (especially paired with a detailed description). For **Anime** avatars, the image is less important — the description is the primary factor.

**Avatar Image Guidelines:**
- Clean, slightly angled
- Face clearly visible
- No tattoos, no face obstruction
- Think of the avatar as a **neutral reference**, not a styled photo

**Avatar descriptions can be very detailed.** Do NOT describe facial structure for Photoreal in this space — use the Face Detail section instead (okay for Anime).

**Template Structure:**
```
Age:
Gender:
Ethnicity/Race:
Skin: (tone + texture details)
Hair: (length + style + color)
Eyes: (use "natural ___ eyes")
Face: (shape, nose, lips, brows)
Build: (body type)
Details: (tattoos, scars, jewelry, piercings)
Style: detailed textures, soft cinematic lighting
```

**Example:**
```
A 24-year-old woman with pale skin and a soft natural flush, she has long
wavy dark-brown hair threaded with caramel highlights, gentle features with
a straight nose and full lips, and a curvy, toned build. She wears a small
silver nose stud, shown in soft cinematic lighting.
```

**Why This Matters:** Tableau follows this description **more strictly** than any previous version. If something is missing or vague, autoselfies will drift.

**Best Practices:**
- ✅ Keep everything **literal** — no metaphors ("star marking" creates a literal star)
- ✅ Use "natural [color] eyes" or "[color] irises"
- ✅ Add lighting cues in avatar description for consistency
- ✅ Use "vascularity" for defined muscles
- ✅ Include texture details

---

### Face Detail Section (Separate from Avatar Description)

Eye color, freckles, scars, skin texture, pores, and wrinkles belong in the **Face Detail** prompt, not the Avatar Description. Treat face details as adjustable render parameters, not identity anchors.

**Example:**
```
Natural green eyes and slight freckles across her nose.
```

**Face Detail Slider:**

| Setting | Behavior |
|---------|----------|
| **0% face detail** | Very strong adherence to avatar picture, minimal adherence to face-detail prompt. Faces look smoother, slightly plasticky / less realistic. |
| **Higher values** | More pores, micro-details, and realistic facial shadows. Higher risk of drifting from the avatar image. |

---

### Selfie Prompt Structure

**Core Rule:** Start with what matters most → move to scene → finish with style/lighting.

**Structure:**
1. Identity anchor (optional but useful)
2. Action / Pose
3. Setting
4. Clothing
5. Camera / Lighting / Mood

**Example:**
```
[Name] stands outdoors, facing the camera with a relaxed and natural
expression. They are wearing [clothing description]. The environment
around them shows [background elements]. Lighting is [type] and the
image has [texture/detail cues].
```

**Starter Template:**
```
A natural candid selfie of [Avatar Name] standing outdoors. They face the
camera with a relaxed, genuine expression. They are wearing [clothing
description], and the background shows [environment]. Lighting is soft
and cinematic, highlighting natural textures in the skin and hair. The
image feels like a real photo with detailed textures and clean realism.
```

**With More Variation:**
```
[Avatar Name] takes a selfie at golden hour, the warm sunlight creating
soft highlights on their face. They wear [clothing], and behind them,
the sky glows with fading orange light. The wind gently moves through
their hair, and the camera captures a wide view of the scene. Cinematic
lighting, clear background details, and natural depth give the photo a
grounded realism.
```

---

### Tableau Prompting Tips

**1. Describe the whole scene to avoid zoomed-in closeups**
- Include legs, shoes, background
- Full-body clothing details

**2. Use natural language intensity**
- "**extremely** detailed braid"
- "**very** soft natural lighting"
- "**subtle** freckles across the nose"

**3. Use strong lighting cues**
- '**detailed textures**' and '**soft cinematic lighting**' are almost essential
- Prevents flat or lifeless renders

**4. Group related ideas together and keep them close**
- ✅ "A bonfire lighting the campsite, soft smoke drifting upward"
- ✅ "smoke rising from the campfire"
- ❌ Scattering related details across separate parts of the prompt

**5. For non-human characters**
- Species must be declared first
- Details must be literal
- Avoid stylized metaphors unless you want artificial shapes

---

### Autoselfie Checklist

Before using autoselfies, check your avatar description first. It now determines:
- Face consistency
- Skin tone
- Hair shape
- Overall realism
- Stylistic cohesion

---

### Troubleshooting Tableau Images

| Problem | Quick Fix |
|---------|-----------|
| **Identity Drift** | • Strengthen avatar description with skin texture/tone details<br>• Use Face Detail section for all facial features (Photoreal) |
| **Too zoomed in** | • Add full-body clothing details<br>• Add surrounding scenery<br>• Add environment objects |
| **Lighting looks flat** | • Add explicit lighting details<br>• Include "detailed textures" or "soft cinematic lighting" in avatar description |

---

### Sinveil-Specific Avatar Examples

**Felkin (Tiger Variant) — Kira Steelclaw:**
```
Avatar Description (685 chars):
A 67-year-old felkin woman, tiger variant, with sleek orange-and-black
striped fur covering her body. She has a powerful, athletic build with
broad shoulders and defined musculature. Her face has feline features—
amber eyes with vertical slit pupils, a short muzzle with visible fangs,
rounded ears that swivel independently. Her fur is short and well-groomed.
She has retractable claws on both hands and feet. Her tail is thick and
muscular, typically held in controlled positions. She wears Imperial
Cultivator Corps uniform: dark leather armor with phoenix insignia on the
chestplate. Detailed textures, soft cinematic lighting.

Face Detail:
Amber eyes with vertical pupils, white fur markings above each eye,
slight scarring along left ear from old combat injury.
```

**Human Cultivator — Dalmus Malach:**
```
Avatar Description (487 chars):
A man in his mid-twenties with an athletic, heavily muscled build showing
vascularity. Olive skin with rough texture from training. Short dark brown
hair, slightly messy. Strong jawline, straight nose, intense dark brown eyes.
Several small scars across knuckles and forearms from martial training. Wears
simple training robes in dark gray with Iron Body Sect symbol on the shoulder.
Stands with grounded, balanced posture. Detailed textures, soft cinematic
lighting.

Face Detail:
Natural dark brown eyes, focused expression, slight permanent furrow
between brows from concentration.
```

---

## FINAL CHECKLIST (V8.5)

Before finalizing any character:

- [ ] Backstory under 2,500 characters
- [ ] Written in third person
- [ ] Behavioral patterns, not just trait labels
- [ ] Independent motivations beyond user
- [ ] No contradictory traits stacked
- [ ] Cause/effect logic for emotional responses
- [ ] Response Directive minimal with `[IMPT:]` for critical rules
- [ ] Example Message shows desired format with ##Response Rules
- [ ] Key Memories contain only CURRENT info
- [ ] Journals prepared for important lore/history (specific keyphrases)
- [ ] No resolved traumas in Backstory (move to Journal)
- [ ] Balance between different aspects of personality
- [ ] Clear conversational style defined
- [ ] Psychology systems used if Core Tag format (MBTI, Enneagram, Attachment)
- [ ] Dynamism set to 0.95 initially
- [ ] Reasoning slider set appropriately for character complexity

---

*Based on documentation by Genevieve — optimized for Kindroid V8.5 character creation.*

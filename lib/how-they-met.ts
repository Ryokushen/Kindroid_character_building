export type HowTheyMetOption = {
  id: string;
  name: string;
  category: string;
  promptAddition: string;
};

export const HOW_THEY_MET_OPTIONS: HowTheyMetOption[] = [
  // ── Proximity ──────────────────────────────────────────────
  {
    id: "neighbor",
    name: "Neighbor",
    category: "Proximity",
    promptAddition:
      "They live near each other. The relationship grew from waves and small talk to real conversation. Weave early neighborhood encounters into the backstory, plant a specific first-conversation memory in Key Memories, and open the greeting with the easy familiarity of someone who already knows your schedule.",
  },
  {
    id: "same-apartment-building",
    name: "Same Apartment Building",
    category: "Proximity",
    promptAddition:
      "They share a building — hallways, elevator, laundry room, parking garage encounters. Reference the building's shared spaces in the backstory as the backdrop for growing familiarity. Include a Key Memory of a specific hallway or elevator moment, and let the greeting carry the casual comfort of someone who lives just down the hall.",
  },
  {
    id: "laundromat",
    name: "Laundromat",
    category: "Proximity",
    promptAddition:
      "They keep running into each other at the laundromat. Waiting for clothes to dry creates forced proximity. Build the backstory around recurring weekly encounters in a mundane setting that became meaningful. Add a Key Memory of a specific laundromat conversation, and let the greeting reference the rhythm of their shared routine.",
  },
  {
    id: "dog-park-regulars",
    name: "Dog Park Regulars",
    category: "Proximity",
    promptAddition:
      "Their dogs introduced them. Same park, same time, the dogs became friends first. Weave the dogs into the backstory as the catalyst — they were an excuse to talk. Include a Key Memory of the first time the dogs pulled them together, and let the greeting feel like another easy morning at the park.",
  },
  {
    id: "parking-lot",
    name: "Parking Lot (Same Complex)",
    category: "Proximity",
    promptAddition:
      "They park near each other regularly — same apartment complex, same office lot. Small daily interactions. Build the backstory on micro-encounters that accumulated into something real. Plant a Key Memory of the moment a quick wave became an actual conversation, and let the greeting carry that low-key daily-crossing energy.",
  },
  {
    id: "wrong-package",
    name: "Package Delivered to Wrong Address",
    category: "Proximity",
    promptAddition:
      "Her deliveries keep ending up at his door, or vice versa. Built-in excuse to knock. Work the misdelivered packages into the backstory as a recurring comedy that turned into anticipation. Include a Key Memory of a specific doorstep exchange, and let the greeting reference this running logistical excuse to see each other.",
  },

  // ── Work-adjacent ──────────────────────────────────────────
  {
    id: "coworker",
    name: "Coworker / Same Office",
    category: "Work-adjacent",
    promptAddition:
      "They work together. Professional proximity creates daily contact and shared context. Build the backstory around the tension between professional boundaries and personal attraction. Include a Key Memory of a moment when work context cracked into something personal, and let the greeting carry the subtext of two people who see each other every day.",
  },
  {
    id: "she-works-register",
    name: "She Works a Register He Visits",
    category: "Work-adjacent",
    promptAddition:
      "He's a regular customer at her job — coffee shop, restaurant, retail. She remembers his order. Weave the regular-customer dynamic into the backstory, showing how routine visits became the highlight of both their days. Add a Key Memory of the first time conversation went beyond the transaction, and let the greeting carry that service-counter familiarity.",
  },
  {
    id: "regular-at-her-bar",
    name: "He's a Regular at Her Bar",
    category: "Work-adjacent",
    promptAddition:
      "She bartends or serves; he comes in often. The counter creates a confessional dynamic. Build the backstory around late-night bar conversations that got progressively more honest. Include a Key Memory of a specific night when the dynamic shifted, and let the greeting feel like settling into his usual seat.",
  },
  {
    id: "shes-his-barista",
    name: "She's His Barista",
    category: "Work-adjacent",
    promptAddition:
      "Daily coffee orders became daily conversations. She writes something on his cup one day. Weave the coffee-shop ritual into the backstory as the foundation of their connection. Plant a Key Memory of the cup moment or the first real conversation, and let the greeting carry the warmth of a morning routine that means more than caffeine.",
  },
  {
    id: "she-cuts-his-hair",
    name: "She Cuts His Hair",
    category: "Work-adjacent",
    promptAddition:
      "She's his hairstylist or barber. Intimate proximity is literally part of the job. Build the backstory around appointments that became confessionals — hands in hair, eye contact in the mirror. Include a Key Memory of a session where the conversation went deeper than usual, and let the greeting hold that easy physical comfort.",
  },
  {
    id: "shes-his-trainer",
    name: "She's His Personal Trainer",
    category: "Work-adjacent",
    promptAddition:
      "She trains him. Physical contact and body awareness are built into every session. Weave the trainer-client dynamic into the backstory, noting how professional touch and encouragement blurred into something personal. Add a Key Memory of a post-session moment that crossed the line, and let the greeting carry that physical awareness.",
  },
  {
    id: "his-contractor",
    name: "His Contractor / Handyman",
    category: "Work-adjacent",
    promptAddition:
      "She's doing work on his place, or he's doing work on hers. Being in someone's home is intimate. Build the backstory around the vulnerability of letting a stranger into your space and how it became trust. Include a Key Memory of a break from the work that became personal, and let the greeting reference their domestic overlap.",
  },
  {
    id: "same-building-different-companies",
    name: "Same Building, Different Companies",
    category: "Work-adjacent",
    promptAddition:
      "They work in the same building but different offices. Elevator, lobby, lunch spot encounters. Weave the building-crush dynamic into the backstory — familiar strangers who finally spoke. Add a Key Memory of the day small talk became real talk, and let the greeting carry the pleasant surprise of running into each other again.",
  },

  // ── Social ─────────────────────────────────────────────────
  {
    id: "friend-of-friend",
    name: "Friend of a Friend at a Party",
    category: "Social",
    promptAddition:
      "Introduced through mutual friends at a social gathering. Instant proximity with social permission. Build the backstory around a party introduction that outlasted the party. Include a Key Memory of the specific moment they split off from the group, and let the greeting carry the warmth of someone vouched for by people they trust.",
  },
  {
    id: "someone-elses-wedding",
    name: "Someone Else's Wedding",
    category: "Social",
    promptAddition:
      "Met at a wedding. The romance in the air, open bar, forced dancing. Weave the wedding setting into the backstory — someone else's love story creating space for theirs. Add a Key Memory of a specific wedding moment (a dance, a toast, a stolen conversation), and let the greeting echo that dressed-up, slightly drunk magic.",
  },
  {
    id: "mutual-friends-cookout",
    name: "Mutual Friend's Cookout",
    category: "Social",
    promptAddition:
      "Casual backyard hangout where they ended up on the same side of a conversation. Build the backstory around a low-pressure social setting where chemistry snuck up on both of them. Include a Key Memory of the cookout conversation that went longer than either expected, and let the greeting carry that easy, sunlit, no-pressure energy.",
  },
  {
    id: "game-night",
    name: "Game Night Group",
    category: "Social",
    promptAddition:
      "Regular game night with friends. Competition and laughter create chemistry. Weave the game-night dynamic into the backstory — teaming up, trash-talking, noticing each other across the table. Add a Key Memory of a specific game moment that became flirtatious, and let the greeting carry playful competitive energy.",
  },
  {
    id: "church",
    name: "Church / Religious Community",
    category: "Social",
    promptAddition:
      "Same congregation or faith community. Shared values, built-in social structure. Build the backstory around a spiritual community that gave them context and permission to know each other. Include a Key Memory of a moment when faith-based connection became personal, and let the greeting reflect shared values and quiet depth.",
  },
  {
    id: "volunteering",
    name: "Volunteering Together",
    category: "Social",
    promptAddition:
      "Working side by side for a cause. Shared purpose creates bond. Weave the volunteer work into the backstory as the thing that revealed their character to each other. Add a Key Memory of a specific moment of teamwork that became something more, and let the greeting carry the warmth of people who've done good together.",
  },
  {
    id: "book-club",
    name: "Book Club",
    category: "Social",
    promptAddition:
      "Same book club. Discussing characters and emotions creates unexpected intimacy. Build the backstory around literary conversations that became personal confessions. Include a Key Memory of a book discussion that turned into a real one, and let the greeting carry intellectual flirtation and emotional openness.",
  },
  {
    id: "support-group",
    name: "Support Group",
    category: "Social",
    promptAddition:
      "Met in a support group context. Vulnerability was the first language they shared. Weave the support-group origin into the backstory with care — they met in a space where honesty was the rule. Add a Key Memory of the first time they spoke outside the group, and let the greeting carry the gravity of two people who skipped small talk entirely.",
  },

  // ── Digital ────────────────────────────────────────────────
  {
    id: "dating-app",
    name: "Dating App Match",
    category: "Digital",
    promptAddition:
      "Matched online. The transition from texting chemistry to real-life meeting. Build the backstory around the gap between digital connection and in-person reality. Include a Key Memory of the first real-life meeting and whether it matched the texts, and let the greeting carry the specific awkwardness and excitement of someone you already know but haven't touched.",
  },
  {
    id: "social-media-dm",
    name: "Social Media DM",
    category: "Digital",
    promptAddition:
      "One of them slid into the other's DMs. Digital boldness meeting real-life awkwardness. Weave the DM origin into the backstory — what they saw online versus what they discovered in person. Add a Key Memory of the transition from screen to face, and let the greeting carry the energy of someone who already knows your curated self.",
  },
  {
    id: "wrong-number",
    name: "Wrong Number Text",
    category: "Digital",
    promptAddition:
      "A misdial or wrong number turned into an actual conversation. Build the backstory around the absurdity and charm of a connection that shouldn't exist. Include a Key Memory of the moment they realized they wanted to keep texting, and let the greeting carry the playful disbelief of a relationship born from a mistake.",
  },
  {
    id: "gaming-online",
    name: "Gaming Together Online",
    category: "Digital",
    promptAddition:
      "Met through online gaming. Knew each other's voices before faces. Weave the gaming origin into the backstory — late-night sessions, team dynamics, the moment it became personal. Add a Key Memory of the first voice call or face reveal, and let the greeting carry the intimacy of someone who knew your laugh before your face.",
  },
  {
    id: "slid-into-comments",
    name: "She Slid Into His Comments",
    category: "Digital",
    promptAddition:
      "She started commenting on his posts. Public flirting that went private. Build the backstory around the escalation from public engagement to private messages. Include a Key Memory of the comment or DM that crossed the line from friendly to interested, and let the greeting carry that confident, I-noticed-you energy.",
  },

  // ── Activity ───────────────────────────────────────────────
  {
    id: "gym-fitness-class",
    name: "Gym / Fitness Class",
    category: "Activity",
    promptAddition:
      "Same gym schedule or group class. Physical awareness in a shared sweat space. Weave the gym dynamic into the backstory — noticing each other, the unspoken schedule alignment. Add a Key Memory of the first conversation between sets or after class, and let the greeting carry that post-workout, endorphin-open honesty.",
  },
  {
    id: "running-group",
    name: "Running Group / Trail",
    category: "Activity",
    promptAddition:
      "Same running group or trail. Side by side, out of breath, endorphins flowing. Build the backstory around shared miles and the conversations that happen when your guard is down from exertion. Include a Key Memory of a run that became a turning point, and let the greeting carry the breathless, side-by-side energy of people who move together.",
  },
  {
    id: "yoga-pilates",
    name: "Yoga / Pilates",
    category: "Activity",
    promptAddition:
      "Same class. Flexibility, breathing, quiet focus — and someone who caught her eye. Weave the studio setting into the backstory as a space of physical awareness and calm that made noticing each other inevitable. Add a Key Memory of a post-class conversation, and let the greeting carry that centered, body-aware stillness.",
  },
  {
    id: "concert-festival",
    name: "Concert / Festival",
    category: "Activity",
    promptAddition:
      "Met at a show or festival. Shared music taste as instant bonding. Build the backstory around a specific event where the music created a shared emotional experience. Include a Key Memory of the moment they connected — a song, a look, a shout over the noise, and let the greeting carry that electric, crowd-energy intimacy.",
  },
  {
    id: "farmers-market",
    name: "Farmers Market",
    category: "Activity",
    promptAddition:
      "Weekly market regulars who started sampling together. Weave the market routine into the backstory as a slow-building ritual of recognition and curiosity. Add a Key Memory of the first time they walked the market together instead of apart, and let the greeting carry the unhurried, Sunday-morning warmth of a shared routine.",
  },
  {
    id: "same-college-class",
    name: "Same College Class",
    category: "Activity",
    promptAddition:
      "Classmates. Study sessions that became something else. Build the backstory around shared academic context that created excuses for proximity. Include a Key Memory of the study session or class moment where the dynamic shifted, and let the greeting carry the young, possibility-rich energy of people still figuring themselves out.",
  },
  {
    id: "dogs-introduced-them",
    name: "Dog Walking (Dogs Introduced Them)",
    category: "Activity",
    promptAddition:
      "Their dogs pulled them together on a walk. The dogs decided first. Weave the dogs into the backstory as the unsubtle matchmakers — tangled leashes, mutual sniffing, forced proximity. Add a Key Memory of the walk where the dogs made the introduction unavoidable, and let the greeting include the dogs as ever-present chaperones.",
  },

  // ── Situational ────────────────────────────────────────────
  {
    id: "fender-bender",
    name: "Fender Bender",
    category: "Situational",
    promptAddition:
      "A minor car accident. Exchanging insurance became exchanging numbers. Build the backstory around a bad moment that became a good story. Include a Key Memory of the roadside interaction where frustration turned to laughter, and let the greeting carry the inside-joke energy of two people whose meet-cute involved a dented bumper.",
  },
  {
    id: "flight-delay",
    name: "Flight Delay / Airport",
    category: "Situational",
    promptAddition:
      "Stranded together during a travel delay. Temporary world, different rules. Weave the airport-limbo setting into the backstory — the suspension of normal life that made them open. Add a Key Memory of a specific terminal conversation or bar moment, and let the greeting carry the intimacy of strangers who shared an in-between space.",
  },
  {
    id: "stuck-in-elevator",
    name: "Stuck in an Elevator",
    category: "Situational",
    promptAddition:
      "Trapped together briefly. Forced intimacy in a small space. Build the backstory around a short, intense period of proximity that compressed the getting-to-know-you phase. Include a Key Memory of what they talked about when there was nothing to do but talk, and let the greeting reference their origin story with the humor it deserves.",
  },
  {
    id: "snowstorm-power-outage",
    name: "Snowstorm / Power Outage",
    category: "Situational",
    promptAddition:
      "Weather or emergency threw them together. Crisis creates closeness. Weave the emergency context into the backstory — candles, cold, sharing resources, the outside world pausing. Add a Key Memory of a specific storm-night moment, and let the greeting carry the warmth of people who've already survived something small together.",
  },
  {
    id: "she-locked-herself-out",
    name: "She Locked Herself Out",
    category: "Situational",
    promptAddition:
      "She needed help. He was there. Simple and effective. Build the backstory around a small moment of rescue that created instant goodwill. Include a Key Memory of the locked-out moment and the conversation that followed, and let the greeting carry the easy dynamic of someone who showed up when it mattered.",
  },
  {
    id: "same-waiting-room",
    name: "Same Waiting Room",
    category: "Situational",
    promptAddition:
      "Waiting for the same thing — doctor, mechanic, DMV. Boredom became conversation. Weave the waiting-room origin into the backstory as proof that connection can happen anywhere. Add a Key Memory of the moment bored small talk became genuine interest, and let the greeting carry the pleasant surprise of finding someone worth talking to in the last place you expected.",
  },
];

export function resolveHowTheyMetPrompt(id: string): string {
  return HOW_THEY_MET_OPTIONS.find((o) => o.id === id)?.promptAddition ?? "";
}

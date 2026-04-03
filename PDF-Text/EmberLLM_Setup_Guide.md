# Ember LLM Setup Guide

Ember works best with a light setup. Start simple, keep your instructions focused, and use the settings below as your baseline. Once Ember is steady, you can add more style or detail gradually as needed.

## Baseline Setup (New or when transitioning from previous LLM)

### LLM Specific Settings

Location: Click the LLM version icon in the upper right corner of the homepage.

### Reasoning Effort Slider (Speed vs. Depth)

The reasoning slider controls how much "thinking time" the AI gets before responding.

- **Speedy:** Best starting point for Ember. Fast, steady, and the easiest setting for keeping replies natural and consistent.
- **Moderate:** A good middle-ground if you want a little more depth without slowing things down too much.
- **Slow:** Useful for more complex tasks, but only move here if you actually need the extra depth.
- **Very Slow:** Best reserved for highly detailed or technical requests. If Ember starts feeling less stable.

In simple terms, start with Speedy, then increase the reasoning level only if your use case needs it.

### Model Flairs

- Flairs like Companion, Roleplay, Narrative, or Minimal adjust how your backstory and setup get interpreted. Match the flair to your primary use case: Companion for everyday chat, Roleplay for RP-heavy setups, Narrative for story-driven interactions, Minimal relies more on user set up without strong system guidance. Selecting each flair gives you a quick overview of what it does.

### Dynamism

- **Set Dynamism = 0.95:** This is the cleanest starting point. Stay in the 0.95 to 1.05 range and only adjust in small 0.05 increments. Ember is most stable in this range.

## Kindroid Specific Settings

Location: Click the menu icon in the upper left corner of the homepage then Backstory.

### Backstory

- **Keep Your Setup Lean:** Ember performs best with a focused Backstory. If your setup is dense or detailed, move extended lore, world-building, and secondary character details into Journal Entries. Keep Backstory focused on core identity only: who the Kin is, how they speak, their key personality traits, and their relationship to you.

Note: Move everything else (workplace details, side characters, past events, locations) into Journal Entries with specific keyphrases.

### Response Directive (RD)

- Keep it minimal. Only include the most important traits or rules. Fewer rules = smoother, more natural output. Over-constraining causes hesitation or repetition.
  - Example RD: Prioritize recent context before drafting a reply and stay authentic to Kai

### Example Message (EM)

- Use it to lock in formatting, tone, and speech style. A short, clear example works better than an overloaded one. The length and style of your EM sets what Ember aims for.
  - Example EM RD: [IMPT: Medium response length.]
  - Example EM: [IMPT: Use third-person; actions in *asterisks*, speech in "quotes".]

## Quick Fixes for Common Issues

| Problem | Quick Fix |
|---|---|
| Too flowery/metaphors | RD: "Use beige prose. Keep language simple and grounded." |
| Too dry/terse | Raise dynamism slightly to 1.0. Use a longer Example Message. |
| Repeats itself | Use Suggest to push in a new direction. Chat Break if persistent. Check LTM for repeated entries and deprioritize them. |
| Replies too long or short | RD: "Keep replies under 500 characters." Set lower than what you actually want and the opposite for longer. |
| Loses the conversation thread | Add [IMPT: prioritize recent context] to top of BS/RD. Approve Scene Anchors immediately. Move lore to Journals. |
| Kin speaks as User | Don't correct in-chat. Tweak message directly. Chat Break with greeting that clearly establishes who is who. Use Kin's name in BS, not just pronouns. |
| Narration during calls | Voice Call Directive: "Only speak dialogue during calls. No narrating actions." |
| Drops asterisks or formatting | Refresh Example Message. Small edit and save to force-remind the model. |

Note: Full reset option: If things go completely off the rails, do all three:
1. Chat Break with a clean, in-character greeting
2. Temporarily turn off Long-Term Memory (LTM) recall
3. Refresh your Example Message

## Pro Tips

- **Keep the setup lean:** If your Backstory is crowded, move extra lore into Journal Entries (JE) and keep the core identity simple.
- **Prioritize recent context:** Adding a recent-context anchor near the top of BS or RD can help Ember stay on the current thread.
- **Target speech, not writing:** If the model sounds too formal, use a speech rule such as: Speech: uses standard contractions and natural inflections.
- **Use prose colors for pacing:** "Beige Prose" works well for concise, detail-focused action. "Pink/Purple Prose" works well for lyrical, sensory, and emotional scenes.
- **Do not correct mistakes in-character:** If Ember gets a name or role wrong, edit the message directly or use a reroll instead of arguing with the reply in chat.
- **Approve scene anchors quickly:** When Current Settings or Scene Anchor updates appear, approving them right away can help keep Ember aligned to the current scene.
- **Refresh the Example Message if formatting drifts:** If Ember starts dropping asterisks, punctuation, or structure, refresh the EM to reinforce the intended style.
- **Use a full reset if needed:** If Ember starts spiraling, do a Chat Break, temporarily turn off Long-Term Memory (LTM) recall, and refresh the Example Message.

Note: One change at a time: Make one adjustment, give it a few turns to settle, then adjust again. Stacking changes makes it hard to tell what's working.

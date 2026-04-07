# Workflow

This is the intended day-to-day workflow for using the app.

## 1. Build repository context

Use the library panel on the main workbench page to:

- browse the documents in `PDF-Text/`
- add new `.txt` or `.md` repository notes
- archive outdated documents
- assign tags and favorites

The selected documents become the source context for generation. The app provides smart recommendations based on your brief — it expands keywords through synonym groups and matches against 31 topic categories to surface relevant docs.

## 2. Configure the model provider

Choose the provider type, base URL, model, API key, and temperature in the provider settings area.

The app currently supports:

- OpenAI
- Anthropic
- xAI (Grok) — also supports web search for worldbuilding research

Provider settings are persisted locally in browser storage. Provider controls are locked during generation to prevent mid-request changes.

## 3. Set backstory tier

Choose between standard (2500 chars) and extended (5000 chars) backstory limits. This affects the system prompt, character limit display, and quality validation.

## 4. Build the character brief

You can start with a plain freeform brief, then optionally add structured inputs across four tabs:

**Core:** personality templates, backstory architectures, scenario modifiers, how-they-met presets

**Profile:** physical profile (body type, height, age, ethnicity, features), emotional logic (wound/armor/crack/contradiction), relationship dynamic (power/temperature/attachment/wants)

**Voice & Kinks:** voice profile (texting style, humor, verbal tics), sexual profile, kink preferences, journal categories

**World:** worldbuilding (locations, shared lore, world lexicon), MC profile (male main-character name, appearance, personality)

These guided inputs are assembled into the final prompt before the model call. Empty sections add zero tokens.

### Discovery mode (alternative to manual building)

Instead of building a brief manually, you can use discovery mode:

- **Surprise Me x4** — generates 4 randomized character concepts at different temperatures, with preference learning from your ratings (like/maybe/pass)
- **Surprise Me x1** — generates a single randomized character
- **Roll Concept** — randomizes builder fields without generating, then uses the LLM to refine the brief
- **Remix** — generates variations based on the fingerprint of an existing batch result

Three modes are available: romanceable, high-heat, and wild-card. Physical profile, kinks, and sexual profile can be locked across rolls.

The discovery system tracks your preferences over time and avoids consecutive repeats of emotional logic, relationship dynamic, and voice presets.

## 5. Add references

You can include existing saved characters as reference material. These are not copied directly; they are used for contrast enforcement — the quality system ensures the new character differs on at least 3 major axes.

## 6. Generate

There are several generation modes:

- standard single draft generation (with automatic quality analysis and novelty rewrite)
- batch generation across multiple temperatures (with partial recovery — if one temperature fails, the others still return)
- prompt preview without a model call
- section regeneration for refining a single part of the character

## 7. Refine output

Once a draft is generated, the quality report card shows:

- **Four scores** — novelty, contrast, internal consistency, sexual consistency (each 0-100)
- **Warnings** with severity levels (info/warn/severe) and actionable fix suggestions
- **Overlap detection** — closest matches to existing saved characters with matched axes
- **Save gate** — severe issues block saving until resolved

You can then:

- edit individual sections via section cards
- regenerate individual sections with full character context
- edit the full raw markdown directly
- **undo/redo** edits with toolbar buttons or Ctrl+Z / Ctrl+Y
- re-analyze the draft after edits

## 8. Save to the character library

Saving writes the markdown into `characters/`. The quality gate runs analysis before saving — drafts with severe issues (missing sections, high overlap, avatar prompt misuse, etc.) must be revised first.

The `/characters` page provides a dedicated view for browsing, editing, and preparing saved characters for copy-paste into Kindroid.

## 9. Redesign existing characters

To modify a saved character without regenerating from scratch:

1. Select the character and switch to the **Redesign** tab
2. Describe what you want to change in natural language
3. Click "Ask me about it" — the LLM reads the character and asks 3-5 clarifying questions
4. Answer the questions (optional — you can skip any) and review the section checklist (toggle any off to protect them)
5. Click "Redesign" — only the checked sections are rewritten, everything else is preserved
6. Review the changes (changed sections are highlighted) and click "Apply changes" or "Discard"
7. Use "Revert" after applying if you want to restore the original

If the LLM doesn't suggest specific sections, a default checklist of common sections is shown automatically.

This uses a selective merge — the LLM returns a full rewrite but only user-approved sections are replaced in the final output.

## 10. Worldbuilding research

When using xAI (Grok), you can research locations, cultural elements, and world lore:

1. Enter a query in the worldbuilding form
2. Grok searches the web and generates journal entry suggestions
3. Accept individual suggestions or all at once — they populate locations, lore, and lexicon fields
4. Worldbuilding auto-enables when content is accepted

Accepted worldbuilding content is included in the generation prompt and generates Global journal entries marked with `[GLOBAL]`.

## 11. Archive instead of delete where possible

- repository documents are moved to `PDF-Text/.archive/`
- deleted characters are moved to `characters/archive/`

The project prefers reversible file operations over hard deletion.

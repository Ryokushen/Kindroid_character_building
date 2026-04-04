# Workflow

This is the intended day-to-day workflow for using the app.

## 1. Build repository context

Use the library panel on the main workbench page to:

- browse the documents in `PDF-Text/`
- add new `.txt` or `.md` repository notes
- archive outdated documents
- assign tags and favorites

The selected documents become the source context for generation.

## 2. Configure the model provider

Choose the provider type, base URL, model, API key, and temperature in the provider settings area.

The app currently supports:

- OpenAI
- Anthropic
- xAI

Provider settings are persisted locally in browser storage.

## 3. Build the character brief

You can start with a plain freeform brief, then optionally add structured inputs:

- personality templates
- backstory architectures
- scenario modifiers
- how-they-met presets
- physical profile
- emotional logic
- relationship dynamic
- voice profile
- sexual profile
- journal categories
- kink preferences
- male main-character profile

These guided inputs are assembled into the final prompt before the model call.

## 4. Add references

You can include existing saved characters as reference material. These are not copied directly; they are used as examples of structure, tone, and specificity.

## 5. Generate

There are several generation modes:

- standard single draft generation
- batch generation across multiple temperatures
- prompt preview without a model call
- section regeneration for refining a single part of the character

## 6. Refine output

Once a draft is generated, you can:

- edit the full markdown directly
- regenerate individual sections
- inspect the parsed Kindroid-ready fields

## 7. Save to the character library

Saving writes the markdown into `characters/`. The `/characters` page provides a dedicated view for browsing, editing, and preparing saved characters for copy-paste into Kindroid.

## 8. Archive instead of delete where possible

- repository documents are moved to `PDF-Text/.archive/`
- deleted characters are moved to `characters/archive/`

The project prefers reversible file operations over hard deletion.

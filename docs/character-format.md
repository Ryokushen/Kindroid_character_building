# Character Format

The app generates and edits characters as structured Markdown.

## Core sections

The generator and parser expect a character file to contain most or all of these sections:

- `# Character Name`
- `## Overview`
- `## Backstory`
- `## Avatar Prompt`
- `## Selfie Description`
- `## Response Directive (RD)`
- `## Example Message (EM)`
- `## Key Memories`
- `## Journal Entries`
- `## Greeting Options`
- `## Selfie / Image Prompts` (optional)

Section parsing lives in [../lib/section-parser.ts](../lib/section-parser.ts).

## Character limits

The current Kindroid-oriented limits defined in code are:

- Backstory: `2500` (standard) or `5000` (extended) — controlled by `BackstoryTier`
- Response Directive: `250`
- Key Memories: `1000`
- Example Message: `750`
- Avatar Prompt: `200`
- Selfie Description: `800`
- Journal entry: `500`
- Greeting: `730`

Static limits are defined in `KINDROID_LIMITS` in [../lib/types.ts](../lib/types.ts). The dynamic backstory limit is resolved via `getKindroidLimit(key, backstoryTier)` which returns the correct limit based on the selected tier. The system prompt in `buildSystemPrompt()` accepts `{ backstoryLimit?: number }` to match.

## Journal entries

Journal entries are expected to look like this:

````text
### Journal 1 — Topic Title
```text
KEYWORDS: "keyword1" "keyword2"
Entry: Factual 3rd-person paragraph.
```
````

Global journal entries (shared world lore) are marked with `[GLOBAL]` in the title:

````text
### Journal — Memphis History [GLOBAL]
```text
KEYWORDS: "beale street" "memphis" "blues"
Entry: Beale Street runs east-west...
```
````

The parser extracts:

- title (with `[GLOBAL]` stripped)
- `isGlobal` flag
- raw keywords string
- entry text (after `Entry:` prefix or everything after keywords line)

## Greeting options

Greeting options are expected as titled subsections under `## Greeting Options`.

## Parser behavior

The parser is intentionally tolerant:

- it handles H1, H2, and H3 headings
- it supports fenced code blocks
- it merges continued journal content
- it can recover orphaned journal sections in some malformed markdown
- **unknown sections are preserved** — any H2 heading that doesn't match a known pattern is stored as a `custom_${slug}` key instead of being dropped, surviving save/reload round-trips
- `reassembleMarkdown()` uses each section's `label` property as the heading, so custom sections retain their original heading text

## Why this structure matters

The structured format enables:

- section-level editing and regeneration
- character-limit validation (dynamic for backstory via `BackstoryTier`)
- quality analysis and overlap detection via character fingerprinting
- copy-paste transfer into Kindroid fields
- undo/redo history tracking (markdown snapshot-based)

If the format changes significantly, update the system prompt (`lib/generation.ts`), the parser (`lib/section-parser.ts`), and the fingerprint extractor (`lib/character-fingerprint.ts`).

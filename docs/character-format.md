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

- Backstory: `2500`
- Response Directive: `250`
- Key Memories: `1000`
- Example Message: `750`
- Avatar Prompt: `200`
- Selfie Description: `800`
- Journal entry: `500`
- Greeting: `730`

These limits are defined in [../lib/types.ts](../lib/types.ts).

## Journal entries

Journal entries are expected to look like this:

````text
### Journal 1 — Topic Title
```text
KEYWORDS: "keyword1" "keyword2"
Entry: Factual 3rd-person paragraph.
```
````

The parser extracts:

- title
- raw keywords string
- entry text

## Greeting options

Greeting options are expected as titled subsections under `## Greeting Options`.

## Parser behavior

The parser is intentionally tolerant:

- it handles H1, H2, and H3 headings
- it supports fenced code blocks
- it merges continued journal content
- it can recover orphaned journal sections in some malformed markdown

## Why this structure matters

The structured format enables:

- section-level editing
- section regeneration
- character-limit validation
- copy-paste transfer into Kindroid fields

If the format changes significantly, update both the system prompt and the parser.

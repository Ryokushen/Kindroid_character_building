# Kindroid Character Workbench

Local-first workspace for building Kindroid characters against a maintainable source repository.

## What this MVP does

- Uses the existing `PDF-Text/` folder as the active best-practices repository
- Lets you add new repository notes or upload `.txt` / `.md` files
- Archives repository documents into `PDF-Text/.archive/` instead of deleting them outright
- Browses the current `characters/` folder
- Generates a structured character draft through an OpenAI-compatible chat completions endpoint
- Saves the generated markdown back into `characters/`

## Why the AI setup is "OpenAI-compatible"

For the first cut, the app accepts:

- a base URL
- a model name
- an API key

That covers OpenAI and many compatible providers such as OpenRouter, Groq, Together, and similar APIs. If you later want native Anthropic or Gemini support, the app can grow a provider adapter layer without changing the rest of the product.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Current structure

- `app/` UI and API routes
- `components/` client dashboard
- `lib/` file-backed repository, character, and generation helpers
- `PDF-Text/` live knowledge repository
- `characters/` saved character files

## Next sensible expansions

- search and tagging for repository docs
- side-by-side edit mode for generated drafts
- template presets for different Kindroid archetypes
- native adapters for Anthropic and Gemini
- vector retrieval or chunked ranking when the document library grows

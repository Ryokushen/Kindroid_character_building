# Architecture

This project is a local-first Next.js App Router application with file-backed storage.

## Stack

- Next.js (app router, `latest` track)
- React
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui primitives (base-nova theme)
- filesystem storage — no database

## High-level flow

```text
app/page.tsx
  -> Workbench
  -> useWorkbench (central state + actions)
  -> API routes under app/api/*
  -> lib/* generation, quality analysis, parsing, and file I/O
```

Generation pipeline:

```text
buildSystemPrompt() + buildUserPrompt()
  -> model-client.ts callModel()
  -> quality-checks.ts analyzeDraftQuality()
  -> novelty-pass.ts rewriteDraftForNovelty() (if overlap detected)
```

## Main layers

### UI

The main workbench entry point is [../components/workbench.tsx](../components/workbench.tsx).

It composes three main panels:

- **Library panel** — document browsing, tags, favorites, smart recommendations
- **Draft builder panel** — provider settings, backstory tier, discovery mode, guided brief form, generation output
- **Character panel** — saved character list, Kindroid transfer view, inline editor

There is also a dedicated saved-character page at [../app/characters/page.tsx](../app/characters/page.tsx).

The project has 34 client components plus 15 shadcn/ui primitives (49 total).

### State

Most interactive state and user actions live in [../hooks/use-workbench.ts](../hooks/use-workbench.ts) (~1180 lines).

This hook owns:

- provider settings and backstory tier
- selected docs and characters
- guided builder state (brief, templates, physical profile, emotional logic, voice, kinks, worldbuilding, etc.)
- discovery mode, preferences, and seed summaries
- generation actions (single, batch, surprise me, roll concept, remix)
- quality report and novelty rewrite state
- batch results and ratings
- error state (separate from status messages)
- save/update/delete actions
- metadata updates

Concurrency safety: all async handlers check `if (isWorking) return` before starting. Provider settings are locked during generation.

### API routes

Current route groups:

- `app/api/generate/` — 7 routes
- `app/api/library/` — 3 routes
- `app/api/characters/` — 1 route (POST/PATCH/DELETE)

Generate routes:

- standard single-draft generation (with auto quality analysis + novelty rewrite)
- batch generation across multiple temperatures (partial recovery via `Promise.allSettled`)
- section regeneration for refining a single part
- draft quality analysis
- LLM-powered concept generation (for Roll Concept)
- prompt preview without a model call
- Grok web search research (xAI only, for worldbuilding)

See [api-routes.md](api-routes.md) for full route documentation.

### Business logic

The `lib/` directory contains 18 modules:

**Core generation:**
- [../lib/generation.ts](../lib/generation.ts) — system prompt builder (`buildSystemPrompt()`), user prompt builder (`buildUserPrompt()`)
- [../lib/model-client.ts](../lib/model-client.ts) — `callModel()` multi-provider LLM adapter, `callXAIWithSearch()` for Grok web search

**Quality pipeline:**
- [../lib/quality-checks.ts](../lib/quality-checks.ts) — `analyzeDraftQuality()`, `FIX_SUGGESTIONS` map for actionable fix guidance
- [../lib/character-fingerprint.ts](../lib/character-fingerprint.ts) — `extractCharacterFingerprint()`, overlap detection, contrast line builder
- [../lib/novelty-pass.ts](../lib/novelty-pass.ts) — `rewriteDraftForNovelty()` auto-rewrite for overlapping drafts

**Discovery system:**
- [../lib/random-seed.ts](../lib/random-seed.ts) — discovery mode presets, `buildDiscoveryPreset()`, `buildConceptSeed()`, preference learning with deduplication

**Data and parsing:**
- [../lib/types.ts](../lib/types.ts) — all TypeScript types, default values, `KINDROID_LIMITS`, `getKindroidLimit()`
- [../lib/section-parser.ts](../lib/section-parser.ts) — structured markdown parsing, journal/greeting extraction, custom section preservation
- [../lib/library.ts](../lib/library.ts) — document CRUD, smart recommendations with synonym expansion
- [../lib/characters.ts](../lib/characters.ts) — character CRUD, reference context builder
- [../lib/metadata.ts](../lib/metadata.ts) — tags and favorites JSON sidecar
- [../lib/utils.ts](../lib/utils.ts) — `cn()`, `stripMarkdown()`, text utilities

**Builder presets:**
- [../lib/templates.ts](../lib/templates.ts) — 8 personality templates
- [../lib/backstory-architectures.ts](../lib/backstory-architectures.ts) — 7 backstory patterns
- [../lib/scenario-templates.ts](../lib/scenario-templates.ts) — 6 scenario modifiers
- [../lib/how-they-met.ts](../lib/how-they-met.ts) — meeting scenario options
- [../lib/emotional-logic-presets.ts](../lib/emotional-logic-presets.ts) — emotional logic preset data
- [../lib/flirtation-styles.ts](../lib/flirtation-styles.ts) — flirtation style options

## Config notes

- [../next.config.ts](../next.config.ts) includes `allowedDevOrigins` for local network access during development.
- The app is designed to run without a database or external storage service.

## Contributor guidance

If you add a major feature, update:

- the relevant `docs/*.md` page
- `CLAUDE.md` (primary architecture reference)
- the root `README.md`
- any generated format assumptions in `lib/generation.ts` and `lib/section-parser.ts`

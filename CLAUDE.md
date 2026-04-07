# Kindroid Character Workbench

Local-first Next.js app for building AI companion characters for the Kindroid platform.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build (also verifies TypeScript)
```

## Architecture

**Stack:** Next.js 16 (app router) + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui (base-nova) + file-based storage. No database.

**Theme:** Dark creative/moody — deep purple-black, warm amber primary, electric purple accents, glassmorphism cards.

### Key Directories

```
app/                    # Next.js app router pages + API routes
  api/generate/         # POST: generate, batch, section, analyze, concept, preview, research
  api/characters/       # GET/POST/PATCH/DELETE character files
  api/library/          # GET/POST docs, archive, metadata
components/             # 34 client components (all "use client")
  ui/                   # 15 shadcn/ui primitives (DO NOT edit manually)
hooks/                  # use-workbench.ts — central state + actions
lib/                    # Business logic (18 files)
  generation.ts         # System prompt builder, user prompt builder
  model-client.ts       # callModel() — multi-provider LLM adapter
  types.ts              # All TypeScript types + default values
  section-parser.ts     # Parse character markdown into sections
  quality-checks.ts     # Draft quality analysis + FIX_SUGGESTIONS map
  character-fingerprint.ts  # Character fingerprinting + overlap detection
  novelty-pass.ts       # Auto-rewrite overlapping drafts
  random-seed.ts        # Discovery mode presets + preference learning
  templates.ts          # 8 personality templates
  backstory-architectures.ts  # 7 backstory patterns
  scenario-templates.ts       # 6 scenario modifiers
  how-they-met.ts       # Meeting scenario options
  emotional-logic-presets.ts  # Emotional logic preset data
  flirtation-styles.ts  # Flirtation style options
  library.ts            # Document CRUD + smart recommendations (synonym-expanded)
  characters.ts         # Character CRUD + reference context builder
  metadata.ts           # Tags/favorites JSON sidecar
  utils.ts              # cn() + text utilities + stripMarkdown()
PDF-Text/               # Knowledge library (markdown/text docs)
characters/             # Saved character .md files
```

### Data Flow

```
page.tsx (server) → Workbench (client) → useWorkbench hook → child components
                                              ↓
                                    fetch /api/generate (or /batch, /section, /concept)
                                              ↓
                                    generation.ts → buildSystemPrompt() + buildUserPrompt()
                                              ↓
                                    model-client.ts → callModel() → OpenAI / Anthropic / xAI
                                              ↓
                                    quality-checks.ts → analyzeDraftQuality()
                                              ↓
                                    novelty-pass.ts → rewriteDraftForNovelty() (if overlap detected)
```

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/generate` | POST | Single character generation with auto quality + novelty rewrite |
| `/api/generate/batch` | POST | Temperature sweep (2-4 temps), partial recovery on failure |
| `/api/generate/section` | POST | Regenerate a single section with full character context |
| `/api/generate/analyze` | POST | Quality analysis of existing character markdown |
| `/api/generate/concept` | POST | LLM-powered concept generation for Roll Concept |
| `/api/generate/preview` | POST | Preview assembled prompt without generating |
| `/api/generate/research` | POST | Grok web search for worldbuilding research (xAI only) |
| `/api/characters` | POST/PATCH/DELETE | Character CRUD |
| `/api/library` | GET/POST | Document listing and upload |
| `/api/library/archive` | POST | Archive a document |
| `/api/library/metadata` | PATCH | Update tags/favorites |

### Component Tree

```
Workbench
  Header (status bar + persistent error banner)
  LibraryPanel
    DocumentAddForm
    DocumentList (tags, favorites, filtering)
    DocumentPreview
  DraftBuilderPanel
    ProviderSettings (OpenAI / Anthropic / xAI presets + model selectors, locked during generation)
    BackstoryTier toggle (2500 / 5000)
    Discovery Mode controls (romanceable / high-heat / wild-card)
      Surprise Me x1, Surprise Me x4, Roll Concept buttons
    BriefForm (4 tabs: Core, Profile, Voice & Kinks, World)
      BackstorySelector (7 architectures)
      EmotionalLogicForm (wound/armor/crack/contradiction)
      RelationshipDynamicForm (power/temperature/attachment/wants)
      VoiceBuilderForm (texting/humor/tics/code-switching)
      PhysicalProfileForm (body type, height, age, ethnicity, features)
      MCProfileForm (male MC name, appearance, personality)
      KinkSelector (per-character variety enforcement)
      Sexual Profile (collapsible textarea)
      JournalCategoriesSelector (5 checkboxes)
      TemplateSelector (8 personality modifiers)
      ScenarioSelector (6 situation modifiers)
      HowTheyMetSelector (meeting scenarios)
      Reference Characters (chip selection)
      ChemistryTool (contrast notes, conditional)
      WorldbuildingForm (locations, lore, lexicon, Grok research, auto-enable)
    BatchGenerationView | GenerationOutput
      QualityReportCard (scores + warnings + fix suggestions)
      CharacterSectionCard (per-section editing + regen)
      Undo/Redo buttons (+ Ctrl+Z/Y keyboard shortcuts)
  CharacterPanel
    CharacterList
    Tabs: KindroidReadyView | CharacterEditor | CharacterPreview
      CharacterEditor (section cards + add journal + undo/redo)
```

### State Management

All state lives in `hooks/use-workbench.ts` (~1180 lines) — a single custom hook returning `{ state, actions }`. No React context. Props flow down explicitly. Provider settings + API keys persist in localStorage (per-provider key storage).

Key state groups:
- **Document/character selection** — selected docs, active doc/character
- **Provider** — type, model, API key, temperature, base URL
- **Builder** — brief, notes, templates, backstories, scenarios, physical profile, emotional logic, relationship dynamic, voice profile, sexual profile, kinks, MC profile, worldbuilding, backstory tier
- **Generation output** — generatedMarkdown, draftQualityReport, originalQualityReport, draftWasAutoRewritten, analyzedMarkdownSnapshot
- **Batch/discovery** — isBatchMode, batchTemperatures, batchResults, batchRatings, discoveryMode, discoveryPreferences, discoverySeedSummary
- **UI** — message, error (separate persistent error state), isWorking

**Concurrency safety:** All async handlers (`handleGenerate`, `handleBatchGenerate`, `handleSurpriseMe`, etc.) have `if (isWorking) return` guards. Provider settings are locked (disabled) during generation.

### Multi-Provider API Support

Three providers with automatic format handling in `lib/model-client.ts`:
- **OpenAI** — `Authorization: Bearer` + `/chat/completions`
- **Anthropic** — `x-api-key` header + `/messages` + `system` as top-level field + `max_tokens: 8192`
- **xAI (Grok)** — OpenAI-compatible format + web search support via `callXAIWithSearch()`

Provider type is stored in `ProviderSettings.providerType`. The `callModel()` function in `model-client.ts` dispatches to the correct adapter.

### System Prompt

The system prompt in `generation.ts` (`buildSystemPrompt()`) contains comprehensive Kindroid platform knowledge:
- Dynamic backstory limit (2500 or 5000 via `BackstoryTier`) — accepts `{ backstoryLimit?: number }` option
- All other field character limits (RD ~250, Key Memories ~1000, EM ~750, Journals ~500, Greetings ~730)
- How each field influences the Ember/Kindroid LLM (strong/moderate/conditional)
- Behavioral writing patterns (show don't tell, ritual method, descriptive memory traces)
- Journal keyword best practices, Global vs Individual journal types
- Sexual behavior journal generation (conditional on sexual profile input)
- Greeting options with character counts

### Quality Analysis Pipeline

Generated drafts go through automatic quality analysis (`lib/quality-checks.ts`):
1. **Character fingerprinting** (`lib/character-fingerprint.ts`) — extracts tropes, voice, emotional signals, relationship patterns, sexual tags
2. **Overlap detection** — compares fingerprint against all saved characters, computes similarity scores
3. **Quality scoring** — novelty, contrast, internal consistency, sexual consistency (each 0-100)
4. **Warning generation** — 17 warning codes with severity levels (info/warn/severe)
5. **Fix suggestions** — `FIX_SUGGESTIONS` map provides actionable guidance for each warning code
6. **Save gate** — severe issues block saving until resolved
7. **Novelty rewrite** (`lib/novelty-pass.ts`) — auto-rewrites drafts with high overlap, preserving visual foundation

### Discovery Mode

The "Surprise Me" system (`lib/random-seed.ts`) generates randomized character concepts:
- **Three modes**: romanceable, high-heat, wild-card — each with different template/backstory/temperature pools
- **Preference learning**: user rates results (like/maybe/pass), weights future selections via `DiscoveryPreferenceStore`
- **Deduplication**: `dedupRandomItem()` tracks recent picks per category to avoid consecutive repeats
- **Roll Concept**: generates builder presets without triggering generation, then calls `/api/generate/concept` for LLM-refined brief
- **Locked fields**: physical profile, kinks, and sexual profile can be locked across discovery rolls
- **Remix**: generates variations based on fingerprint of an existing batch result

### Guided Character Building

The brief form includes 8 optional collapsible guided sections organized into 4 tabs. All start collapsed. Empty sections add zero tokens to the prompt:
1. **Backstory Architecture** — story pattern selection (`lib/backstory-architectures.ts`)
2. **Emotional Logic** — wound/armor/crack/contradiction framework
3. **Relationship Dynamic** — power, temperature, attachment, wants
4. **Voice & Speech** — texting style, humor, verbal tics
5. **Physical Profile** — body type, height, age, ethnicity, features, flirtation style
6. **Sexual Profile + Kinks** — generates dedicated journal entries with keyword triggers
7. **Journal Categories** — which journal types to generate
8. **Scenario Modifiers** — situational context (`lib/scenario-templates.ts`)
9. **Worldbuilding** — locations, lore, lexicon with Grok web search research (auto-enables when content added)

Additional builder features:
- **MC Profile** — male main character name, appearance, personality
- **How They Met** — meeting scenario selection (`lib/how-they-met.ts`)
- **Chemistry Tool** — contrast notes for multi-character comparison
- **Reference Characters** — select saved characters for contrast enforcement

### Character Output

Generated characters follow this section order:
`# Name` → `## Overview` → `## Backstory` → `## Avatar Description` → `## Face Detail` → `## Response Directive` → `## Example Message` → `## Key Memories` → `## Journal Entries` → `## Greeting Options`

The **Kindroid Transfer view** parses saved characters into individual copyable fields matching Kindroid's interface, with character count indicators and dynamic backstory limit display.

### Section Parser

`lib/section-parser.ts` handles:
- H1 (character name), H2 (main sections), H3 (journal/greeting entries)
- Code block extraction (`extractCodeBlockContent`)
- Orphaned journal entries (H3 journals under non-journal H2 sections)
- Journal keyword/entry text splitting (`splitJournalContent`)
- Global journal detection (`[GLOBAL]` flag in titles)
- **Unknown sections preserved** — unrecognized H2 headings are stored as `custom_${slug}` keys instead of being dropped, surviving save/reload round-trips
- Round-trip reassembly via `reassembleMarkdown()`

## Important Patterns

- **All components are client components** (`"use client"`) — shadcn/ui requires this
- **lib/utils.ts** contains both `cn()` (for Tailwind class merging) and text utilities — this is intentional, not a separation issue
- **Template/architecture data** ships as code in `lib/` files, not as files on disk
- **File-based storage**: documents in `PDF-Text/`, characters in `characters/`, metadata in `PDF-Text/.metadata.json`
- **`next.config.ts`** has `allowedDevOrigins` for network IP access during development
- **Concurrent generation guard**: all async handlers check `if (isWorking) return` before starting
- **Provider locking**: `ProviderSettings` component accepts `disabled` prop, locked during generation
- **Batch partial recovery**: uses `Promise.allSettled()` — partial results returned if some temperatures fail
- **Separate error state**: `error` (persistent, dismissible banner) vs `message` (status text, overwritten by next action)
- **Undo/redo**: both `GenerationOutput` and `CharacterEditor` maintain a ref-based history stack (20 entries) with Ctrl+Z/Ctrl+Y keyboard shortcuts
- **Library recommendations**: `getSmartRecommendations()` in `lib/library.ts` expands brief words through synonym groups before matching, with 31 topic-to-document mappings

## Common Tasks

**Add a new personality template:** Edit `lib/templates.ts` — add to the `CHARACTER_TEMPLATES` array.

**Add a new backstory architecture:** Edit `lib/backstory-architectures.ts` — add to `BACKSTORY_ARCHITECTURES`.

**Add a new scenario template:** Edit `lib/scenario-templates.ts` — add to `SCENARIO_TEMPLATES`.

**Add a new Kindroid field to the transfer view:** Update `lib/types.ts` (CharacterSectionKey), `lib/section-parser.ts` (pattern matching), and `components/kindroid-ready-view.tsx`.

**Add a new provider:** Add to `PROVIDER_PRESETS` in `components/provider-settings.tsx`, add adapter in `lib/model-client.ts` if API format differs from OpenAI.

**Modify the system prompt:** Edit `buildSystemPrompt()` in `lib/generation.ts`. It accepts `{ backstoryLimit?: number }` for dynamic limits.

**Add a new guided builder section:** Create component in `components/`, add type + defaults in `lib/types.ts`, add state in `hooks/use-workbench.ts`, add prompt assembly in `buildUserPrompt()` in `lib/generation.ts`, integrate in `components/brief-form.tsx`.

**Add a new quality warning:** Add warning code + `warnings.push()` in `lib/quality-checks.ts`, add fix suggestion to `FIX_SUGGESTIONS` map in the same file.

**Add a new discovery mode preset:** Add to `EMOTIONAL_PRESETS`, `RELATIONSHIP_PRESETS`, `VOICE_PRESETS`, or `SEXUAL_PRESETS` arrays in `lib/random-seed.ts` (per-mode arrays of 3+ presets).

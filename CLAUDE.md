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
  api/generate/         # POST: generate, batch, section regen, preview
  api/characters/       # GET/POST character files
  api/library/          # GET/POST docs, archive, metadata
components/             # 25 client components (all "use client")
  ui/                   # 14 shadcn/ui primitives (DO NOT edit manually)
hooks/                  # use-workbench.ts — central state + actions
lib/                    # Business logic (10 files)
  generation.ts         # System prompt, user prompt builder, multi-provider model calling
  types.ts              # All TypeScript types + default values
  section-parser.ts     # Parse character markdown into sections
  templates.ts          # 8 personality templates
  backstory-architectures.ts  # 7 backstory patterns
  scenario-templates.ts       # 6 scenario modifiers
  library.ts            # Document CRUD + smart recommendations
  characters.ts         # Character CRUD
  metadata.ts           # Tags/favorites JSON sidecar
  utils.ts              # cn() + text utilities
PDF-Text/               # Knowledge library (markdown/text docs)
characters/             # Saved character .md files
```

### Data Flow

```
page.tsx (server) → Workbench (client) → useWorkbench hook → child components
                                              ↓
                                    fetch /api/generate
                                              ↓
                                    generation.ts → buildSystemPrompt() + buildUserPrompt()
                                              ↓
                                    callModel() → OpenAI / Anthropic / xAI
```

### Component Tree

```
Workbench
  Header (status bar)
  LibraryPanel
    DocumentAddForm
    DocumentList (tags, favorites, filtering)
    DocumentPreview
  DraftBuilderPanel
    ProviderSettings (OpenAI / Anthropic / xAI presets + model selectors)
    BriefForm
      BackstorySelector (7 architectures)
      EmotionalLogicForm (wound/armor/crack/contradiction)
      RelationshipDynamicForm (power/temperature/attachment/wants)
      VoiceBuilderForm (texting/humor/tics/code-switching)
      Sexual Profile (collapsible textarea)
      JournalCategoriesSelector (5 checkboxes)
      TemplateSelector (8 personality modifiers)
      ScenarioSelector (6 situation modifiers)
      Reference Characters (chip selection)
      ChemistryTool (contrast notes, conditional)
    BatchGenerationView | GenerationOutput
      CharacterSectionCard (per-section editing + regen)
  CharacterPanel
    CharacterList
    KindroidReadyView (copy-paste per Kindroid field) | CharacterPreview
```

### State Management

All state lives in `hooks/use-workbench.ts` — a single custom hook returning `{ state, actions }`. No React context. Props flow down explicitly. Provider settings + API keys persist in localStorage (per-provider key storage).

### Multi-Provider API Support

Three providers with automatic format handling:
- **OpenAI** — `Authorization: Bearer` + `/chat/completions`
- **Anthropic** — `x-api-key` header + `/messages` + `system` as top-level field + `max_tokens: 8192`
- **xAI (Grok)** — OpenAI-compatible format, same as OpenAI

Provider type is stored in `ProviderSettings.providerType`. The `callModel()` function in `generation.ts` dispatches to the correct adapter.

### System Prompt

The system prompt in `generation.ts` contains comprehensive Kindroid platform knowledge:
- All field character limits (Backstory ~2500, RD ~250, Key Memories ~1000, EM ~750, Journals ~500)
- How each field influences the Ember/Kindroid LLM (strong/moderate/conditional)
- Behavioral writing patterns (show don't tell, ritual method, descriptive memory traces)
- Journal keyword best practices
- Sexual behavior journal generation (conditional on sexual profile input)
- Greeting options with character counts

### Guided Character Building

The brief form includes 7 optional collapsible guided sections. All start collapsed. Empty sections add zero tokens to the prompt:
1. **Backstory Architecture** — story pattern selection (lib/backstory-architectures.ts)
2. **Emotional Logic** — wound/armor/crack/contradiction framework
3. **Relationship Dynamic** — power, temperature, attachment, wants
4. **Voice & Speech** — texting style, humor, verbal tics
5. **Sexual Profile** — generates dedicated journal entries with keyword triggers
6. **Journal Categories** — which journal types to generate
7. **Scenario Modifiers** — situational context (lib/scenario-templates.ts)

### Character Output

Generated characters follow this section order:
`# Name` → `## Overview` → `## Backstory` → `## Avatar Description` → `## Face Detail` → `## Response Directive` → `## Example Message` → `## Key Memories` → `## Journal Entries` → `## Greeting Options`

The **Kindroid Transfer view** parses saved characters into individual copyable fields matching Kindroid's interface, with character count indicators.

## Important Patterns

- **All components are client components** (`"use client"`) — shadcn/ui requires this
- **lib/utils.ts** contains both `cn()` (for Tailwind class merging) and text utilities — this is intentional, not a separation issue
- **Template/architecture data** ships as code in `lib/` files, not as files on disk
- **File-based storage**: documents in `PDF-Text/`, characters in `characters/`, metadata in `PDF-Text/.metadata.json`
- **Section parser** (`lib/section-parser.ts`) handles H1/H2/H3 headings, code blocks, orphaned journal entries, and greeting options
- **`next.config.ts`** has `allowedDevOrigins` for network IP access during development

## Common Tasks

**Add a new personality template:** Edit `lib/templates.ts` — add to the `CHARACTER_TEMPLATES` array.

**Add a new backstory architecture:** Edit `lib/backstory-architectures.ts` — add to `BACKSTORY_ARCHITECTURES`.

**Add a new scenario template:** Edit `lib/scenario-templates.ts` — add to `SCENARIO_TEMPLATES`.

**Add a new Kindroid field to the transfer view:** Update `lib/types.ts` (CharacterSectionKey), `lib/section-parser.ts` (pattern matching), and `components/kindroid-ready-view.tsx`.

**Add a new provider:** Add to `PROVIDER_PRESETS` in `components/provider-settings.tsx`, add adapter in `lib/generation.ts` if API format differs from OpenAI.

**Modify the system prompt:** Edit `buildSystemPrompt()` in `lib/generation.ts`.

**Add a new guided builder section:** Create component in `components/`, add type + defaults in `lib/types.ts`, add state in `hooks/use-workbench.ts`, add prompt assembly in `buildUserPrompt()` in `lib/generation.ts`, integrate in `components/brief-form.tsx`.

# Architecture

This project is a local-first Next.js 16 App Router application with file-backed storage.

## Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui primitives
- filesystem storage

## High-level flow

```text
app/page.tsx
  -> Workbench
  -> useWorkbench
  -> API routes under app/api/*
  -> lib/* generation, parsing, and file I/O
```

## Main layers

### UI

The main workbench entry point is [../components/workbench.tsx](../components/workbench.tsx).

It composes three main panels:

- library panel
- draft builder panel
- character panel

There is also a dedicated saved-character page at [../app/characters/page.tsx](../app/characters/page.tsx).

### State

Most interactive state and user actions live in [../hooks/use-workbench.ts](../hooks/use-workbench.ts).

This hook owns:

- provider settings
- selected docs and characters
- guided builder state
- generation actions
- save/update/delete actions
- metadata updates

### API routes

Current route groups:

- `app/api/generate/`
- `app/api/library/`
- `app/api/characters/`

Current generate routes include:

- standard generation
- batch generation
- prompt preview
- section regeneration

### Business logic

Important modules:

- [../lib/generation.ts](../lib/generation.ts) for prompt construction and provider calls
- [../lib/library.ts](../lib/library.ts) for document CRUD and recommendation logic
- [../lib/characters.ts](../lib/characters.ts) for character CRUD
- [../lib/metadata.ts](../lib/metadata.ts) for tags and favorites
- [../lib/section-parser.ts](../lib/section-parser.ts) for structured markdown parsing
- `lib/*templates*.ts` and related files for builder presets and prompt fragments

## Config notes

- [../next.config.ts](../next.config.ts) includes `allowedDevOrigins` for local network access during development.
- The app is designed to run without a database or external storage service.

## Contributor guidance

If you add a major feature, update:

- the relevant `docs/*.md` page
- the root `README.md`
- any generated format assumptions in `lib/generation.ts` and `lib/section-parser.ts`

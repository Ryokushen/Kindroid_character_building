# Kindroid Character Workbench

Local-first Next.js app for building Kindroid characters against a curated repository of best-practice documents.

## What it does

**Build** — guided character builder with backstory architecture, emotional logic, relationship dynamics, voice profile, physical profile, sexual profile, kinks, worldbuilding, and MC profile. Or skip the manual work and use Discovery Mode to generate randomized concepts with preference learning.

**Generate** — single drafts, batch temperature sweeps (with partial recovery), section-level regeneration, and Grok web search for worldbuilding research. Supports 2500 or 5000 char backstory tiers.

**Analyze** — automatic quality scoring (novelty, contrast, consistency), overlap detection against saved characters, actionable fix suggestions, and auto-rewrite for overlapping drafts. Severe issues block saving until resolved.

**Redesign** — modify existing characters with a two-phase LLM flow: describe changes, answer probing questions, then selectively rewrite only the sections that need to change.

**Manage** — curated document library with tags, favorites, and synonym-expanded smart recommendations. Saved character library with inline editing, undo/redo, and Kindroid-ready copy-paste transfer view.

## Providers

OpenAI, Anthropic, and xAI (Grok). Configured in-app, stored in browser localStorage. See [docs/providers.md](docs/providers.md).

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Documentation

- [docs/README.md](docs/README.md)
- [docs/workflow.md](docs/workflow.md)
- [docs/providers.md](docs/providers.md)
- [docs/storage.md](docs/storage.md)
- [docs/character-format.md](docs/character-format.md)
- [docs/architecture.md](docs/architecture.md)
- [docs/api-routes.md](docs/api-routes.md)
- [docs/testing.md](docs/testing.md)
- [docs/prompt-design.md](docs/prompt-design.md)
- [docs/roadmap.md](docs/roadmap.md)
- [docs/deployment.md](docs/deployment.md)
- [docs/contributing.md](docs/contributing.md)
- [docs/auth-and-multi-user.md](docs/auth-and-multi-user.md)
- [docs/storage-migration.md](docs/storage-migration.md)

## Project structure

- `app/` Next.js pages and API routes
- `components/` client UI
- `hooks/` stateful workbench logic
- `lib/` generation, parsing, templates, and file-backed data helpers
- `PDF-Text/` repository documents
- `characters/` saved character markdown files

## Notes

- Storage is file-based. There is no database.
- `CLAUDE.md` is still useful as an internal engineering reference, but the `docs/` folder is now the main repo documentation surface.

# Kindroid Character Workbench

Local-first Next.js app for building Kindroid characters against a curated repository of best-practice documents.

## What it does

- Uses `PDF-Text/` as the live knowledge library for prompting
- Lets you add, archive, tag, and favorite repository documents
- Generates character drafts from selected docs plus optional reference characters
- Supports guided character building with structured inputs for backstory, relationship dynamic, voice, emotional logic, scenarios, and MC profile
- Supports batch generation across multiple temperatures
- Supports section-level regeneration and prompt preview flows
- Saves generated characters into `characters/`
- Provides a dedicated saved-character library at `/characters`

## Current provider support

- OpenAI
- Anthropic
- xAI

Provider settings are configured in-app and stored locally in the browser. See [docs/providers.md](docs/providers.md).

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

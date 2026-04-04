# Deployment

This project is local-first by design today.

## Current reality

The supported deployment model is:

- run locally with `npm run dev`
- optionally run a local production build with `npm run build` and `npm run start`

There is no dedicated cloud deployment workflow, no infrastructure-as-code, and no production-specific environment setup in the repo.

## Why the app is still local-first

Several current design choices assume a local single-user environment:

- provider settings and API keys are stored in browser `localStorage`
- source documents live directly on the server filesystem
- saved characters are written directly to the local `characters/` folder
- archived content is implemented with file moves, not durable object storage

Relevant files:

- [../hooks/use-workbench.ts](../hooks/use-workbench.ts)
- [../components/character-library.tsx](../components/character-library.tsx)
- [../lib/library.ts](../lib/library.ts)
- [../lib/characters.ts](../lib/characters.ts)

## Development networking

The project currently allows a specific local network origin in [../next.config.ts](../next.config.ts) through `allowedDevOrigins`.

That is a development convenience, not a production deployment strategy.

## If you want to run it locally in production mode

Use:

```bash
npm install
npm run build
npm run start
```

This is still a local or self-managed runtime model.

## Hosted deployment caveats

You can technically deploy a Next.js app like this, but the product is not yet prepared for hosted use without more design work.

Main blockers:

- no auth model
- no server-side secret management strategy
- file-based storage assumes writable local disk
- no tenant separation
- no rate limiting or abuse protection on generation routes

## What would need to change before a real hosted deployment

### Secrets

Move provider credentials out of browser storage for hosted use, or make the user explicitly bring their own key in a safer session model.

### Storage

Replace or abstract filesystem writes for:

- repository documents
- metadata
- character files
- archives

### Auth

Add a clear model for:

- user identity
- per-user content isolation
- who is allowed to call generation routes

### Operational controls

Add:

- logging
- request validation
- quota and rate controls
- better error instrumentation

## Release guidance for now

The practical release model today is:

- make code changes locally
- verify with `npm run build`
- manually verify key workflows
- commit intentionally

Until the architecture changes, treat this project as a local application first and a deployable product second.

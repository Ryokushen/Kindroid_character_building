# Contributing

This project is still moving quickly, so contributions should optimize for clarity and consistency over abstraction for its own sake.

## Core principles

- preserve the local-first model unless you are intentionally changing architecture
- keep prompt behavior explicit and inspectable
- prefer reversible file operations over destructive ones
- update docs when you change user-facing behavior

## Before you change code

Read these first:

- [architecture.md](architecture.md)
- [workflow.md](workflow.md)
- [prompt-design.md](prompt-design.md)
- [storage.md](storage.md)

## Contributor checklist

When you add or change a feature:

- update the relevant docs in `docs/`
- update the root [../README.md](../README.md) if the repo entry point changes
- verify `npm run build`
- manually verify the affected workflow

## Common extension points

### Add a new personality template

Edit:

- [../lib/templates.ts](../lib/templates.ts)

Keep each template:

- human-readable
- behaviorally useful
- distinct from the others

### Add a new backstory architecture

Edit:

- [../lib/backstory-architectures.ts](../lib/backstory-architectures.ts)

Architectures should define relationship structure and stakes, not just style.

### Add a new scenario modifier

Edit:

- [../lib/scenario-templates.ts](../lib/scenario-templates.ts)

Scenario modifiers should create situational pressure or context, not duplicate template behavior.

### Add a new how-they-met preset

Edit:

- [../lib/how-they-met.ts](../lib/how-they-met.ts)

Good presets should influence:

- backstory
- key memories
- greeting tone

### Add a new provider

Update:

- provider UI in `components/provider-settings.tsx`
- provider type definitions in [../lib/types.ts](../lib/types.ts)
- adapter logic in [../lib/generation.ts](../lib/generation.ts)
- docs in [providers.md](providers.md)

### Add a new guided builder section

You will usually need to touch:

- [../lib/types.ts](../lib/types.ts)
- [../hooks/use-workbench.ts](../hooks/use-workbench.ts)
- one or more UI components under `components/`
- [../lib/generation.ts](../lib/generation.ts)
- [prompt-design.md](prompt-design.md)

### Change the generated markdown format

If you change the output structure, update all of:

- [../lib/generation.ts](../lib/generation.ts)
- [../lib/section-parser.ts](../lib/section-parser.ts)
- [character-format.md](character-format.md)

## Guardrails

### Do not silently widen scope

If a change starts assuming:

- multi-user storage
- public deployment
- server-side account ownership
- durable cloud persistence

document that architectural shift clearly instead of letting it arrive accidentally.

### Do not leave docs behind

This repo already drifted once between implementation and documentation. Avoid repeating that.

### Do not break file-backed safety

Be careful with:

- document archive flows
- character archive flows
- filename sanitization
- parser tolerance for older character files

## Verification expectations

Minimum:

```bash
npm run build
```

Then manually verify the feature you changed. See [testing.md](testing.md).

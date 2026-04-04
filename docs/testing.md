# Testing and Verification

This project currently relies more on build verification and manual workflow checks than on automated tests.

## Current baseline

There is no formal automated test suite in `package.json` yet.

The current minimum verification step is:

```bash
npm run build
```

That verifies:

- Next.js compilation
- TypeScript type-checking during build
- route/page build viability

## Recommended local verification flow

After meaningful UI or generation changes, run:

```bash
npm run build
npm run dev
```

Then manually verify the following:

## Main workbench checks

- the homepage loads
- repository documents appear in the library panel
- document preview renders
- selecting and deselecting docs updates state correctly
- adding a document works
- archiving a document removes it from the active list
- tags and favorites still behave correctly

## Provider and generation checks

- provider settings persist in local storage
- the correct provider type can be selected
- prompt preview builds without calling the model
- single draft generation returns markdown
- batch generation returns multiple results
- section regeneration works on parsed sections

## Character library checks

- saving a generated character creates a file in `characters/`
- updating a character persists changes
- deleting a character moves it to `characters/archive/`
- `/characters` loads and displays saved entries
- Kindroid-ready parsing still works for generated files

## Prompt and parsing checks

When changing prompt assembly or markdown structure:

- verify generated markdown still matches the parser's expectations
- confirm journals and greetings still parse into the correct sections
- confirm section regeneration is still operating on valid section keys

Relevant files:

- [../lib/generation.ts](../lib/generation.ts)
- [../lib/section-parser.ts](../lib/section-parser.ts)
- [../lib/types.ts](../lib/types.ts)

## When this doc should change

Update this page when any of the following happen:

- a real automated test suite is introduced
- a test command is added to `package.json`
- deployment checks differ from local checks
- the primary manual workflow changes

## Recommended future additions

- smoke tests for route handlers
- parser tests for multiple character markdown variants
- prompt-preview regression tests
- end-to-end UI checks for save/update/archive flows

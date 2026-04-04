# Storage

The app uses file-based storage. There is no database.

## Repository documents

Active source documents live in:

- `PDF-Text/`

Archived documents live in:

- `PDF-Text/.archive/`

Supported document types:

- `.txt`
- `.md`

Document handling lives in [../lib/library.ts](../lib/library.ts).

## Document metadata

Tags and favorites are stored in:

- `PDF-Text/.metadata.json`

Metadata handling lives in [../lib/metadata.ts](../lib/metadata.ts).

Current metadata shape:

- `tags: string[]`
- `favorite: boolean`
- `updatedAt: string`

## Characters

Active character files live in:

- `characters/`

Archived characters live in:

- `characters/archive/`

Character CRUD lives in [../lib/characters.ts](../lib/characters.ts).

## Storage behavior

- New generated characters are written as markdown files with a timestamp prefix.
- Deleted characters are moved to archive instead of being permanently removed.
- Repository documents are sanitized to safe filenames before writing.
- Hidden files are not treated as normal library documents.

## Why this matters

Because everything is file-backed:

- the repo itself is the source of truth
- backups are straightforward
- Git can capture content changes
- future migration to a database can happen later if needed, without blocking the current product

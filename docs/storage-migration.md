# Storage Migration

The project currently uses the filesystem as its primary data store.

That is simple and effective for the current local-first product, but it should be treated as an implementation choice that may later need abstraction.

## Current storage model

Today the app writes and reads from:

- `PDF-Text/`
- `PDF-Text/.archive/`
- `PDF-Text/.metadata.json`
- `characters/`
- `characters/archive/`

Relevant code:

- [../lib/library.ts](../lib/library.ts)
- [../lib/metadata.ts](../lib/metadata.ts)
- [../lib/characters.ts](../lib/characters.ts)

## Why migrate later

Migration pressure will likely come from one of these needs:

- hosted deployment
- multi-user separation
- better search and querying
- revisions and history
- safer backups and restore flows

## What should remain stable across a migration

Even if storage changes, these conceptual models should survive:

- repository documents
- document metadata
- active characters
- archived characters
- predictable character markdown format

Those concepts are more important than the specific directory layout.

## Recommended migration approach

Do not couple the UI directly to a database migration story.

Instead:

### 1. Preserve the existing domain model

Keep the current concepts stable:

- list library documents
- create document
- archive document
- read and update metadata
- list/save/update/archive characters

### 2. Move file access behind clearer boundaries

The current `lib/` helpers are already the right place to isolate storage logic.

If migration starts, prefer introducing storage adapters behind:

- library operations
- metadata operations
- character operations

### 3. Migrate one storage slice at a time

Do not rewrite everything at once.

Safer order:

1. metadata
2. character records
3. repository document storage
4. archives and recovery flows

### 4. Preserve import/export simplicity

One advantage of the current design is that the repo contents are easy to inspect and back up.

If storage moves to a database or object store, keep a path for:

- exporting characters as markdown
- exporting repository docs
- restoring archived content

## Migration risks

The highest-risk areas are:

- archive semantics changing silently
- parser assumptions breaking on migrated content
- losing filename stability for existing references
- disconnect between metadata and underlying files

## Practical contributor rule

If you introduce a new storage-backed feature today, ask:

- does this belong in the filesystem model?
- does it need a stable abstraction so a future migration is easier?

If the answer is yes, keep the logic in `lib/` and avoid pushing storage-specific assumptions deeper into UI components.

## Related docs

- [storage.md](storage.md)
- [auth-and-multi-user.md](auth-and-multi-user.md)
- [deployment.md](deployment.md)
- [architecture.md](architecture.md)

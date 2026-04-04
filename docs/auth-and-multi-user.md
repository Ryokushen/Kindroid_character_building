# Auth and Multi-User

This project does not currently implement authentication or multi-user isolation.

That is an intentional description of reality, not an oversight in the docs.

## Current state

The app behaves like a local single-operator tool:

- provider settings live in browser `localStorage`
- repository documents live in the local project directory
- characters are written directly to the local filesystem
- API routes assume the caller is the local UI

This means the current product boundary is:

- one machine
- one operator
- one shared local repository

## What the app is not doing today

It is not currently handling:

- user accounts
- sessions
- role-based access
- per-user document ownership
- per-user character libraries
- secure hosted key management

## Why this matters

A lot of future product decisions depend on whether the app stays local-first or becomes hosted and multi-user.

Those are not small implementation details. They change:

- storage layout
- route protections
- credential handling
- cost controls
- data ownership assumptions

## Decision boundary

Before building true hosted deployment, decide which model the project wants:

### Model A: Stay local-first

Characteristics:

- user brings their own model keys
- filesystem storage remains the source of truth
- no account system is needed
- collaboration is out of scope

This is the lowest-complexity path.

### Model B: Hosted, but still bring-your-own-key

Characteristics:

- users log in
- each user manages their own provider credentials
- data isolation becomes mandatory
- the server must stop assuming one shared filesystem view

This is significantly more complex than the current model.

### Model C: Fully hosted managed product

Characteristics:

- the platform may broker model usage
- billing and abuse controls matter
- auth becomes core infrastructure
- storage, privacy, and quota management become first-class concerns

This is a different product category from the current app.

## Recommended rule for contributors

Do not casually introduce multi-user assumptions into individual features.

If a feature needs:

- ownership
- access control
- shared collaboration
- user-specific storage

then that feature should be treated as an architectural decision, not a local patch.

## Likely first steps if multi-user support is pursued later

- choose an auth provider and identity model
- define what a "workspace" means
- define ownership for documents and saved characters
- move storage behind a real abstraction layer
- move secrets out of browser `localStorage`

## Related docs

- [deployment.md](deployment.md)
- [storage.md](storage.md)
- [storage-migration.md](storage-migration.md)
- [roadmap.md](roadmap.md)

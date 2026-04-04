# Roadmap

This page captures the current direction of the project as it exists today.

It is not a promise list. It is a working statement of priority and scope.

## Current product shape

The app is currently:

- a local-first Kindroid character builder
- backed by filesystem storage instead of a database
- powered by user-supplied model credentials
- optimized for a single operator on a local machine

It is not yet:

- a multi-user SaaS
- a hosted production app with account isolation
- a stable external API platform

## Near-term priorities

### 1. Documentation and repo clarity

Priority because the product has already outgrown the original MVP docs.

Focus:

- keep docs aligned with the real app surface
- reduce contributor ambiguity
- make feature boundaries explicit

### 2. Retrieval quality

The app already uses repository documents as context, but retrieval is still relatively direct.

Likely next improvements:

- better document ranking
- chunk selection
- more explainable recommendation logic
- prompt-budget discipline as the repository grows

### 3. Character refinement workflow

The generation flow exists, but the refinement story can still improve.

Likely areas:

- stronger side-by-side editing
- clearer diffing between versions
- more granular section regeneration
- reusable prompt presets for different use cases

### 4. Library management

The repository and character library are usable, but not mature.

Likely areas:

- richer search
- filtering and sorting
- better archive recovery flows
- more metadata on saved characters

## Mid-term direction

### Provider maturity

The project already supports multiple providers, but it does not yet have:

- stronger provider validation
- retry handling
- usage accounting
- fallback behavior

### Quality and test coverage

The project needs stronger regression protection around:

- prompt assembly
- parser behavior
- route contracts
- core CRUD flows

### Safer hosting posture

If the app moves beyond local-only use, the biggest architectural questions are:

- where secrets live
- how users authenticate
- how file-backed content is replaced or isolated
- how model costs are controlled

## Explicit non-goals for now

Until the architecture changes, the project should not pretend to be:

- multi-tenant
- enterprise-secure
- deployment-ready for arbitrary public traffic
- database-backed with full revision history

## Decision rule

When choosing between features, prefer work that improves:

- character quality
- prompt reliability
- local workflow speed
- maintainability of the knowledge repository

Prefer postponing work that assumes a production SaaS architecture the codebase does not yet have.

# API Routes

This project uses Next.js App Router route handlers under `app/api/`.

These routes are primarily consumed by the local UI. They are not currently documented as a stable external API contract.

## Generate routes

### `POST /api/generate`

Primary single-draft generation route.

Expects a JSON body shaped like the generation payload in [../lib/types.ts](../lib/types.ts), including:

- `brief`
- `notes`
- `selectedDocuments`
- `selectedCharacters`
- guided builder fields
- `provider`

Returns:

- `{ markdown }` on success
- `{ error }` with status `400` on validation or provider-call failure

Implementation: [../app/api/generate/route.ts](../app/api/generate/route.ts)

### `POST /api/generate/batch`

Runs multiple generations at different temperatures.

Additional input:

- `temperatures: number[]`

Rules:

- expects 2 to 4 temperature values
- returns results in the same logical shape as a batch of single generations

Returns:

- `{ results: Array<{ temperature, markdown }> }`

Implementation: [../app/api/generate/batch/route.ts](../app/api/generate/batch/route.ts)

### `POST /api/generate/preview`

Builds the prompt preview without calling the model.

Useful for:

- inspecting prompt assembly
- understanding token/character growth
- debugging guided builder contributions

Returns:

- `system`
- `user`
- `systemChars`
- `userChars`
- `totalChars`
- `documentCount`
- `characterCount`

Implementation: [../app/api/generate/preview/route.ts](../app/api/generate/preview/route.ts)

### `POST /api/generate/section`

Regenerates a single parsed section of an existing character.

Required input:

- `sectionKey`
- `sectionLabel`
- `provider`

Optional but normally expected:

- `currentContent`
- `brief`
- `notes`
- `fullCharacterContext`
- `selectedDocuments`

Returns:

- `{ content }`

Implementation: [../app/api/generate/section/route.ts](../app/api/generate/section/route.ts)

## Library routes

### `GET /api/library`

Returns the current active repository documents.

Returns:

- `{ documents }`

### `POST /api/library`

Adds a repository document from form data.

Accepted form fields:

- `title`
- `content`
- `file`

Behavior:

- uploaded file content overrides pasted content when present
- only `.txt` and `.md` documents are supported
- document names are sanitized before writing

Returns:

- `{ document, documents, message }`

Implementation: [../app/api/library/route.ts](../app/api/library/route.ts)

### `POST /api/library/archive`

Archives an active repository document.

Required JSON body:

- `fileName`

Returns:

- `{ documents, message }`

Implementation: [../app/api/library/archive/route.ts](../app/api/library/archive/route.ts)

### `GET /api/library/metadata`

Returns the current document metadata store.

Returns:

- `{ metadata }`

### `PATCH /api/library/metadata`

Updates tags and/or toggles favorite state for a document.

Accepted JSON fields:

- `fileName`
- `tags?: string[]`
- `favorite?: "toggle"`

Returns:

- `{ metadata }`

Implementation: [../app/api/library/metadata/route.ts](../app/api/library/metadata/route.ts)

## Character routes

### `GET /api/characters`

Returns active saved characters.

Returns:

- `{ characters }`

### `POST /api/characters`

Creates a new character file from markdown.

Required JSON body:

- `markdown`

Returns:

- `{ character, characters, message }`

### `PATCH /api/characters`

Updates an existing character markdown file.

Required JSON body:

- `fileName`
- `markdown`

Returns:

- `{ character, characters, message }`

### `DELETE /api/characters`

Archives an existing character file.

Required JSON body:

- `fileName`

Returns:

- `{ characters, message }`

Implementation: [../app/api/characters/route.ts](../app/api/characters/route.ts)

## Error model

Current route behavior is intentionally simple:

- validation failures generally return `400`
- read failures may return `500` in metadata read paths
- error bodies are plain JSON objects with an `error` string

## Important note

These routes are coupled to the current local UI. If you expose them externally later, add:

- versioning
- authentication
- request/response schemas
- stricter validation
- rate limiting

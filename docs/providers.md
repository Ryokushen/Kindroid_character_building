# Providers

The app supports multiple LLM providers through the in-app provider settings.

## Supported provider types

- `openai`
- `anthropic`
- `xai`

Provider type is part of `ProviderSettings` in [../lib/types.ts](../lib/types.ts).

## What the UI stores

The workbench stores provider settings in browser `localStorage`.

Important details:

- the current provider config is stored locally in the browser
- API keys are stored per provider type
- there is no server-side secrets store in this project

This behavior is implemented in [../hooks/use-workbench.ts](../hooks/use-workbench.ts).

## Request handling

Provider-specific request formatting lives in [../lib/generation.ts](../lib/generation.ts).

Current behavior:

- OpenAI uses chat completions style requests
- xAI uses the same OpenAI-compatible request shape
- Anthropic uses the `messages` API shape with Anthropic-specific headers and request body structure

## Required fields

Every provider requires:

- `baseUrl`
- `model`
- `apiKey`
- `temperature`

If any required field is missing, generation routes return a `400` error.

## Operational notes

- The project currently assumes direct API calls from the Next.js server routes.
- There is no usage tracking, retry layer, or provider abstraction package yet.
- If you add another provider, update both the provider UI and the generation adapter logic.

## Future documentation worth adding

- exact example provider configurations
- rate-limit and timeout behavior
- model recommendations by use case

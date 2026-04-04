# Prompt Design

This page explains how the guided builder contributes to the final prompt sent to the model.

The central implementation lives in [../lib/generation.ts](../lib/generation.ts).

## Prompt structure

Generation uses two main prompt layers:

- a large system prompt containing Kindroid platform rules, field limits, and output requirements
- a user prompt assembled from the freeform brief, optional structured builder inputs, selected docs, and reference characters

The user prompt is built by `buildUserPrompt()`.

## Design principle

The guided builder is meant to add specificity without forcing structure when the user does not need it.

In practice, that means:

- empty sections should add little or nothing
- selected presets should inject concrete prompt additions
- structured inputs should bias behavior and formatting, not hard-script every output detail

## Freeform brief

The brief remains the center of gravity.

If the brief and guided builder disagree, the generator should generally treat the brief as primary intent and the structured inputs as supporting constraints.

## Style modifiers

Template selections come from [../lib/templates.ts](../lib/templates.ts) and are resolved through [../components/template-selector.tsx](../components/template-selector.tsx).

These modifiers are best for:

- tonal bias
- personality texture
- framing the character's social energy

They are not meant to replace backstory logic or relationship specifics.

## Backstory architectures

Backstory architectures come from [../lib/backstory-architectures.ts](../lib/backstory-architectures.ts).

These should shape:

- relationship structure
- stakes
- pre-existing history
- why the dynamic matters

They should not collapse the character into a trope-only output. The architecture is scaffolding, not the whole character.

## Scenario modifiers

Scenario templates come from [../lib/scenario-templates.ts](../lib/scenario-templates.ts).

These are intended to bias:

- situational tension
- social setting
- emotional tone
- what kinds of interactions feel plausible

They should help the model answer "what kind of story pressure is this character under?"

## How-they-met presets

How-they-met options come from [../lib/how-they-met.ts](../lib/how-they-met.ts).

These are especially important because they influence multiple downstream sections:

- backstory
- key memories
- greeting tone

The preset should create relationship specificity, not just a cute origin anecdote.

## Physical profile

The physical profile should bias visual coherence:

- avatar prompt
- selfie description
- presence cues in the character voice

It should not dominate unrelated sections unless appearance is part of the concept.

## Emotional logic

Emotional logic is one of the highest-value structured inputs.

It should shape:

- wound
- coping style
- contradiction
- how intimacy affects behavior

If a generated character feels generic, weak emotional logic is often the cause.

## Relationship dynamic

This should guide:

- power balance
- pacing
- attachment patterns
- what the character wants versus what they admit wanting

This input helps prevent generic chemistry and vague attraction language.

## Voice profile

Voice profile should affect:

- rhythm
- humor
- texting energy
- code-switching
- verbal habits

It should be especially visible in:

- response directive
- example message
- greetings

## Sexual profile and kink selection

These inputs are treated as optional and conditional.

Current generator behavior:

- sexual guidance only matters when those inputs are actually provided
- the model is instructed to generate a subset of fitting behaviors, not blindly assign every preference
- emotional logic should shape sexual behavior instead of the other way around

This is implemented in the sexual journal instructions inside [../lib/generation.ts](../lib/generation.ts).

## Journal categories

Journal categories tell the generator where to spend memory budget.

Use them to force coverage in areas like:

- daily life
- family
- work
- insecurity
- conflict
- milestones

These categories should help the resulting character feel usable in long-form chat, not just strong in the first scene.

## MC profile

The male main-character profile is meant to ground the female character in a specific relational context without making her identity purely reactive.

Good usage:

- integrate his name and current role in key memories
- let her perception of him color parts of the backstory
- use him to sharpen specificity

Bad usage:

- turning her into a character who only exists to orbit him

## Reference characters and repository docs

The final user prompt always includes:

- repository context for best-practice guidance
- selected reference characters for structure and specificity examples

Repository docs should influence correctness.
Reference characters should influence quality and structure.
Neither should become a direct copy source.

## Prompt-design guardrails

When editing prompt assembly, preserve these properties:

- empty optional fields should not flood the prompt
- preset additions should remain readable prose, not raw internal IDs
- relationship logic should appear before raw repository dumps when possible
- document context and reference characters should stay clearly labeled
- section regeneration rules must stay tighter than full-draft generation rules

## When to update this doc

Update this page when:

- a new guided builder section is added
- prompt assembly order changes materially
- a preset library changes purpose
- provider-specific prompt handling diverges

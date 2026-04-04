import { NextResponse } from "next/server";
import { callModel } from "@/lib/model-client";
import type { ProviderSettings } from "@/lib/types";

const CONCEPT_SYSTEM_PROMPT = `You are a character concept generator for a romance-focused AI companion builder. Given a set of personality seeds, backstory directions, and relationship dynamics, create a vivid 3-4 sentence character concept.

Your output must include:
- A full name (first and last, culturally appropriate if ethnicity is specified)
- Age and occupation (specific, grounded, interesting)
- A one-line hook that makes this person immediately compelling
- The specific tension or dynamic between her and the male MC
- A concrete detail that makes her feel real (a habit, a specific thing she owns, something she does)

Write in present tense, third person. Be specific — not "she works in food service" but "she runs the taco truck parked outside his office three days a week." Not "she has trust issues" but "she screenshots conversations before deleting them."

Do NOT include any formatting, headers, or bullet points. Just 3-4 vivid sentences that make someone want to generate this character.`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      seedSummary: string;
      templateNames: string[];
      backstoryName: string;
      scenarioName: string;
      howTheyMetName: string;
      emotionalLogic: { wound: string; armor: string };
      physicalHints: string;
      mcName: string;
      provider: Partial<ProviderSettings>;
    };

    if (!body.provider?.baseUrl?.trim() || !body.provider?.model?.trim() || !body.provider?.apiKey?.trim()) {
      return NextResponse.json({ error: "Provider settings required for concept generation." }, { status: 400 });
    }

    const userPrompt = [
      `Personality direction: ${body.templateNames.join(" + ")}`,
      `Backstory pattern: ${body.backstoryName}`,
      `Scenario: ${body.scenarioName}`,
      `How they met: ${body.howTheyMetName}`,
      `Emotional wound: ${body.emotionalLogic.wound}`,
      `Emotional armor: ${body.emotionalLogic.armor}`,
      body.physicalHints ? `Physical notes: ${body.physicalHints}` : "",
      body.mcName ? `The male MC's name is ${body.mcName} — use it naturally.` : "",
      "",
      "Generate the character concept. 3-4 sentences, vivid and specific.",
    ].filter(Boolean).join("\n");

    const concept = await callModel(
      body.provider.providerType ?? "openai",
      body.provider.baseUrl!,
      body.provider.apiKey!,
      body.provider.model!,
      1.1,
      CONCEPT_SYSTEM_PROMPT,
      userPrompt,
    );

    return NextResponse.json({ concept });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate concept." },
      { status: 400 },
    );
  }
}

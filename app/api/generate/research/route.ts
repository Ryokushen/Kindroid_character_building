import { NextResponse } from "next/server";
import { callXAIWithSearch } from "@/lib/model-client";
import type { ProviderSettings, ResearchSuggestion } from "@/lib/types";

const RESEARCH_SYSTEM_PROMPT = `You are a worldbuilding research assistant for Kindroid AI companion characters. The user will give you a search query — typically a real-world location, cultural topic, or social dynamic. Use web search to find accurate, current information, then format your findings as Global Journal entry suggestions for the Kindroid platform.

## OUTPUT FORMAT

Return ONLY a valid JSON array of objects. No markdown, no explanation, no code fences. Each object:

{
  "title": "Short descriptive title (e.g. 'Beale Street, Memphis')",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "entryText": "Third-person factual paragraph under 450 characters. Include sensory details, atmosphere, social texture, and who inhabits the space. Written as Kindroid journal entry prose — concise, specific, evocative.",
  "type": "location | lore | lexicon"
}

## RULES

- Generate 3-6 suggestions per query
- **Keywords** must be specific proper nouns or unique terms (place names, landmark names, local slang). NEVER generic words like "city" "street" "food" "music"
- **entryText** must be under 450 characters — this is a hard Kindroid platform limit
- **type** classification:
  - "location" = a specific place with physical atmosphere and sensory details
  - "lore" = historical facts, social dynamics, cultural context, political texture
  - "lexicon" = local slang, nicknames, proper nouns unique to this area that make good journal keywords
- Write in third person, factual, present tense where possible
- For locations: include what it looks, sounds, and smells like. Who goes there. What it feels like at different times of day
- For lore: include real history, demographics, social patterns, local culture
- For lexicon: explain the term and how locals use it — these become the vocabulary for triggering journal entries
- Ground everything in real, searchable facts — do not invent or embellish`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      query: string;
      provider: Partial<ProviderSettings>;
    };

    if (!body.query?.trim()) {
      return NextResponse.json({ error: "Search query is required." }, { status: 400 });
    }

    const prov = body.provider;
    if (prov?.providerType !== "xai") {
      return NextResponse.json(
        { error: "Web search research requires xAI (Grok) as the provider. Switch to xAI in Provider Settings." },
        { status: 400 },
      );
    }

    if (!prov?.baseUrl?.trim() || !prov?.model?.trim() || !prov?.apiKey?.trim()) {
      return NextResponse.json(
        { error: "xAI provider config incomplete — check base URL, model, and API key." },
        { status: 400 },
      );
    }

    const userPrompt = `Research this topic for worldbuilding journal entries: ${body.query.trim()}\n\nFind real-world information and create Global Journal entry suggestions. Return ONLY the JSON array.`;

    const rawResponse = await callXAIWithSearch(
      prov.baseUrl!,
      prov.apiKey!,
      prov.model!,
      RESEARCH_SYSTEM_PROMPT,
      userPrompt,
    );

    // Parse the JSON response — handle possible markdown code fences
    const jsonStr = rawResponse
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    let suggestions: ResearchSuggestion[];
    try {
      suggestions = JSON.parse(jsonStr) as ResearchSuggestion[];
    } catch {
      // If JSON parsing fails, try to extract array from the response
      const arrayMatch = rawResponse.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        suggestions = JSON.parse(arrayMatch[0]) as ResearchSuggestion[];
      } else {
        throw new Error("Could not parse research results. The model did not return valid JSON.");
      }
    }

    // Validate and clean suggestions
    suggestions = suggestions
      .filter((s) => s.title && s.entryText && s.keywords?.length > 0)
      .map((s) => ({
        title: s.title.trim(),
        keywords: s.keywords.map((k) => k.trim()).filter(Boolean),
        entryText: s.entryText.trim().slice(0, 500),
        type: ["location", "lore", "lexicon"].includes(s.type) ? s.type : "lore",
      }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to complete research.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// src/services/gemini.js
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY missing in .env");
}

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-001",
  "gemini-1.5-pro-001",
];

async function callGeminiWithFirstWorkingModel(promptText) {
  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.3,
      },
    };

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await resp.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch (e) {
        console.error(`Model ${model} returned non-JSON:`, text);
        continue;
      }

      if (!resp.ok || body.error) {
        console.error(`Model ${model} failed:`, body.error || body);
        continue;
      }

      return body;
    } catch (e) {
      console.error(`Fetch error for model ${model}:`, e.message);
      continue;
    }
  }

  return null;
}

export async function generateRecipe(filters) {
  if (!apiKey) return null;

  // filters can be { query, cuisine, maxTimeMinutes, dietaryRestrictions, difficulty, notes }
  const {
    query,
    cuisine,
    maxTimeMinutes,
    dietaryRestrictions,
    difficulty,
    notes,
  } = typeof filters === "string" ? { query: filters } : filters || {};

  if (!query || !query.trim()) return null;

  // build constraint text
  const constraintLines = [];
  if (cuisine) constraintLines.push(`Cuisine: ${cuisine}.`);
  if (maxTimeMinutes)
    constraintLines.push(`Total time must be <= ${maxTimeMinutes} minutes.`);
  if (dietaryRestrictions)
    constraintLines.push(
      `Dietary restrictions to respect: ${dietaryRestrictions}.`
    );
  if (difficulty)
    constraintLines.push(`Difficulty level: ${difficulty.toUpperCase()}.`);
  if (notes) constraintLines.push(`Other details: ${notes}.`);

  const constraintsText =
    constraintLines.length > 0
      ? "Constraints:\n" + constraintLines.map((l) => "- " + l).join("\n")
      : "Constraints:\n- None specified.";

  const prompt = `
Create a cooking recipe in JSON using the user's ingredients or idea.

User query: "${query}"

${constraintsText}

Return ONLY JSON like:
{
  "title": "...",
  "ingredients": [
    { "name": "...", "quantity": "..." }
  ],
  "instructions": ["step 1", "step 2"],
  "prep_time_minutes": 10,
  "difficulty_level": "EASY",
  "estimated_calories": 250,
  "recipe_id": "TEMP_ID"
}

Rules:
- Obey dietary restrictions if given.
- If a max time is provided, keep prep_time_minutes <= that value.
- If a difficulty is provided, make instructions match it (short for EASY, more steps for HARD).
- Do not add comments or prose outside JSON.
`;

  const result = await callGeminiWithFirstWorkingModel(prompt);
  if (!result) return null;

  const jsonText =
    result?.candidates?.[0]?.content?.parts?.[0]?.text ??
    result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
    null;

  if (!jsonText) {
    console.error("Gemini response didn't contain JSON text:", result);
    return null;
  }

  const trimmed = jsonText.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", e.message, trimmed);
      return null;
    }
  }

  console.error("Gemini returned non-object JSON text:", trimmed);
  return null;
}

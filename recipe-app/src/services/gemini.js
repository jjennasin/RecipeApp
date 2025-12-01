// src/services/gemini.js
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY missing in .env");
}

// We KNOW this one worked for you earlier.
const CANDIDATE_TEXT_MODELS = ["gemini-2.5-flash"];
const CANDIDATE_IMAGE_MODELS = ["gemini-2.5-flash"];
const IMAGE_MODEL = "gemini-2.5-flash-image";


// ---------- HELPERS ----------

// Call Gemini expecting JSON in parts[0].text
async function callGeminiForJson(promptText) {
  for (const model of CANDIDATE_TEXT_MODELS) {
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
        console.error(`Text model ${model} returned non-JSON:`, text);
        continue;
      }

      if (!resp.ok || body.error) {
        console.error(`Text model ${model} failed:`, body.error || body);
        continue;
      }

      return body;
    } catch (e) {
      console.error(`Fetch error for text model ${model}:`, e);
      continue;
    }
  }

  return null;
}

// Call Gemini expecting an image (PNG) and return a data URL
async function callGeminiForImage(promptText) {
  if (!apiKey) {
    console.error("No GEMINI_API_KEY set for image generation.");
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: promptText }] }],
    // important: NO response_mime_type here
  };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await resp.json();

    if (!resp.ok || body.error) {
      console.error("Gemini image error:", body.error || body);
      return null;
    }

    const parts =
      body?.candidates?.[0]?.content?.parts ||
      body?.content?.parts ||
      [];

    const inlinePart = parts.find(
      (p) => p.inlineData && p.inlineData.data
    );

    if (!inlinePart) {
      console.error("No inlineData.data found in image response:", body);
      return null;
    }

    const base64 = inlinePart.inlineData.data;
    const mime = inlinePart.inlineData.mimeType || "image/png";

    // This is what your React <img src="..."> will use
    return `data:${mime};base64,${base64}`;
  } catch (e) {
    console.error("Fetch error in image call:", e);
    return null;
  }
}


// ---------- MAIN EXPORT ----------

export async function generateRecipe(filtersOrQuery) {
  if (!apiKey) return null;

  const {
    query,
    cuisine,
    maxTimeMinutes,
    dietaryRestrictions,
    difficulty,
    notes,
  } =
    typeof filtersOrQuery === "string"
      ? { query: filtersOrQuery }
      : filtersOrQuery || {};

  if (!query || !query.trim()) return null;

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
[
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
]

Rules:
- Obey dietary restrictions if given.
- If a max time is provided, keep prep_time_minutes <= that value.
- If a difficulty is provided, make instructions match it (short for EASY, more steps for HARD).
- Return an ARRAY with exactly ONE recipe object.
- Do not add comments or prose outside JSON.
`;

  // 1) JSON recipe from Gemini
  const jsonBody = await callGeminiForJson(prompt);

  // 🔁 DEV FALLBACK IF GEMINI FAILS ENTIRELY
  if (!jsonBody) {
    console.warn("Gemini call failed, returning dev fallback recipe.");
    return {
      title: "Dev Mode Lemon Herb Pasta",
      ingredients: [
        { name: "Pasta", quantity: "8 oz" },
        { name: "Olive oil", quantity: "2 tbsp" },
        { name: "Garlic", quantity: "2 cloves" },
      ],
      instructions: [
        "Boil pasta according to package instructions.",
        "Sauté garlic in olive oil.",
        "Toss pasta with garlic oil and serve.",
      ],
      prep_time_minutes: 10,
      difficulty_level: "EASY",
      estimated_calories: 350,
      recipe_id: "DEV_001",
      imageDataUrl:
        "https://images.pexels.com/photos/8500/food-dinner-pasta-spaghetti-8500.jpg?auto=compress&cs=tinysrgb&w=600",
    };
  }

  const jsonText =
    jsonBody?.candidates?.[0]?.content?.parts?.[0]?.text ??
    jsonBody?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
    null;

  if (!jsonText) {
    console.error("Gemini JSON response didn't contain text:", jsonBody);
    return null;
  }

  const trimmed = jsonText.trim();
  let recipeObj;

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        console.error("Gemini returned an empty array for recipe JSON:", parsed);
        return null;
      }
      recipeObj = parsed[0];
    } else if (parsed && typeof parsed === "object") {
      recipeObj = parsed;
    } else {
      console.error("Gemini returned JSON that is not an object or array:", parsed);
      return null;
    }
  } catch (e) {
    console.error("Failed to parse Gemini recipe JSON:", e.message, trimmed);
    return null;
  }

  // 2) Image from Gemini (paid). If it fails, we still have text.
  const titleForImage = recipeObj.title || query || "food dish";
  const imagePrompt = `High-quality appetizing food photograph of the finished dish: "${titleForImage}". 
The image should be suitable for a mobile recipe app UI. No watermarks or text.`;

  const imageDataUrl = await callGeminiForImage(imagePrompt);
  if (imageDataUrl) {
    recipeObj.imageDataUrl = imageDataUrl;
  }

  return recipeObj;
}

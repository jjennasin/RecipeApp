// src/server/api.js
import "dotenv/config";
import express from "express";
import cors from "cors";

import fs from "fs";
import path from "path";
import crypto from "crypto";

import { generateRecipe } from "../services/gemini.js";
import { generateImage } from "../services/gemini-image.js";

const app = express();

// ---- middleware ----
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve generated images as normal URLs like /generated/<file>.png
app.use("/generated", express.static(path.resolve("public/generated")));

// ---- routes ----
app.post("/api/recipe", async (req, res) => {
  const {
    query,
    cuisine,
    maxTimeMinutes,
    dietaryRestrictions,
    difficulty,
    notes,
  } = req.body || {};

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' field." });
  }

  try {
    const aiResult = await generateRecipe({
      query,
      cuisine,
      maxTimeMinutes,
      dietaryRestrictions,
      difficulty,
      notes,
    });

    // TEMP LOG (ok to remove later)
    console.log("RAW GEMINI RECIPE RESULT:", aiResult);

    if (!aiResult) {
      return res.status(200).json({
        title: "Fallback Recipe (AI Failed)",
        ingredients: [
          { name: "Flour", quantity: "1 cup" },
          { name: "Water", quantity: "1/2 cup" },
        ],
        instructions: ["Mix flour and water.", "Cook over medium heat."],
        prep_time_minutes: 5,
        difficulty_level: "EASY",
        estimated_calories: 200,
        image_prompt:
          "Simple bread dough on a wooden board, high-quality food photo.",
        recipe_id: "TEMP_ID",
      });
    }

    // Ensure we always have an image prompt so frontend can request /api/image
    const safeImagePrompt =
      aiResult.image_prompt ||
      `Professional food photography of ${aiResult.title || "the dish"}, plated, natural light, shallow depth of field`;

    return res.json({
      title: aiResult.title || "Untitled Recipe",
      ingredients: aiResult.ingredients || [],
      instructions: aiResult.instructions || [],
      prep_time_minutes: aiResult.prep_time_minutes ?? 0,
      difficulty_level: aiResult.difficulty_level || "N/A",
      estimated_calories: aiResult.estimated_calories ?? 0,
      image_prompt: safeImagePrompt,
      recipe_id: aiResult.recipe_id || "TEMP_ID",
    });
  } catch (err) {
    console.error("Error in /api/recipe:", err);

    return res.status(200).json({
      title: "Error Fallback Recipe",
      ingredients: [{ name: "API Service", quantity: "Unavailable" }],
      instructions: ["Upstream provider failed."],
      prep_time_minutes: 1,
      difficulty_level: "EASY",
      estimated_calories: 0,
      image_prompt: "Abstract error image.",
      recipe_id: "TEMP_ID",
    });
  }
});

// Image generation route:
// Generates image with Imagen, saves it to public/generated/<file>.png,
// returns a normal URL: { imageUrl: "/generated/<file>.png" }
app.post("/api/image", async (req, res) => {
  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' field." });
  }

  try {
    // Generate a data URL (data:image/png;base64,...)
    const dataUrl = await generateImage(prompt);

    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      console.error("generateImage returned invalid dataUrl.");
      return res.status(500).json({ error: "Failed to generate image." });
    }

    // Parse mime + base64 from data URL
    const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      console.error("Bad data URL format.");
      return res.status(500).json({ error: "Bad image data format." });
    }

    const mime = match[1]; // e.g. image/png
    const b64 = match[2];

    const ext = mime.includes("png") ? "png" : "jpg";

    // Ensure folder exists
    const outDir = path.resolve("public/generated");
    fs.mkdirSync(outDir, { recursive: true });

    // Unique filename
    const name = crypto
      .createHash("sha256")
      .update(prompt + Date.now().toString())
      .digest("hex")
      .slice(0, 16);

    const filename = `${name}.${ext}`;
    const filepath = path.join(outDir, filename);

    // Write bytes to disk
    fs.writeFileSync(filepath, Buffer.from(b64, "base64"));

    // Return a normal URL the browser can load
    return res.json({ imageUrl: `http://localhost:3001/generated/${filename}` });

  } catch (err) {
    console.error("Error in /api/image:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ---- start server ----
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Gemini API server running on port ${PORT}`);
});

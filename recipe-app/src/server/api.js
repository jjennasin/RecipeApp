// src/server/api.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { generateRecipe } from "../services/gemini.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/recipe", async (req, res) => {
  const {
    query,
    cuisine,
    maxTimeMinutes,
    dietaryRestrictions,
    difficulty,
    notes,
  } = req.body || {};

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Missing 'query' field." });
  }

  try {
    const recipe = await generateRecipe({
      query,
      cuisine,
      maxTimeMinutes,
      dietaryRestrictions,
      difficulty,
      notes,
    });

    if (!recipe) {
      console.warn("generateRecipe returned null – sending fallback recipe.");

      return res.status(200).json({
        title: "Fallback Recipe",
        ingredients: [{ name: "Ingredient", quantity: "1" }],
        instructions: ["Upstream provider failed."],
        prep_time_minutes: 1,
        difficulty_level: "EASY",
        recipe_id: "TEMP_ID",
        imageDataUrl: null,
      });
    }

    return res.json(recipe);
  } catch (err) {
    console.error("Error in /api/recipe:", err);

    return res.status(200).json({
      title: "Fallback Recipe",
      ingredients: [{ name: "Ingredient", quantity: "1" }],
      instructions: ["Upstream provider failed."],
      prep_time_minutes: 1,
      difficulty_level: "EASY",
      recipe_id: "TEMP_ID",
      imageDataUrl: null,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gemini API server running on port ${PORT}`);
});

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
      });
    }

    const recipe = {
      title: aiResult.title || "Untitled Recipe",
      ingredients: aiResult.ingredients || [],
      instructions: aiResult.instructions || [],
      prep_time_minutes: aiResult.prep_time_minutes || 0,
      difficulty_level: aiResult.difficulty_level || "N/A",
      estimated_calories: aiResult.estimated_calories || 0,
    };

    return res.json(recipe);
  } catch (err) {
    console.error("Error in /api/recipe:", err);

    return res.status(200).json({
      title: "Error Fallback Recipe",
      ingredients: [{ name: "API Service", quantity: "Unavailable" }],
      instructions: ["Upstream provider failed."],
      prep_time_minutes: 1,
      difficulty_level: "EASY",
      estimated_calories: 0,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gemini API server running on port ${PORT}`);
});

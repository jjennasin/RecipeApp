// src/server/api.js
import express from "express";
import cors from "cors";
import { generateRecipe } from "../services/gemini.js";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint: POST /api/recipe
app.post("/api/recipe", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Missing 'query' field." });
  }

  try {
    const recipe = await generateRecipe(query);
    if (!recipe) {
      return res.status(500).json({ error: "Recipe generation failed." });
    }
    res.json(recipe);
  } catch (err) {
    console.error("Error generating recipe:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Gemini API server running on port ${PORT}`)
);

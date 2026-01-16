import "dotenv/config";
import express from "express";
import cors from "cors";
import { generateRecipe } from "../services/gemini.js";
import multer from "multer";
import { spawn } from "child_process";
import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

// compute absolute paths safely
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Configure multer for uploads (preserve extension)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // keep .jpg, .png, etc
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// ✅ POST /api/upload — upload image → detect ingredients → (optionally generate recipe)
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const cuisine = req.body.cuisine || "";
    const maxTimeMinutes = req.body.maxTimeMinutes || "";
    const dietaryRestrictions = req.body.dietaryRestrictions || "";
    const difficulty = req.body.difficulty || "";
    const notes = req.body.notes || "";
    const onlyDetect = req.body.onlyDetect === "true"; // 👈 added flag for frontend

    console.log("📸 Received upload:", filePath);

    // Call Python detection script
    const detectPath = join(__dirname, "../../backend/detect.py");
    const py = spawn("python", [detectPath, filePath]);

    let output = "";
    py.stdout.on("data", (data) => (output += data.toString()));
    py.stderr.on("data", (data) => console.error("PYTHON ERR:", data.toString()));

    py.on("close", async (code) => {
      fs.unlink(filePath, () => {}); // clean up uploaded image
      console.log("YOLO exited with code:", code);

      try {
        const detectedIngredients = JSON.parse(output.trim());
        console.log("✅ Detected ingredients:", detectedIngredients);

        // ✨ Return only detected ingredients if requested
        if (onlyDetect || !cuisine && !maxTimeMinutes && !dietaryRestrictions && !difficulty && !notes) {
          return res.json({ ingredients: detectedIngredients });
        }

        // Otherwise, build the query for Gemini
        const query = `Generate a recipe using: ${detectedIngredients.join(", ")}`;
        console.log("🧠 Calling Gemini with query:", query);

        const aiResult = await generateRecipe({
          query,
          cuisine,
          maxTimeMinutes,
          dietaryRestrictions,
          difficulty,
          notes,
        });

        console.log("📬 Gemini responded with:", aiResult);

        if (!aiResult) {
          return res.status(500).json({ error: "Gemini failed to generate recipe." });
        }

        const recipe = {
          title: aiResult.title || "Untitled Recipe",
          ingredients: aiResult.ingredients || [],
          instructions: aiResult.instructions || [],
          prep_time_minutes: aiResult.prep_time_minutes || 0,
          difficulty_level: aiResult.difficulty_level || "N/A",
          estimated_calories: aiResult.estimated_calories || 0,
        };

        res.json(recipe);
      } catch (err) {
        console.error("❌ Failed to parse Python output:", err, output);
        res.status(500).json({ error: "Failed to parse YOLO output." });
      }
    });
  } catch (err) {
    console.error("❌ Upload route error:", err);
    res.status(500).json({ error: "Upload route failed." });
  }
});


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
  console.log(`🚀 Gemini API server running on port ${PORT}`);
});

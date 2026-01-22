// src/server/api.js
import "dotenv/config";
//TEST
console.log("cwd:", process.cwd());
console.log(
  "GEMINI_API_KEY length:",
  (process.env.GEMINI_API_KEY || "").length
);
console.log(
  "GEMINI_API_KEY starts:",
  (process.env.GEMINI_API_KEY || "").slice(0, 6)
);
//TEST


import express from "express";
import cors from "cors";

import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

import { generateRecipe } from "../services/gemini.js";
import { generateImage } from "../services/gemini-image.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// ---- middleware ----
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve generated images
app.use("/generated", express.static(path.resolve("public/generated")));

// ✅ Multer DISK storage so req.file.path exists
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      
      
      cb(null, unique + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Make sure uploads folder exists
fs.mkdirSync("uploads", { recursive: true });

app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    console.log("📥 UPLOAD HIT");
    console.log("file?", !!req.file);
    console.log("body:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    const filePath = req.file.path;
    const onlyDetect = req.body.onlyDetect === "true";

    console.log("file path:", filePath);
    console.log("file size:", req.file.size);

    const detectPath = join(__dirname, "../../backend/detect.py");
    console.log("running detect:", detectPath);

    const py = spawn("python3", [detectPath, filePath]);

    // ✅ prevent server crash if python is missing or fails to spawn
    py.on("error", (err) => {
      console.error("PYTHON SPAWN ERROR:", err);
      fs.unlink(filePath, () => {});
      return res.status(500).json({
        error: "Failed to start Python. Is python3 installed?",
        details: err.message,
      });
    });

    let out = "";
    let errOut = "";

    py.stdout.on("data", (data) => (out += data.toString()));
    py.stderr.on("data", (data) => (errOut += data.toString()));

    py.on("close", async (code) => {
      // cleanup upload
      fs.unlink(filePath, () => {});

      if (errOut) console.error("PYTHON STDERR:", errOut);
      console.log("python exit code:", code);
      console.log("python raw stdout:", out);

      // ✅ if python failed, return error instead of hanging
      if (code !== 0) {
        return res.status(500).json({
          error: "Ingredient detection failed.",
          details: errOut || out || `exit code ${code}`,
        });
      }

      // ✅ parse JSON from python output
      let detectedIngredients;
      try {
        detectedIngredients = JSON.parse(out.trim());
      } catch (e) {
        return res.status(500).json({
          error: "Detector did not return valid JSON.",
          details: out,
        });
      }

      // ✅ Search.jsx expects this when onlyDetect=true
      if (onlyDetect) {
        return res.json({ ingredients: detectedIngredients });
      }

      // (optional) if you want it to generate a recipe too, you can add that later.
      return res.json({ ingredients: detectedIngredients });
    });
  } catch (e) {
    console.error("UPLOAD ROUTE ERROR:", e);
    return res.status(500).json({ error: "Upload route crashed" });
  }
});


// ---- /api/recipe ----
app.post("/api/recipe", async (req, res) => {
  const { query, cuisine, maxTimeMinutes, dietaryRestrictions, difficulty, notes } = req.body || {};
  if (!query) return res.status(400).json({ error: "Missing 'query' field." });

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
        ingredients: [{ name: "Flour", quantity: "1 cup" }, { name: "Water", quantity: "1/2 cup" }],
        instructions: ["Mix flour and water.", "Cook over medium heat."],
        prep_time_minutes: 5,
        difficulty_level: "EASY",
        estimated_calories: 200,
        image_prompt: "Simple bread dough on a wooden board, high-quality food photo.",
        recipe_id: "TEMP_ID",
      });
    }

    const safeImagePrompt =
      aiResult.image_prompt ||
      `Professional food photography of ${aiResult.title || "the dish"}, plated, natural light`;

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
    return res.status(500).json({ error: "Recipe generation failed." });
  }
});

// ---- /api/image ----
app.post("/api/image", async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Missing 'prompt' field." });

  try {
    const dataUrl = await generateImage(prompt);
    if (!dataUrl?.startsWith("data:image/")) {
      return res.status(500).json({ error: "Failed to generate image." });
    }

    const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) return res.status(500).json({ error: "Bad image data format." });

    const mime = match[1];
    const b64 = match[2];
    const ext = mime.includes("png") ? "png" : "jpg";

    const outDir = path.resolve("public/generated");
    fs.mkdirSync(outDir, { recursive: true });

    const name = crypto
      .createHash("sha256")
      .update(prompt + Date.now().toString())
      .digest("hex")
      .slice(0, 16);

    const filename = `${name}.${ext}`;
    fs.writeFileSync(path.join(outDir, filename), Buffer.from(b64, "base64"));

    return res.json({ imageUrl: `http://localhost:3001/generated/${filename}` });
  } catch (err) {
    console.error("Error in /api/image:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ---- start server ----
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Gemini API server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error("EXPRESS ERROR:", err);
  res.status(500).json({ error: err.message || "Server error" });
});

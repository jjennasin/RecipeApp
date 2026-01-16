import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

initializeApp();

export const ping = onCall(() => ({ ok: true, ts: Date.now() }));

// Secret (already set in Firebase console/CLI)
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

export const generateRecipe = onCall({ secrets: [GEMINI_API_KEY] }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");

  const prompt = String(req.data?.prompt || "").trim();
  if (prompt.length < 3) throw new HttpsError("invalid-argument", "Prompt too short.");

  // Use API v1 + a v1 model id (no “-002” suffix)
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value(), { apiVersion: "v1" });
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const system = `Return ONLY JSON with:
{ "title": string, "steps": string[] }
No markdown, just JSON.`.trim();

  let text;
  try {
    const resp = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: system + "\n\nUser: " + prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    });
    text = resp.response.text();
  } catch (err) {
    console.error("Gemini request failed:", err);
    throw new HttpsError("internal", "LLM call failed");
  }

  // Parse JSON robustly
  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    const s = text.indexOf("{");
    const e = text.lastIndexOf("}");
    if (s >= 0 && e >= s) obj = JSON.parse(text.slice(s, e + 1));
    else throw new HttpsError("data-loss", "Bad JSON from model");
  }

  const title = typeof obj.title === "string" ? obj.title : "Untitled";
  const steps = Array.isArray(obj.steps) ? obj.steps : [];

  // Save to Firestore
  const db = getFirestore();
  const ref = db.collection("users").doc(uid).collection("recipes").doc();
  await ref.set({
    recipeId: ref.id,
    source: "ai",
    title,
    steps,
    createdAt: FieldValue.serverTimestamp(),
    prompt,
  });

  // Return full payload so the UI can render immediately
  return { recipeId: ref.id, title, steps };
});
n
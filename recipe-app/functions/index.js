import { onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

initializeApp();

export const ping = onCall(() => ({ ok: true, ts: Date.now() }));

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

export const generateRecipe = onCall({ secrets: [GEMINI_API_KEY], cors: true }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error("UNAUTHENTICATED");

  const prompt = (req.data?.prompt || "").toString();
  if (prompt.trim().length < 3) throw new Error("INVALID_PROMPT");

  // Gemini
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.value());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const system = `
Return ONLY JSON with:
{ "title": string, "steps": string[] }
No markdown, just JSON.
`.trim();

  const resp = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: system + "\n\nUser: " + prompt }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
  });

  const text = resp.response.text();

  // Parse JSON (tolerate stray text just in case)
  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    const s = text.indexOf("{");
    const e = text.lastIndexOf("}");
    if (s >= 0 && e >= s) obj = JSON.parse(text.slice(s, e + 1));
    else throw new Error("BAD_JSON");
  }

  // Save to Firestore (modular admin API)
  const db = getFirestore();
  const ref = db.collection("users").doc(uid).collection("recipes").doc();
  await ref.set({
    recipeId: ref.id,
    source: "ai",
    title: obj.title || "Untitled",
    steps: Array.isArray(obj.steps) ? obj.steps : [],
    createdAt: FieldValue.serverTimestamp(),
    prompt,
  });

  return { recipeId: ref.id };
});

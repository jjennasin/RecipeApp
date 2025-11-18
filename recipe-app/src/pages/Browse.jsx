// src/pages/Browse.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function Browse() {
  const nav = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const imageUrl = recipe
  ? `https://loremflickr.com/640/480/${encodeURIComponent(
      recipe.title + " food"
    )}`
  : null;

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setRecipe(null);
    setSaved(false);

    try {
      // call your local Express backend now
      const res = await fetch("http://localhost:3001/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not generate recipe.");
        return;
      }


      // your backend returns { title, ingredients, instructions, ... }
      // but this UI expects { title, steps: [...] }
      const steps =
        Array.isArray(data.instructions) && data.instructions.length > 0
          ? data.instructions
          : ["No instructions returned."];

      setRecipe({
        title: data.title || "Generated recipe",
        steps,
        source: "ai",
      });
    } catch (e) {
      console.error(e);
      setError("Could not reach recipe server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to save recipes.");
      return;
    }
    if (!recipe) return;

    setSaving(true);
    try {
      const db = getFirestore();
      await addDoc(collection(db, "users", user.uid, "recipes"), {
        title: recipe.title || "Untitled",
        steps: Array.isArray(recipe.steps) ? recipe.steps : [],
        source: recipe.source || "ai",
        createdAt: serverTimestamp(),
        prompt,
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      data-layer="init Browse Recipes"
      className="Initcolor w-96 h-screen px-5 pt-9 pb-20 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden"
    >
      <button
        onClick={() => nav("/search")}
        type="button"
        className="ImputArea self-stretch h-12 p-2.5 rounded-[10px] border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] placeholder:text-lighterRed focus:outline-none focus:ring-0 inline-flex justify-start items-center gap-[5px] overflow-hidden"
      >
        <img src="./src/assets/search20.svg" className="logo" alt="Search Icon" />
        Search
      </button>

      <div className="self-stretch space-y-2">
        <textarea
          className="w-full h-24 p-2.5 rounded-[10px] border border-darkYellow font-['Franklin_Gothic_Book'] focus:outline-none"
          placeholder='e.g., "Make a 10-minute breakfast using eggs and white bread."'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 rounded-[10px] bg-darkYellow text-main-navy font-['Franklin_Gothic_Medium'] disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>

      {/* ... keep the rest of your JSX (carousel, recipe display, list) exactly the same ... */}

      {recipe && (
  <div className="self-stretch p-3 rounded-[10px] border border-darkYellow space-y-3">
    {/* Recipe image */}
    {imageUrl && (
      <div className="w-full h-40 overflow-hidden rounded-[10px] mb-1">
        <img
          src={imageUrl}
          alt={recipe.title || "Recipe image"}
          className="w-full h-full object-cover"
        />
      </div>
    )}

    <h2 className="text-lg font-['Franklin_Gothic_Medium'] text-main-navy">
      {recipe.title}
    </h2>

    {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
      <ol className="list-decimal ml-5 space-y-1 font-['Franklin_Gothic_Book'] text-main-navy">
        {recipe.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    ) : (
      <p className="font-['Franklin_Gothic_Book'] text-main-navy">
        No steps found.
      </p>
    )}

    <button
      onClick={handleSave}
      disabled={saving || saved}
      className={`mt-1 px-4 py-2 rounded-[10px] text-white font-['Franklin_Gothic_Medium'] ${
        saved ? "bg-green-600" : "bg-darkYellow"
      }`}
    >
      {saved ? "Saved ✓" : saving ? "Saving..." : "Save Recipe"}
    </button>
  </div>
)}


      {!recipe && (
        <div
          data-layer="recipes"
          className="Recipes flex flex-col justify-start items-start gap-2.5 overflow-y-auto"
        >
          {[1, 2, 3, 4, 5].map((k) => (
            <div
              key={k}
              className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5"
            >
              <div className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
              <div className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
                <div className="text-main-navy text-base font-['Franklin_Gothic_Medium']">
                  Recipe
                </div>
                <div className="text-main-navy text-base font-['Franklin_Gothic_Book']">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// src/pages/Browse.jsx
import { useState, useEffect } from "react";
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
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError(null);
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

      className="Initcolor w-96 h-screen px-5 pt-9 pb-20 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden"
    >
    const genericQuery = "a random, popular, and easy-to-make recipe";
    const NUM_RECIPES = 3;
    const fetchedRecipes = [];
        type="button"
        className="ImputArea self-stretch h-12 p-2.5 rounded-[10px] border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] placeholder:text-lighterRed focus:outline-none focus:ring-0 inline-flex justify-start items-center gap-[5px] overflow-hidden"
      >

      <section className="Preview self-stretch flex justify-center">
        <div className="relative h-48 w-auto rounded-[10px]">
          {/* radio inputs (hidden) */}
          <input id="card-01" type="radio" name="slider" className="sr-only peer/01" defaultChecked />
          <input id="card-02" type="radio" name="slider" className="sr-only peer/02" />
          <input id="card-03" type="radio" name="slider" className="sr-only peer/03" />
    for (let i = 0; i < NUM_RECIPES; i++) {
      try {
        const query = `${genericQuery} for person ${i}`;
        const res = await fetch("http://localhost:3001/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
      <div className="self-stretch space-y-2">
        <textarea
          className="w-full h-24 p-2.5 rounded-[10px] border border-darkYellow font-['Franklin_Gothic_Book'] focus:outline-none"
          placeholder='e.g., "Make a 10-minute breakfast using eggs and white bread."'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          {/* Card 1 */}
          <div
            className={`
        const data = await res.json();
        if (res.ok) fetchedRecipes.push(data);
        else console.error(`Failed to fetch recipe ${i}:`, data.error);
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 rounded-[10px] bg-darkYellow text-main-navy font-['Franklin_Gothic_Medium'] disabled:opacity-50"
        >
            <label className="absolute inset-0 cursor-pointer" htmlFor="card-01">
              <span className="sr-only">Card 1</span>
            </label>
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>

        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`Network error for recipe ${i}:`, err);
      }
    }

    if (fetchedRecipes.length > 0) {
      setRecipes(fetchedRecipes);
      setActiveCardIndex(0);
    } else {
      setError(
        "All recipe generation attempts failed. Please check the server logs."
          {/* Card 2 */}
          <div
            className={`
              absolute inset-0 w-64 h-48 rounded-[10px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              peer-checked/01:translate-x-8 peer-checked/01:z-40
              peer-checked/02:relative peer-checked/02:z-50 peer-checked/02:translate-x-0 
              peer-checked/03:-translate-x-8 peer-checked/03:z-40
            `}
          >
            <label className="absolute inset-0 cursor-pointer" htmlFor="card-02">
              <span className="sr-only">Card 2</span>
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
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  const getRecipeCaption = (recipe) => {
    if (recipe && recipe.instructions && recipe.instructions.length > 0) {
      const firstInstruction = recipe.instructions[0];
      return firstInstruction.length > 70
        ? firstInstruction.substring(0, 70) + "..."
        : firstInstruction;
    }
    return "Click to view details.";
  };

  const renderRadioInputs = () =>
    recipes
      .slice(0, 3)
      .map((_, index) => (
        <input
          key={`card-radio-${index}`}
          id={`card-0${index + 1}`}
          type="radio"
          name="slider"
          className={`sr-only peer/0${index + 1}`}
          defaultChecked={index === activeCardIndex}
          onChange={() => setActiveCardIndex(index)}
        />
      ));

  const renderCarouselCards = () =>
    recipes.slice(0, 3).map((recipe, index) => {
      const cardId = `card-0${index + 1}`;
      let transitionClasses = `absolute inset-0 w-64 h-48 rounded-[10px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]`;

      if (index === 0) {
        transitionClasses +=
          activeCardIndex === 0
            ? " relative z-50 translate-x-0"
            : activeCardIndex === 1
            ? " translate-x-8 z-40"
            : " translate-x-10 z-30";
      } else if (index === 1) {
        transitionClasses +=
          activeCardIndex === 0
            ? " -translate-x-8 z-40"
            : activeCardIndex === 1
            ? " relative z-50 translate-x-0"
            : " translate-x-8 z-40";
      } else if (index === 2) {
        transitionClasses +=
          activeCardIndex === 0
            ? " -translate-x-10 z-30"
            : activeCardIndex === 1
            ? " -translate-x-8 z-40"
            : " relative z-50 translate-x-0";
      }

      return (
        <div key={`card-${index}`} className={transitionClasses}>
          <label className="absolute inset-0 cursor-pointer" htmlFor={cardId}>
            <span className="sr-only">{recipe.title || "Recipe"}</span>
          </label>
      </div>
    )}

          {/* Card 3 */}
          <div
            className={`
              absolute inset-0 w-64 h-48 rounded-[10px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              peer-checked/01:translate-x-10 peer-checked/01:z-30
              peer-checked/02:translate-x-8 peer-checked/02:z-40
              peer-checked/03:relative peer-checked/03:z-50 peer-checked/03:translate-x-0
            `}
          <Link
            to={`/recipe/${recipe.title.replace(/\s+/g, "-").toLowerCase()}`}
            state={{ recipeData: recipe }}
    <h2 className="text-lg font-['Franklin_Gothic_Medium'] text-main-navy">
      {recipe.title}
    </h2>

    {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
      <ol className="list-decimal ml-5 space-y-1 font-['Franklin_Gothic_Book'] text-main-navy">
        {recipe.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
            <label className="absolute inset-0 cursor-pointer" htmlFor="card-03">
              <span className="sr-only">Card 3</span>
            </label>
            <article className="bg-gray-300 p-5 w-64 h-48 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(74,76,78,0.25)] flex flex-col justify-end">
              <h2 className="text-white font-['Franklin_Gothic_Medium'] text-xl mb-1">Title</h2>
              <p className="text-white font-['Franklin_Gothic_Book'] leading-snug">
            <article className="bg-white p-5 w-64 h-48 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(74,76,78,0.25)] flex flex-col justify-end">
              <h2 className="text-navy font-['Franklin_Gothic_Medium'] text-xl mb-1">
                {recipe.title || "Loading..."}
              </h2>
              <p className="text-navy font-['Franklin_Gothic_Book'] leading-snug">
                {getRecipeCaption(recipe)}
      </ol>
    ) : (
      <p className="font-['Franklin_Gothic_Book'] text-main-navy">
        No steps found.
      </p>
    )}
          </Link>
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
      </section>


      <div
        data-layer="recipes"
        <div
          data-layer="recipes"
        className="Recipes flex flex-col justify-start items-start gap-2.5 overflow-y-auto">
        <div
          data-layer="Recipe"
        <p className="text-navy">Loading recipes... 🍝</p>
          className="Recipes flex flex-col justify-start items-start gap-2.5 overflow-y-auto"
        >
          {[1, 2, 3, 4, 5].map((k) => (
          </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <p className="text-red-600 font-bold mb-4">Error Loading Recipes</p>
        <p className="text-gray-700">{error}</p>
        </div>
        <div
          data-layer="Recipe"
          className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
          <div
            data-layer="img"
            className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
          <div
            data-layer="text"
            className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
            <div
              data-layer="Recipe"
              className="Recipe justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
            <div
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
    );
  }

  return (
    <div className="Initcolor w-96 h-screen px-5 pt-9 pb-14 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden">
      <button
        onClick={() => nav("/search")}
        type="button"
        className="ImputArea border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] hover:bg-greenishYellow/50 transition self-stretch h-12 p-2.5 rounded-[10px] inline-flex gap-[5px]"
      >
        Search
      </button>

      <section className="Preview self-stretch flex justify-center">
        {recipes.length > 0 && (
          <div className="relative h-48 w-auto rounded-[10px]">
            {renderRadioInputs()}
            {renderCarouselCards()}
        )}
      </section>

      <div className="Recipes inline-flex self-stretch flex-col justify-start items-start gap-2.5 overflow-y-auto no-scrollbar">
        {recipes.map((recipe, index) => (
          <Link
            key={index}
            to={`/recipe/${recipe.title.replace(/\s+/g, "-").toLowerCase()}`}
            state={{ recipeData: recipe }}
            className="w-full"
          >
            <div className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5 hover:bg-greenishYellow/30 transition">
              <div className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px] flex items-center justify-center text-xs text-white">
                IMG
        </div>
        <div
          data-layer="Recipe"
          className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
              <div className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
                <div className="RecipeTitle justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">
                  {recipe.title || "Recipe"}
              data-layer="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-main-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              key={k}
              className="Recipe w-80 h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5"
            >
              <div className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px]" />
              <div className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
                <div className="text-main-navy text-base font-['Franklin_Gothic_Medium']">
                  Recipe
                </div>
                <div className="RecipeCaption self-stretch justify-center text-navy text-sm font-normal font-['Franklin_Gothic_Book']">
                  {getRecipeCaption(recipe)}
                <div className="text-main-navy text-base font-['Franklin_Gothic_Book']">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
              </div>
            </div>
          ))}
        ))}
        {recipes.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500 w-full mt-10">
            No recipes found. Try generating one manually!
          </p>
        )}
        </div>
      )}
    </div>
  );
}

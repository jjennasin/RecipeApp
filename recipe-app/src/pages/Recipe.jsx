// src/pages/RecipePage.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RecipePage() {
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // read filters from URL
  const params = new URLSearchParams(location.search);
  const cuisine = params.get("cuisine") || "";
  const dietaryRestrictions = params.get("dietaryRestrictions") || "";
  const maxTimeMinutes = params.get("maxTimeMinutes") || "";
  const difficulty = params.get("difficulty") || "";
  const notes = params.get("notes") || "";

  // derive an image URL from the recipe title or notes
  const imageUrl = recipe
    ? `https://source.unsplash.com/featured/?${encodeURIComponent(
        (recipe.title || notes || "recipe") + " food"
      )}`
    : null;

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true);
      setError("");
      setRecipe(null);

      try {
        const res = await fetch("http://localhost:3001/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: notes || "Create a recipe",
            cuisine,
            dietaryRestrictions,
            maxTimeMinutes: maxTimeMinutes
              ? Number(maxTimeMinutes)
              : undefined,
            difficulty,
            notes,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to generate recipe");
        } else {
          setRecipe(data);
        }
      } catch (e) {
        console.error(e);
        setError("Could not reach server.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [cuisine, dietaryRestrictions, maxTimeMinutes, difficulty, notes]);

  return (
    <div className="w-96 h-screen overflow-y-auto px-5 pt-9 pb-20 bg-white">
      {loading && (
        <p className="text-center text-gray-500">Generating recipe...</p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}

      {recipe && (
        <div className="space-y-4">
          {/* image header */}
          {imageUrl && (
            <div className="w-full h-40 overflow-hidden rounded-[10px]">
              <img
                src={imageUrl}
                alt={recipe.title || "Recipe image"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://source.unsplash.com/featured/?food";
                }}
              />
            </div>
          )}

          <h1 className="text-2xl font-['Orelega_One'] text-main-navy">
            {recipe.title}
          </h1>

          <p className="font-['Franklin_Gothic_Book']">
            <span>
              Prep Time: {recipe.prep_time_minutes} min
            </span>{" "}
            |{" "}
            <span>Difficulty: {recipe.difficulty_level}</span>
          </p>

          <h2 className="text-xl font-['Franklin_Gothic_Medium']">
            Ingredients
          </h2>
          <ul className="list-disc ml-5 space-y-1 font-['Franklin_Gothic_Book']">
            {recipe.ingredients?.map((ing, i) => (
              <li key={i}>
                {ing.quantity} {ing.name}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-['Franklin_Gothic_Medium']">
            Instructions
          </h2>
          <ol className="list-decimal ml-5 space-y-2 font-['Franklin_Gothic_Book']">
            {recipe.instructions?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          {recipe.estimated_calories && (
            <p className="text-sm text-gray-600 font-['Franklin_Gothic_Book']">
              Estimated calories: {recipe.estimated_calories}
            </p>
          )}
        </div>
      )}

      {!loading && !error && !recipe && (
        <p className="text-center text-gray-500">No recipe found.</p>
      )}
    </div>
  );
}

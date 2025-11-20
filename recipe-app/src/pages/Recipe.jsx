// src/pages/RecipePage.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RecipePage() {
  const location = useLocation();
  const nav = useNavigate();
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

    const cuisine = params.get("cuisine") || "None";
    const diet = params.get("diet") || "None";
    const time = params.get("time") || "60";
    const difficulty = params.get("difficulty") || "Medium";
    const details = params.get("details") || "None";
  const { recipeData } = location.state || {};
  // derive an image URL from the recipe title or notes
  const imageUrl = recipe
    ? `https://source.unsplash.com/featured/?${encodeURIComponent(
        (recipe.title || notes || "recipe") + " food"
      )}`
    : null;

    const nav = useNavigate();
  const title = recipeData?.title || "Recipe Not Found";
  const instructions = recipeData?.instructions || [
    "No instructions provided.",
  ];
  const ingredients = recipeData?.ingredients || ["No ingredients provided."];
  const time = recipeData?.prep_time_minutes || "N/A";
  const difficulty = recipeData?.difficulty_level || "N/A";
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

  if (!recipeData) {
  return (
        <div className="w-96 h-screen px-5 pt-9 pb-20 bg-white flex flex-col gap-5 overflow-y-auto no-scrollbar">
        <p className="text-red-600 font-bold mb-4">Recipe Data Missing</p>     
        <p className="text-gray-700">
          Please go back to the browse page and select a recipe.      
        </p>
    <div className="w-96 h-screen overflow-y-auto px-5 pt-9 pb-20 bg-white">
      {loading && (
        <p className="text-center text-gray-500">Generating recipe...</p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}
        <button
            {/* Upper Nav */}
            <div className="flex justify-between items-center h-10">
                <img src="./src/assets/bArrow20.svg" className="w-5 h-5" alt="Back" onClick={() => nav("/search")}/>
                <img src="./src/assets/heart20.svg" className="w-5 h-5" alt="Favorite" />
          onClick={() => nav("/browse")}
          className="mt-4 p-2 bg-darkYellow rounded"
        >
          Go to Browse
        </button>
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
  }

            {/* Image Placeholder */}
            <div data-layer="img" className="w-full h-[200px] p-5 bg-zinc-300 rounded-[10px] flex-shrink-0 flex-grow-0 flex flex-col justify-end overflow-hidden">
                {/* Use an actual image with object-cover if available */}
                {/* <img src="path-to-image" alt="Recipe" className="w-full h-full object-cover" /> */}
                <div className="text-white text-3xl font-['Orelega_One']">
                    Recipe
  const areIngredientsObjects =
    Array.isArray(ingredients) &&
    ingredients.length > 0 &&
    typeof ingredients[0] === "object" &&
    "name" in ingredients[0];

          <h1 className="text-2xl font-['Orelega_One'] text-main-navy">
            {recipe.title}
          </h1>
  return (
    <div className="w-96 h-screen px-5 pt-9 pb-20 bg-white flex flex-col gap-5 overflow-y-auto scrollbar-none">
      <div className="flex justify-between items-center h-10">
        <img
          src="/src/assets/bArrow20.svg"
          className="w-5 h-5"
          alt="Back"
          onClick={() => nav("/browse")}
        />
        <img src="/src/assets/heart20.svg" className="w-5 h-5" alt="Favorite" />
      </div>
      <div
        data-layer="img"
        className="w-full h-[200px] p-5 bg-zinc-300 rounded-[10px] flex-shrink-0 flex-grow-0 flex flex-col justify-end overflow-hidden"
      >
        <div className="text-white text-3xl font-['Orelega_One']">{title}</div> 
      </div>
            {/* Details */}
          <p className="font-['Franklin_Gothic_Book']">
            <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-1">
            <span>
                <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">Details</div>
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Details
        </div>
              Prep Time: {recipe.prep_time_minutes} min
            </span>{" "}
            |{" "}
                <div className="text-navy text-base font-['Franklin_Gothic_Book']">
        <div className="text-navy text-base font-['Franklin_Gothic_Book']">
            <span>Difficulty: {recipe.difficulty_level}</span>
                    Time: {time} minutes
                    <br />
                    Time: {time} minutes          
          <br />    Difficulty: {difficulty}
          </p>
                </div>
            </div>
            {/* Ingredients */}
          <h2 className="text-xl font-['Franklin_Gothic_Medium']">
            <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-1">
            Ingredients
                <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">Ingredients</div>
                <div className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Num Ingredient 1
                    <br />
                    Num Ingredient 2
                    <br />
                    Num Ingredient 3
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Ingredients
        </div>
        <div className="text-navy text-base font-['Franklin_Gothic_Book'] space-y-1">
          {ingredients.map((item, index) => (
            <div key={`ing-${index}`} className="flex justify-between">
              {areIngredientsObjects ? (
                <span className="flex-1">{item.name}</span>
          </h2>
          <ul className="list-disc ml-5 space-y-1 font-['Franklin_Gothic_Book']">
            {recipe.ingredients?.map((ing, i) => (
              <li key={i}>
                {ing.quantity} {ing.name}
              </li>
            ))}
          </ul>
              ) : (
                <span className="flex-1">{item}</span>
              )}
              {areIngredientsObjects && (
                <span className="text-right font-bold text-darkYellow">
                  {item.quantity}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
            {/* Instructions */}
          <h2 className="text-xl font-['Franklin_Gothic_Medium']">
            <div className="flex flex-col gap-1">
            Instructions
                <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">Instructions</div>
                <div className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Instruction 1
                    <br />
                    Instruction 2
                    <br />
                    Instruction 3
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Instructions{" "}
        </div>
        <div className="text-navy text-base font-['Franklin_Gothic_Book'] space-y-3">
          {instructions.map((step, index) => (
            <div key={`inst-${index}`} className="flex gap-2">
              <span className="font-bold text-darkRed flex-shrink-0">
                {index + 1}.
              </span>
              <span>{step}</span>
            </div>
          ))}
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

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const CACHE_KEY = "cachedBrowseRecipes";

export default function Browse() {
  const nav = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [savingRecipe, setSavingRecipe] = useState(null);

  const RECIPE_QUERIES = [
    "easy Italian recipe",
    "easy Mexican recipe",
    "easy American recipe",
  ];

  const getRecipeCaption = (recipe) => {
    if (recipe && recipe.instructions && recipe.instructions.length > 0) {
      const firstInstruction = recipe.instructions[0];
      return firstInstruction.length > 70
        ? firstInstruction.substring(0, 70) + "..."
        : firstInstruction;
    }
    return "Click to view details.";
  };

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    const fetchedRecipes = [];

    for (let i = 0; i < RECIPE_QUERIES.length; i++) {
      const query = RECIPE_QUERIES[i];
      try {
        const res = await fetch("http://localhost:3001/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        const data = await res.json();

        if (res.ok && data.title) {
          const steps =
            Array.isArray(data.instructions) && data.instructions.length > 0
              ? data.instructions
              : ["No instructions returned."];

          const ingredientsList =
            Array.isArray(data.ingredients) &&
            data.ingredients.length > 0 &&
            typeof data.ingredients[0] === "object" &&
            data.ingredients[0] !== null
              ? data.ingredients
              : [
                  {
                    name: `${query.replace("easy ", "")} ingredient A`,
                    quantity: "1 serving",
                  },
                  {
                    name: `${query.replace("easy ", "")} ingredient B`,
                    quantity: "2 units",
                  },
                  { name: "Spice", quantity: "A dash" },
                ];

          const timeInMinutes = 15 + i * 10;
          const difficultyLevels = ["EASY", "MEDIUM", "HARD"];
          const difficulty = difficultyLevels[i % difficultyLevels.length];

          fetchedRecipes.push({
            title: data.title || query,
            instructions: steps,
            ingredients: ingredientsList,
            prep_time_minutes: timeInMinutes,
            difficulty_level: difficulty,
            source: "ai",
            id: `recipe-${Date.now()}-${i}`,
            isSaved: false,
          });
        } else {
          console.error(`Failed to fetch recipe ${i}:`, data.error);
        }

        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`Network error for recipe ${i}:`, err);
      }
    }

    if (fetchedRecipes.length > 0) {
      setRecipes(fetchedRecipes);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(fetchedRecipes));
      setActiveCardIndex(0);
    } else {
      setError(
        "All recipe generation attempts failed. Please check the server logs."
      );
    }
    setLoading(false);
  };

  async function handleSave(recipeToSave) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to save recipes.");
      return;
    }

    setSavingRecipe(recipeToSave.id);

    try {
      const db = getFirestore();
      await addDoc(collection(db, "users", user.uid, "recipes"), {
        title: recipeToSave.title || "Untitled",
        steps: Array.isArray(recipeToSave.instructions)
          ? recipeToSave.instructions
          : [],
        ingredients: Array.isArray(recipeToSave.ingredients)
          ? recipeToSave.ingredients
          : [],
        time: recipeToSave.prep_time_minutes,
        difficulty: recipeToSave.difficulty_level,
        source: recipeToSave.source || "ai",
        createdAt: serverTimestamp(),
      });

      setRecipes((prevRecipes) =>
        prevRecipes.map((r) =>
          r.id === recipeToSave.id ? { ...r, isSaved: true } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe. Please try again.");
    } finally {
      setSavingRecipe(null);
    }
  }

  useEffect(() => {
    const cachedRecipes = sessionStorage.getItem(CACHE_KEY);
    if (cachedRecipes) {
      try {
        const parsedRecipes = JSON.parse(cachedRecipes);
        if (Array.isArray(parsedRecipes) && parsedRecipes.length > 0) {
          setRecipes(parsedRecipes);
          setLoading(false);
          setActiveCardIndex(0);
          return;
        }
      } catch (e) {
        console.error("Error parsing cached recipes:", e);
        sessionStorage.removeItem(CACHE_KEY);
      }
    }

    fetchRandomRecipes();
  }, []);

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
          <Link
            to={`/recipe?notes=${encodeURIComponent(recipe.title)}`}
            state={{ recipeData: recipe }}
            className="w-full h-full block"
          >
            <article
              className={`bg-white p-5 w-64 h-48 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(74,76,78,0.25)] flex flex-col justify-end`}
            >
              <h2 className="text-main-navy font-['Franklin_Gothic_Medium'] text-xl mb-1">
                {recipe.title || "Loading..."}
              </h2>
              <p className="text-main-navy font-['Franklin_Gothic_Book'] leading-snug text-sm">
                {getRecipeCaption(recipe)}
              </p>
            </article>
          </Link>
        </div>
      );
    });

  if (loading && recipes.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-main-navy">Loading recipes... 🍝</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <p className="text-red-600 font-bold mb-4">Error Loading Recipes</p>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={fetchRandomRecipes}
          className="mt-4 px-4 py-2 rounded-[10px] bg-darkYellow text-main-navy font-['Franklin_Gothic_Medium']"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="Initcolor w-96 h-screen px-5 pt-9 pb-14 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden">
      <button
        onClick={() => nav("/search")}
        type="button"
        className="ImputArea border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] hover:bg-greenishYellow/50 transition self-stretch h-12 p-2.5 rounded-[10px] inline-flex gap-[5px] justify-start items-center"
      >
        <img
          src="./src/assets/search20.svg"
          className="logo"
          alt="Search Icon"
        />
        Search
      </button>

      <section className="Preview self-stretch flex justify-center">
        {recipes.length > 0 && (
          <div className="relative h-48 w-auto rounded-[10px]">
            {renderRadioInputs()}
            {renderCarouselCards()}
          </div>
        )}
      </section>

      <div className="Recipes inline-flex self-stretch flex-col justify-start items-start gap-2.5 overflow-y-auto no-scrollbar">
        {recipes.map((recipe, index) => (
          <Link
            key={index}
            to={`/recipe?notes=${encodeURIComponent(recipe.title)}`}
            state={{ recipeData: recipe }}
            className="w-full"
          >
            <div className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5 hover:bg-greenishYellow/30 transition w-full">
              <div className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px] flex items-center justify-center text-xs text-white">
                IMG
              </div>
              <div className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px] min-w-0">
                <div className="RecipeTitle text-main-navy text-base font-normal font-['Franklin_Gothic_Medium'] truncate">
                  {recipe.title}
                </div>
                <div className="RecipeCaption text-main-navy text-sm font-normal font-['Franklin_Gothic_Book'] truncate">
                  {getRecipeCaption(recipe)}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {recipes.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500 w-full mt-10">
            No recipes found.
          </p>
        )}
      </div>
    </div>
  );
}

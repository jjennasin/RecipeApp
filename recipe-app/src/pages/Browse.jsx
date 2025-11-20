import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Browse() {
  const nav = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError(null);
      className="Initcolor w-96 h-screen px-5 pt-9 pb-14 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden">

    const genericQuery = "a random, popular, and easy-to-make recipe";
    const NUM_RECIPES = 3;
    const fetchedRecipes = [];
        className="ImputArea border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] hover:bg-greenishYellow/50 transition self-stretch h-12 p-2.5 rounded-[10px] inline-flex gap-[5px]">

    for (let i = 0; i < NUM_RECIPES; i++) {
      try {
        const query = `${genericQuery} for person ${i}`;
        const res = await fetch("http://localhost:3001/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        const data = await res.json();
        if (res.ok) fetchedRecipes.push(data);
        else console.error(`Failed to fetch recipe ${i}:`, data.error);

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

          <Link
            to={`/recipe/${recipe.title.replace(/\s+/g, "-").toLowerCase()}`}
            state={{ recipeData: recipe }}
          >
            <article
              className={`bg-white p-5 w-64 h-48 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(74,76,78,0.25)] flex flex-col justify-end`}
            >
              <h2 className="text-navy font-['Franklin_Gothic_Medium'] text-xl mb-1">
                {recipe.title || "Loading..."}
              </h2>
              <p className="text-navy font-['Franklin_Gothic_Book'] leading-snug">
                {getRecipeCaption(recipe)}
              </p>
            </article>
          </Link>
        </div>
      );
    });

  if (loading && recipes.length === 0) {
    return (
        className="Recipes inline-flex self-stretch flex-col justify-start items-start gap-2.5 overflow-y-auto no-scrollbar">
        <p className="text-navy">Loading recipes... 🍝</p>
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <p className="text-red-600 font-bold mb-4">Error Loading Recipes</p>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
  return (
    <div className="Initcolor w-96 h-screen px-5 pt-9 pb-14 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden">
      <button
        onClick={() => nav("/search")}
        type="button"
        className="ImputArea border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] hover:bg-greenishYellow/50 transition self-stretch h-12 p-2.5 rounded-[10px] inline-flex gap-[5px]"
      >
        <img
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
          className="logo"
          alt="Search Icon"
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
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
            to={`/recipe/${recipe.title.replace(/\s+/g, "-").toLowerCase()}`}
            state={{ recipeData: recipe }}
            className="w-full"
          >
            <div className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5 hover:bg-greenishYellow/30 transition">
              <div className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px] flex items-center justify-center text-xs text-white">
                IMG
              </div>
              <div className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px]">
                <div className="RecipeTitle justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                </div>
                <div className="RecipeCaption self-stretch justify-center text-navy text-sm font-normal font-['Franklin_Gothic_Book']">
                  {getRecipeCaption(recipe)}
                </div>
          className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5">
              className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium']">Recipe</div>
              className="LoremIpsumDolorSitAmetConsecteturAdipiscingElit self-stretch justify-center text-navy text-base font-normal font-['Franklin_Gothic_Book']">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              </div>
            </div>
          </Link>
        ))}
        {recipes.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500 w-full mt-10">
            No recipes found. Try generating one manually!
          </p>
        )}
      </div>
    </div>
  );
}

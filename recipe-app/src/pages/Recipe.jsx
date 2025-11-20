import { useLocation, useNavigate } from "react-router-dom";

export default function RecipePage() {
  const location = useLocation();
  const nav = useNavigate();

  const { recipeData } = location.state || {};

  const title = recipeData?.title || "Recipe Not Found";
  const instructions = recipeData?.instructions || [
    "No instructions provided.",
  ];
  const ingredients = recipeData?.ingredients || ["No ingredients provided."];
  const time = recipeData?.prep_time_minutes || "N/A";
  const difficulty = recipeData?.difficulty_level || "N/A";

  if (!recipeData) {
    return (
        <div className="w-96 h-screen px-5 pt-9 pb-20 bg-white flex flex-col gap-5 overflow-y-auto no-scrollbar">
        <p className="text-red-600 font-bold mb-4">Recipe Data Missing</p>     
        <p className="text-gray-700">
          Please go back to the browse page and select a recipe.      
        </p>
        <button
          onClick={() => nav("/browse")}
          className="mt-4 p-2 bg-darkYellow rounded"
        >
          Go to Browse
        </button>
      </div>
    );
  }

  const areIngredientsObjects =
    Array.isArray(ingredients) &&
    ingredients.length > 0 &&
    typeof ingredients[0] === "object" &&
    "name" in ingredients[0];

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
      <div className="flex flex-col gap-1">
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Details
        </div>
        <div className="text-navy text-base font-['Franklin_Gothic_Book']">
                    Time: {time} minutes          
          <br />    Difficulty: {difficulty}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Ingredients
        </div>
        <div className="text-navy text-base font-['Franklin_Gothic_Book'] space-y-1">
          {ingredients.map((item, index) => (
            <div key={`ing-${index}`} className="flex justify-between">
              {areIngredientsObjects ? (
                <span className="flex-1">{item.name}</span>
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
      <div className="flex flex-col gap-1">
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
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Browse() {
  const nav = useNavigate();

  // 🔹 Your Alexa / recipe generation logic
  const [query, setQuery] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setRecipe(null);

    try {
      const res = await fetch("http://localhost:3001/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) setRecipe(data);
      else alert(data.error || "Failed to generate recipe");
    } catch (err) {
      console.error(err);
      alert("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-layer="init Browse Recipes"
      className="Initcolor w-96 h-screen px-5 pt-9 pb-20 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden"
    >
      {/* 🔹 Search Section */}
      <div className="w-full flex flex-col gap-2">
        <button
          onClick={() => nav("/search")}
          type="button"
          className="ImputArea self-stretch h-12 p-2.5 rounded-[10px] border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] placeholder:text-lighterRed focus:outline-none focus:ring-0 inline-flex justify-start items-center gap-[5px] overflow-hidden"
        >
          <img
            src="./src/assets/search20.svg"
            className="logo"
            alt="Search Icon"
          />
          Search
        </button>

        {/* 🔹 Input + Generate Button */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe a recipe (e.g., 'spicy pasta with chicken')"
          className="w-full border border-darkYellow rounded-[10px] p-2.5 text-darkRed placeholder:text-lighterRed focus:outline-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full mt-2 py-2 rounded-[10px] text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-darkYellow hover:bg-yellow-500"
          }`}
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>

      {/* 🔹 Generated Recipe Section */}
      {recipe && (
        <div className="w-full mt-5 p-4 rounded-[10px] border border-darkYellow bg-lightYellow overflow-y-auto">
          <h2 className="text-xl font-['Franklin_Gothic_Medium'] mb-2">
            {recipe.title}
          </h2>
          <p className="text-sm mb-4">
            <strong>Prep Time:</strong> {recipe.prep_time_minutes} min |{" "}
            <strong>Difficulty:</strong> {recipe.difficulty_level}
          </p>

          {recipe.estimated_calories && (
            <p className="text-sm mb-4">
              <strong>Estimated Calories:</strong>{" "}
              {recipe.estimated_calories.toLocaleString()}
            </p>
          )}

          <h3 className="font-semibold mb-1">Ingredients:</h3>
          <ul className="list-disc ml-5 mb-3">
            {recipe.ingredients?.map((item, idx) => (
              <li key={idx}>
                {item.quantity} - {item.name}
              </li>
            ))}
          </ul>

          <h3 className="font-semibold mb-1">Instructions:</h3>
          <ol className="list-decimal ml-5">
            {recipe.instructions?.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* 🔹 Static Recipe Cards (from main's styling) */}
      <section className="Preview self-stretch flex justify-center mt-5">
        {/* Cards layout from main can stay here if still needed */}
      </section>
    </div>
  );
}

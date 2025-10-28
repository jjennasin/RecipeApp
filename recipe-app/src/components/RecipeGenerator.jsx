import { useState } from "react";

export default function RecipeGenerator() {
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">AI Recipe Generator 🍳</h1>

      <textarea
        className="w-full p-3 border rounded-lg"
        placeholder="Enter ingredients or a recipe idea..."
        rows={3}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      {recipe && (
        <div className="border p-4 rounded-lg shadow mt-4">
          <h2 className="text-2xl font-semibold">{recipe.title}</h2>
          <p className="text-gray-600 mb-2">
            Prep Time: {recipe.prep_time_minutes} min | Difficulty:{" "}
            {recipe.difficulty_level}
          </p>
          <h3 className="font-semibold mt-2">Ingredients:</h3>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>
                {item.quantity} - {item.name}
              </li>
            ))}
          </ul>
          <h3 className="font-semibold mt-4">Instructions:</h3>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-gray-500">
            Estimated Calories: {recipe.estimated_calories}
          </p>
        </div>
      )}
    </div>
  );
}

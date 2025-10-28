<<<<<<< HEAD
import { useState } from "react";
import { generateRecipe } from "../lib/functions";

export default function Browse() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");

  async function handleGenerate() {
    try {
      setStatus("Generating...");
      const { recipeId } = await generateRecipe(prompt);
      setStatus(`Recipe saved! ID: ${recipeId}`);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div className="p-4">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type ingredients or a dish idea"
        className="border p-2 w-full"
      />
      <button
        onClick={handleGenerate}
        className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
      >
        Generate Recipe
      </button>
      <p className="mt-2 text-sm">{status}</p>
    </div>
  );
}
=======
import { useState } from "react";

export default function Browse() {
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
    <div style={{ padding: 16 }}>
      <h1>Browse Recipes 🍽️</h1>

      <div style={{ marginTop: "1rem" }}>
        <textarea
          placeholder="Enter ingredients or describe your dish..."
          rows={3}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <br />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            backgroundColor: "#646cff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>

      {recipe && (
        <div
          style={{
            padding: 16,
            minHeight: "100vh",
            backgroundColor: "#1a1a1a",
            color: "#f9f9f9",
          }}
        >
          <h2>{recipe.title}</h2>
          <p>
            <strong>Prep Time:</strong> {recipe.prep_time_minutes} min |{" "}
            <strong>Difficulty:</strong> {recipe.difficulty_level}
          </p>

          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients?.map((item, idx) => (
              <li key={idx}>
                {item.quantity} - {item.name}
              </li>
            ))}
          </ul>

          <h3>Instructions:</h3>
          <ol>
            {recipe.instructions?.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>

          {recipe.estimated_calories && (
            <p style={{ marginTop: "1rem", fontSize: "0.9em" }}>
              <strong>Estimated Calories:</strong>{" "}
              {recipe.estimated_calories.toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
>>>>>>> a04b3c0326459adf9b270806797755797d837739

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
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
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React + Gemini Recipes 🍳</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <div className="recipe-generator" style={{ marginTop: "2rem" }}>
        <h2>AI Recipe Generator</h2>
        <textarea
          placeholder="Enter ingredients or a recipe idea..."
          rows={3}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "1rem",
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
          }}
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>

        {recipe && (
          <div
            style={{
              textAlign: "left",
              marginTop: "2rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "#f9f9f9",
            }}
          >
            <h3>{recipe.title}</h3>
            <p>
              <strong>Prep Time:</strong> {recipe.prep_time_minutes} min |{" "}
              <strong>Difficulty:</strong> {recipe.difficulty_level}
            </p>

            <h4>Ingredients:</h4>
            <ul>
              {recipe.ingredients?.map((item, i) => (
                <li key={i}>
                  {item.quantity} - {item.name}
                </li>
              ))}
            </ul>

            <h4>Instructions:</h4>
            <ol>
              {recipe.instructions?.map((step, i) => (
                <li key={i}>{step}</li>
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

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
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

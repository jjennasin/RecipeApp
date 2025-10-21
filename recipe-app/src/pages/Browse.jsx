import { useState } from "react";
import { callGenerateRecipe, callPing } from "../lib/functions";
import { auth } from "../lib/firebase";

export default function Browse() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");

  async function testPing() {
    try {
      const data = await callPing();
      console.log("ping:", data);
      setStatus("Ping OK");
    } catch (e) {
      setStatus(`Ping error: ${e.message}`);
    }
  }

  async function generate() {
    if (!auth.currentUser) { setStatus("Please sign in first."); return; }
    try {
      setStatus("Generating…");
      const { recipeId } = await callGenerateRecipe({ prompt });
      setStatus(`Saved recipe: ${recipeId}`);
    } catch (e) {
      setStatus(`Error: ${e.message}`);
      console.error(e);
    }
  }

  return (
    <div className="p-4">
      <button onClick={testPing} className="border px-3 py-1 mr-2">Test Ping</button>
      <div className="mt-3 flex gap-2">
        <input className="border p-2 flex-1" value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="e.g., eggs and white bread breakfast" />
        <button onClick={generate} className="bg-green-600 text-white px-4 py-2 rounded">Generate</button>
      </div>
      <div className="mt-2 text-sm">{status}</div>
    </div>
  );
}

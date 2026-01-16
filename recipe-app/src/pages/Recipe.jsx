import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function RecipePage() {
  const location = useLocation();
  const nav = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const { recipeData: stateRecipeData } = location.state || {};

  const [recipe, setRecipe] = useState(stateRecipeData);
  const [loading, setLoading] = useState(!stateRecipeData && !!location.search);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);
  const params = new URLSearchParams(location.search);
  const cuisine = params.get("cuisine") || "";
  const dietaryRestrictions = params.get("dietaryRestrictions") || "";
  const maxTimeMinutes = params.get("maxTimeMinutes") || "";
  const difficulty = params.get("difficulty") || "";
  const notes = params.get("notes") || "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!user || !recipe || !recipe.title) return;

    const recipeId = recipe.title.replace(/[^a-z0-9]/gi, "-").toLowerCase();

    async function checkSavedStatus() {
      const docRef = doc(db, "users", user.uid, "recipes", recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsSaved(true);
      }
    }
    checkSavedStatus();
  }, [user, recipe, db]);

  useEffect(() => {
    if (stateRecipeData || !location.search) {
      setLoading(false);
      return;
    }

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
            maxTimeMinutes: maxTimeMinutes ? Number(maxTimeMinutes) : undefined,
            difficulty,
            notes,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.title) {
          setError(data.error || "Failed to generate recipe");
        } else {
          setRecipe({
            title: data.title || notes || "Generated Recipe",
            instructions: Array.isArray(data.instructions)
              ? data.instructions.filter((i) => i.trim() !== "")
              : typeof data.instructions === "string"
              ? data.instructions.split("\n").filter((i) => i.trim() !== "")
              : ["No instructions provided."],
            ingredients: data.ingredients || [],
            prep_time_minutes:
              data.prep_time_minutes !== undefined
                ? data.prep_time_minutes
                : maxTimeMinutes || "N/A",
            difficulty_level: data.difficulty_level || difficulty || "N/A",
          });
        }
      } catch (e) {
        console.error(e);
        setError("Could not reach server.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [
    cuisine,
    dietaryRestrictions,
    maxTimeMinutes,
    difficulty,
    notes,
    location.search,
    stateRecipeData,
  ]);

  const handleToggleSave = async () => {
    if (!user) {
      alert("You must be signed in to save recipes!");
      nav("/signin");
      return;
    }
    if (!recipe) return;

    const recipeId = recipe.title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const docRef = doc(db, "users", user.uid, "recipes", recipeId);

    try {
      if (isSaved) {
        await deleteDoc(docRef);
        setIsSaved(false);
      } else {
        await setDoc(docRef, {
          ...recipe,
          savedAt: serverTimestamp(),
          id: recipeId,
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      alert("Failed to save recipe.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-main-navy">Generating recipe... 👨‍🍳</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <p className="text-red-600 font-bold mb-4">Error</p>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => nav("/search")}
          className="mt-4 p-2 bg-darkYellow rounded"
        >
          Try New Search
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <p className="text-red-600 font-bold mb-4">Recipe Data Missing</p>
        <p className="text-gray-700">
          Please go back to the browse page or use the search filters.
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

  const {
    title,
    instructions = ["No instructions provided."],
    ingredients = [],
    prep_time_minutes,
    difficulty_level,
  } = recipe;

  const heartColor = "#E54868";

  return (
    <div className="w-96 h-screen px-5 pt-9 pb-20 bg-white flex flex-col gap-5 overflow-y-auto scrollbar-none">
      <div className="flex justify-between items-center h-10">
        <img
          src="/src/assets/bArrow20.svg"
          className="w-5 h-5 cursor-pointer"
          alt="Back"
          onClick={() => nav(-1)}
        />

        <button
          onClick={handleToggleSave}
          className="focus:outline-none transition-transform active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-6 h-6 stroke-[1.5px]`}
            style={{
              fill: isSaved ? heartColor : "none",
              stroke: heartColor,
            }}
          >
            <path
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="w-full h-[250px] bg-zinc-300 rounded-[10px] mb-6" />
      <div className="text-4xl font-['Orelega_One'] text-[#333333] mb-6">
        {title}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Details
        </div>
        <div className="text-navy text-base font-['Franklin_Gothic_Book']">
          Time: {prep_time_minutes} minutes
          <br />
          Difficulty: {difficulty_level}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Ingredients
        </div>
        <div className="text-navy text-base font-['Franklin_Gothic_Book'] space-y-1">
          {ingredients.length > 0 ? (
            ingredients.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="flex-1">
                  {item.name || "Missing Ingredient"}
                </span>
                <span className="text-right font-bold text-darkYellow">
                  {item.quantity || "N/A"}
                </span>
              </div>
            ))
          ) : (
            <div>No ingredients provided.</div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Instructions
        </div>
        <ol className="list-decimal list-inside p-0 ml-1 text-navy text-base font-['Franklin_Gothic_Book'] space-y-3">
          {instructions.map((step, index) => (
            <li key={index} className="pl-1">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

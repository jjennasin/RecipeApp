// src/pages/Recipe.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const [recipe, setRecipe] = useState(stateRecipeData || null);
  const [loading, setLoading] = useState(!stateRecipeData && !!location.search);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);

  // imageUrl will hold either:
  // - "/generated/xxxx.png" (relative)
  // - "http://localhost:3001/generated/xxxx.png" (absolute)
  // - a data URL (if you ever go back)
  const [imageUrl, setImageUrl] = useState(stateRecipeData?.imageUrl || "");

  const pageRef = useRef(null);
  const prevSearchRef = useRef(location.search);

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const cuisine = params.get("cuisine") || "";
  const dietaryRestrictions = params.get("dietaryRestrictions") || "";
  const maxTimeMinutes = params.get("maxTimeMinutes") || "";
  const difficulty = params.get("difficulty") || "";
  const notes = params.get("notes") || "";

  // If user lands on /recipe with no state and no URL params, send them back
  useEffect(() => {
    if (!stateRecipeData && !location.search) {
      nav("/browse", { replace: true });
    }
  }, [stateRecipeData, location.search, nav]);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsub();
  }, [auth]);

  // Saved status check
  useEffect(() => {
    if (!user || !recipe?.title) return;

    const recipeId = recipe.title.replace(/[^a-z0-9]/gi, "-").toLowerCase();

    (async () => {
      try {
        const docRef = doc(db, "users", user.uid, "recipes", recipeId);
        const docSnap = await getDoc(docRef);
        setIsSaved(docSnap.exists());
      } catch (e) {
        console.error("Saved status check failed:", e);
      }
    })();
  }, [user, recipe?.title, db]);

  // Clear image only when a NEW search string happens
  useEffect(() => {
    if (prevSearchRef.current !== location.search) {
      prevSearchRef.current = location.search;
      setImageUrl("");
    }
  }, [location.search]);

  

  // Helper: make /generated/... always load even if Vite proxy is flaky
  const resolvedImageUrl = useMemo(() => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("/generated/")) return `http://localhost:3001${imageUrl}`;
    return imageUrl;
  }, [imageUrl]);

  const fetchImage = useCallback(async (prompt, signal) => {
    if (!prompt?.trim()) return null;

    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.imageUrl) {
      throw new Error(data.error || `Image API failed (${res.status})`);
    }
    return data.imageUrl;
  }, []);

  // If navigated with state, use it (and show existing imageUrl if provided)
  useEffect(() => {
    if (!stateRecipeData) return;

    setRecipe(stateRecipeData);
    setLoading(false);
    setError("");

    if (stateRecipeData.imageUrl) {
      setImageUrl(stateRecipeData.imageUrl);
    }
  }, [stateRecipeData]);

  // Fetch recipe (from URL params) if not provided via state
  useEffect(() => {
    if (stateRecipeData) return;
    if (!location.search) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");
        setRecipe(null);

        const res = await fetch("/api/recipe", {
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
          signal: controller.signal,
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.title) {
          setError(data.error || "Failed to generate recipe");
          return;
        }

        const newRecipe = {
          title: data.title || notes || "Generated Recipe",
          instructions: Array.isArray(data.instructions)
            ? data.instructions.filter((i) => String(i).trim() !== "")
            : typeof data.instructions === "string"
              ? data.instructions
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : ["No instructions provided."],
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          prep_time_minutes: data.prep_time_minutes ?? (maxTimeMinutes || "N/A"),
          difficulty_level: data.difficulty_level || difficulty || "N/A",
          estimated_calories: data.estimated_calories ?? 0,
          image_prompt: data.image_prompt || "",
          recipe_id: data.recipe_id || "TEMP_ID",
          imageUrl: data.imageUrl || "",
        };

        setRecipe(newRecipe);

        // If backend ever returns a stored imageUrl, use it immediately
        if (newRecipe.imageUrl) setImageUrl(newRecipe.imageUrl);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setError("Could not reach server.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [
    stateRecipeData,
    location.search,
    cuisine,
    dietaryRestrictions,
    maxTimeMinutes,
    difficulty,
    notes,
  ]);

  // Auto-generate image if we have a prompt but no image yet
  useEffect(() => {
    if (!recipe?.image_prompt) return;
    if (imageUrl) return;

    const controller = new AbortController();

    (async () => {
      try {
        const url = await fetchImage(recipe.image_prompt, controller.signal);
        if (url) setImageUrl(url);
      } catch (e) {
        if (e.name !== "AbortError") console.error("Image load failed:", e);
      }
    })();

    return () => controller.abort();
  }, [recipe?.image_prompt, imageUrl, fetchImage]);

  // Scroll fix: when new recipe loads, snap to top
  useEffect(() => {
    if (!recipe?.title) return;
    pageRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [recipe?.title]);

  useEffect(() => {
    if (!resolvedImageUrl) return;
    pageRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [resolvedImageUrl]);
  

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
          imageUrl: imageUrl || "",
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
    <div
      ref={pageRef}
      className="w-96 mx-auto h-screen px-5 pt-9 pb-20 bg-white flex flex-col gap-5 overflow-y-auto scrollbar-none"
    >
      {/* Header */}
      <div className="flex justify-between items-center h-10">
        {/* ✅ back arrow is an ASSET, not the recipe image */}
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
            className="w-6 h-6 stroke-[1.5px]"
            style={{ fill: isSaved ? heartColor : "none", stroke: heartColor }}
          >
            <path
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Title */}
      <div className="text-4xl font-['Orelega_One'] text-[#333333] mb-2">
        {title}
      </div>

      {/* ✅ BIG IMAGE RIGHT AFTER TITLE */}
      <div
  style={{
    height: 220,
    width: "100%",
    borderRadius: 10,
    border: "4px solid #8B3E2F",
    overflow: "hidden",
    marginBottom: 16,
    background: "#e5e7eb",
    flexShrink: 0,          // ✅ prevents flex from shrinking it
  }}
>
  <img
    src={resolvedImageUrl}
    alt={`Image of ${title}`}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />
</div>


      {/* Details */}
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

      {/* Ingredients */}
      <div className="flex flex-col gap-1">
        <div className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Ingredients
        </div>
        <div className="text-navy text-base font-['Franklin_Gothic_Book'] space-y-1">
          {ingredients.length > 0 ? (
            ingredients.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="flex-1">{item.name || "Missing Ingredient"}</span>
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

      {/* Instructions */}
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

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const db = getFirestore();
    const q = query(
      collection(db, "users", user.uid, "recipes"),
      orderBy("savedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedRecipes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(fetchedRecipes);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching saved recipes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const getCaption = (recipe) => {
    const steps = recipe.instructions || recipe.steps || [];
    if (steps.length > 0) {
      const first = steps[0];
      return first.length > 60 ? first.substring(0, 60) + "..." : first;
    }
    return "View recipe details";
  };

  if (!user && !loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-navy text-xl font-['Franklin_Gothic_Medium']">
          Please sign in to view saved recipes.
        </p>
        <button
          onClick={() => nav("/signin")}
          className="px-4 py-2 bg-darkYellow rounded-[10px] text-main-navy"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 h-screen px-5 pt-9 pb-14 relative bg-white inline-flex flex-col justify-start items-start gap-5 overflow-hidden">
      {/* Header */}
      <div className="self-stretch text-center text-navy text-4xl font-['Orelega_One']">
        Saved Recipes
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full text-center text-gray-500 mt-10">
          Loading your cookbook... 📖
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="w-full flex flex-col items-center mt-10 gap-3">
          <p className="text-gray-500">No saved recipes yet.</p>
          <button
            onClick={() => nav("/browse")}
            className="text-darkRed underline"
          >
            Go find some food!
          </button>
        </div>
      )}

      {/* Recipe Cards List */}
      <div
        data-layer="recipes"
        className="Recipes inline-flex self-stretch flex-col justify-start items-start gap-2.5 overflow-y-auto no-scrollbar"
      >
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recipe?notes=${encodeURIComponent(recipe.title)}`}
            state={{ recipeData: recipe }}
            className="w-full"
          >
            <div
              data-layer="Recipe"
              className="Recipe h-20 p-2.5 rounded-[10px] border border-darkYellow inline-flex justify-start items-center gap-2.5 hover:bg-greenishYellow/30 transition"
            >
              {/* Image Placeholder */}
              <div
                data-layer="img"
                className="Img w-14 self-stretch relative bg-zinc-300 rounded-[10px] flex items-center justify-center text-xs text-white"
              >
                IMG
              </div>

              {/* Text Content */}
              <div
                data-layer="text"
                className="Text flex-1 inline-flex flex-col justify-center items-start gap-[3px] min-w-0"
              >
                <div
                  data-layer="RecipeTitle"
                  className="Recipe justify-center text-navy text-base font-normal font-['Franklin_Gothic_Medium'] truncate w-full"
                >
                  {recipe.title}
                </div>
                <div
                  data-layer="RecipeDesc"
                  className="LoremIpsum self-stretch justify-center text-navy text-sm font-normal font-['Franklin_Gothic_Book'] truncate text-gray-600"
                >
                  {getCaption(recipe)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

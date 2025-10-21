import { httpsCallable } from "firebase/functions";
import { auth, functions } from "./firebase";

export async function callGenerateRecipe({ prompt }) {
  if (!auth.currentUser) throw new Error("Please sign in first.");
  const fn = httpsCallable(functions, "generateRecipe");
  const res = await fn({ prompt });
  return res.data; // { recipeId }
}

export async function callPing() {
  const fn = httpsCallable(functions, "ping");
  const res = await fn();
  return res.data;
}

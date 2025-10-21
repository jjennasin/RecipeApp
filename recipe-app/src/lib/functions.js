import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export async function generateRecipe(prompt) {
  const call = httpsCallable(functions, "generateRecipe");
  const res = await call({ prompt });
  return res.data; // { recipeId }
}

import { searchRecipes } from "../services/spoonacular.js";

async function test() {
  const results = await searchRecipes("pasta", 5);
  console.log("Test API Results:", results);
}

test();

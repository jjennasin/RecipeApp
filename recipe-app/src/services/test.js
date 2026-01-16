import { generateRecipe } from "../services/gemini.js";

async function test() {
  console.log(
    "Starting Gemini Structured Recipe Generation Test with Filters..."
  );

  // ----------------------------------------------------
  // --- DEFINE TEST FILTERS AND INGREDIENTS HERE ---
  // ----------------------------------------------------
  const ingredients = [
    "chicken breast",
    "heavy cream",
    "parmesan cheese",
    "fettuccine pasta",
    "spinach",
  ];

  // Simulated User Filter Selections
  const dietaryRestriction = "Gluten-Free"; // Test a substitution rule
  const cuisineType = "Italian";
  const prepTimeMinutes = 45; // Max duration
  const difficulty = "EASY";
  // ----------------------------------------------------

  // Construct a clear and detailed prompt using all constraints
  let inputPrompt = `Generate a delicious and complete ${cuisineType} main course recipe. The recipe must use primarily these ingredients: ${ingredients.join(
    ", "
  )}.`;

  if (dietaryRestriction) {
    inputPrompt += ` It MUST be compliant with the ${dietaryRestriction} dietary restriction, substituting ingredients where necessary (e.g., using gluten-free pasta).`;
  }
  if (prepTimeMinutes) {
    inputPrompt += ` The preparation and cooking time must be less than ${prepTimeMinutes} minutes.`;
  }
  if (difficulty) {
    inputPrompt += ` The overall difficulty level should be ${difficulty}.`;
  }

  console.log(`\nInput Prompt: ${inputPrompt}`);
  console.log("-----------------------------------------");

  const results = await generateRecipe(inputPrompt);

  if (results) {
    console.log("--- Test API Results (Structured JSON) ---");
    console.log(JSON.stringify(results, null, 2));
    console.log("-----------------------------------------");
  } else {
    console.log(
      "Recipe generation failed. This might be due to a temporary service error (503) or a persistent configuration issue."
    );
  }
}

test();

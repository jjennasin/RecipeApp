import "dotenv/config";
import axios from "axios";

const BASE = "https://api.spoonacular.com";
const KEY = process.env.SPOONACULAR_API_KEY;

export async function searchRecipes(query, number = 5) {
  try {
    const url = `${BASE}/recipes/complexSearch`;
    console.log(
      `Making request to: ${url}?query=${query}&number=${number}&apiKey=${KEY}`
    );

    const res = await axios.get(url, {
      params: { query, number, apiKey: KEY },
    });
    return res.data.results;
  } catch (err) {
    console.error("Spoonacular API Error:", err.response?.data || err.message);
    return [];
  }
}

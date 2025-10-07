sample database info storage

{
  "users": {
    "uid": "string",
    "email": "string",
    "savedRecipes": ["recipeId"],
    "groceryList": [
      {"id": "string", "name": "string", "checked": false}
    ]
  },
  "recipes": {
    "id": "int",
    "title": "string",
    "image": "url",
    "readyInMinutes": "int",
    "diets": ["vegetarian"],
    "sourceUrl": "url"
  }
}
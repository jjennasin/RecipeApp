from ultralytics import YOLO
import requests
import json
import os

model = YOLO(os.path.join("models", "best.pt"))

def detect_ingredients(image_path):
    results = model(image_path)
    detections = results[0].boxes
    ingredients = []

    for box in detections:
        cls_id = int(box.cls[0])
        name = results[0].names[cls_id]
        ingredients.append(name)

    ingredients = list(set(ingredients))
    return ingredients

def generate_recipe_with_gemini(ingredients):
    url = "http://localhost:3001/api/recipe"
    payload = {"query": f"Generate a recipe using: {', '.join(ingredients)}"}
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()  # Gemini API returns JSON
    except Exception as e:
        print("Error contacting Gemini API:", e)
        print("Response text:", getattr(response, "text", ""))
        return None
    
if __name__ == "__main__":
    test_image = os.path.join("samples", "train_batch30101.jpg")  # adjust path
    ingredients = detect_ingredients(test_image)
    print("Detected ingredients:", ingredients)

    recipe = generate_recipe_with_gemini(ingredients)
    print("\nGenerated Recipe:\n", json.dumps(recipe, indent=2))

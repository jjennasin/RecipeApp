from ultralytics import YOLO
import requests
import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "models", "best.pt")

model = YOLO(MODEL_PATH)

def detect_ingredients(image_path):
    results = model(image_path, verbose=False)
    detections = results[0].boxes
    ingredients = []

    for box in detections:
        cls_id = int(box.cls[0])
        name = results[0].names[cls_id]
        ingredients.append(name)

    ingredients = list(set(ingredients))
    return ingredients


if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        ingredients = detect_ingredients(image_path)
        print(json.dumps(ingredients))
    else:
        test_image = os.path.join("samples", "train_batch30101.jpg")
        ingredients = detect_ingredients(test_image)
        print(json.dumps(ingredients, indent=2))

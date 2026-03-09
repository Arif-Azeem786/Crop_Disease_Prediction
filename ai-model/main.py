import io
import os
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from disease_info import DISEASE_DATABASE, CLASS_NAMES

app = FastAPI(title="Plant Disease Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
model_class_names = None
MODEL_PATH = "plant_disease_model.h5"
CLASS_MAPPING_PATH = "class_mapping.json"
IMG_SIZE = (224, 224)


def load_model():
    global model, model_class_names
    try:
        import tensorflow as tf
        import json
        model = tf.keras.models.load_model(MODEL_PATH)
        if os.path.exists(CLASS_MAPPING_PATH):
            with open(CLASS_MAPPING_PATH) as f:
                model_class_names = json.load(f)["classes"]
        else:
            model_class_names = CLASS_NAMES
        print(f"Model loaded from {MODEL_PATH} ({len(model_class_names)} classes)")
    except Exception as e:
        print(f"Could not load model: {e}")
        print("Running in DEMO mode — predictions will be simulated.")
        model = None
        model_class_names = None


@app.on_event("startup")
async def startup_event():
    load_model()


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)


def simulate_prediction(image_bytes: bytes) -> dict:
    """Generate a realistic demo prediction when no trained model is available."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    pixels = np.array(img)

    green_ratio = pixels[:, :, 1].mean() / (pixels.mean() + 1e-6)
    brown_ratio = pixels[:, :, 0].mean() / (pixels[:, :, 1].mean() + 1e-6)

    if green_ratio > 1.3:
        if brown_ratio > 1.1:
            predicted_class = "Wheat_Leaf_Rust"
            confidence = round(np.random.uniform(0.78, 0.95), 4)
        else:
            choices = ["Banana_Healthy", "Wheat_Healthy"]
            predicted_class = choices[int(pixels.mean()) % 2]
            confidence = round(np.random.uniform(0.88, 0.97), 4)
    elif brown_ratio > 1.2:
        choices = ["Banana_Black_Sigatoka", "Wheat_Leaf_Blight", "Banana_Panama_Disease"]
        predicted_class = choices[int(pixels.sum()) % 3]
        confidence = round(np.random.uniform(0.72, 0.92), 4)
    else:
        choices = ["Banana_Bacterial_Wilt", "Wheat_Powdery_Mildew"]
        predicted_class = choices[int(pixels.std() * 100) % 2]
        confidence = round(np.random.uniform(0.70, 0.89), 4)

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "all_predictions": {cls: round(np.random.uniform(0.01, 0.10), 4) for cls in CLASS_NAMES if cls != predicted_class}
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    image_bytes = await file.read()

    if model is not None:
        class_names = model_class_names or CLASS_NAMES
        img_array = preprocess_image(image_bytes)
        predictions = model.predict(img_array)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_index])
        predicted_class = class_names[predicted_index]

        all_preds = {class_names[i]: float(predictions[0][i]) for i in range(len(class_names))}
    else:
        result = simulate_prediction(image_bytes)
        predicted_class = result["predicted_class"]
        confidence = result["confidence"]
        all_preds = result["all_predictions"]
        all_preds[predicted_class] = confidence

    disease_info = DISEASE_DATABASE.get(predicted_class, {})

    return {
        "success": True,
        "prediction": {
            "class": predicted_class,
            "disease_name": disease_info.get("disease_name", predicted_class),
            "crop": disease_info.get("crop", "Unknown"),
            "confidence": round(confidence * 100, 2),
            "description": disease_info.get("description", ""),
            "causes": disease_info.get("causes", []),
            "symptoms": disease_info.get("symptoms", []),
            "treatment": disease_info.get("treatment", []),
            "prevention": disease_info.get("prevention", []),
            "fertilizers_pesticides": disease_info.get("fertilizers_pesticides", []),
            "chemical_fertilizers": disease_info.get("chemical_fertilizers", []),
            "natural_fertilizers": disease_info.get("natural_fertilizers", []),
        },
        "all_predictions": {k: round(v * 100, 2) for k, v in all_preds.items()}
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "supported_classes": (model_class_names or CLASS_NAMES) if model else CLASS_NAMES
    }

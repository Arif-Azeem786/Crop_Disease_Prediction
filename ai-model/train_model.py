"""
Train a CNN model for Banana and Wheat leaf disease classification.
Auto-discovers classes from dataset folder names.

Dataset structure:
    dataset/
    ├── Banana_healthy/
    ├── cordana/
    ├── Healthy/
    ├── pestalotiopsis/
    ├── septoria/
    ├── sigatoka/
    └── stripe_rust/
"""

import os
import json

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15
DATASET_DIR = "dataset"
MODEL_PATH = "plant_disease_model.h5"
CLASS_MAPPING_PATH = "class_mapping.json"


def get_classes_from_dataset(data_dir):
    """Discover class names from folder names (only folders with images)."""
    classes = []
    for name in sorted(os.listdir(data_dir)):
        path = os.path.join(data_dir, name)
        if os.path.isdir(path):
            imgs = [f for f in os.listdir(path) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
            if imgs:
                classes.append(name)
    return classes


def build_model(num_classes):
    """Build a transfer-learning model using MobileNetV2."""
    import tensorflow as tf

    base = tf.keras.applications.MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
        pooling="avg",
    )
    base.trainable = False

    inputs = tf.keras.Input(shape=(*IMG_SIZE, 3))
    x = base(inputs, training=False)
    x = tf.keras.layers.Dense(256, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)

    model = tf.keras.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def create_dataset_from_folders(data_dir, classes):
    """Create ImageDataGenerator from class-named folders."""
    import tensorflow as tf

    datagen = tf.keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2,
    )

    common = dict(
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        classes=classes,
    )

    train_ds = datagen.flow_from_directory(
        data_dir,
        subset="training",
        shuffle=True,
        **common,
    )

    val_ds = datagen.flow_from_directory(
        data_dir,
        subset="validation",
        shuffle=False,
        **common,
    )

    return train_ds, val_ds


def main():
    if not os.path.isdir(DATASET_DIR):
        print(f"\nDataset folder '{DATASET_DIR}' not found.")
        return

    classes = get_classes_from_dataset(DATASET_DIR)
    if not classes:
        print(f"No image folders found in {DATASET_DIR}")
        return

    print(f"Found {len(classes)} classes: {classes}")

    for c in classes:
        path = os.path.join(DATASET_DIR, c)
        count = len([f for f in os.listdir(path) if f.lower().endswith((".jpg", ".jpeg", ".png"))])
        print(f"  {c}: {count} images")
        if count < 10:
            print(f"    Warning: recommend 50+ images per class")

    import tensorflow as tf

    print("\nBuilding model...")
    model = build_model(len(classes))

    print("Loading dataset...")
    train_ds, val_ds = create_dataset_from_folders(DATASET_DIR, classes)

    print("Training...")
    history = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)

    # Evaluate and compute metrics
    print("\nComputing metrics...")
    val_ds.reset()
    y_pred = model.predict(val_ds)
    y_pred_classes = y_pred.argmax(axis=1)
    y_true = val_ds.classes

    from sklearn.metrics import (
        accuracy_score,
        precision_score,
        recall_score,
        f1_score,
        confusion_matrix,
    )

    accuracy = float(accuracy_score(y_true, y_pred_classes))
    precision = float(precision_score(y_true, y_pred_classes, average="macro", zero_division=0))
    recall = float(recall_score(y_true, y_pred_classes, average="macro", zero_division=0))
    f1 = float(f1_score(y_true, y_pred_classes, average="macro", zero_division=0))
    cm = confusion_matrix(y_true, y_pred_classes).tolist()

    metrics = {
        "accuracy": round(accuracy * 100, 2),
        "precision": round(precision * 100, 2),
        "recall": round(recall * 100, 2),
        "f1_score": round(f1 * 100, 2),
        "confusion_matrix": cm,
        "classes": classes,
    }

    metrics_path = os.path.join(os.path.dirname(__file__), "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Saved metrics to {metrics_path}")

    print(f"\nSaving model to {MODEL_PATH}")
    model.save(MODEL_PATH)

    with open(CLASS_MAPPING_PATH, "w") as f:
        json.dump({"classes": classes}, f, indent=2)
    print(f"Saving class mapping to {CLASS_MAPPING_PATH}")

    print("Done. Restart the AI service to use the new model.")


if __name__ == "__main__":
    main()

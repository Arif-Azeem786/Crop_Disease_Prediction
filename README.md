# CropGuard — AI-Powered Plant Disease Detection

Full-stack web application for detecting Banana and Wheat leaf diseases and assisting farmers with treatment advice.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Tailwind CSS, Chart.js, React Router |
| Backend | Node.js, Express |
| Database | MongoDB |
| AI Service | Python, FastAPI, TensorFlow (CNN) |
| Chatbot | OpenAI API |
| Voice | Browser SpeechSynthesis API |

## Features

- **Home Page** — Hero, how-it-works, supported crops (Banana, Wheat)
- **Disease Detection** — Upload leaf image, drag & drop, AI prediction
- **Results** — Disease name, confidence, causes, symptoms, treatment, prevention, fertilizers
- **Voice Assist** — Speaker button reads results aloud (SpeechSynthesis, en-IN)
- **AI Chatbot** — Farmer Q&A via OpenAI (fallback responses if no API key)
- **Admin Dashboard** — Total predictions, users, disease stats, Chart.js graphs
- **FAQ** — Common farmer questions
- **Disease Library** — Database of Banana and Wheat diseases

## Project Structure

```
Banana_Wheat_prediction/
├── ai-model/          # Python FastAPI AI service
│   ├── main.py
│   ├── disease_info.py
│   └── requirements.txt
├── backend/           # Node.js Express API
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── uploads/
├── frontend/          # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── config/
└── README.md
```

## Setup

### 1. AI Model Service (Python)

```bash
cd ai-model
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**PowerShell (Windows):** Use `;` instead of `&&` to chain commands:
```powershell
cd ai-model; pip install -r requirements.txt; uvicorn main:app --reload --port 8000
```

**Note:** Without a trained model, the service runs in **DEMO mode** (simulated predictions). See below for real-time detection.

---

### Real-time disease detection (actual AI predictions)

For real-time disease detection when you upload an image, you need a trained CNN model:

1. **Create the dataset folder** in `ai-model/`:
   ```
   ai-model/dataset/
   ├── Banana_Bacterial_Wilt/   (put leaf images here)
   ├── Banana_Black_Sigatoka/
   ├── Banana_Healthy/
   ├── Banana_Panama_Disease/
   ├── Wheat_Healthy/
   ├── Wheat_Leaf_Blight/
   ├── Wheat_Leaf_Rust/
   └── Wheat_Powdery_Mildew/
   ```

2. **Get labeled images** — Download from Kaggle:
   - Search: "plant village dataset", "banana leaf disease", "wheat leaf disease"
   - Organize images into the folders above (50+ images per class recommended)

3. **Train the model:**
   ```powershell
   cd ai-model
   pip install -r requirements.txt
   python train_model.py
   ```
   This creates `plant_disease_model.h5` in the `ai-model/` folder.

4. **Restart the AI service** — The service will load the model and perform real predictions.

### 2. Backend (Node.js)

```bash
cd backend
npm install
# Create .env from .env.example and set:
# MONGODB_URI, AI_SERVICE_URL, OPENAI_API_KEY
npm start
```

**PowerShell (Windows):** `cd backend; npm install; npm start`

### 3. Frontend (React)

```bash
cd frontend
npm install
# Create .env with REACT_APP_API_URL=http://localhost:5000/api
npm start
```

**PowerShell (Windows):** `cd frontend; npm install; npm start`

### 4. MongoDB

Ensure MongoDB is running locally or set `MONGODB_URI` in backend `.env`.

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| AI_SERVICE_URL | Python AI service URL (e.g. http://localhost:8000) |
| OPENAI_API_KEY | OpenAI API key for chatbot (optional; fallback responses if missing) |

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| REACT_APP_API_URL | Backend API URL (e.g. http://localhost:5000/api) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload image, get prediction |
| POST | /api/chat | Send message to chatbot |
| GET | /api/dashboard | Dashboard statistics |
| GET | /api/health | Health check |

## AI Service Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /predict | Predict disease from image |
| GET | /health | Health and model status |

## Supported Diseases

**Banana:** Black Sigatoka, Panama Disease, Bacterial Wilt, Healthy  
**Wheat:** Leaf Rust, Powdery Mildew, Leaf Blight, Healthy

## Documentation

Open `docs/index.html` in a browser for full documentation with index, setup, API reference, and print/PDF download.

## License

MIT

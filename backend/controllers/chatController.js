const OpenAI = require("openai");
const axios = require("axios");
const ChatMessage = require("../models/ChatMessage");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert agricultural assistant (Kisan Mitra) designed to help Indian farmers.
Your specialty is banana and wheat crop diseases, farming practices, fertilizers, pesticides, and pest management.

Guidelines:
- Use very simple, easy-to-understand language suitable for farmers who may have limited formal education.
- Provide practical, actionable advice with specific dosages and steps.
- When discussing diseases: always mention symptoms, causes, treatment, and prevention.
- Recommend specific fertilizers and pesticides with dosage (e.g., "2g per litre", "per hectare").
- Be encouraging, supportive, and respectful.
- If asked in Hindi or Telugu, respond in that language. Otherwise respond in simple English.
- If a question is outside agriculture, politely redirect to farming topics.
- Keep responses concise but thorough. Use bullet points for lists.
- Include local/regional context when relevant (e.g., Indian farming conditions).`;

exports.chat = async (req, res) => {
  try {
    const { message, sessionId, lang } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const langHint = lang === "hi" ? "Respond in Hindi (हिंदी)." : lang === "te" ? "Respond in Telugu (తెలుగు)." : "";

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
      const fallbackResponse = getFallbackResponse(message);
      await ChatMessage.create({
        userMessage: message.trim(),
        botResponse: fallbackResponse,
        sessionId,
        ipAddress: req.ip,
      });
      return res.json({ success: true, response: fallbackResponse });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + (langHint ? `\n${langHint}` : "") },
        { role: "user", content: message.trim() },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content;

    await ChatMessage.create({
      userMessage: message.trim(),
      botResponse,
      sessionId,
      ipAddress: req.ip,
    });

    res.json({ success: true, response: botResponse });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({
      success: false,
      message: "Sorry, I could not process your question right now. Please try again.",
    });
  }
};

function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes("yellow") && msg.includes("banana")) {
    return `Yellowing of banana leaves can have several causes:

• **Fusarium Wilt (Panama Disease):** A soil-borne fungus that causes yellowing from older to younger leaves. There is no chemical cure — remove infected plants immediately.
• **Nutrient Deficiency:** Lack of nitrogen or potassium can cause yellowing. Apply balanced NPK fertilizer (14-14-14) at 200g per plant.
• **Overwatering:** Waterlogged roots can turn leaves yellow. Ensure proper drainage in your field.
• **Natural Aging:** Lower leaves naturally turn yellow and die — this is normal.

I recommend inspecting the pattern of yellowing carefully and checking soil drainage first.`;
  }

  if (msg.includes("fertilizer") && msg.includes("wheat")) {
    return `Here are the recommended fertilizers for wheat:

• **At Sowing:** Apply DAP (Diammonium Phosphate) at 60 kg/ha and Muriate of Potash at 40 kg/ha.
• **First Irrigation (21 days):** Apply Urea at 60 kg/ha for nitrogen boost.
• **Second Irrigation (45 days):** Apply remaining Urea at 60 kg/ha.
• **Micronutrients:** Zinc Sulphate at 25 kg/ha at sowing for better grain quality.

Total recommended dose: 120 kg Nitrogen, 60 kg Phosphorus, 40 kg Potash per hectare. Adjust based on soil test results.`;
  }

  if (msg.includes("fungal") || msg.includes("fungus") || msg.includes("infection")) {
    return `To treat fungal infections in crops:

• **Identify the disease first** — look at the pattern, color, and location of spots on leaves.
• **Protective Fungicides:** Mancozeb 75% WP at 2.5g/L — spray every 10-14 days as prevention.
• **Systemic Fungicides:** Propiconazole 25% EC at 1ml/L — use when disease is already spreading.
• **Cultural Practices:** Remove infected leaves, improve air circulation, and avoid overhead irrigation.
• **Biocontrol:** Trichoderma viride at 10g/L as soil drench can suppress soil-borne fungi.

Always rotate between different fungicide groups to prevent resistance.`;
  }

  if (msg.includes("rust") && msg.includes("wheat")) {
    return `Wheat Leaf Rust (Brown Rust) management:

• **Symptoms:** Small, round orange-brown pustules scattered on the upper leaf surface.
• **Treatment:** Spray Propiconazole 25% EC at 1ml/L at the first sign of pustules. Follow up with Tebuconazole if needed.
• **Prevention:** Grow rust-resistant varieties, avoid late sowing, and destroy volunteer wheat plants.
• **Critical Period:** Monitor especially during flag-leaf to grain-filling stage — this is when rust causes maximum yield loss.`;
  }

  if (msg.includes("sigatoka") || (msg.includes("black spot") && msg.includes("banana"))) {
    return `Black Sigatoka management for banana:

• **Symptoms:** Dark brown to black streaks and spots on leaves, starting from lower leaves.
• **Treatment:** Apply Mancozeb 75% WP at 2g/L every 2 weeks. For severe cases, use Propiconazole 25% EC at 1ml/L.
• **Prevention:** Remove infected leaves, maintain good spacing, and ensure proper drainage.
• **Tip:** Mix mineral oil with fungicide spray for better leaf coverage and adhesion.`;
  }

  if (msg.includes("cordana") || msg.includes("cordana leaf")) {
    return `Cordana Leaf Spot (Banana) management:

• **Symptoms:** Oval to irregular brown spots with yellow halos, usually on older leaves.
• **Treatment:** Spray Mancozeb 75% WP at 2g/L or Chlorothalonil.
• **Prevention:** Improve drainage, reduce humidity, maintain good spacing between plants.`;
  }

  if (msg.includes("pestalotiopsis") || msg.includes("pestalotiopsis leaf")) {
    return `Pestalotiopsis Leaf Spot (Banana) management:

• **Symptoms:** Gray-brown elliptical spots with dark margins on banana leaves.
• **Treatment:** Apply copper-based fungicides or Mancozeb 75% WP. Remove severely infected leaves.
• **Prevention:** Reduce plant stress, avoid wounding, practice good field sanitation.`;
  }

  if (msg.includes("septoria") || msg.includes("septoria blotch")) {
    return `Septoria Tritici Blotch (Wheat) management:

• **Symptoms:** Yellow-brown elongated lesions with small dark pycnidia.
• **Treatment:** Spray Azoxystrobin or Propiconazole at flag-leaf stage.
• **Prevention:** Grow resistant varieties, practice crop rotation, destroy infected crop residue.`;
  }

  if (msg.includes("stripe rust") || msg.includes("yellow rust")) {
    return `Stripe Rust (Yellow Rust) management for wheat:

• **Symptoms:** Yellow-orange stripes along leaf veins, parallel streaks.
• **Treatment:** Apply Propiconazole 25% EC or Tebuconazole 25.9% EC at 1ml/L.
• **Prevention:** Grow resistant varieties, avoid late sowing, destroy volunteer wheat plants.`;
  }

  if (msg.includes("banana") && (msg.includes("disease") || msg.includes("problem"))) {
    return `Common banana diseases and quick tips:

• **Black Sigatoka:** Dark streaks on leaves — use Mancozeb + Propiconazole.
• **Cordana:** Brown oval spots — use Mancozeb or Chlorothalonil.
• **Pestalotiopsis:** Gray-brown spots with dark border — copper fungicide.
• **Panama Disease:** Yellowing, wilting — no cure, remove infected plants immediately.

Always take a clear photo of the leaf and use our Disease Detection tool for accurate identification!`;
  }

  if (msg.includes("wheat") && (msg.includes("disease") || msg.includes("problem"))) {
    return `Common wheat diseases and quick tips:

• **Leaf Rust:** Orange-brown pustules — Propiconazole at 1ml/L.
• **Stripe Rust:** Yellow stripes along veins — same fungicide.
• **Powdery Mildew:** White powdery growth — Sulfur or Triadimefon.
• **Septoria:** Yellow-brown lesions — Azoxystrobin or Propiconazole.

Use our Disease Detection page to upload a leaf photo for accurate identification!`;
  }

  return `Thank you for your question! Here are some general farming tips:

• **Soil Health:** Get your soil tested regularly and apply fertilizers based on results.
• **Disease Prevention:** Practice crop rotation, use disease-free seeds, and maintain field hygiene.
• **Irrigation:** Water your crops early morning and avoid waterlogging.
• **Pest Management:** Scout your fields regularly and use integrated pest management (IPM) approaches.

Feel free to ask me specific questions about banana or wheat diseases, fertilizers, or farming practices. I'm here to help!`;
}

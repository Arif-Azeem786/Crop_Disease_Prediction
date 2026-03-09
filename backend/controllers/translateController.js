const axios = require("axios");

const LANG_MAP = { en: "en", hi: "hi", te: "te" };

async function translateMyMemory(text, targetLang) {
  const url = "https://api.mymemory.translated.net/get";
  const res = await axios.get(url, {
    params: { q: text.substring(0, 500), langpair: `en|${targetLang}` },
    timeout: 8000,
  });
  const translated = res.data?.responseData?.translatedText;
  if (translated && translated !== text) return translated;
  return null;
}

async function translateLibre(text, targetLang) {
  try {
    const res = await axios.post(
      "https://libretranslate.com/translate",
      {
        q: text.substring(0, 1000),
        source: "en",
        target: targetLang,
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 8000,
      }
    );
    return res.data?.translatedText || null;
  } catch {
    return null;
  }
}

exports.translate = async (req, res) => {
  try {
    const { text, targetLang = "en" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ success: false, message: "Text is required." });
    }
    const lang = LANG_MAP[targetLang] || "en";
    if (lang === "en") {
      return res.json({ success: true, translatedText: text });
    }

    let translated = await translateMyMemory(text, lang);
    if (!translated) translated = await translateLibre(text, lang);
    if (!translated) {
      return res.status(503).json({
        success: false,
        message: "Translation service unavailable. Please try again.",
        translatedText: null,
      });
    }

    res.json({ success: true, translatedText: translated });
  } catch (error) {
    console.error("Translate error:", error.message);
    res.status(500).json({ success: false, message: "Translation failed.", translatedText: null });
  }
};

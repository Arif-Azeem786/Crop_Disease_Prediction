import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import API from '../config/api';

const LANGUAGES = [
  { code: 'en', label: 'English', lang: 'en-IN' },
  { code: 'hi', label: 'हिंदी', lang: 'hi-IN' },
  { code: 'te', label: 'తెలుగు', lang: 'te-IN' },
];

function getVoiceForLang(langCode) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  if (!voices.length) return null;
  const target = LANGUAGES.find((l) => l.code === langCode)?.lang || 'en-IN';
  const prefix = target.split('-')[0];
  return voices.find((v) => v.lang.startsWith(prefix)) || voices[0];
}

export default function VoiceAssist({ text, className = '' }) {
  const [speaking, setSpeaking] = useState(false);
  const [activeLang, setActiveLang] = useState(null);
  const [voicesReady, setVoicesReady] = useState(false);
  const [translatedPreview, setTranslatedPreview] = useState(null);
  const [translatedCache, setTranslatedCache] = useState({});
  const [loadingLang, setLoadingLang] = useState(null);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    setTranslatedCache({});
  }, [text]);

  useEffect(() => {
    const load = () => {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      if (voices.length) setVoicesReady(true);
    };
    load();
    window.speechSynthesis?.getVoices?.();
    window.speechSynthesis.onvoiceschanged = load;
    const fallback = setInterval(() => {
      if (window.speechSynthesis?.getVoices?.().length) {
        setVoicesReady(true);
        clearInterval(fallback);
      }
    }, 200);
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      clearInterval(fallback);
    };
  }, []);

  const doSpeak = useCallback((textToSpeak, langCode) => {
    if (!textToSpeak || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const langConfig = LANGUAGES.find((l) => l.code === langCode);
    const voice = getVoiceForLang(langCode);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langConfig?.lang || 'en-IN';
    utterance.rate = 0.9;
    utterance.volume = 1;
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setActiveLang(null);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setActiveLang(null);
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakText = useCallback((langCode) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setActiveLang(null);
      return;
    }

    setActiveLang(langCode);

    if (langCode === 'en') {
      doSpeak(text, 'en');
      setTranslatedPreview(null);
      return;
    }

    const cached = translatedCache[langCode];
    if (cached) {
      doSpeak(cached, langCode);
      setTranslatedPreview({ lang: langCode, text: cached, fallbackSpeech: false });
      setTimeout(() => setTranslatedPreview(null), 10000);
      return;
    }

    setLoadingLang(langCode);
    axios
      .post(API.translate, { text, targetLang: langCode })
      .then((res) => {
        const translated = res.data?.translatedText;
        if (translated) {
          setTranslatedCache((prev) => ({ ...prev, [langCode]: translated }));
          setTranslatedPreview({ lang: langCode, text: translated, fallbackSpeech: false });
          setTimeout(() => setTranslatedPreview(null), 10000);
          // Don't speak here - browser blocks after async. User must click again (has gesture).
        } else {
          setTranslatedPreview(null);
        }
      })
      .catch(() => {
        setTranslatedPreview(null);
      })
      .finally(() => {
        setLoadingLang(null);
      });
  }, [text, speaking, translatedCache, doSpeak]);

  return (
    <div className={className}>
      {translatedPreview && (
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <strong>{translatedPreview.lang === 'hi' ? 'हिंदी:' : 'తెలుగు:'}</strong> {translatedPreview.text}
          <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click the language button again to hear the translation.
          </span>
        </p>
      )}
      <div className="inline-flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Speak:</span>
        {LANGUAGES.map(({ code, label: l }) => {
          const isLoading = loadingLang === code;
          const isDisabled = (speaking && activeLang !== code) || isLoading;
          return (
            <button
              key={code}
              type="button"
              onClick={() => speakText(code)}
              disabled={isDisabled}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all ${
                speaking && activeLang === code
                  ? 'bg-leaf-600 text-white'
                  : 'bg-leaf-100 text-leaf-700 hover:bg-leaf-200 dark:bg-leaf-900/50 dark:text-leaf-300 dark:hover:bg-leaf-800'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={`Read in ${l}`}
            >
              {speaking && activeLang === code ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Stop
                </>
              ) : isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {l}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                  {l}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

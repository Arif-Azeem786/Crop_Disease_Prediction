import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../config/api';
import VoiceAssist from '../components/VoiceAssist';
import ConfidenceGauge from '../components/ConfidenceGauge';
import ShareButtons from '../components/ShareButtons';

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'te', label: 'తెలుగు' },
];

async function translateText(text, lang) {
  if (!text || lang === 'en') return text;
  try {
    const res = await axios.post(API.translate, { text: String(text), targetLang: lang });
    return res.data?.translatedText || text;
  } catch {
    return text;
  }
}

async function translateList(arr, lang) {
  if (!arr?.length || lang === 'en') return arr;
  const joined = arr.join('\n');
  const t = await translateText(joined, lang);
  return t.split('\n').filter(Boolean);
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const data = location.state?.prediction;
  const [lang, setLang] = useState('en');
  const [display, setDisplay] = useState(null);
  const [translating, setTranslating] = useState(false);

  const handlePrint = () => window.print();

  useEffect(() => {
    if (!data?.prediction) return;
    const p = data.prediction;
    if (lang === 'en') {
      setDisplay(p);
      return;
    }
    setTranslating(true);
    Promise.all([
      translateText(p.disease_name, lang),
      translateText(p.description || '', lang),
      translateList(p.causes || [], lang),
      translateList(p.symptoms || [], lang),
      translateList(p.treatment || [], lang),
      translateList(p.prevention || [], lang),
      translateList(p.chemical_fertilizers || [], lang),
      translateList(p.natural_fertilizers || p.fertilizers_pesticides || [], lang),
    ]).then(([dn, desc, causes, symptoms, treatment, prevention, chem, nat]) => {
      setDisplay({
        ...p,
        disease_name: dn,
        description: desc,
        causes,
        symptoms,
        treatment,
        prevention,
        chemical_fertilizers: chem,
        natural_fertilizers: nat,
      });
    }).finally(() => setTranslating(false));
  }, [data?.prediction, lang]);

  if (!data || !data.prediction) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 dark:text-slate-400 mb-6">No prediction result found.</p>
        <button type="button" onClick={() => navigate('/detection')} className="btn-primary">
          Upload New Image
        </button>
      </div>
    );
  }

  const p = display || data.prediction;
  const isHealthy = p.class?.includes('Healthy') ?? false;
  const fullText = `${p.disease_name}. ${p.description || ''}. Confidence ${p.confidence} percent.`;

  const titles = {
    en: { causes: 'Causes', symptoms: 'Symptoms', treatment: 'Treatment', prevention: 'Prevention', chem: 'Chemical Fertilizers & Pesticides', nat: 'Natural / Organic Fertilizers' },
    hi: { causes: 'कारण', symptoms: 'लक्षण', treatment: 'उपचार', prevention: 'रोकथाम', chem: 'रासायनिक उर्वरक', nat: 'प्राकृतिक उर्वरक' },
    te: { causes: 'కారణాలు', symptoms: 'లక్షణాలు', treatment: 'చికిత్స', prevention: 'నివారణ', chem: 'రసాయన ఎరువులు', nat: 'సహజ ఎరువులు' },
  };
  const t = titles[lang] || titles.en;

  const sections = [
    { title: t.causes, titleKey: 'causes', icon: '🔍', items: p.causes },
    { title: t.symptoms, titleKey: 'symptoms', icon: '🩺', items: p.symptoms },
    { title: t.treatment, titleKey: 'treatment', icon: '💊', items: p.treatment },
    { title: t.prevention, titleKey: 'prevention', icon: '🛡️', items: p.prevention },
  ];

  const shareText = `CropGuard: ${p.disease_name} (${p.crop}) - ${p.confidence}% confidence`;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-600/90 to-emerald-700/90" />
        <div className="absolute inset-0 bg-[url('./images/wheat-leaf-bg.png')] bg-cover bg-center opacity-30" />
        <div className="relative p-8 text-white">
          <h1 className="font-display font-bold text-3xl md:text-4xl">
            {lang === 'en' ? 'Prediction Result' : 'ఫలితం'}
          </h1>
          <p className="mt-2 text-white/90">
            {p.disease_name} — {p.crop} • {p.confidence}% confidence
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-4">
        <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-white sr-only">
          {lang === 'en' ? 'Prediction Result' : 'ఫలితం'}
        </h1>
        <div className="flex flex-wrap items-center gap-2 no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {lang === 'en' ? 'View in:' : 'భాష:'}
            </span>
            {LANG_OPTIONS.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  lang === code ? 'bg-leaf-600 text-white' : 'bg-slate-100 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <VoiceAssist text={fullText} />
          <ShareButtons text={shareText} />
          <button type="button" onClick={handlePrint} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">
            Print
          </button>
          <button type="button" onClick={() => navigate('/detection')} className="btn-secondary shrink-0">
            New Detection
          </button>
        </div>
      </div>

      {translating && (
        <div className="flex items-center gap-2 text-leaf-600">
          <span className="w-4 h-4 border-2 border-leaf-500 border-t-transparent rounded-full animate-spin" />
          Translating to {LANG_OPTIONS.find(l => l.code === lang)?.label}...
        </div>
      )}

      <div ref={printRef} className={`rounded-2xl bg-white dark:bg-slate-800 backdrop-blur p-6 shadow-xl border-l-4 border-slate-100 dark:border-slate-700 print:shadow-none ${isHealthy ? 'border-l-leaf-500' : 'border-l-amber-500'}`}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{p.crop}</span>
            <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-white mt-1">{p.disease_name}</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{p.description}</p>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-2">
            <ConfidenceGauge value={p.confidence} />
            <span className="text-xs text-slate-500">confidence</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map(({ title, titleKey, icon, items }) =>
          items?.length ? (
            <div key={titleKey} className="rounded-2xl bg-white dark:bg-slate-800 backdrop-blur p-6 shadow-lg border border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <span>{icon}</span> {title}
              </h3>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400">
                    <span className="text-leaf-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}

        {(p.chemical_fertilizers?.length || p.natural_fertilizers?.length) ? (
          <div className="grid md:grid-cols-2 gap-6">
            {p.chemical_fertilizers?.length ? (
              <div className="rounded-2xl bg-white dark:bg-slate-800 backdrop-blur p-6 shadow-lg border border-slate-100 dark:border-slate-700 border-t-4 border-t-amber-400">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  🧪 {t.chem}
                </h3>
                <ul className="space-y-2">
                  {p.chemical_fertilizers.map((item, i) => (
                    <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400 text-sm">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {p.natural_fertilizers?.length ? (
              <div className="rounded-2xl bg-white dark:bg-slate-800 backdrop-blur p-6 shadow-lg border border-slate-100 dark:border-slate-700 border-t-4 border-t-leaf-500">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  🌿 {t.nat}
                </h3>
                <ul className="space-y-2">
                  {p.natural_fertilizers.map((item, i) => (
                    <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400 text-sm">
                      <span className="text-leaf-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : p.fertilizers_pesticides?.length ? (
          <div className="rounded-2xl bg-white dark:bg-slate-800 backdrop-blur p-6 shadow-lg border border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-3">🧪 Fertilizers & Pesticides</h3>
            <ul className="space-y-2">
              {p.fertilizers_pesticides.map((item, i) => (
                <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-leaf-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <style>{`
        @media print { nav, footer, button, .no-print { display: none !important; } body { background: white; } }
      `}</style>
    </div>
  );
}

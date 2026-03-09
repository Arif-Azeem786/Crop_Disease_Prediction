import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DISEASES = {
  Banana: [
    { name: 'Black Sigatoka', icon: '🍌', description: 'A devastating leaf spot disease caused by the fungus Mycosphaerella fijiensis. It is one of the most economically important diseases of banana worldwide.', symptoms: ['Small dark brown streaks on lower leaf', 'Streaks expand into large lesions', 'Premature leaf death', 'Uneven fruit ripening'], treatment: ['Apply propiconazole or azoxystrobin', 'Remove severely infected leaves', 'Use mineral oil + fungicide sprays'], prevention: ['Plant resistant varieties', 'Maintain spacing for air circulation', 'Practice good drainage'], chemical: ['Mancozeb 75% WP — 2g/L', 'Propiconazole 25% EC — 1ml/L', 'Azoxystrobin 23% SC', 'NPK 14-14-14'], natural: ['Potassium-rich compost', 'Neem oil spray 5ml/L', 'Banana compost tea'] },
    { name: 'Panama Disease', icon: '🍌', description: 'Soil-borne fungal infection caused by Fusarium oxysporum. It attacks the vascular system and blocks water and nutrient flow.', symptoms: ['Yellowing of older leaves from edges', 'Splitting of pseudostem', 'Brown vascular tissue', 'Wilting (skirt effect)'], treatment: ['Remove and destroy infected plants', 'Use Trichoderma biocontrol', 'Solarize contaminated soil'], prevention: ['Plant resistant varieties', 'Use disease-free planting material', 'Disinfect tools'], chemical: ['Calcium Ammonium Nitrate (soil pH)'], natural: ['Trichoderma viride 10g/L', 'Pseudomonas fluorescens', 'Organic compost', 'Neem cake 250g/plant'] },
    { name: 'Banana Bacterial Wilt', icon: '🍌', description: 'Caused by Xanthomonas campestris pv. musacearum. Highly destructive—can cause 100% crop loss.', symptoms: ['Wilting and yellowing', 'Brown slimy ooze from cut stem', 'Premature ripening', 'Internal browning of fruit'], treatment: ['Uproot and destroy infected plants', 'Disinfect tools with bleach', 'Remove male buds early'], prevention: ['Use certified disease-free material', 'Remove male buds with forked stick', 'Community-wide management'], chemical: ['Copper hydroxide 77% WP', 'Streptomycin sulphate', 'NPK 10-10-10'], natural: ['Organic mulch', 'Neem cake', 'Compost tea'] },
  ],
  Wheat: [
    { name: 'Leaf Rust', icon: '🌾', description: 'Caused by Puccinia triticina. The most common rust disease of wheat, reducing yield by decreasing photosynthetic area.', symptoms: ['Orange-brown pustules on upper leaf', 'Yellowing and premature drying', 'Shriveled kernels'], treatment: ['Apply propiconazole at first sign', 'Tebuconazole 25% EC at 1ml/L'], prevention: ['Grow rust-resistant varieties', 'Avoid late sowing', 'Destroy volunteer wheat'], chemical: ['Propiconazole 25% EC', 'Tebuconazole', 'Mancozeb', 'NPK 12-32-16'], natural: ['Neem oil spray', 'Compost tea', 'Sulphur dust'] },
    { name: 'Powdery Mildew', icon: '🌾', description: 'Caused by Blumeria graminis. Forms white powdery coating on leaves in cool, humid conditions.', symptoms: ['White to gray powdery growth', 'Starts on lower leaves', 'Yellowing under fungal mat'], treatment: ['Sulfur-based fungicides', 'Triadimefon or propiconazole'], prevention: ['Resistant varieties', 'Avoid excess nitrogen', 'Proper plant spacing'], chemical: ['Sulphur 80% WP', 'Triadimefon', 'Propiconazole', 'Potassium chloride'], natural: ['Neem oil', 'Baking soda spray', 'Compost'] },
    { name: 'Leaf Blight', icon: '🌾', description: 'Caused by Bipolaris sorokiniana and Alternaria triticina. Common in warm, humid regions.', symptoms: ['Dark oval lesions on leaves', 'Yellow halos', 'Premature drying', 'Black point on grains'], treatment: ['Seed treatment with thiram', 'Mancozeb foliar spray'], prevention: ['Disease-free seed', 'Crop rotation', 'Seed fungicide treatment'], chemical: ['Thiram seed treatment', 'Mancozeb', 'Propiconazole', 'DAP'], natural: ['Trichoderma seed treatment', 'Neem extract', 'Compost'] },
  ],
};

const QUICK_LINKS = [
  { label: 'Detect Disease', path: '/detection', icon: '📷' },
  { label: 'AI Chatbot', path: '/chatbot', icon: '💬' },
  { label: 'FAQ', path: '/faq', icon: '❓' },
];

export default function DiseaseLibrary() {
  const [crop, setCrop] = useState('Banana');
  const list = DISEASES[crop] || [];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-amber-700/90" />
        <div className="absolute inset-0 bg-[url('./images/banana-leaf-bg.png')] bg-cover bg-center opacity-35" />
        <div className="relative p-8 md:p-10 text-white">
          <h1 className="font-display font-bold text-3xl md:text-4xl">Disease Database</h1>
          <p className="mt-2 text-white/90 max-w-2xl">Comprehensive guide to Banana & Wheat diseases — symptoms, treatment, prevention, and fertilizers</p>
        </div>
      </div>

      {/* Quick Links Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {QUICK_LINKS.map((q) => (
          <Link
            key={q.path}
            to={q.path}
            className="rounded-2xl p-4 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-leaf-200 dark:hover:border-leaf-800 transition-all flex items-center gap-3"
          >
            <span className="text-2xl">{q.icon}</span>
            <span className="font-medium text-slate-800 dark:text-white">{q.label}</span>
          </Link>
        ))}
      </div>

      {/* Crop Toggle */}
      <div className="flex gap-2 mb-8">
        {['Banana', 'Wheat'].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCrop(c)}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all ${
              crop === c ? 'bg-leaf-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-leaf-50 dark:hover:bg-slate-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Disease Cards */}
      <div className="space-y-8">
        {list.map((d, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-leaf-100 dark:bg-leaf-900/50 flex items-center justify-center text-3xl shrink-0">{d.icon}</div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-white">{d.name}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{d.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-1">🩺 Symptoms</h3>
                <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                  {d.symptoms.map((s, j) => <li key={j}>• {s}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-1">💊 Treatment</h3>
                <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                  {d.treatment.map((t, j) => <li key={j}>• {t}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-1">🛡️ Prevention</h3>
                <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                  {d.prevention.map((p, j) => <li key={j}>• {p}</li>)}
                </ul>
              </div>
              {d.chemical?.length ? (
                <div>
                  <h3 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-2">🧪 Chemical</h3>
                  <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                    {d.chemical.map((c, j) => <li key={j}>• {c}</li>)}
                  </ul>
                </div>
              ) : null}
              {d.natural?.length ? (
                <div>
                  <h3 className="font-semibold text-leaf-700 dark:text-leaf-400 text-sm mb-2">🌿 Natural</h3>
                  <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                    {d.natural.map((n, j) => <li key={j}>• {n}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

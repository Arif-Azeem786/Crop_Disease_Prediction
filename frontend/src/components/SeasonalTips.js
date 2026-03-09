import React, { useState, useEffect } from 'react';

const TIPS = [
  { month: [2, 3, 4], crop: 'Wheat', tip: 'Monitor for Leaf Rust and Powdery Mildew during flowering. Apply preventive fungicide at flag-leaf stage.', icon: '🌾' },
  { month: [3, 4, 5], crop: 'Wheat', tip: 'Avoid excessive nitrogen — it increases rust susceptibility. Split urea application for better efficiency.', icon: '📋' },
  { month: [5, 6, 7, 8], crop: 'Banana', tip: 'Rainy season increases Black Sigatoka risk. Spray Mancozeb every 2 weeks and improve drainage.', icon: '🍌' },
  { month: [6, 7, 8], crop: 'Banana', tip: 'Watch for Cordana and Pestalotiopsis in humid weather. Remove infected leaves early.', icon: '🌧️' },
  { month: [9, 10, 11], crop: 'Wheat', tip: 'Early sown wheat faces stripe rust. Use resistant varieties and scout regularly.', icon: '🔍' },
  { month: [11, 12, 1], crop: 'Banana', tip: 'Cool season — reduce fungicide frequency. Focus on soil health and organic matter.', icon: '❄️' },
];

export default function SeasonalTips() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const now = new Date().getMonth() + 1;
    const relevant = TIPS.filter((t) => t.month.includes(now));
    if (relevant.length) {
      const i = TIPS.indexOf(relevant[0]);
      if (i >= 0) setIdx(i);
    }
  }, []);

  const display = TIPS[idx % TIPS.length];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-500 via-leaf-600 to-emerald-700" />
      <div className="absolute inset-0 bg-[url('./images/farm-landscape-bg.png')] bg-cover bg-center opacity-25" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/20 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0 backdrop-blur">{display.icon}</div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-leaf-100">Seasonal Tip</p>
          <p className="font-bold text-xl text-white mt-1">{display.crop}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/95">{display.tip}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {TIPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === i ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
              aria-label={`Tip ${i + 1}`}
            />
          ))}
          <button type="button" onClick={() => setIdx((i) => (i + 1) % TIPS.length)} className="ml-2 px-3 py-1 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

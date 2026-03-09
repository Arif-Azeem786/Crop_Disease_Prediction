import React from 'react';
import { Link } from 'react-router-dom';

const TIPS = [
  { text: 'Take leaf photos in natural daylight for best results', icon: '☀️', link: '/detection', color: 'from-amber-400 to-orange-500' },
  { text: 'Chemical + Natural fertilizers both work — choose based on severity', icon: '🌿', link: '/diseases', color: 'from-green-400 to-emerald-500' },
  { text: 'Use Voice Assist to hear results in English, Hindi, or Telugu', icon: '🔊', link: '/detection', color: 'from-blue-400 to-indigo-500' },
  { text: 'Ask our AI chatbot for instant farming advice', icon: '💬', link: '/chatbot', color: 'from-violet-400 to-purple-500' },
  { text: 'Browse the Disease Library before detection', icon: '📚', link: '/diseases', color: 'from-rose-400 to-pink-500' },
  { text: 'Create account to save results and access profile', icon: '👤', link: '/signup', color: 'from-cyan-400 to-teal-500' },
];

export default function QuickTips() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700">
      <div className="absolute inset-0 bg-[url('./images/wheat-leaf-bg.png')] bg-cover bg-center opacity-[0.12]" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-emerald-50/80 dark:from-slate-800/95 dark:to-slate-800/80" />
      <div className="relative p-6 md:p-8">
        <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-1 flex items-center gap-2">
          <span className="text-2xl">💡</span> Quick Expert Tips
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Get the most out of CropGuard</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPS.map((tip, i) => (
            <Link
              key={i}
              to={tip.link}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg border border-slate-100 dark:border-slate-600 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform`}>{tip.icon}</div>
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium">{tip.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

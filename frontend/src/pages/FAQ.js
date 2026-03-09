import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ_ITEMS = [
  { q: 'How accurate is the system?', a: 'Our AI model is trained on thousands of leaf images and typically achieves 85–95% accuracy for Banana and Wheat diseases. Accuracy depends on image quality—clear, well-lit photos give the best results.' },
  { q: 'Which crops are supported?', a: 'We support Banana (Black Sigatoka, Cordana, Pestalotiopsis, Sigatoka, Panama Disease, Bacterial Wilt) and Wheat (Leaf Rust, Stripe Rust, Powdery Mildew, Septoria, Leaf Blight). We also identify healthy leaves.' },
  { q: 'How to take a proper leaf image?', a: '1) Use natural daylight. 2) Place the leaf on a plain, contrasting background. 3) Fill the frame with the leaf. 4) Focus on the affected area and avoid blur. 5) Avoid shadows and reflections.' },
  { q: 'Can this work on mobile?', a: 'Yes! Our app is fully responsive. Upload images from your phone camera or gallery. Voice Assist works on most modern mobile browsers.' },
  { q: 'Is the service free?', a: 'Yes. Disease detection and chatbot are free. We aim to help farmers with accessible technology.' },
  { q: 'What languages are supported?', a: 'Results and chatbot support English, Hindi (हिंदी), and Telugu (తెలుగు). Use the language selector and Voice Assist to hear results.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/90 via-slate-800/90 to-slate-700/90" />
        <div className="absolute inset-0 bg-[url('./images/farm-landscape-bg.png')] bg-cover bg-center opacity-30" />
        <div className="relative p-8 md:p-10 text-white">
          <h1 className="font-display font-bold text-3xl md:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-2 text-white/90">Common questions from farmers about our AI disease detection system</p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <span className="font-semibold text-slate-800 dark:text-white pr-4">{item.q}</span>
              <span className="shrink-0 text-leaf-600 dark:text-leaf-400">
                {openIndex === i ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                )}
              </span>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Need Help Card */}
      <div className="mt-10 rounded-2xl p-8 bg-gradient-to-r from-leaf-500 to-emerald-600 text-white shadow-xl">
        <h3 className="font-display font-bold text-xl mb-2">Still have questions?</h3>
        <p className="text-white/90 mb-4">Try our AI chatbot or browse the Disease Library.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/chatbot" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-leaf-700 font-semibold hover:bg-amber-50 transition-colors">
            <span>💬</span> Chat with AI
          </Link>
          <Link to="/diseases" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors">
            <span>📚</span> Disease Library
          </Link>
        </div>
      </div>
    </div>
  );
}

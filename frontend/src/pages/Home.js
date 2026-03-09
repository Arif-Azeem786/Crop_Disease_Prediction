import React from 'react';
import { Link } from 'react-router-dom';
import SeasonalTips from '../components/SeasonalTips';
import LiveStats from '../components/LiveStats';
import QuickTips from '../components/QuickTips';

const FEATURES = [
  { icon: '⚡', title: 'Instant Results', desc: 'Get diagnosis in under 3 seconds', color: 'from-amber-400 to-orange-500' },
  { icon: '🌐', title: '3 Languages', desc: 'English, Hindi & Telugu support', color: 'from-blue-400 to-indigo-500' },
  { icon: '🆓', title: 'Free Forever', desc: 'No hidden costs for farmers', color: 'from-green-400 to-emerald-500' },
  { icon: '📱', title: 'Mobile Ready', desc: 'Works on any smartphone', color: 'from-violet-400 to-purple-500' },
  { icon: '🎯', title: '90%+ Accuracy', desc: 'AI trained on thousands of images', color: 'from-rose-400 to-pink-500' },
];

const WHY_CHOOSE = [
  { icon: '🔬', title: 'Scientific Accuracy', text: 'CNN model trained on real farm images for reliable disease detection.' },
  { icon: '💊', title: 'Treatment Guidance', text: 'Chemical and natural fertilizer recommendations for every disease.' },
  { icon: '🔊', title: 'Voice Output', text: 'Listen to results in your language—perfect for field use.' },
  { icon: '📚', title: 'Disease Library', text: 'Detailed info on symptoms, prevention, and management.' },
];

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative text-center py-20 md:py-28 overflow-hidden rounded-3xl mx-2 md:mx-4 -mt-2">
        <div className="absolute inset-0 bg-[url('./images/hero-wheat-field.png')] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/70 to-emerald-700/50" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="relative text-white px-4">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['🤖 AI-Powered', '🌾 Banana & Wheat', '📷 Upload & Analyze'].map((badge) => (
              <span key={badge} className="px-4 py-2 rounded-full bg-white/20 text-sm font-medium backdrop-blur">{badge}</span>
            ))}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-7xl text-white leading-tight drop-shadow-lg">
            AI Plant Disease Detection
          </h1>
          <p className="mt-6 text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">
            Upload a photo of your banana or wheat leaf. Our AI identifies diseases in seconds and gives you treatment advice in simple language.
          </p>
          <Link
            to="/detection"
            className="inline-flex items-center gap-2 mt-10 text-lg px-10 py-4 rounded-2xl font-semibold bg-white text-emerald-700 hover:bg-amber-50 shadow-2xl transition-all hover:scale-105"
          >
            <span>Upload Leaf Image</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </Link>
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/90 text-sm">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-300" /> Instant results</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-300" /> Voice in 3 languages</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-300" /> Free for farmers</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-300" /> No sign-up needed</span>
          </div>
        </div>
      </section>

      {/* Stats & Quick Section */}
      <section className="max-w-5xl mx-auto space-y-6">
        <LiveStats />
        <QuickTips />
        <SeasonalTips />
      </section>

      {/* Feature Cards Strip */}
      <section className="max-w-6xl mx-auto">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-800 dark:text-white mb-6 text-center">Why CropGuard?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mx-auto mb-3`}>{f.icon}</div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('./images/farm-landscape-bg.png')] bg-cover bg-center opacity-30" />
        <div className="relative p-8 md:p-12">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-800 dark:text-white mb-2 text-center">How It Works</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-xl mx-auto">Three simple steps to protect your crops</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: '📷', title: 'Take or Upload', desc: 'Click a clear photo of the leaf or upload from your gallery. Use natural light and fill the frame with the leaf.', color: 'from-emerald-400 to-teal-500' },
              { step: 2, icon: '🤖', title: 'AI Analysis', desc: 'Our CNN model analyzes the image in seconds and identifies the disease with confidence percentage.', color: 'from-blue-400 to-indigo-500' },
              { step: 3, icon: '💡', title: 'Get Advice', desc: 'Receive treatment, prevention tips, chemical & natural fertilizers. Use voice to listen in your language.', color: 'from-amber-400 to-orange-500' },
            ].map((item) => (
              <div key={item.step} className="card p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative">
                <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg`}>{item.step}</div>
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - More Content */}
      <section className="max-w-5xl mx-auto">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-800 dark:text-white mb-2 text-center">Trusted by Farmers</h2>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-10">Built for real-world farm conditions</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE.map((w, i) => (
            <div key={i} className="rounded-2xl p-6 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 hover:border-leaf-300 dark:hover:border-leaf-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-leaf-100 dark:bg-leaf-900/50 flex items-center justify-center text-2xl mb-4">{w.icon}</div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{w.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Crops */}
      <section className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('./images/banana-farm-bg.png')] bg-cover bg-center opacity-25" />
        <div className="relative p-8">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-800 dark:text-white mb-2 text-center">Supported Crops</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10">Disease detection for Banana and Wheat</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-10 flex items-center gap-8 hover:shadow-2xl hover:border-leaf-200 dark:hover:border-leaf-800 transition-all">
              <div className="w-28 h-28 rounded-3xl bg-leaf-100 dark:bg-leaf-900/50 flex items-center justify-center text-5xl shrink-0">🍌</div>
              <div>
                <h3 className="font-bold text-2xl text-slate-800 dark:text-white">Banana</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Black Sigatoka, Cordana, Pestalotiopsis, Sigatoka, Panama Disease, Bacterial Wilt</p>
                <Link to="/diseases" className="inline-flex items-center gap-1 mt-4 text-leaf-600 dark:text-leaf-400 font-medium hover:underline">
                  View disease library →
                </Link>
              </div>
            </div>
            <div className="card p-10 flex items-center gap-8 hover:shadow-2xl hover:border-earth-200 dark:hover:border-amber-900/50 transition-all">
              <div className="w-28 h-28 rounded-3xl bg-earth-100 dark:bg-amber-900/30 flex items-center justify-center text-5xl shrink-0">🌾</div>
              <div>
                <h3 className="font-bold text-2xl text-slate-800 dark:text-white">Wheat</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Leaf Rust, Stripe Rust, Powdery Mildew, Septoria, Leaf Blight</p>
                <Link to="/diseases" className="inline-flex items-center gap-1 mt-4 text-leaf-600 dark:text-leaf-400 font-medium hover:underline">
                  View disease library →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 rounded-3xl bg-gradient-to-r from-leaf-500 to-emerald-600 text-white shadow-xl">
          <div className="text-left">
            <h3 className="font-display font-bold text-2xl">Ready to protect your crops?</h3>
            <p className="text-white/90 mt-1">Get instant disease detection — free and easy</p>
          </div>
          <Link to="/detection" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-emerald-700 hover:bg-amber-50 shadow-lg transition-all shrink-0">
            <span>Start Detection</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from '../config/api';
import VoiceAssist from '../components/VoiceAssist';

const SUGGESTIONS = [
  'Why are banana leaves turning yellow?',
  'Best fertilizer for wheat?',
  'How to treat fungal infections?',
  'What is Black Sigatoka?',
  'How to prevent wheat rust?',
  'Organic vs chemical fertilizers?',
];

const FEATURE_CARDS = [
  { icon: '🌐', title: '3 Languages', text: 'English, Hindi, Telugu' },
  { icon: '🔊', title: 'Voice Output', text: 'Listen to responses' },
  { icon: '📚', title: 'Expert Knowledge', text: 'Diseases, fertilizers, farming' },
];

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'te', label: 'తెలుగు' },
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm your farming assistant. Ask me about banana or wheat diseases, fertilizers, or general farming practices. I can respond in English, Hindi, or Telugu." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text?.trim() || input.trim();
    if (!msg) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await axios.post(API.chat, { message: msg, sessionId: 'web-session', lang });
      setMessages((prev) => [...prev, { role: 'bot', text: res.data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I could not process your question. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-indigo-700/90 to-purple-700/90" />
        <div className="absolute inset-0 bg-[url('./images/banana-farm-bg.png')] bg-cover bg-center opacity-25" />
        <div className="relative p-8 md:p-10 text-white">
          <h1 className="font-display font-bold text-3xl md:text-4xl">AI Agriculture Chatbot</h1>
          <p className="mt-2 text-white/90 max-w-xl">Ask about diseases, fertilizers, or farming — in English, Hindi, or Telugu</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {FEATURE_CARDS.map((f, i) => (
          <div key={i} className="rounded-2xl p-4 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-leaf-100 dark:bg-leaf-900/50 flex items-center justify-center text-2xl">{f.icon}</div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">{f.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Language & Chat */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Response language:</span>
        {LANG_OPTIONS.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${
              lang === code ? 'bg-leaf-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-leaf-50 dark:hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                  m.role === 'user'
                    ? 'bg-leaf-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                {m.role === 'bot' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-600">
                    <VoiceAssist text={m.text} className="text-sm" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-5 py-3">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 dark:bg-slate-400 animate-bounce" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 dark:bg-slate-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 dark:bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage(s)}
                className="text-sm px-4 py-2 rounded-full bg-leaf-50 dark:bg-leaf-900/30 text-leaf-700 dark:text-leaf-300 hover:bg-leaf-100 dark:hover:bg-leaf-900/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a farming question..."
              className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 focus:border-leaf-500 outline-none"
            />
            <button type="submit" className="btn-primary px-8">Send</button>
          </form>
        </div>
      </div>

      <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-4">
        <Link to="/detection" className="text-leaf-600 dark:text-leaf-400 hover:underline">Upload a leaf image</Link> for instant AI diagnosis
      </p>
    </div>
  );
}

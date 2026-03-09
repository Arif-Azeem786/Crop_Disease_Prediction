import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import API from '../config/api';

const PHOTO_TIPS = [
  'Use natural daylight for best results',
  'Place leaf on plain background',
  'Fill the frame with the leaf',
  'Avoid shadows and blur',
  'Focus on the affected area',
];

export default function Detection() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = (acceptedFiles) => {
    setError('');
    if (acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(API.upload, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/results', { state: { prediction: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-teal-700/90 to-cyan-700/90" />
        <div className="absolute inset-0 bg-[url('./images/wheat-leaf-bg.png')] bg-cover bg-center opacity-35" />
        <div className="relative p-8 md:p-10 text-white">
          <h1 className="font-display font-bold text-3xl md:text-4xl">Detect Leaf Disease</h1>
          <p className="mt-2 text-white/90 max-w-xl">Upload a clear photo of your banana or wheat leaf. AI analysis typically takes under 3 seconds.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 p-6 space-y-6">
            {!preview ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 md:p-16 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-leaf-500 bg-leaf-50 dark:bg-leaf-900/30' : 'border-slate-300 dark:border-slate-600 hover:border-leaf-400 dark:hover:border-leaf-600 hover:bg-leaf-50/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-6xl mb-4">📤</div>
                <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">JPEG, PNG or WebP — max 10MB</p>
              </div>
            ) : (
              <div>
                <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img src={preview} alt="Preview" className="w-full h-auto max-h-80 object-contain mx-auto" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/95 dark:bg-slate-800 hover:bg-white shadow-lg"
                  >
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              {preview && (
                <button type="button" onClick={clearImage} className="btn-secondary flex-1">
                  Change Image
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!file || loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  'Analyze Image'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Feature Cards & Tips */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span>📷</span> Photo Tips
            </h3>
            <ul className="space-y-3">
              {PHOTO_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-leaf-100 dark:bg-leaf-900/50 flex items-center justify-center text-xs text-leaf-600 dark:text-leaf-400 shrink-0 mt-0.5">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-leaf-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 p-6 border border-leaf-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Why use CropGuard?</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Instant</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Results in under 3 seconds</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Accurate</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">85–95% AI accuracy</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🆓</span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Free</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No cost for farmers</p>
                </div>
              </div>
            </div>
            <Link to="/diseases" className="mt-4 inline-block text-leaf-600 dark:text-leaf-400 text-sm font-medium hover:underline">
              Browse Disease Library →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

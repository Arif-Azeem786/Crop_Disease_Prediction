import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const result = await register(name, email, password, phone, location);
      if (result?.success) navigate('/', { replace: true });
      else setError('Registration failed. Try again.');
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (err.response?.status === 404) msg = 'Registration API not found. Restart the backend server.';
        else if (!err.response) msg = 'Cannot connect to server. Is the backend running on port 5000?';
        else msg = 'Registration failed.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero header with quality background */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-emerald-700/90" />
        <div className="absolute inset-0 bg-[url('./images/banana-farm-bg.png')] bg-cover bg-center opacity-45" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-leaf-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="relative p-8 md:p-10 text-white text-center">
          <h1 className="font-display font-bold text-3xl md:text-4xl">Join CropGuard</h1>
          <p className="mt-2 text-white/90">Create your free account to save results and access your profile</p>
        </div>
      </div>

      <div className="relative flex justify-center">
        <div className="absolute inset-0 bg-[url('./images/wheat-leaf-bg.png')] bg-cover bg-center opacity-[0.1] dark:opacity-[0.08] rounded-2xl" />
        <div className="relative w-full max-w-md z-10">
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-2xl border border-slate-100 dark:border-slate-700 backdrop-blur-sm">
          <div className="text-center mb-8">
            <span className="text-4xl">🌱</span>
            <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white mt-2">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join CropGuard to save your results & more</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" placeholder="Min 6 characters" />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone (optional)</label>
              <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location (optional)</label>
              <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" placeholder="Village, State" />
            </div>
            {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</span> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-leaf-600 hover:underline font-medium">Login</Link>
          </p>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-2">
            <Link to="/" className="hover:underline">← Back to Home</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}

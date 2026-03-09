import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin, userLogin } = useAuth();
  const isAdminMode = location.state?.admin === true || location.state?.from?.pathname === '/dashboard';
  const [mode, setMode] = useState(isAdminMode ? 'admin' : 'user');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || (mode === 'admin' ? '/dashboard' : '/');

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await adminLogin(username, password);
      if (result?.success) navigate(from, { replace: true });
      else setError('Invalid username or password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await userLogin(email, password);
      if (result?.success) navigate(from, { replace: true });
      else setError('Invalid email or password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero header with quality background */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-600/90 via-emerald-700/90 to-teal-700/90" />
        <div className="absolute inset-0 bg-[url('./images/hero-wheat-field.png')] bg-cover bg-center opacity-40" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="relative p-8 md:p-10 text-white text-center">
          <h1 className="font-display font-bold text-3xl md:text-4xl">Welcome Back</h1>
          <p className="mt-2 text-white/90">Sign in to your CropGuard account or access admin dashboard</p>
        </div>
      </div>

      <div className="relative flex justify-center">
        <div className="absolute inset-0 bg-[url('./images/farm-landscape-bg.png')] bg-cover bg-center opacity-[0.08] dark:opacity-[0.06] rounded-2xl" />
        <div className="relative w-full max-w-md z-10">
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-2xl border border-slate-100 dark:border-slate-700 backdrop-blur-sm">
          <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-700 mb-8">
            <button
              type="button"
              onClick={() => { setMode('user'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${mode === 'user' ? 'bg-white dark:bg-slate-600 text-leaf-600 shadow' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Farmer Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('admin'); setError(''); }}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${mode === 'admin' ? 'bg-white dark:bg-slate-600 text-leaf-600 shadow' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Admin
            </button>
          </div>
          <div className="text-center mb-6">
            <span className="text-4xl">{mode === 'admin' ? '🔐' : '👨‍🌾'}</span>
            <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white mt-2">
              {mode === 'admin' ? 'Admin Login' : 'Farmer Login'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {mode === 'admin' ? 'Access the analytics dashboard' : 'Sign in to your CropGuard account'}
            </p>
          </div>
          {mode === 'admin' ? (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" placeholder="admin" />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" />
              </div>
              {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 text-sm">{error}</div>}
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</span> : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="user-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input id="user-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" />
              </div>
              {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 text-sm">{error}</div>}
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</span> : 'Sign In'}
              </button>
            </form>
          )}
          {mode === 'user' && (
            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-4">
              Don&apos;t have an account? <Link to="/signup" className="text-leaf-600 hover:underline font-medium">Create Account</Link>
            </p>
          )}
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
            <button type="button" onClick={() => navigate('/')} className="text-leaf-600 hover:underline">← Back to Home</button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}

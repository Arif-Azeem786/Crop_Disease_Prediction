import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { isAdmin, isUser } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/detection', label: 'Detect Disease' },
    { path: '/chatbot', label: 'Chatbot' },
    { path: '/diseases', label: 'Disease Library' },
    { path: '/faq', label: 'FAQ' },
    ...(isAdmin ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <div className={`min-h-screen transition-colors ${dark ? 'dark bg-slate-900' : 'bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/60'}`}>
      <div className="fixed inset-0 -z-10 bg-[url('./images/farm-landscape-bg.png')] bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10" aria-hidden />
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${dark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200/80'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className={`font-display font-bold text-xl ${dark ? 'text-leaf-400' : 'text-leaf-700'}`}>CropGuard</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    location.pathname === path
                      ? dark ? 'bg-leaf-900/50 text-leaf-400' : 'bg-leaf-100 text-leaf-700'
                      : dark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-leaf-50 hover:text-leaf-600'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {isUser && (
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    location.pathname === '/profile' ? (dark ? 'bg-leaf-900/50 text-leaf-400' : 'bg-leaf-100 text-leaf-700') : (dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-leaf-50')
                  }`}
                >
                  Profile
                </Link>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={dark ? 'Light mode' : 'Dark mode'}
                title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? '☀️' : '🌙'}
              </button>
              {!isAdmin && !isUser && (
                <>
                  <Link to="/login" className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">Login</Link>
                  <Link to="/signup" className="px-4 py-2 rounded-lg font-medium btn-primary text-sm">Create Account</Link>
                </>
              )}
            </div>
            <div className="md:hidden flex items-center gap-2">
              <button type="button" onClick={toggleTheme} className="p-2 rounded-lg" aria-label="Toggle theme"> {dark ? '☀️' : '🌙'} </button>
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'} p-4 space-y-2`}>
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-2 rounded-lg ${location.pathname === path ? 'bg-leaf-100 dark:bg-leaf-900/50 text-leaf-700 dark:text-leaf-400' : 'text-slate-600 dark:text-slate-400'}`}>{label}</Link>
            ))}
            {isUser && <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-2 rounded-lg ${location.pathname === '/profile' ? 'bg-leaf-100 dark:bg-leaf-900/50' : ''}`}>Profile</Link>}
            {!isAdmin && !isUser && (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400">Login</Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg btn-primary text-center">Create Account</Link>
              </>
            )}
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className={`mt-auto border-t py-6 ${dark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white/90'} backdrop-blur`}>
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} CropGuard — AI-Powered Plant Disease Detection for Farmers
        </div>
      </footer>
    </div>
  );
}

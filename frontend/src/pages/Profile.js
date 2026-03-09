import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isUser, logout, getToken } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isUser && getToken()) {
      axios.get(API.userProfile, { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((res) => {
          const u = res.data?.user;
          if (u) {
            setProfile(u);
            setName(u.name);
            setPhone(u.phone || '');
            setLocation(u.location || '');
          }
        })
        .catch(() => logout());
    } else if (!isUser) {
      navigate('/login');
    }
  }, [isUser, getToken, logout, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.put(API.userProfile, { name, phone, location }, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.data?.user) {
        setProfile(res.data.user);
        setEditing(false);
        setMessage('Profile updated!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      setMessage('Update failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile && isUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-leaf-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 dark:text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-600/90 to-emerald-700/90" />
        <div className="absolute inset-0 bg-[url('./images/farm-landscape-bg.png')] bg-cover bg-center opacity-25" />
        <div className="relative p-8 text-white">
          <h1 className="font-display font-bold text-3xl md:text-4xl">My Profile</h1>
          <p className="mt-2 text-white/90">Manage your CropGuard account</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-leaf-100 dark:bg-leaf-900/50 flex items-center justify-center text-3xl">
            👨‍🌾
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white">{profile?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{profile?.email}</p>
          </div>
        </div>

        {message && <div className="p-3 rounded-xl bg-leaf-50 dark:bg-leaf-900/30 text-leaf-700 dark:text-leaf-300 text-sm mb-4">{message}</div>}

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-leaf-500 outline-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div><span className="text-slate-500 dark:text-slate-400 text-sm">Phone</span><p className="text-slate-800 dark:text-white font-medium">{profile?.phone || '—'}</p></div>
            <div><span className="text-slate-500 dark:text-slate-400 text-sm">Location</span><p className="text-slate-800 dark:text-white font-medium">{profile?.location || '—'}</p></div>
            <button type="button" onClick={() => setEditing(true)} className="btn-primary">Edit Profile</button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
          <button type="button" onClick={() => { logout(); navigate('/'); }} className="text-red-600 dark:text-red-400 hover:underline text-sm">Logout</button>
        </div>
      </div>
    </div>
  );
}

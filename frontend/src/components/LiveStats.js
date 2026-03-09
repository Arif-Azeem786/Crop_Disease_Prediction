import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../config/api';
import AnimatedCounter from './AnimatedCounter';

export default function LiveStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(API.statsPublic)
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const items = [
    { icon: '📊', label: 'Total Predictions', value: stats.totalPredictions },
    { icon: '📅', label: 'Today', value: stats.todayCount },
    { icon: '👨‍🌾', label: 'Farmers Reached', value: stats.totalUsers },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700">
      <div className="absolute inset-0 bg-[url('./images/hero-wheat-field.png')] bg-cover bg-center opacity-[0.15]" />
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm" />
      <div className="relative grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-600">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-center gap-4 p-6 sm:p-8">
            <div className="w-14 h-14 rounded-2xl bg-leaf-100 dark:bg-leaf-900/50 flex items-center justify-center text-2xl shrink-0">{item.icon}</div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{item.label}</p>
              <p className="font-bold text-2xl md:text-3xl text-slate-800 dark:text-white">
                <AnimatedCounter value={item.value} duration={1200} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

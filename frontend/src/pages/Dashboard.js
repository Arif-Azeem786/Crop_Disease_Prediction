import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import API from '../config/api';
import { useAuth } from '../context/AuthContext';
import AnimatedCounter from '../components/AnimatedCounter';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const chartColors = {
  green: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#dcfce7'],
  amber: ['#fbbf24', '#f59e0b', '#d97706', '#b45309'],
  gradient: 'rgba(34, 197, 94, 0.3)',
};

export default function Dashboard() {
  const { getToken, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    axios.get(API.dashboard, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStats(res.data.stats))
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setStats(null);
        }
      })
      .finally(() => setLoading(false));
  }, [getToken, logout, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-14 h-14 border-4 border-leaf-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-500">Loading analytics...</p>
        <div className="mt-2 flex gap-1">
          <span className="w-2 h-2 rounded-full bg-leaf-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-leaf-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-leaf-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-4xl mb-4">⚠️</div>
        <p className="text-slate-600 font-medium">Could not load dashboard data</p>
        <p className="text-slate-500 text-sm mt-1">Ensure the backend and MongoDB are running</p>
      </div>
    );
  }

  const dailyData = {
    labels: stats.dailyPredictions?.map((d) => d.date) || ['No data'],
    datasets: [
      {
        label: 'Predictions',
        data: stats.dailyPredictions?.map((d) => d.count) || [0],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const diseaseData = {
    labels: stats.diseaseDistribution?.map((d) => d.name) || [],
    datasets: [
      {
        data: stats.diseaseDistribution?.map((d) => d.count) || [],
        backgroundColor: chartColors.green,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const cropData = {
    labels: stats.cropDistribution?.map((c) => c.name) || [],
    datasets: [
      {
        data: stats.cropDistribution?.map((c) => c.count) || [1, 1],
        backgroundColor: ['#22c55e', '#f59e0b'],
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 6,
      },
    ],
  };

  const conf = stats.confidenceStats || {};
  const avgConf = Math.round(conf.avgConfidence || 0);
  const metrics = stats.modelMetrics || {};
  const hasMetrics = metrics.accuracy != null;

  const cards = [
    { label: 'Total Predictions', value: stats.totalPredictions, icon: '📊', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10' },
    { label: 'Farmers Reached', value: stats.totalUsers, icon: '👨‍🌾', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10' },
    { label: 'Healthy Leaves', value: stats.healthyCount, icon: '✅', color: 'from-green-500 to-emerald-600', bg: 'bg-green-500/10' },
    { label: 'Diseases Detected', value: stats.diseasedCount, icon: '🔬', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-500/10' },
    { label: 'Avg Confidence', value: `${avgConf}%`, icon: '🎯', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10' },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/90 to-teal-800/90" />
        <div className="absolute inset-0 bg-[url('./images/hero-wheat-field.png')] bg-cover bg-center opacity-25" />
        <div className="relative p-8 text-white">
          <h1 className="font-display font-bold text-3xl md:text-4xl">Analytics Dashboard</h1>
          <p className="mt-2 text-white/90">Real-time insights from CropGuard</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-4">
        <div />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-leaf-50 text-leaf-700 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-leaf-500 animate-pulse" />
            Live
          </div>
          <button
            type="button"
            onClick={() => { logout(); navigate('/login', { state: { admin: true } }); }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon, color, bg }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-leaf-200 dark:hover:border-leaf-800 transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-gradient-to-br ${color} opacity-10`} />
            <div className={`relative w-12 h-12 rounded-xl ${bg} flex items-center justify-center text-2xl mb-4`}>
              {icon}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
            <p className="font-bold text-3xl text-slate-800 dark:text-white mt-1">
              <AnimatedCounter value={value} duration={1200} />
            </p>
          </div>
        ))}
      </div>

      {/* AI Model Metrics: Accuracy, Precision, F1 */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600" />
          <h2 className="font-semibold text-slate-800 dark:text-white">AI Model Metrics</h2>
        </div>
        {hasMetrics ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl p-4 bg-leaf-50 dark:bg-leaf-900/30 border border-leaf-200 dark:border-leaf-800">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-leaf-700 dark:text-leaf-400">{metrics.accuracy}%</p>
              </div>
              <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Precision</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{metrics.precision}%</p>
              </div>
              <div className="rounded-xl p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Recall</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{metrics.recall}%</p>
              </div>
              <div className="rounded-xl p-4 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">F1 Score</p>
                <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">{metrics.f1_score}%</p>
              </div>
            </div>
            {/* Confusion Matrix Heatmap */}
            {metrics.confusion_matrix?.length > 0 && metrics.classes?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Confusion Matrix Heatmap</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Rows = True label, Columns = Predicted label</p>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr>
                          <th className="p-1.5 border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-left w-24">True \ Pred</th>
                          {metrics.classes.map((c, i) => (
                            <th key={i} className="p-1.5 border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[80px]" title={c}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.confusion_matrix.map((row, i) => (
                          <tr key={i}>
                            <td className="p-1.5 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 font-medium text-slate-700 dark:text-slate-300 truncate max-w-[80px]" title={metrics.classes[i]}>{metrics.classes[i]}</td>
                            {row.map((cell, j) => {
                              const maxVal = Math.max(...metrics.confusion_matrix.flat());
                              const intensity = maxVal > 0 ? Math.min(1, cell / maxVal) : 0;
                              const green = Math.round(34 + (220 - 34) * intensity);
                              const bg = `rgb(34, ${green}, 94)`;
                              const isDiag = i === j;
                              return (
                                <td
                                  key={j}
                                  className="p-1.5 border border-slate-200 dark:border-slate-600 text-center font-medium text-white"
                                  style={{ backgroundColor: isDiag ? 'rgb(22, 163, 74)' : `rgba(34, 197, 94, ${0.3 + 0.7 * intensity})` }}
                                  title={`${metrics.classes[i]} → ${metrics.classes[j]}: ${cell}`}
                                >
                                  {cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl p-6 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-center">
            <p className="text-slate-600 dark:text-slate-400">No model metrics yet. Run <code className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600">python train_model.py</code> in the ai-model folder to generate accuracy, precision, F1, and confusion matrix.</p>
          </div>
        )}
      </div>

      {/* Model Comparison */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600" />
          <h2 className="font-semibold text-slate-800 dark:text-white">Model Comparison — Which Performs Better?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl p-6 bg-gradient-to-br from-leaf-50 to-emerald-50 dark:from-leaf-900/30 dark:to-emerald-900/20 border-2 border-leaf-200 dark:border-leaf-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🤖</span>
              <h3 className="font-bold text-slate-800 dark:text-white">Our CNN Model</h3>
            </div>
            <ul className="text-slate-600 dark:text-slate-300 text-sm space-y-2">
              <li>• 85–95% accuracy</li>
              <li>• Instant results (&lt;3s)</li>
              <li>• Banana + Wheat</li>
              <li>• 7 disease classes</li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-leaf-100 dark:bg-leaf-900/50 text-leaf-700 dark:text-leaf-300 text-sm font-medium">Recommended</div>
          </div>
          <div className="rounded-xl p-6 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔬</span>
              <h3 className="font-bold text-slate-800 dark:text-white">Traditional Lab</h3>
            </div>
            <ul className="text-slate-600 dark:text-slate-300 text-sm space-y-2">
              <li>• High accuracy</li>
              <li>• Days to weeks</li>
              <li>• Costly equipment</li>
              <li>• Expert needed</li>
            </ul>
          </div>
          <div className="rounded-xl p-6 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👁️</span>
              <h3 className="font-bold text-slate-800 dark:text-white">Visual Only</h3>
            </div>
            <ul className="text-slate-600 dark:text-slate-300 text-sm space-y-2">
              <li>• ~60–70% accuracy</li>
              <li>• Inconsistent</li>
              <li>• Experience dependent</li>
              <li>• Often missed early signs</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-leaf-400 to-leaf-600" />
            <h2 className="font-semibold text-slate-800 dark:text-white">Daily Predictions</h2>
          </div>
          <div className="h-72">
            <Line data={dailyData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
            <h2 className="font-semibold text-slate-800 dark:text-white">Crop Usage</h2>
          </div>
          <div className="h-72 flex items-center justify-center">
            <Doughnut
              data={cropData}
              options={{
                ...chartOptions,
                plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } } },
                cutout: '60%',
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />
          <h2 className="font-semibold text-slate-800 dark:text-white">Most Common Diseases</h2>
        </div>
        <div className="h-72">
          <Bar
            data={diseaseData}
            options={{
              ...chartOptions,
              indexAxis: 'y',
              barThickness: 24,
              borderRadius: 8,
            }}
          />
        </div>
      </div>

      {stats.recentPredictions?.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-violet-600" />
            <h2 className="font-semibold text-slate-800 dark:text-white">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-600">
                  <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Disease</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Crop</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Confidence</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700 dark:text-slate-200">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPredictions.map((r, i) => (
                  <tr key={i} className="border-b border-slate-50 dark:border-slate-700 hover:bg-leaf-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-800 dark:text-white">{r.diseaseName}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{r.crop}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-leaf-100 text-leaf-700">
                        {r.confidence}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

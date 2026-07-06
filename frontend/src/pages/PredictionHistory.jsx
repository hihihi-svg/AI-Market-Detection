import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import { getPrediction, getPredictionHistory, getAnalyticsMetrics } from '../services/api';
import { dashboardData } from '../mock/dashboardData';
import {
  TrendingUp, TrendingDown, Sparkles, CheckCircle2, XCircle, Clock, RefreshCw, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine
} from 'recharts';

const confidenceHistory = [
  { date: '30 Jun', confidence: 62, prediction: 'UP',   correct: true  },
  { date: '01 Jul', confidence: 58, prediction: 'DOWN', correct: true  },
  { date: '02 Jul', confidence: 71, prediction: 'UP',   correct: true  },
  { date: '03 Jul', confidence: 49, prediction: 'DOWN', correct: false },
  { date: '04 Jul', confidence: 65, prediction: 'UP',   correct: true  },
  { date: '05 Jul', confidence: 68, prediction: 'DOWN', correct: false },
  { date: '06 Jul', confidence: 55, prediction: 'UP',   correct: null  },
];

function PredictionHistory() {
  const [liveData, setLiveData]     = useState(null);
  const [history, setHistory]       = useState([]);
  const [analytics, setAnalytics]   = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchAll = useCallback(() => {
    Promise.all([getPrediction(), getPredictionHistory(), getAnalyticsMetrics()])
      .then(([pred, hist, anl]) => {
        setLiveData(pred);
        setHistory(hist.length ? hist : dashboardData.history);
        setAnalytics(anl);
        setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsLoading(false);
      })
      .catch(() => {
        setHistory(dashboardData.history);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 5000);
    return () => clearInterval(iv);
  }, [fetchAll]);

  const isUp = liveData?.prediction === 'UP';

  const modelBars = analytics ? [
    { name: 'Gradient Boosting', acc: analytics.gradientBoosting, color: '#22c55e' },
    { name: 'Random Forest',     acc: analytics.randomForest,     color: '#a78bfa' },
    { name: 'Log. Regression',   acc: analytics.logisticRegression, color: '#3b82f6' },
  ] : [
    { name: 'Gradient Boosting', acc: 54.25, color: '#22c55e' },
    { name: 'Random Forest',     acc: 48.45, color: '#a78bfa' },
    { name: 'Log. Regression',   acc: 54.12, color: '#3b82f6' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles size={13} className="animate-pulse" /> AI Intelligence Engine
          </div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">AI Predictions</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Live prediction output from 3 ML models — updated every 5s</p>
        </div>
        <div className="flex items-center gap-2 text-[#64748B] text-[10px] font-semibold">
          <RefreshCw size={11} className="animate-spin" style={{ animationDuration: '3s' }} />
          {lastUpdated ? `Updated ${lastUpdated}` : 'Connecting...'}
        </div>
      </div>

      {/* Hero Prediction Banner */}
      {isLoading ? (
        <div className="h-36 rounded-2xl bg-[#112240]/25 animate-pulse border border-[#112240]" />
      ) : (
        <div className={`relative rounded-2xl p-6 flex items-center justify-between border overflow-hidden ${
          isUp
            ? 'bg-[#00b060]/5 border-[#00b060]/20'
            : 'bg-[#ff3b30]/5 border-[#ff3b30]/20'
        }`}>
          <div className={`absolute inset-0 opacity-5 ${isUp ? 'bg-gradient-to-r from-[#00b060]' : 'bg-gradient-to-r from-[#ff3b30]'}`} />
          <div className="relative flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Tomorrow's NIFTY 50 Prediction</span>
            <div className={`flex items-center gap-3 mt-1 ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
              {isUp ? <TrendingUp size={36} /> : <TrendingDown size={36} />}
              <span className="text-5xl font-black tracking-tight">{liveData?.prediction ?? '—'}</span>
            </div>
            <span className="text-xs text-[#64748B] mt-0.5">For {liveData?.predictionDate || 'Tomorrow'}</span>
          </div>
          <div className="relative flex gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#64748B] font-bold uppercase">Confidence</span>
              <span className={`text-3xl font-black mt-1 ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                {liveData?.confidence ?? '—'}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#64748B] font-bold uppercase">Expected Move</span>
              <span className={`text-3xl font-black mt-1 ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                {liveData?.expectedMove ?? '—'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#64748B] font-bold uppercase">Live Price</span>
              <span className="text-3xl font-black mt-1 text-[#F8FAFC]">
                ₹{liveData?.currentPrice?.toLocaleString('en-IN') ?? '—'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Model Probabilities + Model Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Probability Bars */}
        <Card>
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Live Model Probabilities (UP)</span>
          <div className="mt-4 space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-[#112240] animate-pulse rounded" />
              ))
            ) : [
              { name: 'Gradient Boosting', prob: liveData?.probability?.gradientBoosting ?? 54, color: '#22c55e' },
              { name: 'Random Forest',     prob: liveData?.probability?.randomForest ?? 48,     color: '#a78bfa' },
              { name: 'Logistic Reg.',     prob: liveData?.probability?.logisticRegression ?? 55, color: '#3b82f6' },
            ].map((m, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-[10px] font-semibold text-[#E2E8F0] mb-1">
                  <span>{m.name}</span>
                  <span style={{ color: m.color }}>{m.prob}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#112240]/50 rounded-full overflow-hidden border border-[#112240]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.prob}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[#112240] text-[9px] text-[#64748B]">
            Majority vote decides the final direction. Probabilities fluctuate every 2s.
          </div>
        </Card>

        {/* Model Accuracy BarChart */}
        <Card>
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
            <BarChart2 size={12} className="text-violet-400" /> Model Accuracy (Test Set)
          </span>
          <div className="h-48 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelBars} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#112240" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={8} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={8} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                <ReferenceLine y={50} stroke="#334155" strokeDasharray="3 3" />
                <Tooltip
                  content={({ active, payload }) => active && payload?.length ? (
                    <div className="bg-[#1E293B] border border-[#334155] p-2 rounded text-[10px] text-[#F8FAFC]">
                      <span className="font-bold">{payload[0].payload.name}: </span>
                      <span style={{ color: payload[0].payload.color }}>{payload[0].value?.toFixed(2)}%</span>
                    </div>
                  ) : null}
                />
                <Bar dataKey="acc" radius={[4, 4, 0, 0]}>
                  {modelBars.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Confidence Trend Chart */}
      <Card>
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">7-Day Confidence Trend</span>
        <div className="h-[160px] mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={confidenceHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#112240" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={9} tickLine={false} domain={[40, 80]} ticks={[40, 50, 60, 70, 80]} />
              <ReferenceLine y={50} stroke="#334155" strokeDasharray="4 4" label={{ value: '50%', fill: '#64748B', fontSize: 8 }} />
              <Tooltip
                content={({ active, payload }) => active && payload?.length ? (
                  <div className="bg-[#1E293B] border border-[#334155] p-2.5 rounded-lg text-xs">
                    <p className="font-bold text-[#F8FAFC]">{payload[0].payload.date}</p>
                    <p className="text-violet-400">{payload[0].value}% confidence</p>
                    <p className={payload[0].payload.prediction === 'UP' ? 'text-[#00b060]' : 'text-[#ff3b30]'}>
                      {payload[0].payload.prediction}
                      {payload[0].payload.correct === true && ' ✓'}
                      {payload[0].payload.correct === false && ' ✗'}
                    </p>
                  </div>
                ) : null}
              />
              <Area type="monotone" dataKey="confidence" stroke="#7C3AED" strokeWidth={2} fill="url(#confGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Prediction History Table */}
      <Card>
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-4 block">Recent Prediction Log</span>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-[#112240] animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#112240]">
                  {['Date', 'Prediction', 'Confidence', 'Actual', 'Result'].map(h => (
                    <th key={h} className="text-left pb-2.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#112240]/40">
                {history.map((row, i) => {
                  const rowUp = row.prediction === 'UP';
                  const correct = (rowUp && row.actual === '▲') || (!rowUp && row.actual === '▼');
                  const isPending = row.actual === '—';
                  return (
                    <tr key={i} className="hover:bg-[#112240]/20 transition-colors">
                      <td className="py-3 pr-4 text-[#94A3B8] font-semibold">{row.date}</td>
                      <td className="py-3 pr-4">
                        <span className={`flex items-center gap-1 font-bold ${rowUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                          {rowUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {row.prediction}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[#F8FAFC] font-semibold">{row.confidence}</td>
                      <td className={`py-3 pr-4 font-bold text-lg ${
                        row.actual === '▲' ? 'text-[#00b060]' :
                        row.actual === '▼' ? 'text-[#ff3b30]' : 'text-[#64748B]'
                      }`}>{row.actual}</td>
                      <td className="py-3">
                        {isPending ? (
                          <span className="flex items-center gap-1 text-[#64748B] font-semibold">
                            <Clock size={11} /> Pending
                          </span>
                        ) : correct ? (
                          <span className="flex items-center gap-1 text-[#00b060] font-bold">
                            <CheckCircle2 size={12} /> Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#ff3b30] font-bold">
                            <XCircle size={12} /> Incorrect
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default PredictionHistory;

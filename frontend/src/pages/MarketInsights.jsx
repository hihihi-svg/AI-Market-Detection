import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import { getMarketSnapshot, getExplanation } from '../services/api';
import { dashboardData } from '../mock/dashboardData';
import {
  TrendingUp, TrendingDown, RefreshCw, Activity, Zap, Globe, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const STATUS_COLOR = {
  Rising:   { text: 'text-[#00b060]', bg: 'bg-[#00b060]/10 border-[#00b060]/20', dot: 'bg-[#00b060]' },
  Stable:   { text: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/10 border-[#3b82f6]/20', dot: 'bg-[#3b82f6]' },
  Neutral:  { text: 'text-[#94A3B8]', bg: 'bg-[#94A3B8]/10 border-[#94A3B8]/20', dot: 'bg-[#94A3B8]' },
  Falling:  { text: 'text-[#ff3b30]', bg: 'bg-[#ff3b30]/10 border-[#ff3b30]/20', dot: 'bg-[#ff3b30]' },
  Volatile: { text: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10 border-[#f59e0b]/20', dot: 'bg-[#f59e0b]' },
};

const MACRO_META = [
  { key: 'gold',  label: 'Gold (MCX)',      icon: '🥇', value: '₹72,385', change: '+0.28%', isUp: true,  prices: [71900, 72050, 72150, 72250, 72385] },
  { key: 'oil',   label: 'Crude Oil (WTI)', icon: '🛢️', value: '$82.10',  change: '-0.35%', isUp: false, prices: [83.4, 83.1, 82.9, 82.7, 82.1] },
  { key: 'usd',   label: 'USD / INR',       icon: '💵', value: '₹83.32',  change: '+0.12%', isUp: true,  prices: [83.22, 83.25, 83.30, 83.31, 83.32] },
  { key: 'vix',   label: 'India VIX',       icon: '📊', value: '14.23',   change: '-2.15%', isUp: false, prices: [14.8, 14.7, 14.5, 14.3, 14.23] },
];

const niftyIntraday = [
  { t: '09:15', close: 24310 }, { t: '09:30', close: 24348 }, { t: '09:45', close: 24320 },
  { t: '10:00', close: 24395 }, { t: '10:15', close: 24402 }, { t: '10:30', close: 24388 },
  { t: '10:45', close: 24422 }, { t: '11:00', close: 24450 }, { t: '11:15', close: 24436 },
  { t: '11:30', close: 24468 }, { t: '12:00', close: 24491 }, { t: '12:30', close: 24502 },
];

const sectorData = [
  { name: 'IT',        change: 1.24,  color: '#22c55e' },
  { name: 'Banking',   change: 0.87,  color: '#22c55e' },
  { name: 'Auto',      change: 0.62,  color: '#22c55e' },
  { name: 'Pharma',    change: -0.35, color: '#ff3b30' },
  { name: 'Energy',    change: -0.58, color: '#ff3b30' },
  { name: 'FMCG',      change: 0.19,  color: '#22c55e' },
  { name: 'Realty',    change: 1.72,  color: '#22c55e' },
  { name: 'Metal',     change: -0.91, color: '#ff3b30' },
];

function MiniSparkline({ data, isUp }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 56, h = 18;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={isUp ? '#00b060' : '#ff3b30'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MarketInsights() {
  const [market, setMarket] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(() => {
    Promise.all([getMarketSnapshot(), getExplanation()])
      .then(([mkt, exp]) => {
        setMarket(mkt);
        setExplanation(exp.explanation || '');
        setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsLoading(false);
      })
      .catch(() => {
        setMarket({ gold: 'Stable', oil: 'Neutral', usd: 'Rising', vix: 'Falling' });
        setExplanation('Market data currently unavailable. Showing cached indicators.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Globe size={13} className="animate-pulse" /> Live Market Overview
          </div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Market Overview</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Macroeconomic indicators: Gold, Crude Oil, USD/INR and India VIX — refreshed every 5s</p>
        </div>
        <div className="flex items-center gap-2 text-[#64748B] text-[10px] font-semibold">
          <RefreshCw size={11} className="animate-spin" style={{ animationDuration: '3s' }} />
          {lastUpdated ? `Updated ${lastUpdated}` : 'Loading...'}
        </div>
      </div>

      {/* 4 Macro Indicator Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MACRO_META.map((m) => {
          const status = market ? market[m.key] : '...';
          const sc = STATUS_COLOR[status] || STATUS_COLOR['Neutral'];
          return (
            <Card key={m.key} className="flex flex-col justify-between h-[130px] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{m.label}</span>
                </div>
                {isLoading ? (
                  <div className="h-4 w-14 bg-[#112240] animate-pulse rounded" />
                ) : (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${sc.dot}`} />
                    {status}
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between mt-2">
                <div>
                  <div className="text-lg font-extrabold text-[#F8FAFC]">{m.value}</div>
                  <div className={`text-[10px] font-bold mt-0.5 ${m.isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>{m.change}</div>
                </div>
                <MiniSparkline data={m.prices} isUp={m.isUp} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Intraday NIFTY Chart + AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
              <Activity size={14} className="text-violet-400" /> NIFTY 50 — Intraday Price
            </span>
            <span className="text-[9px] text-[#64748B] font-semibold">06 Jul 2026</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={niftyIntraday} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="niftyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#112240" vertical={false} />
                <XAxis dataKey="t" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={9} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  content={({ active, payload }) => active && payload?.length ? (
                    <div className="bg-[#1E293B] border border-[#334155] p-2.5 rounded-lg text-xs shadow-xl">
                      <p className="font-bold text-[#F8FAFC]">{payload[0].payload.t}</p>
                      <p className="text-violet-400 font-semibold mt-0.5">₹{payload[0].value?.toLocaleString('en-IN')}</p>
                    </div>
                  ) : null}
                />
                <Area type="monotone" dataKey="close" stroke="#7C3AED" strokeWidth={2} fill="url(#niftyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-[300px]">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs font-bold text-[#F8FAFC]">AI Explanation</span>
          </div>
          <div className="flex-1 flex items-center">
            {isLoading ? (
              <div className="space-y-2 w-full">
                {[1,2,3].map(i => <div key={i} className="h-3 bg-[#112240] animate-pulse rounded w-full" />)}
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8] leading-relaxed">{explanation}</p>
            )}
          </div>
          <div className="pt-3 border-t border-[#112240]">
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {dashboardData.macroCards.map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[#64748B]">{c.name.split(' ')[0]}</span>
                  <span className={c.isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}>{c.change}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Sector Performance */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={14} className="text-violet-400" />
          <span className="text-xs font-bold text-[#F8FAFC]">Sector Performance Today</span>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#112240" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={9} tickLine={false} tickFormatter={v => `${v > 0 ? '+' : ''}${v}%`} />
              <Tooltip
                content={({ active, payload }) => active && payload?.length ? (
                  <div className="bg-[#1E293B] border border-[#334155] p-2 rounded text-[10px] text-[#F8FAFC]">
                    <span className="font-bold">{payload[0].payload.name}:</span>{' '}
                    <span className={payload[0].value >= 0 ? 'text-[#00b060]' : 'text-[#ff3b30]'}>
                      {payload[0].value > 0 ? '+' : ''}{payload[0].value}%
                    </span>
                  </div>
                ) : null}
              />
              <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                {sectorData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Live Market Indicators Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dashboardData.tickers.slice(0, 4).map((tick, idx) => (
          <Card key={idx} className="flex flex-col gap-1 p-4 h-[80px]">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{tick.name}</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#F8FAFC]">{tick.value}</span>
              <span className={`text-[10px] font-bold ${tick.isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>{tick.change}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MarketInsights;

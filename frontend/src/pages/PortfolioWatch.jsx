import React, { useState } from 'react';
import Card from '../components/common/Card';
import { Eye, TrendingUp, TrendingDown, Plus, Trash2, Star, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const DEFAULT_WATCHLIST = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2845.30, change: 1.24, mktCap: '19.3T', sector: 'Energy', starred: true,
    prices: [2800, 2818, 2830, 2822, 2840, 2845] },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3920.65, change: 0.87, mktCap: '14.2T', sector: 'IT', starred: true,
    prices: [3880, 3895, 3910, 3900, 3915, 3920] },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1652.10, change: -0.35, mktCap: '12.5T', sector: 'Banking', starred: false,
    prices: [1665, 1660, 1658, 1655, 1653, 1652] },
  { symbol: 'INFY', name: 'Infosys', price: 1542.80, change: 1.72, mktCap: '6.4T', sector: 'IT', starred: false,
    prices: [1515, 1520, 1528, 1533, 1540, 1542] },
  { symbol: 'WIPRO', name: 'Wipro', price: 468.90, change: -0.58, mktCap: '2.4T', sector: 'IT', starred: false,
    prices: [472, 471, 470, 469.5, 469, 468.9] },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1389.45, change: 0.62, mktCap: '8.2T', sector: 'Telecom', starred: false,
    prices: [1380, 1383, 1385, 1386, 1388, 1389] },
];

const AI_SIGNAL = {
  RELIANCE: { signal: 'BUY',  confidence: 72, reason: 'Strong momentum + VIX declining' },
  TCS:      { signal: 'HOLD', confidence: 58, reason: 'Mixed signals — wait for clarity' },
  HDFCBANK: { signal: 'SELL', confidence: 64, reason: 'Bearish crossover detected in MA' },
  INFY:     { signal: 'BUY',  confidence: 69, reason: 'Breakout above 50DMA confirmed' },
  WIPRO:    { signal: 'HOLD', confidence: 51, reason: 'Low volatility — range-bound' },
  BHARTIARTL: { signal: 'BUY', confidence: 66, reason: 'Sector tailwind + RSI healthy' },
};

const SIGNAL_STYLE = {
  BUY:  { text: 'text-[#00b060]', bg: 'bg-[#00b060]/10 border-[#00b060]/20' },
  SELL: { text: 'text-[#ff3b30]', bg: 'bg-[#ff3b30]/10 border-[#ff3b30]/20' },
  HOLD: { text: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10 border-[#f59e0b]/20' },
};

function MiniSpark({ data, isUp }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const w = 64, h = 24;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={isUp ? '#00b060' : '#ff3b30'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PortfolioWatch() {
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [search, setSearch] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [sortBy, setSortBy] = useState('starred');

  const totalValue = watchlist.reduce((s, w) => s + w.price, 0);
  const gainers = watchlist.filter(w => w.change > 0).length;
  const losers  = watchlist.filter(w => w.change < 0).length;

  const remove = (symbol) => setWatchlist(prev => prev.filter(w => w.symbol !== symbol));
  const toggleStar = (symbol) => setWatchlist(prev => prev.map(w => w.symbol === symbol ? { ...w, starred: !w.starred } : w));

  const filtered = watchlist
    .filter(w => w.symbol.toLowerCase().includes(search.toLowerCase()) || w.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'starred' ? (b.starred - a.starred) : sortBy === 'change' ? b.change - a.change : a.symbol.localeCompare(b.symbol));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Eye size={13} className="animate-pulse" /> Personal Watchlist
        </div>
        <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Portfolio Watch</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Track your favourite stocks with live AI signals and price changes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tracked Stocks',  value: watchlist.length,   color: 'text-violet-400', icon: <Eye size={16} /> },
          { label: 'Gainers Today',   value: gainers,            color: 'text-[#00b060]',  icon: <TrendingUp size={16} /> },
          { label: 'Losers Today',    value: losers,             color: 'text-[#ff3b30]',  icon: <TrendingDown size={16} /> },
          { label: 'Starred Stocks',  value: watchlist.filter(w => w.starred).length, color: 'text-[#f59e0b]', icon: <Star size={16} /> },
        ].map((s, i) => (
          <Card key={i} className="flex items-center gap-3 h-[72px] p-4">
            <div className={`${s.color} opacity-70`}>{s.icon}</div>
            <div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search + Sort + Add */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search symbol or name..."
          className="flex-1 min-w-[200px] bg-[#060D19] border border-[#112240] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] outline-none focus:border-violet-500/50 transition-colors"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-[#060D19] border border-[#112240] rounded-lg px-3 py-2 text-xs text-[#94A3B8] outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
        >
          <option value="starred">Sort: Starred First</option>
          <option value="change">Sort: By Change%</option>
          <option value="alpha">Sort: Alphabetical</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            value={newSymbol}
            onChange={e => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="Add symbol..."
            className="w-32 bg-[#060D19] border border-[#112240] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] outline-none focus:border-violet-500/50 transition-colors"
          />
          <button
            onClick={() => {
              if (newSymbol.trim() && !watchlist.find(w => w.symbol === newSymbol)) {
                setWatchlist(prev => [...prev, {
                  symbol: newSymbol, name: newSymbol + ' Ltd.', price: Math.round(1000 + Math.random() * 3000),
                  change: parseFloat((Math.random() * 4 - 2).toFixed(2)), mktCap: '—', sector: 'Unknown', starred: false,
                  prices: Array.from({ length: 6 }, () => 1000 + Math.random() * 2000)
                }]);
                setNewSymbol('');
              }
            }}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      {/* Watchlist Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#112240] bg-[#060D19]/80">
                {['', 'Symbol', 'Price', 'Change', 'Trend', 'AI Signal', 'Confidence', 'Sector', ''].map((h, i) => (
                  <th key={i} className="text-left px-5 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#112240]/30">
              {filtered.map((stock, i) => {
                const isUp = stock.change >= 0;
                const ai = AI_SIGNAL[stock.symbol];
                const ss = ai ? SIGNAL_STYLE[ai.signal] : SIGNAL_STYLE['HOLD'];
                return (
                  <tr key={i} className="hover:bg-[#112240]/15 transition-colors group">
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleStar(stock.symbol)}>
                        <Star size={13} fill={stock.starred ? '#f59e0b' : 'none'} className={stock.starred ? 'text-[#f59e0b]' : 'text-[#334155] hover:text-[#64748B]'} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-[#F8FAFC]">{stock.symbol}</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5 whitespace-nowrap">{stock.name}</div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#F8FAFC] whitespace-nowrap">
                      ₹{stock.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-0.5 font-bold ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                        {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {isUp ? '+' : ''}{stock.change}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <MiniSpark data={stock.prices} isUp={isUp} />
                    </td>
                    <td className="px-5 py-3.5">
                      {ai ? (
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${ss.bg} ${ss.text}`}>
                          {ai.signal}
                        </span>
                      ) : <span className="text-[#64748B]">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {ai ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#112240] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${ai.confidence}%`, backgroundColor: ss.text.replace('text-[', '').replace(']', '') === '#00b060' ? '#00b060' : ss.text.includes('ff3b30') ? '#ff3b30' : '#f59e0b' }} />
                          </div>
                          <span className="text-[10px] text-[#94A3B8] font-semibold">{ai.confidence}%</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] text-[#64748B] font-semibold bg-[#112240]/40 px-2 py-0.5 rounded">{stock.sector}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => remove(stock.symbol)}
                        className="opacity-0 group-hover:opacity-100 text-[#64748B] hover:text-[#ff3b30] transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#64748B] text-sm">
              No stocks match your search.
            </div>
          )}
        </div>
      </Card>

      {/* AI Reasoning Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(AI_SIGNAL).slice(0, 3).map(([sym, info], i) => {
          const ss = SIGNAL_STYLE[info.signal];
          return (
            <Card key={i} className={`border-l-2 ${info.signal === 'BUY' ? 'border-l-[#00b060]' : info.signal === 'SELL' ? 'border-l-[#ff3b30]' : 'border-l-[#f59e0b]'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-extrabold text-[#F8FAFC] text-sm">{sym}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${ss.bg} ${ss.text}`}>{info.signal}</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">{info.reason}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-[#112240] rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${info.confidence}%` }} />
                </div>
                <span className="text-[10px] text-[#64748B] font-semibold">{info.confidence}%</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default PortfolioWatch;

import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { getMarketHistory, getMarketCorrelations } from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Info,
  DollarSign,
  Droplet,
  Shield,
  BarChart2,
  Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INDICATORS = {
  NIFTY_Close: {
    name: 'NIFTY 50',
    key: 'NIFTY_Close',
    symbol: '^NSEI',
    unit: '',
    prefix: '',
    color: '#00b060',
    gradient: ['#00b060', 'rgba(0, 176, 96, 0.0)'],
    icon: <BarChart2 size={18} className="text-[#00b060]" />,
    description: 'Benchmark index of the National Stock Exchange of India, representing the weighted average of 50 of the largest Indian companies.'
  },
  Gold: {
    name: 'Gold (Futures)',
    key: 'Gold',
    symbol: 'GC=F',
    unit: ' / oz',
    prefix: '$',
    color: '#eab308',
    gradient: ['#eab308', 'rgba(234, 179, 8, 0.0)'],
    icon: <Shield size={18} className="text-[#eab308]" />,
    description: 'Safe-haven asset class. Typically shares an inverse relationship with equities during acute crises, but shows positive correlation during periods of high structural inflation.'
  },
  Oil: {
    name: 'Crude Oil (WTI)',
    key: 'Oil',
    symbol: 'CL=F',
    unit: ' / bbl',
    prefix: '$',
    color: '#3b82f6',
    gradient: ['#3b82f6', 'rgba(59, 130, 246, 0.0)'],
    icon: <Droplet size={18} className="text-[#3b82f6]" />,
    description: 'Crude oil is a major import expense for India. Rising prices squeeze margins, fuel domestic inflation, and negatively impact index valuations.'
  },
  USD_INR: {
    name: 'USD / INR',
    key: 'USD_INR',
    symbol: 'INR=X',
    unit: '',
    prefix: '₹',
    color: '#10b981',
    gradient: ['#10b981', 'rgba(16, 185, 129, 0.0)'],
    icon: <DollarSign size={18} className="text-[#10b981]" />,
    description: 'Currency exchange rate. A weakening rupee (rising USD/INR) increases input import costs but benefits export-heavy sectors like IT and Pharmaceuticals.'
  },
  India_VIX: {
    name: 'India VIX',
    key: 'India_VIX',
    symbol: 'INDIAVIX',
    unit: '%',
    prefix: '',
    color: '#ec4899',
    gradient: ['#ec4899', 'rgba(236, 72, 153, 0.0)'],
    icon: <Activity size={18} className="text-[#ec4899]" />,
    description: 'Volatility Index indicating the market\'s expectation of near-term volatility. Highly negatively correlated with short-term equity price trends.'
  }
};

function MarketInsights() {
  const [historyData, setHistoryData] = useState([]);
  const [correlations, setCorrelations] = useState({});
  const [selectedInd, setSelectedInd] = useState('NIFTY_Close');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [hist, corr] = await Promise.all([
          getMarketHistory(),
          getMarketCorrelations()
        ]);
        setHistoryData(hist);
        setCorrelations(corr);
        setError(null);
      } catch (err) {
        console.error("Error loading insights page data:", err);
        setError("Unable to load live macroeconomic data from Flask backend.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeInd = INDICATORS[selectedInd];

  // Helper to extract latest value and daily delta
  const getLatestMetrics = (key) => {
    if (!historyData || historyData.length < 2) return { value: '—', change: '0.00%', isUp: true };
    const latestRow = historyData[historyData.length - 1];
    const prevRow = historyData[historyData.length - 2];
    const latestVal = latestRow[key];
    const prevVal = prevRow[key];
    
    if (latestVal === undefined || prevVal === undefined) return { value: '—', change: '0.00%', isUp: true };

    const rawChange = latestVal - prevVal;
    const pctChange = ((rawChange) / prevVal) * 100;
    
    const formattedVal = latestVal.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
    const formattedPct = pctChange.toFixed(2) + '%';
    
    return {
      value: formattedVal,
      change: (rawChange >= 0 ? '+' : '') + formattedPct,
      isUp: rawChange >= 0
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-[#112240]/40 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#112240]/25 rounded-xl h-[92px] border border-[#112240]"></div>
          ))}
        </div>
        <div className="h-[360px] bg-[#112240]/25 rounded-xl border border-[#112240]"></div>
      </div>
    );
  }

  // Calculate dynamic domain limits for chart Y-axis mapping to make fluctuations look elegant
  const chartValues = historyData.map(d => d[activeInd.key]).filter(v => v !== undefined && v !== null);
  const minVal = chartValues.length > 0 ? Math.min(...chartValues) : 0;
  const maxVal = chartValues.length > 0 ? Math.max(...chartValues) : 100;
  const padding = (maxVal - minVal) * 0.05 || 1;
  const yDomain = [Math.max(0, minVal - padding), maxVal + padding];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">Market Insights</h1>
        <p className="mt-1.5 text-sm text-[#94A3B8] font-medium leading-relaxed">
          Monitor primary macroeconomic drivers, safe-haven flows, and exchange volatility influencing the Indian stock market (NIFTY 50).
        </p>
      </div>

      {error && (
        <div className="bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-xl p-3 text-xs text-[#ff3b30] font-semibold">
          {error}
        </div>
      )}

      {/* 1. Primary Macro Indicator Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.values(INDICATORS).map((ind) => {
          const metrics = getLatestMetrics(ind.key);
          const isSelected = selectedInd === ind.key;
          
          return (
            <div 
              key={ind.key}
              onClick={() => setSelectedInd(ind.key)}
              className={`cursor-pointer transition-all duration-300 rounded-xl p-4 border flex flex-col justify-between h-[104px] hover:-translate-y-0.5 ${
                isSelected 
                  ? 'bg-[#112240]/30 border-violet-500/50 shadow-md shadow-violet-500/5' 
                  : 'bg-[#0C1524] border-[#112240] hover:border-[#1E293B]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{ind.name}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-[#112240]/40 border border-[#112240]`}>
                  {ind.icon}
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-lg font-black text-[#F8FAFC] tracking-tight">
                  {ind.prefix}{metrics.value}{ind.unit}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-extrabold flex items-center gap-0.5 ${
                    metrics.isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'
                  }`}>
                    {metrics.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {metrics.change}
                  </span>
                  <span className="text-[8px] text-[#64748B] font-semibold">24h Change</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Interactive Main Visualization Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between h-[380px]">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: activeInd.color }}></div>
              <span className="text-xs font-bold text-[#F8FAFC]">{activeInd.name} Historical Trend</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#112240]/30 border border-[#112240] rounded-lg p-0.5">
              {['30D', '90D', '150D'].map((timeframe) => (
                <button 
                  key={timeframe} 
                  className={`px-2.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                    timeframe === '150D' 
                      ? 'bg-[#7C3AED]/20 text-[#a78bfa] border border-[#7C3AED]/30' 
                      : 'text-[#64748B] hover:text-[#94A3B8]'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad_${activeInd.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeInd.color} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={activeInd.color} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#112240/30" horizontal={true} vertical={false} />
                <XAxis 
                  dataKey="Date" 
                  stroke="#64748B" 
                  fontSize={9} 
                  tickLine={false} 
                  tickFormatter={formatDate}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={9} 
                  tickLine={false} 
                  domain={yDomain}
                  tickFormatter={(val) => val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-[#1E293B] border border-[#334155] p-3 rounded-lg text-xs shadow-xl space-y-1">
                        <p className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#94A3B8]" />
                          {formatDate(dataPoint.Date)}
                        </p>
                        <p className="font-bold mt-1.5" style={{ color: activeInd.color }}>
                          {activeInd.name}: {activeInd.prefix}{dataPoint[activeInd.key]?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}{activeInd.unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Area 
                  type="monotone" 
                  dataKey={activeInd.key} 
                  stroke={activeInd.color} 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill={`url(#grad_${activeInd.key})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dynamic Correlation analysis info box */}
        <Card className="p-5 flex flex-col justify-between h-[380px]">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Indicator Specification</span>
            <h3 className="text-lg font-extrabold text-[#F8FAFC] tracking-tight">{activeInd.name}</h3>
            <span className="text-[10px] text-[#7C3AED] font-bold mt-0.5 tracking-widest">{activeInd.symbol}</span>
            <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed font-medium">
              {activeInd.description}
            </p>
          </div>

          <div className="border-t border-[#112240] pt-4 mt-4">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-3">
              Pearson Correlation (vs NIFTY 50)
            </span>
            {activeInd.key === 'NIFTY_Close' ? (
              <div className="bg-[#112240]/25 border border-[#112240] rounded-xl p-4 text-center">
                <span className="text-3xl font-black text-[#00b060]">1.00</span>
                <span className="text-[10px] text-[#94A3B8] font-bold block mt-1.5">Perfect positive self-correlation.</span>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#112240]/20 border border-[#112240] rounded-xl p-4">
                <div className="flex flex-col">
                  <span className={`text-3xl font-black ${
                    correlations[activeInd.key] >= 0.4 ? 'text-[#00b060]' : correlations[activeInd.key] <= -0.2 ? 'text-[#ff3b30]' : 'text-slate-400'
                  }`}>
                    {correlations[activeInd.key] !== undefined ? (correlations[activeInd.key] >= 0 ? '+' : '') + correlations[activeInd.key] : '0.00'}
                  </span>
                  <span className="text-[8px] text-[#64748B] font-extrabold uppercase mt-1">Pearson Coefficient</span>
                </div>
                <div className="flex flex-col max-w-[130px] text-right">
                  <span className="text-[10px] text-[#F8FAFC] font-extrabold">
                    {correlations[activeInd.key] >= 0.5 
                      ? 'Strong Positive' 
                      : correlations[activeInd.key] >= 0.1 
                      ? 'Mild Positive'
                      : correlations[activeInd.key] <= -0.3
                      ? 'Inverse Relation'
                      : 'Low Correlation'}
                  </span>
                  <span className="text-[9px] text-[#94A3B8] mt-1 leading-snug">
                    {correlations[activeInd.key] >= 0.5 
                      ? 'Movements generally align in direction.' 
                      : correlations[activeInd.key] <= -0.3 
                      ? 'Moves opposite to NIFTY directions.'
                      : 'Relatively decoupled price action.'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 3. Detailed Macroeconomic Correlation Insights Dashboard */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
          <Info size={16} className="text-[#64748B]" /> Macroeconomic Drivers & Inter-dependencies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Object.values(INDICATORS).filter(ind => ind.key !== 'NIFTY_Close').map((ind) => {
            const corr = correlations[ind.key] || 0;
            return (
              <Card key={ind.key} className="p-4 flex flex-col justify-between h-[168px]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#F8FAFC]">{ind.name}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    corr >= 0.4 ? 'bg-[#00b060]/10 text-[#00b060]' : corr <= -0.2 ? 'bg-[#ff3b30]/10 text-[#ff3b30]' : 'bg-[#64748B]/10 text-[#94A3B8]'
                  }`}>
                    {corr >= 0 ? '+' : ''}{corr} Corr
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8] font-medium leading-relaxed mt-2.5 flex-1">
                  {ind.key === 'Gold' && 'Usually serves as an inflation hedge. The strong positive long-term correlation is driven by structural asset growth and currency devaluation.'}
                  {ind.key === 'Oil' && 'Higher crude pricing strains India\'s trade deficit and escalates logistics/production costs, reducing net corporate margins.'}
                  {ind.key === 'USD_INR' && 'Long-term dollar strength mirrors the domestic inflation differential. Over 15 years, both USD/INR and NIFTY expanded in tandem.'}
                  {ind.key === 'India_VIX' && 'Known as the stock market\'s fear gauge. Spikes intensely during corrections and major market panic, showing negative correlation.'}
                </p>
                <div className="flex items-center gap-1.5 border-t border-[#112240] pt-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ind.color }}></div>
                  <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider">{ind.symbol}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. Tabular Historical Snapshot */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-[#F8FAFC]">Historical Macro Database (Latest 15 Records)</span>
          <span className="text-[9px] text-[#64748B] font-bold uppercase">Showing processed clean dataset</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#94A3B8] border-collapse">
            <thead>
              <tr className="border-b border-[#112240] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">NIFTY 50</th>
                <th className="py-2.5">Gold</th>
                <th className="py-2.5">Crude Oil</th>
                <th className="py-2.5">USD / INR</th>
                <th className="py-2.5">India VIX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#112240]/40">
              {[...historyData].reverse().slice(0, 15).map((row, idx) => (
                <tr key={idx} className="hover:bg-[#112240]/10 transition-colors">
                  <td className="py-2 font-semibold text-[#F8FAFC]">{formatDate(row.Date)}</td>
                  <td className="py-2 text-[#00b060] font-bold">{row.NIFTY_Close?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-[#eab308] font-bold">${row.Gold?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-[#3b82f6] font-bold">${row.Oil?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-[#10b981] font-bold">₹{row.USD_INR?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="py-2 text-[#ec4899] font-bold">{row.India_VIX?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default MarketInsights;

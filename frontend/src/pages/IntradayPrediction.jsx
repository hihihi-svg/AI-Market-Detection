import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import { getIntraday } from '../services/api';
import {
  TrendingUp, TrendingDown, Clock, RefreshCw, Activity, Zap,
  ChevronUp, ChevronDown, Minus
} from 'lucide-react';
import {
  ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';

const STATUS_RING = {
  past:    'border-[#334155] bg-[#060D19]/40 opacity-70',
  current: 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10 scale-[1.02]',
  future:  'border-[#112240]/60 bg-[#060D19]/60',
};

const DIR_ICON = {
  UP:   (size = 14) => <ChevronUp size={size} className="text-[#00b060]" />,
  DOWN: (size = 14) => <ChevronDown size={size} className="text-[#ff3b30]" />,
};

function IntradayPrediction() {
  const [data, setData]           = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState('');
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchData = useCallback(() => {
    getIntraday()
      .then(d => {
        setData(d);
        setLastFetch(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsLoading(false);
        // auto-select current slot
        const cur = d.slots?.find(s => s.status === 'current') || d.slots?.find(s => s.status === 'future');
        if (cur) setSelectedSlot(cur);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 10000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const isUp = data?.dayDirection === 'UP';

  // Chart data
  const chartData = data?.slots?.map(s => ({
    slot: s.slot,
    price: s.predictedPrice,
    confidence: s.confidence,
    direction: s.direction,
    status: s.status,
  })) || [];

  const displaySlot = hoveredSlot || selectedSlot;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Activity size={13} className="animate-pulse" /> Intraday Intelligence
          </div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Full-Day Prediction
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            NIFTY 50 slot-by-slot predictions from 09:15 to 15:30 — powered by 3 ML models · refreshed every 10s
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#64748B] font-semibold flex items-center gap-1.5">
            <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '4s' }} />
            Updated {lastFetch || '...'}
          </span>
          <button
            onClick={fetchData}
            className="text-xs font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg hover:bg-violet-500/20 transition-all"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Day Summary Banner */}
      {isLoading ? (
        <div className="h-28 rounded-2xl bg-[#112240]/20 animate-pulse border border-[#112240]" />
      ) : (
        <div className={`relative rounded-2xl p-5 border overflow-hidden flex flex-wrap gap-6 items-center ${
          isUp ? 'border-[#00b060]/20 bg-[#00b060]/5' : 'border-[#ff3b30]/20 bg-[#ff3b30]/5'
        }`}>
          <div className={`absolute inset-0 opacity-[0.03] ${isUp ? 'bg-gradient-to-r from-[#00b060]' : 'bg-gradient-to-r from-[#ff3b30]'}`} />

          {/* Day direction */}
          <div className="relative flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Day Outlook</span>
            <div className={`flex items-center gap-2 mt-1 ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
              {isUp ? <TrendingUp size={30} /> : <TrendingDown size={30} />}
              <span className="text-4xl font-black">{data?.dayDirection}</span>
            </div>
            <span className="text-[10px] text-[#64748B]">{data?.date}</span>
          </div>

          <div className="relative h-12 w-px bg-[#112240]" />

          {/* Stats row */}
          {[
            { label: 'Avg Confidence',   value: `${data?.avgConfidence}%`,  color: 'text-[#F8FAFC]' },
            { label: 'Bullish Slots',    value: data?.upSlots,             color: 'text-[#00b060]' },
            { label: 'Bearish Slots',    value: data?.downSlots,           color: 'text-[#ff3b30]' },
            { label: 'Predicted Open',   value: `₹${data?.openPrice?.toLocaleString('en-IN')}`, color: 'text-[#F8FAFC]' },
            { label: 'Predicted Close',  value: `₹${data?.closePrice?.toLocaleString('en-IN')}`, color: isUp ? 'text-[#00b060]' : 'text-[#ff3b30]' },
            { label: 'Day Range',        value: `₹${data?.dayRangeLow?.toLocaleString('en-IN')} – ₹${data?.dayRangeHigh?.toLocaleString('en-IN')}`, color: 'text-[#94A3B8]' },
          ].map((s, i) => (
            <div key={i} className="relative flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{s.label}</span>
              <span className={`text-lg font-extrabold ${s.color}`}>{s.value}</span>
            </div>
          ))}

          <div className="relative ml-auto text-[9px] text-[#64748B] font-mono">
            Generated {data?.generatedAt}
          </div>
        </div>
      )}

      {/* Main: Chart + Slot Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intraday Predicted Price Chart */}
        <Card className="lg:col-span-2 flex flex-col h-[340px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
              <Zap size={13} className="text-violet-400" /> Predicted NIFTY 50 Price — Full Day
            </span>
            <span className="text-[9px] text-[#64748B] font-semibold uppercase tracking-wider">09:15 → 15:30</span>
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="h-full bg-[#112240]/20 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  onMouseMove={e => {
                    if (e.activePayload) {
                      const s = data?.slots?.find(sl => sl.slot === e.activePayload[0]?.payload?.slot);
                      if (s) setHoveredSlot(s);
                    }
                  }}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  <defs>
                    <linearGradient id="intradayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={isUp ? '#00b060' : '#ff3b30'} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={isUp ? '#00b060' : '#ff3b30'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#112240" vertical={false} />
                  <XAxis dataKey="slot" stroke="#64748B" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={9} tickLine={false} domain={['auto', 'auto']}
                    tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
                  <ReferenceLine y={24502.15} stroke="#334155" strokeDasharray="4 4"
                    label={{ value: 'Base', fill: '#64748B', fontSize: 8 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload;
                      const slot = data?.slots?.find(s => s.slot === row?.slot);
                      if (!slot) return null;
                      return (
                        <div className="bg-[#1E293B] border border-[#334155] p-3 rounded-xl shadow-2xl text-xs min-w-[170px]">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Clock size={11} className="text-[#64748B]" />
                            <span className="font-bold text-[#F8FAFC]">{slot.slot}</span>
                            <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                              slot.direction === 'UP' ? 'bg-[#00b060]/15 text-[#00b060]' : 'bg-[#ff3b30]/15 text-[#ff3b30]'
                            }`}>{slot.direction}</span>
                          </div>
                          <div className="text-[#F8FAFC] font-extrabold text-sm">₹{slot.predictedPrice?.toLocaleString('en-IN')}</div>
                          <div className={`text-[10px] font-bold ${slot.change >= 0 ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                            {slot.change >= 0 ? '+' : ''}{slot.change} ({slot.changePct >= 0 ? '+' : ''}{slot.changePct}%)
                          </div>
                          <div className="text-[#94A3B8] mt-1 text-[10px]">{slot.sentiment}</div>
                          <div className="text-[#64748B] mt-0.5 text-[9px]">Confidence: {slot.confidence}%</div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone" dataKey="price"
                    stroke={isUp ? '#00b060' : '#ff3b30'} strokeWidth={2}
                    fill="url(#intradayGrad)" dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Selected Slot Detail Panel */}
        <Card className="flex flex-col justify-between h-[340px]">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-violet-400" />
            <span className="text-xs font-bold text-[#F8FAFC]">Slot Details</span>
            {displaySlot?.status === 'current' && (
              <span className="ml-auto text-[9px] font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full animate-pulse">
                CURRENT
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex-1 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-[#112240]/20 animate-pulse rounded" />
              ))}
            </div>
          ) : displaySlot ? (
            <div className="flex-1 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-black text-[#F8FAFC]">{displaySlot.slot}</div>
                <div className={`flex items-center justify-center gap-1.5 mt-1 text-2xl font-black ${
                  displaySlot.direction === 'UP' ? 'text-[#00b060]' : 'text-[#ff3b30]'
                }`}>
                  {displaySlot.direction === 'UP' ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                  {displaySlot.direction}
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">{displaySlot.sentiment}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Predicted Price', value: `₹${displaySlot.predictedPrice?.toLocaleString('en-IN')}`, color: 'text-[#F8FAFC]' },
                  { label: 'Confidence',       value: `${displaySlot.confidence}%`,                              color: 'text-violet-400' },
                  { label: 'Change',  value: `${displaySlot.change >= 0 ? '+' : ''}${displaySlot.change}`,       color: displaySlot.change >= 0 ? 'text-[#00b060]' : 'text-[#ff3b30]' },
                  { label: 'Change %', value: `${displaySlot.changePct >= 0 ? '+' : ''}${displaySlot.changePct}%`, color: displaySlot.changePct >= 0 ? 'text-[#00b060]' : 'text-[#ff3b30]' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#112240]/30 rounded-lg p-2.5 border border-[#112240]/40">
                    <div className="text-[9px] text-[#64748B] uppercase tracking-wider">{s.label}</div>
                    <div className={`text-sm font-extrabold mt-0.5 ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Per-model probs */}
              <div className="space-y-2">
                {[
                  { label: 'Gradient Boosting', key: 'gradientBoosting', color: '#22c55e' },
                  { label: 'Random Forest',     key: 'randomForest',     color: '#a78bfa' },
                  { label: 'Logistic Reg.',     key: 'logisticRegression', color: '#3b82f6' },
                ].map(m => (
                  <div key={m.key}>
                    <div className="flex justify-between text-[9px] text-[#94A3B8] mb-0.5">
                      <span>{m.label}</span>
                      <span style={{ color: m.color }}>{displaySlot.models?.[m.key]}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#112240] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${displaySlot.models?.[m.key]}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#64748B] text-xs">
              Hover a slot on the chart to see details
            </div>
          )}

          <div className="text-[9px] text-[#64748B] border-t border-[#112240] pt-2 mt-2">
            Click any time slot below to pin details
          </div>
        </Card>
      </div>

      {/* Confidence Bar Chart */}
      <Card>
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity size={12} className="text-violet-400" /> Confidence by Time Slot
        </span>
        <div className="h-[120px]">
          {isLoading ? (
            <div className="h-full bg-[#112240]/20 animate-pulse rounded" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#112240" vertical={false} />
                <XAxis dataKey="slot" stroke="#64748B" fontSize={8} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={8} tickLine={false} domain={[0, 100]} ticks={[0, 50, 100]} />
                <ReferenceLine y={50} stroke="#334155" strokeDasharray="3 3" />
                <Tooltip
                  content={({ active, payload }) => active && payload?.length ? (
                    <div className="bg-[#1E293B] border border-[#334155] p-2 rounded text-[10px] text-[#F8FAFC]">
                      <span className="font-bold">{payload[0].payload.slot}</span>:{' '}
                      <span className="text-violet-400">{payload[0].value}% confidence</span>
                    </div>
                  ) : null}
                />
                <Bar dataKey="confidence" radius={[3, 3, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i}
                      fill={entry.status === 'current' ? '#7C3AED' : entry.direction === 'UP' ? '#00b060' : '#ff3b30'}
                      opacity={entry.status === 'past' ? 0.4 : 1}
                    />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Slot Timeline Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={13} className="text-violet-400" />
          <span className="text-xs font-bold text-[#F8FAFC]">Slot-by-Slot Timeline</span>
          <div className="ml-auto flex items-center gap-3 text-[9px] text-[#64748B] font-semibold">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#334155]" /> Past</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Current</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#112240]" /> Future</span>
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="h-[90px] rounded-xl bg-[#112240]/20 animate-pulse border border-[#112240]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
            {data?.slots?.map((slot, i) => {
              const isSlotUp = slot.direction === 'UP';
              const isCurrent = slot.status === 'current';
              return (
                <div
                  key={i}
                  onClick={() => setSelectedSlot(slot)}
                  onMouseEnter={() => setHoveredSlot(slot)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  className={`relative p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.04] ${STATUS_RING[slot.status]} ${
                    selectedSlot?.slot === slot.slot && !hoveredSlot ? 'ring-1 ring-violet-500/50' : ''
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full animate-ping" />
                  )}
                  <div className="text-[10px] font-bold text-[#64748B] mb-1">{slot.slot}</div>
                  <div className={`flex items-center gap-0.5 font-black text-xs ${isSlotUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                    {isSlotUp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {slot.direction}
                  </div>
                  <div className="text-[9px] text-[#64748B] mt-0.5">{slot.confidence}%</div>
                  <div className={`text-[8px] font-bold mt-0.5 ${slot.changePct >= 0 ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                    {slot.changePct >= 0 ? '+' : ''}{slot.changePct}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default IntradayPrediction;

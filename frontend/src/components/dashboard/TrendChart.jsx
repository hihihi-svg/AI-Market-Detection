import React from 'react';
import Card from '../common/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles } from 'lucide-react';

function TrendChart({ data }) {
  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const info = payload[0].payload;
      return (
        <div className="bg-[#1E293B] border border-[#334155] p-3 rounded-xl text-xs shadow-lg">
          <p className="font-bold text-[#F8FAFC]">{info.date}</p>
          <p className="mt-1 text-[#94A3B8]">
            Close: <span className="text-[#F8FAFC] font-semibold">{info.close}</span>
          </p>
          <p className="text-[#94A3B8]">
            AI Up Probability: <span className="text-violet-500 font-semibold">{info.probability}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} /> Trend Analytics
          </span>
          <h3 className="text-lg font-bold text-[#F8FAFC]">AI Prediction Probability Trend</h3>
        </div>
      </div>
      
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155/40" horizontal={true} vertical={false} />
            <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[30, 90]} />
            <Tooltip content={customTooltip} />
            <Area type="monotone" dataKey="probability" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#probGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default TrendChart;

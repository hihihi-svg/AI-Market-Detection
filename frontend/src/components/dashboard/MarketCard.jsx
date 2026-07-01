import React from 'react';
import Card from '../common/Card';
import { MdArrowUpward, MdArrowDownward, MdTrendingFlat } from 'react-icons/md';

function MarketCard({ name, value, change, status }) {
  const isUp = change.startsWith('+') || change.startsWith('▲');
  const isFlat = change.startsWith('0') || change === 'Flat';

  let icon = <MdTrendingFlat className="text-[#FACC15]" size={20} />;
  let colorClass = 'text-[#FACC15]';

  if (!isFlat) {
    if (isUp) {
      icon = <MdArrowUpward className="text-[#22C55E]" size={20} />;
      colorClass = 'text-[#22C55E] bg-green-500/10 border border-green-500/20';
    } else {
      icon = <MdArrowDownward className="text-[#EF4444]" size={20} />;
      colorClass = 'text-[#EF4444] bg-red-500/10 border border-red-500/20';
    }
  }

  return (
    <Card className="flex flex-col justify-between h-36">
      <div className="flex justify-between items-start">
        <span className="text-sm font-semibold text-[#94A3B8]">{name}</span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#334155] text-[#F8FAFC]">
          {status}
        </span>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <div>
          <span className="text-2xl font-bold text-[#F8FAFC]">{value}</span>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${colorClass}`}>
          {icon}
          {change}
        </div>
      </div>
    </Card>
  );
}

export default MarketCard;

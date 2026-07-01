import React from 'react';
import Card from '../common/Card';
import Sparkline from './Sparkline';
import { ArrowUpRight, ArrowDownRight, Minus, Layers } from 'lucide-react';

function MarketSnapshot({ macroCards }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
          <Layers size={14} className="text-[#64748B]" /> Market Snapshot
        </h3>
        <button className="text-[10px] font-bold text-violet-400 hover:underline">
          View All Insights
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {macroCards.map((card, idx) => {
          const isCardUp = card.isUp;
          let changeColor = isCardUp ? 'text-[#00b060]' : 'text-[#ff3b30]';
          let iconBg = isCardUp ? 'bg-[#00b060]/10 border-[#00b060]/20' : 'bg-[#ff3b30]/10 border-[#ff3b30]/20';
          
          return (
            <Card key={idx} className="flex items-center justify-between h-[84px] p-4 relative overflow-hidden group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${iconBg} border shrink-0`}>
                  {card.name.includes('GOLD') && '🟡'}
                  {card.name.includes('OIL') && '🛢️'}
                  {card.name.includes('USD') && '💵'}
                  {card.name.includes('VIX') && '💜'}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{card.name}</span>
                  <span className="text-base font-extrabold text-[#F8FAFC] tracking-tight mt-0.5">{card.value}</span>
                  <span className="text-[9px] text-[#94A3B8] mt-0.5">{card.status}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1.5">
                <div className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${changeColor}`}>
                  {isCardUp ? '+' : ''}{card.change}
                </div>
                <Sparkline data={card.prices} isUp={card.isUp} width={50} height={14} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default MarketSnapshot;

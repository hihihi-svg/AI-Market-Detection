import React from 'react';
import Card from '../common/Card';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

function HeroPredictionCard({ prediction, confidence, expectedMove, targetRange, timeHorizon }) {
  const isUp = prediction === 'UP';

  return (
    <Card className={`relative overflow-hidden border-l-4 ${isUp ? 'border-l-[#00b060]' : 'border-l-[#ff3b30]'} flex flex-col justify-between h-[256px]`}>
      {/* Subtle neon glowing orb */}
      <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-[#00b060]/5 blur-3xl" />
      
      <div className="flex justify-between items-start z-10">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Tomorrow's Outlook</span>
          <div className="flex items-center gap-2 mt-1">
            {isUp ? (
              <span className="flex items-center text-3xl font-black text-[#00b060] tracking-wide gap-1">
                <TrendingUp size={28} />
                BULLISH
              </span>
            ) : (
              <span className="flex items-center text-3xl font-black text-[#ff3b30] tracking-wide gap-1">
                <TrendingDown size={28} />
                BEARISH
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-[#94A3B8] block mt-0.5">AI Predicts an Upward Movement</span>
        </div>

        {/* Circular progress loader */}
        <div className="relative flex items-center justify-center">
          <svg className="w-18 h-18 transform -rotate-90">
            <circle className="text-[#112240]" strokeWidth="4" stroke="currentColor" fill="transparent" r="28" cx="36" cy="36" />
            <circle className="text-[#00b060]" strokeWidth="4" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - confidence / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="28" cx="36" cy="36" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-sm font-extrabold text-[#F8FAFC]">{confidence}%</span>
            <span className="text-[7px] text-[#64748B] uppercase font-bold tracking-wider leading-none">Conf.</span>
          </div>
        </div>
      </div>

      {/* Clean 3D wireframe graph grid representation in background */}
      <div className="absolute bottom-6 right-6 opacity-25 pointer-events-none z-0">
        <svg viewBox="0 0 100 80" className="w-36 h-24 text-[#00b060] drop-shadow-[0_0_12px_rgba(0,176,96,0.25)]">
          <path fill="none" stroke="currentColor" strokeWidth="1" d="M10,70 L30,50 L50,60 L70,30 L90,40" />
          <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M10,70 L10,30 M30,70 L30,30 M50,70 L50,30 M70,70 L70,30 M90,70 L90,30" />
          <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#112240] z-10">
        <div>
          <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider block">Expected Move</span>
          <span className="text-base font-extrabold text-[#00b060] mt-0.5 block">{expectedMove}</span>
        </div>
        <div>
          <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider block">Target Range</span>
          <span className="text-sm font-extrabold text-[#E2E8F0] mt-0.5 block">{targetRange}</span>
        </div>
        <div>
          <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider block">Time Horizon</span>
          <span className="text-sm font-extrabold text-[#E2E8F0] mt-0.5 block">{timeHorizon}</span>
        </div>
      </div>
    </Card>
  );
}

export default HeroPredictionCard;

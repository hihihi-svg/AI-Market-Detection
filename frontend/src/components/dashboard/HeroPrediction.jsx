import React from 'react';
import Card from '../common/Card';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

function HeroPrediction({ prediction, probability, confidence, expectedMove }) {
  const isUp = prediction === 'UP';

  return (
    <Card className={`relative overflow-hidden border-l-4 ${isUp ? 'border-l-[#22C55E]' : 'border-l-[#EF4444]'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
            Tomorrow's Outlook
          </h2>
          <div className="mt-4 flex items-center">
            {isUp ? (
              <span className="flex items-center text-4xl font-extrabold text-[#22C55E] gap-2">
                <MdTrendingUp size={40} />
                BULLISH
              </span>
            ) : (
              <span className="flex items-center text-4xl font-extrabold text-[#EF4444] gap-2">
                <MdTrendingDown size={40} />
                BEARISH
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Expected market movement: <span className={`font-semibold ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{expectedMove}</span>
          </p>
        </div>

        {/* Circular Confidence Meter */}
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-95">
            <circle
              className="text-[#334155]"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="38"
              cx="48"
              cy="48"
            />
            <circle
              className={isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 38}
              strokeDashoffset={2 * Math.PI * 38 * (1 - confidence / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="38"
              cx="48"
              cy="48"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{confidence}%</span>
            <span className="text-[10px] text-[#94A3B8] uppercase">Confidence</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default HeroPrediction;

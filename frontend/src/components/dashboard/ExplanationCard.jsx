import React from 'react';
import Card from '../common/Card';
import { Sparkles } from 'lucide-react';

function ExplanationCard({ prediction, reasons }) {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={14} /> Explainable AI
        </div>
        <h3 className="text-lg font-bold text-[#F8FAFC] mt-1">Why did the AI predict this?</h3>
        
        <div className="mt-5 space-y-3.5">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
              <p className="text-[#E2E8F0] text-xs leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4 mt-6 border-t border-[#334155]/60 text-[10px] text-[#64748B] flex items-center justify-between">
        <span>Insights recalculated daily post-market close</span>
        <span className="font-semibold text-violet-400 hover:underline cursor-pointer">Learn more</span>
      </div>
    </Card>
  );
}

export default ExplanationCard;

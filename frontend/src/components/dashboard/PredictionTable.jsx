import React from 'react';
import Card from '../common/Card';
import { History, CheckCircle2, XCircle } from 'lucide-react';

function PredictionTable({ data }) {
  return (
    <Card className="h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
            <History size={12} /> Timeline Logs
          </span>
          <h3 className="text-lg font-bold text-[#F8FAFC]">Prediction Timeline</h3>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[250px] space-y-3.5 pr-1">
        {data.map((row, idx) => {
          const isCorrect = row.prediction === row.actual;
          return (
            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-[#0F172A]/50 border border-[#334155]/40 hover:border-[#334155] transition-all duration-150">
              <div className="space-y-1">
                <span className="text-xs text-[#E2E8F0] font-semibold">{row.date}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    row.prediction === 'UP' ? 'bg-[#00b060]/10 text-[#00b060]' : 'bg-[#ff3b30]/10 text-[#ff3b30]'
                  }`}>
                    {row.prediction}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-medium">Conf: {row.probability}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#94A3B8] font-medium">Actual: {row.actual}</span>
                {isCorrect ? (
                  <CheckCircle2 size={16} className="text-[#00b060]" />
                ) : (
                  <XCircle size={16} className="text-[#ff3b30]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default PredictionTable;

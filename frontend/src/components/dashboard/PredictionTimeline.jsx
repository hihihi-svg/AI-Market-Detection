import React from 'react';
import Card from '../common/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

function PredictionTimeline({ history }) {
  return (
    <Card className="lg:col-span-2 h-[320px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-[#F8FAFC]">Recent Predictions</h3>
        <button className="text-[10px] font-bold text-violet-400 hover:underline">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#112240] text-[#64748B]">
              <th className="pb-2 font-bold uppercase tracking-wider">Date</th>
              <th className="pb-2 font-bold uppercase tracking-wider">Prediction</th>
              <th className="pb-2 font-bold uppercase tracking-wider">Confidence</th>
              <th className="pb-2 font-bold uppercase tracking-wider">Actual</th>
              <th className="pb-2 font-bold uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#112240] text-[#E2E8F0]">
            {history.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#112240]/20">
                <td className="py-2.5 font-medium">{row.date}</td>
                <td className="py-2.5">
                  <span className={`flex items-center gap-0.5 font-bold ${row.prediction === 'UP' ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                    {row.prediction === 'UP' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {row.prediction}
                  </span>
                </td>
                <td className="py-2.5">{row.confidence}</td>
                <td className="py-2.5">
                  <span className={`flex items-center gap-0.5 font-bold ${row.actual === '▲' || row.actual === 'UP' ? 'text-[#00b060]' : row.actual === '▼' || row.actual === 'DOWN' ? 'text-[#ff3b30]' : 'text-[#64748B]'}`}>
                    {row.actual}
                  </span>
                </td>
                <td className="py-2.5 text-center">
                  <span className={row.correct ? 'text-[#00b060]' : 'text-[#ff3b30]'}>
                    {row.correct ? '●' : '✕'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default PredictionTimeline;

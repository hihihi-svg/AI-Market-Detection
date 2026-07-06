import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import { getReport } from '../services/api';
import { FileText, Download, RefreshCw, CheckCircle2, XCircle, TrendingUp, TrendingDown, BarChart2, Sparkles } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend } from 'recharts';

const MODEL_LABEL = {
  gradientBoosting: 'Gradient Boosting',
  randomForest: 'Random Forest',
  logisticRegression: 'Logistic Regression',
};
const MODEL_COLOR = {
  gradientBoosting: '#22c55e',
  randomForest: '#a78bfa',
  logisticRegression: '#3b82f6',
};

function Reports() {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState('');

  const fetchReport = useCallback(() => {
    setIsLoading(true);
    getReport()
      .then(data => {
        setReport(data);
        setLastFetched(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const modelBars = report ? Object.entries(report.modelAccuracy).map(([k, v]) => ({
    name: MODEL_LABEL[k],
    acc: v,
    color: MODEL_COLOR[k],
  })) : [];

  const pieData = report ? [
    { name: 'Correct', value: report.correctPredictions, fill: '#00b060' },
    { name: 'Incorrect', value: report.totalPredictions - report.correctPredictions, fill: '#ff3b30' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText size={13} /> Performance Reports
          </div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Reports</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            AI performance summary generated dynamically from live model outputs
            {report && <> · Period: <span className="text-[#94A3B8] font-semibold">{report.period}</span></>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#64748B] font-semibold flex items-center gap-1">
            <RefreshCw size={10} className={isLoading ? 'animate-spin' : ''} />
            {lastFetched ? `Generated ${lastFetched}` : 'Generating...'}
          </span>
          <button
            onClick={fetchReport}
            className="flex items-center gap-1.5 text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-1.5 hover:bg-violet-500/20 transition-all"
          >
            <RefreshCw size={11} /> Regenerate
          </button>
          <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] bg-[#112240]/40 border border-[#112240] rounded-lg px-3 py-1.5 hover:bg-[#112240] transition-all">
            <Download size={11} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Weekly Accuracy',
            value: isLoading ? '—' : `${report?.weeklyAccuracy}%`,
            color: report?.weeklyAccuracy >= 60 ? 'text-[#00b060]' : 'text-[#ff3b30]',
            sub: 'Last 7 trading days',
            icon: <BarChart2 size={16} />,
          },
          {
            label: 'Correct Predictions',
            value: isLoading ? '—' : `${report?.correctPredictions} / ${report?.totalPredictions}`,
            color: 'text-violet-400',
            sub: 'Sessions predicted right',
            icon: <CheckCircle2 size={16} />,
          },
          {
            label: 'Best Model',
            value: isLoading ? '—' : MODEL_LABEL[report?.bestModel]?.split(' ')[0] || '—',
            color: 'text-[#22c55e]',
            sub: `${isLoading ? '—' : report?.bestModelAccuracy?.toFixed(2)}% test accuracy`,
            icon: <Sparkles size={16} />,
          },
          {
            label: 'Generated At',
            value: isLoading ? '—' : (report?.generatedAt?.split(',')[1]?.trim() || '—'),
            color: 'text-[#F8FAFC]',
            sub: report?.generatedAt?.split(',')[0] || '—',
            icon: <FileText size={16} />,
          },
        ].map((s, i) => (
          <Card key={i} className="flex flex-col justify-between h-[90px] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{s.label}</span>
              <span className={`${s.color} opacity-60`}>{s.icon}</span>
            </div>
            <div>
              <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-[#64748B] mt-0.5">{s.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Summary Text */}
      {!isLoading && report?.summary && (
        <Card className="border-l-2 border-l-violet-500">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-xs font-bold text-[#F8FAFC]">AI Performance Summary</span>
          </div>
          <p className="text-sm text-[#94A3B8] leading-relaxed">{report.summary}</p>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Accuracy Bar Chart */}
        <Card>
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2 mb-3">
            <BarChart2 size={12} className="text-violet-400" /> Model Accuracy Comparison
          </span>
          {isLoading ? (
            <div className="h-44 bg-[#112240]/20 animate-pulse rounded" />
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelBars} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#112240" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={8} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={8} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                  <Tooltip
                    content={({ active, payload }) => active && payload?.length ? (
                      <div className="bg-[#1E293B] border border-[#334155] p-2 rounded text-[10px] text-[#F8FAFC]">
                        <span className="font-bold">{payload[0].payload.name}: </span>
                        <span style={{ color: payload[0].payload.color }}>{payload[0].value?.toFixed(2)}%</span>
                      </div>
                    ) : null}
                  />
                  <Bar dataKey="acc" radius={[4, 4, 0, 0]}>
                    {modelBars.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Prediction Accuracy Pie */}
        <Card>
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2 mb-3">
            <CheckCircle2 size={12} className="text-[#00b060]" /> Weekly Prediction Accuracy
          </span>
          {isLoading ? (
            <div className="h-44 bg-[#112240]/20 animate-pulse rounded" />
          ) : (
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => active && payload?.length ? (
                      <div className="bg-[#1E293B] border border-[#334155] p-2 rounded text-[10px]">
                        <span style={{ color: payload[0].payload.fill }} className="font-bold">{payload[0].name}: </span>
                        <span className="text-[#F8FAFC]">{payload[0].value} sessions</span>
                      </div>
                    ) : null}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', color: '#94A3B8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Weekly Log Table */}
      <Card>
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-4 block">7-Day Prediction Log</span>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-10 bg-[#112240]/20 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#112240]">
                  {['Date', 'AI Prediction', 'Actual', 'Result'].map(h => (
                    <th key={h} className="text-left pb-2.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#112240]/30">
                {report?.weeklyLog?.map((row, i) => (
                  <tr key={i} className="hover:bg-[#112240]/10 transition-colors">
                    <td className="py-3 pr-6 text-[#94A3B8] font-semibold">{row.date}</td>
                    <td className="py-3 pr-6">
                      <span className={`flex items-center gap-1 font-bold ${row.prediction === 'UP' ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                        {row.prediction === 'UP' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {row.prediction}
                      </span>
                    </td>
                    <td className="py-3 pr-6">
                      <span className={`font-bold ${row.actual === 'UP' ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                        {row.actual === 'UP' ? '▲ UP' : '▼ DOWN'}
                      </span>
                    </td>
                    <td className="py-3">
                      {row.correct ? (
                        <span className="flex items-center gap-1 text-[#00b060] font-bold">
                          <CheckCircle2 size={12} /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#ff3b30] font-bold">
                          <XCircle size={12} /> Incorrect
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Reports;

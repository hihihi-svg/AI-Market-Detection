import React from 'react';
import Card from '../components/common/Card';
import Sparkline from '../components/dashboard/Sparkline';
import HeroPredictionCard from '../components/dashboard/HeroPredictionCard';
import MarketSnapshot from '../components/dashboard/MarketSnapshot';
import PredictionTimeline from '../components/dashboard/PredictionTimeline';
import NewsTicker from '../components/dashboard/NewsTicker';
import { dashboardData } from '../mock/dashboardData';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

import { getPrediction, getMarketSnapshot, getExplanation, getPredictionHistory } from '../services/api';

function Dashboard() {
  const [liveData, setLiveData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [historyData, setHistoryData] = React.useState([]);
  const [chartData, setChartData] = React.useState(dashboardData.chartData);

  const fetchLatestPrediction = React.useCallback(() => {
    setIsLoading(true);
    getPrediction()
      .then(data => {
        setLiveData(data);
        if (data.lastUpdated) {
          window.lastUpdatedValue = data.lastUpdated;
        }
        
        if (data.currentPrice) {
          setChartData(prev => {
            const newData = [...prev];
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            newData.push({ date: timeStr, close: data.currentPrice });
            if (newData.length > 20) newData.shift();
            return newData;
          });
        }
        setError(null);
      })
      .catch(err => {
        console.log('Using fallback static predictions due to connection exception');
        setError('Unable to fetch the latest market prediction. Using offline database fallback.');
      });

    getPredictionHistory()
      .then(data => setHistoryData(data))
      .catch(err => console.log('Using static prediction history logs fallback'));
      
    // Set isLoading to false only after main datasets check
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  React.useEffect(() => {
    fetchLatestPrediction();
    
    // Set up click triggers on window helper to let browser subagents or users test dynamics easily
    window.triggerLiveReload = fetchLatestPrediction;
    
    // Auto Refresh Every 2 Seconds for Real Time updates
    const interval = setInterval(fetchLatestPrediction, 2000);
    return () => {
      clearInterval(interval);
      delete window.triggerLiveReload;
    };
  }, [fetchLatestPrediction]);

  const currentPrediction = liveData?.prediction || dashboardData.prediction;
  const currentConfidence = liveData?.confidence || dashboardData.confidence;
  const currentExpected = liveData?.expectedMove || dashboardData.expectedMove;
  const currentModelProbs = liveData?.probability ? [
    { name: 'Gradient Boosting', prob: liveData.probability.gradientBoosting, color: '#22c55e' },
    { name: 'Random Forest', prob: liveData.probability.randomForest, color: '#a78bfa' },
    { name: 'Logistic Regression', prob: liveData.probability.logisticRegression, color: '#3b82f6' }
  ] : dashboardData.models;

  const isUp = currentPrediction === 'UP';

  // Render skeleton loaders for a premium visual feedback during fetches
  if (isLoading && !liveData) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-[#112240]/25 rounded-xl h-[82px] border border-[#112240]"></div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#112240]/25 rounded-xl h-[92px] border border-[#112240]"></div>
          ))}
        </div>
        <div className="h-[340px] bg-[#112240]/25 rounded-xl border border-[#112240]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-xl p-3 text-xs text-[#ff3b30] font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-white">✕</button>
        </div>
      )}
      {/* 1. Top Row Tick Tickers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {dashboardData.tickers.map((tick, idx) => (
          <div key={idx} className="bg-[#060D19]/70 border border-[#112240] rounded-xl p-3 flex flex-col justify-between h-[82px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-[#64748B] tracking-wide uppercase">{tick.name}</span>
            </div>
            <div className="flex justify-between items-end mt-1.5">
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-[#F8FAFC] tracking-tight">{tick.value}</span>
                <span className={`text-[9px] font-bold mt-0.5 ${tick.isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                  {tick.change}
                </span>
              </div>
              <div className="pb-0.5">
                <Sparkline data={tick.prices} isUp={tick.isUp} width={45} height={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. NIFTY Price Header and Key predictions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="flex flex-col justify-between h-[92px] p-4">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">NIFTY 50</span>
          <span className="text-xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">{liveData?.currentPrice ? liveData.currentPrice.toLocaleString('en-IN') : dashboardData.niftyValue}</span>
          <span className={`text-[10px] font-bold mt-0.5 ${liveData?.expectedMove?.includes('-') ? 'text-[#ff3b30]' : 'text-[#00b060]'}`}>{liveData?.expectedMove || dashboardData.niftyChange}</span>
          <span className="text-[8px] text-[#64748B] mt-0.5">{liveData?.lastUpdated || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </Card>

        <Card className={`flex flex-col justify-between h-[92px] p-4 border-l-2 ${isUp ? 'border-l-[#00b060]' : 'border-l-[#ff3b30]'}`}>
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">AI Prediction</span>
          <div className={`mt-1.5 flex items-center gap-1 font-black text-lg ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
            {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />} {currentPrediction}
          </div>
          <span className="text-[8px] text-[#64748B]">{isUp ? 'Higher probability of market going UP' : 'Higher probability of market going DOWN'}</span>
        </Card>

        <Card className="flex flex-col justify-between h-[92px] p-4">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Confidence Score</span>
          <div className="flex items-center justify-between mt-1">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle className="text-[#112240]" strokeWidth="3" stroke="currentColor" fill="transparent" r="14" cx="20" cy="20" />
                <circle className={isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'} strokeWidth="3" strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 * (1 - currentConfidence / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="14" cx="20" cy="20" />
              </svg>
              <span className="absolute text-[10px] font-extrabold text-[#F8FAFC]">{currentConfidence}%</span>
            </div>
            <span className="text-[9px] text-[#64748B] font-semibold text-right leading-snug">Probability of<br/>{currentPrediction} Movement</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-[92px] p-4">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Expected Move (Tomorrow)</span>
          <span className={`text-lg font-black mt-1.5 ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>{currentExpected}</span>
          <span className="text-[8px] text-[#64748B]">Estimated change in NIFTY 50</span>
        </Card>

        <Card className="flex flex-col justify-between h-[92px] p-4">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Prediction Date</span>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-[#F8FAFC]">
            <span className="text-xs font-bold text-[#F8FAFC]">
              {liveData?.predictionDate || new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <span className="text-[8px] text-[#64748B]">For next trading day</span>
        </Card>
      </div>

      {/* 3. Interactive chart and AI model probabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* NIFTY 50 Price Chart */}
        <Card className="lg:col-span-3 h-[340px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#F8FAFC]">NIFTY 50 Price Chart</span>
              <div className="flex gap-1">
                {['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'].map((item) => (
                  <button key={item} className={`px-2 py-0.5 rounded text-[9px] font-bold ${item === '1M' ? 'bg-[#7C3AED]/20 text-[#a78bfa] border border-[#7C3AED]/30' : 'text-[#64748B]'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <select className="bg-[#0C1524] border border-[#112240] rounded text-[9px] font-semibold text-[#94A3B8] px-2 py-0.5 outline-none cursor-pointer">
              <option>NSE</option>
            </select>
          </div>
          
          <div className="h-56 mt-2 relative">
            < ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b060" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00b060" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#112240/30" horizontal={true} vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={9} tickLine={false} domain={[22000, 25000]} ticks={[22800, 23200, 23600, 24000, 24400, 24800]} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1E293B] border border-[#334155] p-2.5 rounded-lg text-xs shadow-lg">
                        <p className="font-bold text-[#F8FAFC]">{payload[0].payload.date}</p>
                        <p className="mt-1 text-[#00b060] font-semibold">Price: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Area type="monotone" dataKey="close" stroke="#00b060" strokeWidth={2} fillOpacity={1} fill="url(#chartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Visual highlight tag inside the chart */}
            <div className={`absolute top-[48px] right-[10px] ${liveData?.expectedMove?.includes('-') ? 'bg-[#ff3b30]' : 'bg-[#00b060]'} text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg shadow-[#00b060]/20`}>
              {liveData?.currentPrice ? liveData.currentPrice.toLocaleString('en-IN') : '24,502.15'}
            </div>
          </div>
        </Card>

        {/* Probabilities and Final Prediction details */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-6 h-[340px]">
          {/* AI Prediction Probabilities */}
          <Card className="flex-1 flex flex-col justify-between p-4">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              AI Prediction Probabilities (For {liveData?.predictionDate || new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})
            </span>
            <div className="mt-3.5 space-y-3">
              {currentModelProbs.map((model, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-[#E2E8F0]">
                    <span>{model.name}</span>
                    <span>{model.prob}%</span>
                  </div>
                  <div className="w-full bg-[#112240]/40 rounded-full h-2 overflow-hidden border border-[#112240]">
                    <div className="h-full rounded-full" style={{ width: `${model.prob}%`, backgroundColor: model.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Final Prediction combined card */}
          <Card className={`h-28 flex items-center justify-between p-5 border-l-2 ${isUp ? 'border-l-[#00b060]' : 'border-l-[#ff3b30]'}`}>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Final Prediction</span>
              <span className={`text-3xl font-black tracking-wide mt-1.5 flex items-center gap-1.5 ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                {currentPrediction} <span className="text-xl">{isUp ? '▲' : '▼'}</span>
              </span>
              <span className="text-[9px] text-[#64748B] mt-0.5">Based on majority voting of all models</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`text-3xl font-black ${isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>{currentConfidence}%</span>
              <span className="text-[9px] text-[#64748B] mt-0.5">Overall Confidence</span>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Market snapshot row panels */}
      <MarketSnapshot macroCards={dashboardData.macroCards} />

      {/* 5. Deep insights row grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Market Drivers */}
        <Card className="flex flex-col justify-between h-[256px] p-4">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Market Drivers</span>
          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {dashboardData.macroCards.map((drv, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8] font-medium">{drv.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#F8FAFC] font-semibold">{drv.value}</span>
                  <span className={`font-bold ${drv.isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>
                    {drv.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Impacting Features */}
        <Card className="flex flex-col justify-between h-[256px] p-4">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Top Impacting Features</span>
          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {dashboardData.features.map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-[#E2E8F0] font-medium">
                  <span>{feat.name}</span>
                  <span>{feat.weight.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#112240]/40 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-[#00b060]/80 rounded-full" style={{ width: `${feat.weight * 350}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <span className="text-[8px] text-[#64748B] mt-2 block">Based on Random Forest Feature Importance</span>
        </Card>

        {/* Recent Predictions timeline log list */}
        <PredictionTimeline history={historyData.length > 0 ? historyData : dashboardData.history} />

        {/* Model Performance Accuracy comparison */}
        <Card className="flex flex-col justify-between h-[256px] p-4">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">Model Performance (Overall Accuracy)</span>
          <div className="h-36 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.performanceData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#112240/30" horizontal={true} vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={8} tick={false} />
                <YAxis stroke="#64748B" fontSize={8} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1E293B] border border-[#334155] p-2 rounded text-[10px] text-[#F8FAFC]">
                        Accuracy: {payload[0].value}%
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                  {dashboardData.performanceData.map((entry, index) => {
                    let barColor = '#22c55e'; // GB
                    if (index === 1) barColor = '#a78bfa'; // RF
                    if (index === 2) barColor = '#3b82f6'; // LR
                    return <Cell key={`cell-${index}`} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[8px] text-[#64748B] font-bold pt-2 uppercase">
            <span>Grad Boost</span>
            <span>Rand Forest</span>
            <span>Log Reg</span>
          </div>
        </Card>
      </div>

      {/* 6. News Ticker */}
      <NewsTicker news={dashboardData.news} />
    </div>
  );
}

export default Dashboard;

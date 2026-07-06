import React, { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Sparkles,
  History,
  Eye,
  AlertCircle,
  FileText,
  RefreshCw,
  BarChart2,
  Clock
} from 'lucide-react';
import { getPrediction, getMarketSnapshot } from '../services/api';
import { dashboardData } from '../mock/dashboardData';

function MainLayout() {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard',            path: '/',          icon: <LayoutDashboard size={16} /> },
    { name: 'Market Overview',      path: '/market',    icon: <TrendingUp size={16} /> },
    { name: 'AI Predictions',       path: '/history',   icon: <Sparkles size={16} /> },
    { name: 'Intraday Prediction',  path: '/intraday',  icon: <Clock size={16} /> },
    { name: 'Model Comparison',     path: '/analytics', icon: <History size={16} /> },
    { name: 'Portfolio Watch',      path: '/watchlist', icon: <Eye size={16} /> },
    { name: 'Alerts',               path: '/alerts',    icon: <AlertCircle size={16} /> },
    { name: 'Reports',              path: '/reports',   icon: <FileText size={16} /> },
  ];

  const [livePrice, setLivePrice]   = useState(null);
  const [liveMarket, setLiveMarket] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchTicker = useCallback(() => {
    getPrediction()
      .then(data => {
        setLivePrice(data.currentPrice);
        setLastUpdated(data.lastUpdated || '');
      })
      .catch(() => {});
    getMarketSnapshot()
      .then(data => setLiveMarket(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchTicker();
    const iv = setInterval(fetchTicker, 3000);
    window.triggerLiveReload = fetchTicker;
    return () => { clearInterval(iv); delete window.triggerLiveReload; };
  }, [fetchTicker]);

  const statusColor = (s) => {
    if (!s) return 'text-[#94A3B8]';
    if (['Rising', 'Stable'].includes(s))  return 'text-[#00b060]';
    if (s === 'Falling')  return 'text-[#ff3b30]';
    if (s === 'Volatile') return 'text-[#f59e0b]';
    return 'text-[#94A3B8]';
  };

  const niftyPrice = livePrice ? livePrice.toLocaleString('en-IN') : dashboardData.tickers[0].value;
  const sensex    = dashboardData.tickers[1];
  const bankNifty = dashboardData.tickers[2];

  return (
    <div className="flex h-screen bg-[#060D19] text-[#F8FAFC] font-sans">
      {/* Sidebar */}
      <aside className="w-56 bg-[#030712] border-r border-[#112240]/40 flex flex-col z-20 shrink-0">
        <div className="h-16 flex items-center px-5 gap-2 border-b border-[#112240]/40">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-xs">
            📈
          </div>
          <span className="text-sm font-bold tracking-tight text-[#F8FAFC]">AI Market Direction</span>
        </div>

        <nav className="flex-1 px-2.5 py-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-500/10'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#112240]/20'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#112240]/40 flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-violet-400">AI Market Direction</span>
          <p className="text-[9px] text-[#64748B] leading-relaxed">Predicting NIFTY direction with Machine Learning</p>
          <span className="text-[9px] text-[#64748B] font-semibold mt-1">© 2026</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header — fully dynamic ticker */}
        <header className="h-16 bg-[#030712] border-b border-[#112240]/40 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-5 overflow-x-auto py-1 scrollbar-none flex-1 max-w-[82%]">

            {/* NIFTY 50 — LIVE from /api/prediction */}
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">NIFTY 50</span>
              <span className={`text-xs font-bold transition-all duration-500 ${livePrice ? 'text-[#F8FAFC]' : 'text-[#64748B] animate-pulse'}`}>
                {niftyPrice}
              </span>
              <span className="text-[9px] font-bold text-[#00b060] animate-pulse">●</span>
            </div>

            {/* SENSEX */}
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">SENSEX</span>
              <span className="text-xs font-bold text-[#F8FAFC]">{sensex.value}</span>
              <span className={`text-[9px] font-bold ${sensex.isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>{sensex.change}</span>
            </div>

            {/* BANK NIFTY */}
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">BANK NIFTY</span>
              <span className="text-xs font-bold text-[#F8FAFC]">{bankNifty.value}</span>
              <span className={`text-[9px] font-bold ${bankNifty.isUp ? 'text-[#00b060]' : 'text-[#ff3b30]'}`}>{bankNifty.change}</span>
            </div>

            {/* INDIA VIX — DYNAMIC state from /api/market */}
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">INDIA VIX</span>
              <span className="text-xs font-bold text-[#F8FAFC]">14.23</span>
              {liveMarket?.vix && <span className={`text-[9px] font-bold ${statusColor(liveMarket.vix)}`}>{liveMarket.vix}</span>}
            </div>

            {/* GOLD — DYNAMIC */}
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">GOLD</span>
              <span className="text-xs font-bold text-[#F8FAFC]">₹72,385</span>
              {liveMarket?.gold && <span className={`text-[9px] font-bold ${statusColor(liveMarket.gold)}`}>{liveMarket.gold}</span>}
            </div>

            {/* USD/INR — DYNAMIC */}
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">USD/INR</span>
              <span className="text-xs font-bold text-[#F8FAFC]">₹83.32</span>
              {liveMarket?.usd && <span className={`text-[9px] font-bold ${statusColor(liveMarket.usd)}`}>{liveMarket.usd}</span>}
            </div>

            {/* CRUDE OIL — DYNAMIC */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">CRUDE OIL</span>
              <span className="text-xs font-bold text-[#F8FAFC]">₹6,128</span>
              {liveMarket?.oil && <span className={`text-[9px] font-bold ${statusColor(liveMarket.oil)}`}>{liveMarket.oil}</span>}
            </div>
          </div>

          {/* Refresh + timestamp */}
          <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-[#112240]/40">
            <button
              onClick={fetchTicker}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1.5 hover:bg-[#112240]/30 rounded-lg"
            >
              <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
            </button>
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider">Last updated</span>
              <span className="text-[10px] font-semibold text-[#E2E8F0]">{lastUpdated || '—'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#060D19]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

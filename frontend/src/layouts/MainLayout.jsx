import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Sparkles,
  History,
  Eye,
  AlertCircle,
  FileText,
  RefreshCw
} from 'lucide-react';

function MainLayout() {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={16} /> },
    { name: 'Market Overview', path: '/market', icon: <TrendingUp size={16} /> },
    { name: 'AI Predictions', path: '/history', icon: <Sparkles size={16} /> },
    { name: 'Model Comparison', path: '/analytics', icon: <History size={16} /> },
    { name: 'Portfolio Watch', path: '/watchlist', icon: <Eye size={16} /> },
    { name: 'Alerts', path: '/alerts', icon: <AlertCircle size={16} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={16} /> },
  ];

  return (
    <div className="flex h-screen bg-[#060D19] text-[#F8FAFC] font-sans">
      {/* Sidebar matching the design with dark purple highlights */}
      <aside className="w-56 bg-[#030712] border-r border-[#112240]/40 flex flex-col z-20 shrink-0">
        <div className="h-16 flex items-center px-5 gap-2 border-b border-[#112240]/40">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-[#F8FAFC]">
            📈
          </div>
          <span className="text-sm font-bold tracking-tight text-[#F8FAFC]">
            AI Market Direction
          </span>
        </div>
        
        {/* Navigation list */}
        <nav className="flex-1 px-2.5 py-4 space-y-1">
          {navItems.map((item) => {
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

        {/* Sidebar Footer block */}
        <div className="p-4 border-t border-[#112240]/40 flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-violet-400">AI Market Direction</span>
          <p className="text-[9px] text-[#64748B] leading-relaxed">
            Predicting NIFTY direction with Machine Learning
          </p>
          <span className="text-[9px] text-[#64748B] font-semibold mt-1">© 2025</span>
        </div>
      </aside>

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Flat Ticker Bar Header */}
        <header className="h-16 bg-[#030712] border-b border-[#112240]/40 flex items-center justify-between px-6 z-10 shrink-0">
          {/* Top Row Mini Tickers */}
          <div className="flex items-center gap-6 overflow-x-auto py-1 scrollbar-none flex-1 max-w-[80%]">
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">NIFTY 50</span>
              <span className="text-xs font-bold text-[#F8FAFC]">24,502.15</span>
              <span className="text-[9px] font-bold text-[#00b060]">+0.45%</span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">SENSEX</span>
              <span className="text-xs font-bold text-[#F8FAFC]">80,319.48</span>
              <span className="text-[9px] font-bold text-[#00b060]">+0.38%</span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">BANK NIFTY</span>
              <span className="text-xs font-bold text-[#F8FAFC]">51,104.35</span>
              <span className="text-[9px] font-bold text-[#00b060]">+0.62%</span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">INDIA VIX</span>
              <span className="text-xs font-bold text-[#F8FAFC]">14.23</span>
              <span className="text-[9px] font-bold text-[#ff3b30]">-2.15%</span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">USD/INR</span>
              <span className="text-xs font-bold text-[#F8FAFC]">83.32</span>
              <span className="text-[9px] font-bold text-[#00b060]">+0.12%</span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-[#112240]/40 pr-4 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">GOLD</span>
              <span className="text-xs font-bold text-[#F8FAFC]">72,385</span>
              <span className="text-[9px] font-bold text-[#00b060]">+0.28%</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">CRUDE OIL</span>
              <span className="text-xs font-bold text-[#F8FAFC]">6,128</span>
              <span className="text-[9px] font-bold text-[#ff3b30]">-0.35%</span>
            </div>
          </div>
          
          {/* Last updated and refresh icons */}
          <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-[#112240]/40">
            <button 
              onClick={() => {
                if (typeof window.triggerLiveReload === 'function') {
                  window.triggerLiveReload();
                }
              }}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1.5 hover:bg-[#112240]/30 rounded-lg"
            >
              <RefreshCw size={14} className="animate-spin-slow" />
            </button>
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider">Last updated</span>
              <span className="text-[10px] font-semibold text-[#E2E8F0]">
                {window.lastUpdatedValue || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#060D19]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

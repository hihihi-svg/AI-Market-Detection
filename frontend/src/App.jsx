import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const MarketInsights = lazy(() => import('./pages/MarketInsights'));
const PredictionHistory = lazy(() => import('./pages/PredictionHistory'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const PortfolioWatch = lazy(() => import('./pages/PortfolioWatch'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Reports = lazy(() => import('./pages/Reports'));
const IntradayPrediction = lazy(() => import('./pages/IntradayPrediction'));
const StockSearch = lazy(() => import('./pages/StockSearch'));

// Reusable spinner fallback for lazy page bundles
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#060D19] h-full min-h-[300px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin"></div>
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-widest animate-pulse">Loading engine assets...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="market" element={<MarketInsights />} />
            <Route path="history" element={<PredictionHistory />} />
            <Route path="intraday" element={<IntradayPrediction />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="watchlist" element={<PortfolioWatch />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
            <Route path="watchlist" element={<PortfolioWatch />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="stocks" element={<StockSearch />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

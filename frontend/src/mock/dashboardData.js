// Dynamic dashboard data — generates current dates and values at runtime
// This replaces the old static May 2025 mock data

const today = new Date();

function formatDate(d) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysAgo(n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
}

function formatShortDate(d) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export const dashboardData = {
  // These fields are overridden by live API data; kept as loading fallback only
  niftyValue: '—',
  niftyChange: '—',
  niftyChangeValue: '—',
  niftyChangePercent: '—',
  lastUpdated: formatDate(today) + ', loading...',
  prediction: 'UP',
  probability: 68,
  confidence: 68,
  expectedMove: '+0.62%',
  predictionDate: formatDate(new Date(today.getTime() + 86400000)),
  targetRange: '—',
  timeHorizon: '1 Day',

  // Ticker sparkline mini-charts — prices are illustrative shapes, not exact values
  tickers: [
    { name: 'NIFTY 50',   value: '—', change: '—', isUp: true,  prices: [23800, 23850, 23900, 23870, 23940, 23963] },
    { name: 'SENSEX',     value: '—', change: '—', isUp: true,  prices: [79200, 79400, 79600, 79500, 79700, 79800] },
    { name: 'BANK NIFTY', value: '—', change: '—', isUp: true,  prices: [51200, 51350, 51500, 51400, 51600, 51700] },
    { name: 'INDIA VIX',  value: '—', change: '—', isUp: false, prices: [13.8, 13.5, 13.6, 13.4, 13.3, 13.36] },
    { name: 'USD/INR',    value: '—', change: '—', isUp: true,  prices: [94.8, 94.9, 95.0, 95.1, 95.2, 95.25] },
    { name: 'GOLD',       value: '—', change: '—', isUp: true,  prices: [4050, 4080, 4100, 4090, 4120, 4133] },
    { name: 'CRUDE OIL',  value: '—', change: '—', isUp: false, prices: [74.5, 73.8, 73.2, 72.8, 72.5, 72.3] },
  ],

  reasons: [
    'Fetching live AI analysis...'
  ],

  macroCards: [
    { name: 'GOLD (MCX)',      value: '—', change: '—', isUp: true,  status: 'Loading...', prices: [4050, 4080, 4100, 4090, 4120, 4133] },
    { name: 'CRUDE OIL (WTI)', value: '—', change: '—', isUp: false, status: 'Loading...', prices: [74.5, 73.8, 73.2, 72.8, 72.5, 72.3] },
    { name: 'USD / INR',       value: '—', change: '—', isUp: true,  status: 'Loading...', prices: [94.8, 94.9, 95.0, 95.1, 95.2, 95.25] },
    { name: 'INDIA VIX',       value: '—', change: '—', isUp: false, status: 'Loading...', prices: [13.8, 13.5, 13.6, 13.4, 13.3, 13.36] }
  ],

  features: [
    { name: 'RSI (14)',              weight: 0.22 },
    { name: 'NIFTY Return (Lag 1)',  weight: 0.18 },
    { name: 'MACD Signal',           weight: 0.15 },
    { name: 'India VIX Change',      weight: 0.14 },
    { name: 'Price-MA20 Diff',       weight: 0.12 },
  ],

  models: [
    { name: 'Gradient Boosting',    prob: 68, color: '#22c55e' },
    { name: 'Random Forest',        prob: 61, color: '#a78bfa' },
    { name: 'Logistic Regression',  prob: 54, color: '#3b82f6' }
  ],

  // History is generated with today's dates as placeholders; live data overrides these
  history: [
    { date: formatDate(daysAgo(0)), prediction: '—', confidence: '—', actual: '—' },
    { date: formatDate(daysAgo(1)), prediction: '—', confidence: '—', actual: '—' },
    { date: formatDate(daysAgo(2)), prediction: '—', confidence: '—', actual: '—' },
    { date: formatDate(daysAgo(3)), prediction: '—', confidence: '—', actual: '—' },
    { date: formatDate(daysAgo(4)), prediction: '—', confidence: '—', actual: '—' },
  ],

  // Chart data: last 6 trading day labels (dynamic) — prices are loaded from API
  chartData: [
    { date: formatShortDate(daysAgo(10)), close: 23600, volume: 480 },
    { date: formatShortDate(daysAgo(8)),  close: 23750, volume: 510 },
    { date: formatShortDate(daysAgo(6)),  close: 23820, volume: 490 },
    { date: formatShortDate(daysAgo(4)),  close: 23900, volume: 540 },
    { date: formatShortDate(daysAgo(2)),  close: 23882, volume: 560 },
    { date: formatShortDate(daysAgo(0)),  close: 23963, volume: 600 },
  ],

  performanceData: [
    { name: 'Gradient Boosting',   accuracy: 54.25 },
    { name: 'Random Forest',       accuracy: 48.45 },
    { name: 'Logistic Regression', accuracy: 54.12 }
  ],

  news: 'Live market data loading...   •   AI prediction engine active   •   NIFTY 50 tracking in real-time'
};

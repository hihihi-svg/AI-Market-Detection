// Static mock dataset matching NIFTY feature pipeline outputs
export const dashboardData = {
  niftyValue: '24,502.15',
  niftyChange: '+110.45 (0.45%)',
  niftyChangeValue: '+110.45',
  niftyChangePercent: '0.45%',
  lastUpdated: '12 May 2025, 03:30 PM',
  prediction: 'UP',
  probability: 68,
  confidence: 68,
  expectedMove: '+0.62%',
  predictionDate: '13 May 2025',
  targetRange: '25,200 – 25,400',
  timeHorizon: '1 Day',
  
  tickers: [
    { name: 'NIFTY 50', value: '24,502.15', change: '+134.25 (0.45%)', isUp: true, prices: [24380, 24410, 24450, 24430, 24490, 24502] },
    { name: 'SENSEX', value: '80,319.48', change: '+337.86 (0.38%)', isUp: true, prices: [79900, 80050, 80150, 80100, 80250, 80319] },
    { name: 'BANK NIFTY', value: '51,104.35', change: '+198.20 (0.62%)', isUp: true, prices: [50800, 50900, 51010, 50950, 51050, 51104] },
    { name: 'INDIA VIX', value: '14.23', change: '-2.15%', isUp: false, prices: [14.8, 14.7, 14.5, 14.6, 14.3, 14.23] },
    { name: 'USD/INR', value: '83.32', change: '+0.12%', isUp: true, prices: [83.22, 83.25, 83.30, 83.28, 83.31, 83.32] },
    { name: 'GOLD', value: '72,385', change: '+0.28%', isUp: true, prices: [71900, 72050, 72150, 72100, 72250, 72385] },
    { name: 'CRUDE OIL', value: '6,128', change: '-0.35%', isUp: false, prices: [6220, 6210, 6230, 6195, 6200, 6128] },
  ],

  reasons: [
    'India VIX has dropped by 4.2%, signaling reduced market fear.',
    'RSI (58.2) shows strong bullish momentum, not yet overbought.',
    'Golden cross formed in moving averages (20DMA > 50DMA).',
    'Crude oil prices are stable, reducing import cost uncertainty.',
    '2 out of 3 machine learning models strongly agree on upward trend.'
  ],

  macroCards: [
    { name: 'GOLD (MCX)', value: '₹72,385', change: '+0.28%', isUp: true, status: 'Stable', prices: [71900, 72050, 72150, 72250, 72385] },
    { name: 'CRUDE OIL (WTI)', value: '$6,128', change: '-0.35%', isUp: false, status: 'Neutral', prices: [6220, 6210, 6230, 6200, 6128] },
    { name: 'USD / INR', value: '₹83.32', change: '+0.12%', isUp: true, status: 'Slightly Weak', prices: [83.22, 83.25, 83.30, 83.31, 83.32] },
    { name: 'INDIA VIX', value: '14.23', change: '-2.15%', isUp: false, status: 'Low Fear', prices: [14.8, 14.7, 14.5, 14.3, 14.23] }
  ],

  features: [
    { name: 'NIFTY Return (Lag 1)', weight: 0.18 },
    { name: 'RSI (14)', weight: 0.15 },
    { name: 'India VIX Change', weight: 0.12 },
    { name: 'USD/INR Change', weight: 0.10 },
    { name: 'Gold Return', weight: 0.09 }
  ],

  models: [
    { name: 'Gradient Boosting', prob: 68, color: '#22c55e' },
    { name: 'Random Forest', prob: 61, color: '#a78bfa' },
    { name: 'Logistic Regression', prob: 54, color: '#3b82f6' }
  ],

  history: [
    { date: '12 May 2025', prediction: 'UP', confidence: '68%', actual: '—' },
    { date: '9 May 2025', prediction: 'UP', confidence: '63%', actual: '▲' },
    { date: '8 May 2025', prediction: 'DOWN', confidence: '58%', actual: '▼' },
    { date: '7 May 2025', prediction: 'UP', confidence: '61%', actual: '▲' },
    { date: '6 May 2025', prediction: 'UP', confidence: '65%', actual: '▲' }
  ],

  chartData: [
    { date: '14 Apr', close: 23200, volume: 400 },
    { date: '18 Apr', close: 23500, volume: 550 },
    { date: '24 Apr', close: 23000, volume: 600 },
    { date: '30 Apr', close: 23800, volume: 480 },
    { date: '6 May', close: 24200, volume: 500 },
    { date: '12 May', close: 24502, volume: 700 }
  ],

  performanceData: [
    { name: 'Gradient Boosting', accuracy: 68 },
    { name: 'Random Forest', accuracy: 61 },
    { name: 'Logistic Regression', accuracy: 54 }
  ],

  news: 'NIFTY ends higher as IT and banking stocks rally   •   India VIX drops 2% indicating lower market volatility   •   Global cues positive ahead of US inflation data'
};

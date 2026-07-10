import React, { useState, useEffect } from 'react';
import { getPredictionHistory, getAnalyticsMetrics, getFeatureImportance, getModelComparison, getTechnicalIndicators } from '../services/api';

function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [importance, setImportance] = useState({});
  const [modelComparison, setModelComparison] = useState(null);
  const [technicalIndicators, setTechnicalIndicators] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [historyData, analyticsData, importanceData, comparisonData, indicatorsData] = await Promise.all([
          getPredictionHistory().catch(() => []),
          getAnalyticsMetrics().catch(() => ({})),
          getFeatureImportance().catch(() => ({})),
          getModelComparison().catch(() => ({})),
          getTechnicalIndicators().catch(() => ({}))
        ]);

        setHistory(historyData || []);
        setAnalytics(analyticsData);
        setImportance(importanceData);
        setModelComparison(comparisonData);
        setTechnicalIndicators(indicatorsData);
      } catch (error) {
        console.error('Error fetching prediction data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-10 bg-gray-700 rounded mb-4 w-48"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-700 rounded"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC]">Prediction Analytics</h1>
          <p className="mt-2 text-[#94A3B8]">Comprehensive AI model performance and market analysis</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-[#334155]">
        {[
          { id: 'history', label: '📊 Prediction History' },
          { id: 'analytics', label: '📈 Model Performance' },
          { id: 'features', label: '⚙️ Feature Importance' },
          { id: 'models', label: '🤖 Model Comparison' },
          { id: 'indicators', label: '📉 Technical Indicators' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === tab.id
                ? 'text-[#0EA5E9] border-b-2 border-[#0EA5E9]'
                : 'text-[#94A3B8] hover:text-[#CBD5E1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      
      {/* Prediction History */}
      {activeTab === 'history' && (
        <div className="bg-[#1E293B] rounded-lg border border-[#334155] p-6">
          <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">Recent Predictions</h2>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#334155]">
                    <th className="text-left py-3 px-4 text-[#94A3B8] font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-[#94A3B8] font-semibold">Prediction</th>
                    <th className="text-left py-3 px-4 text-[#94A3B8] font-semibold">Confidence</th>
                    <th className="text-left py-3 px-4 text-[#94A3B8] font-semibold">Actual</th>
                    <th className="text-left py-3 px-4 text-[#94A3B8] font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-[#94A3B8] font-semibold">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={idx} className="border-b border-[#334155] hover:bg-[#0F172A] transition-colors">
                      <td className="py-3 px-4 text-[#CBD5E1]">{item.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.prediction === 'UP'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {item.prediction}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#CBD5E1]">{item.confidence}</td>
                      <td className="py-3 px-4 text-lg font-bold">
                        <span className={item.actual === '▲' ? 'text-green-400' : 'text-red-400'}>
                          {item.actual}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#CBD5E1]">{item.price}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${item.accuracy === '✓' ? 'text-green-400' : 'text-red-400'}`}>
                          {item.accuracy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[#94A3B8]">No prediction history available</p>
          )}
        </div>
      )}

      {/* Model Performance */}
      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(analytics).map(([modelKey, metrics]) => (
            <div key={modelKey} className="bg-[#1E293B] rounded-lg border border-[#334155] p-6">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">
                {typeof metrics === 'object' ? metrics.name || modelKey : modelKey}
              </h3>
              {typeof metrics === 'object' && !Array.isArray(metrics) ? (
                <div className="space-y-3">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-[#94A3B8] text-sm capitalize">{key}</span>
                      <span className="text-[#0EA5E9] font-bold">
                        {typeof value === 'number' ? `${value.toFixed(2)}%` : value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#0EA5E9] text-2xl font-bold">
                  {typeof metrics === 'number' ? `${metrics.toFixed(2)}%` : metrics}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feature Importance */}
      {activeTab === 'features' && (
        <div className="bg-[#1E293B] rounded-lg border border-[#334155] p-6">
          <h2 className="text-xl font-semibold text-[#F8FAFC] mb-6">Feature Importance Ranking</h2>
          {Object.keys(importance).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(importance).slice(0, 12).map(([feature, value], idx) => (
                <div key={feature}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#CBD5E1] font-medium">{idx + 1}. {feature}</span>
                    <span className="text-[#0EA5E9] font-bold">{(value * 100).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-[#0F172A] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] h-2 rounded-full"
                      style={{ width: `${Math.min(value * 500, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#94A3B8]">Feature importance data unavailable</p>
          )}
        </div>
      )}

      {/* Model Comparison */}
      {activeTab === 'models' && modelComparison && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(modelComparison).map(([key, model]) => (
            <div key={key} className="bg-[#1E293B] rounded-lg border border-[#334155] p-6">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">{model.name}</h3>
              <p className="text-[#94A3B8] text-sm mb-4">{model.description}</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#CBD5E1]">Prediction</span>
                  <span className={`font-bold ${model.prediction === 1 ? 'text-green-400' : 'text-red-400'}`}>
                    {model.prediction === 1 ? '📈 UP' : '📉 DOWN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#CBD5E1]">Confidence</span>
                  <span className="text-[#0EA5E9] font-bold">{model.confidence.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#CBD5E1]">Interpretability</span>
                  <span className="text-[#22C55E]">{model.interpretability}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technical Indicators */}
      {activeTab === 'indicators' && technicalIndicators && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* RSI */}
          <div className="bg-[#1E293B] rounded-lg border border-[#334155] p-6">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">RSI (Relative Strength Index)</h3>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#0EA5E9]">{technicalIndicators.rsi?.value}</p>
              <p className="text-[#94A3B8] mt-2">{technicalIndicators.rsi?.status}</p>
              <div className="mt-4 bg-[#0F172A] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${technicalIndicators.rsi?.value || 50}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* MACD */}
          <div className="bg-[#1E293B] rounded-lg border border-[#334155] p-6">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">MACD Indicator</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">MACD Value</span>
                <span className="text-[#0EA5E9] font-bold">{technicalIndicators.macd?.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">Signal Line</span>
                <span className="text-[#0EA5E9] font-bold">{technicalIndicators.macd?.signal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">Histogram</span>
                <span className={`font-bold ${technicalIndicators.macd?.histogram > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {technicalIndicators.macd?.histogram}
                </span>
              </div>
            </div>
          </div>

          {/* Moving Averages */}
          <div className="bg-[#1E293B] rounded-lg border border-[#334155] p-6">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Moving Averages</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">Current Price</span>
                <span className="text-[#0EA5E9] font-bold">{technicalIndicators.movingAverages?.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">MA20</span>
                <span className="text-[#22C55E]">{technicalIndicators.movingAverages?.ma20}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">MA50</span>
                <span className="text-[#22C55E]">{technicalIndicators.movingAverages?.ma50}</span>
              </div>
            </div>
          </div>

          {/* Volatility & Momentum */}
          <div className="bg-[#1E293B] rounded-lg border border-[#334155] p-6">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Volatility & Momentum</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">Volatility</span>
                <span className="text-[#0EA5E9] font-bold">{technicalIndicators.volatility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">Momentum (3-day)</span>
                <span className="text-[#22C55E]">{technicalIndicators.momentum?.momentum3}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#CBD5E1]">Momentum (7-day)</span>
                <span className="text-[#22C55E]">{technicalIndicators.momentum?.momentum7}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictionHistory;

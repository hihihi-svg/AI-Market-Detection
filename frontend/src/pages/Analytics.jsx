import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import Card from '../components/common/Card';
import { Sparkles, BarChart3, LineChart, Table } from 'lucide-react';

function Analytics() {
  const [activeTab, setActiveTab] = useState('probabilitySurface');

  // 1. Mock Data for 3D Prediction Probability Surface
  // X: Time (Days), Y: Prediction Probability (%), Z: Confidence Score (%)
  const xSurface = Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`);
  const ySurface = [50, 55, 60, 65, 70, 75, 80, 85, 90];
  const zSurface = [
    [52, 53, 55, 57, 60, 62, 65, 67, 72, 70, 68, 65, 60, 58, 55],
    [54, 55, 57, 59, 62, 64, 67, 69, 74, 72, 70, 67, 62, 60, 57],
    [56, 57, 59, 61, 64, 66, 69, 71, 76, 74, 72, 69, 64, 62, 59],
    [58, 59, 61, 63, 66, 68, 71, 73, 78, 76, 74, 71, 66, 64, 61],
    [60, 61, 63, 65, 68, 70, 73, 75, 80, 78, 76, 73, 68, 66, 63],
    [62, 63, 65, 67, 70, 72, 75, 77, 82, 80, 78, 75, 70, 68, 65],
    [64, 65, 67, 69, 72, 74, 77, 79, 84, 82, 80, 77, 72, 70, 67],
    [66, 67, 69, 71, 74, 76, 79, 81, 86, 84, 82, 79, 74, 72, 69],
    [68, 69, 71, 73, 76, 78, 81, 83, 88, 86, 84, 81, 76, 74, 71]
  ];

  // 2. Mock Data for 3D Feature Importance Map
  // X: Input Features, Y: Model Type (LR, RF, GB), Z: Importance score
  const features = ['RSI', 'MACD', 'MA20_Diff', 'Volatility', 'VIX_Change', 'Gold_Return', 'Oil_Return', 'USD_Return'];
  const models = ['Logistic Regression', 'Random Forest', 'Gradient Boosting'];
  const zImportance = [
    [0.15, 0.12, 0.18, 0.22, 0.10, 0.08, 0.05, 0.10], // LR
    [0.22, 0.18, 0.15, 0.12, 0.14, 0.07, 0.04, 0.08], // RF
    [0.25, 0.20, 0.12, 0.10, 0.15, 0.09, 0.03, 0.06]  // GB
  ];

  // 3. Mock Data for 3D Historical Prediction Landscape
  // X: Date, Y: Prediction Probability, Z: Actual direction (-1 for Down, 1 for Up)
  const historyDates = ['1 May', '2 May', '3 May', '4 May', '5 May', '6 May', '7 May', '8 May', '9 May', '10 May'];
  const historyProbs = [52, 58, 61, 48, 45, 68, 70, 72, 65, 75];
  const historyActuals = [1, 1, 1, -1, -1, 1, 1, 1, -1, 1];

  const layout3DConfig = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#94A3B8', size: 10, family: 'Inter, sans-serif' },
    margin: { l: 0, r: 0, b: 0, t: 0 },
    scene: {
      xaxis: {
        backgroundcolor: 'rgba(12,21,36,0.5)',
        gridcolor: '#1E293B',
        showbackground: true,
        zerolinecolor: '#334155',
        title: { text: 'X Axis', font: { color: '#64748B' } }
      },
      yaxis: {
        backgroundcolor: 'rgba(12,21,36,0.5)',
        gridcolor: '#1E293B',
        showbackground: true,
        zerolinecolor: '#334155',
        title: { text: 'Y Axis', font: { color: '#64748B' } }
      },
      zaxis: {
        backgroundcolor: 'rgba(12,21,36,0.5)',
        gridcolor: '#1E293B',
        showbackground: true,
        zerolinecolor: '#334155',
        title: { text: 'Z Axis', font: { color: '#64748B' } }
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.2 }
      }
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={14} className="animate-pulse" />
          AI Reasoning Lab
        </div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">3D Interactive Analytics</h1>
        <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
          Explore multi-dimensional visualizations showing how the machine learning models arrive at their prediction outputs. Rotate and zoom each 3D landscape directly inside your browser.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#112240] gap-4">
        <button
          onClick={() => setActiveTab('probabilitySurface')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'probabilitySurface' 
              ? 'border-violet-500 text-violet-400' 
              : 'border-transparent text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          3D Probability Surface
        </button>
        <button
          onClick={() => setActiveTab('featureImportance')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'featureImportance' 
              ? 'border-violet-500 text-violet-400' 
              : 'border-transparent text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          3D Feature Importance Map
        </button>
        <button
          onClick={() => setActiveTab('historyLandscape')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'historyLandscape' 
              ? 'border-violet-500 text-violet-400' 
              : 'border-transparent text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          3D Historical Landscape
        </button>
      </div>

      {/* 3D Visualizer Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-3 h-[460px] flex items-center justify-center p-4">
          {activeTab === 'probabilitySurface' && (
            <Plot
              data={[
                {
                  x: xSurface,
                  y: ySurface,
                  z: zSurface,
                  type: 'surface',
                  colorscale: 'Viridis',
                  showscale: false
                }
              ]}
              layout={{
                ...layout3DConfig,
                width: 700,
                height: 420,
                scene: {
                  ...layout3DConfig.scene,
                  xaxis: { ...layout3DConfig.scene.xaxis, title: { text: 'Time Sequence' } },
                  yaxis: { ...layout3DConfig.scene.yaxis, title: { text: 'Probability %' } },
                  zaxis: { ...layout3DConfig.scene.zaxis, title: { text: 'Confidence %' } }
                }
              }}
              config={{ displayModeBar: false, responsive: true }}
            />
          )}

          {activeTab === 'featureImportance' && (
            <Plot
              data={[
                {
                  x: features,
                  y: models,
                  z: zImportance,
                  type: 'surface',
                  colorscale: 'Plasma',
                  showscale: false
                }
              ]}
              layout={{
                ...layout3DConfig,
                width: 700,
                height: 420,
                scene: {
                  ...layout3DConfig.scene,
                  xaxis: { ...layout3DConfig.scene.xaxis, title: { text: 'Features' } },
                  yaxis: { ...layout3DConfig.scene.yaxis, title: { text: 'ML Models' } },
                  zaxis: { ...layout3DConfig.scene.zaxis, title: { text: 'Importance Weight' } }
                }
              }}
              config={{ displayModeBar: false, responsive: true }}
            />
          )}

          {activeTab === 'historyLandscape' && (
            <Plot
              data={[
                {
                  x: historyDates,
                  y: historyProbs,
                  z: historyActuals,
                  type: 'scatter3d',
                  mode: 'markers+lines',
                  marker: {
                    size: 6,
                    color: historyActuals.map(a => a === 1 ? '#00b060' : '#ff3b30'),
                    opacity: 0.8
                  },
                  line: {
                    color: '#7C3AED',
                    width: 2
                  }
                }
              ]}
              layout={{
                ...layout3DConfig,
                width: 700,
                height: 420,
                scene: {
                  ...layout3DConfig.scene,
                  xaxis: { ...layout3DConfig.scene.xaxis, title: { text: 'Time Log' } },
                  yaxis: { ...layout3DConfig.scene.yaxis, title: { text: 'Probability %' } },
                  zaxis: { ...layout3DConfig.scene.zaxis, title: { text: 'Actual (Down/Up)' } }
                }
              }}
              config={{ displayModeBar: false, responsive: true }}
            />
          )}
        </Card>

        {/* Informative Side Panel */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Analytical Details</h3>
            
            {activeTab === 'probabilitySurface' && (
              <div className="space-y-3.5 text-xs text-[#94A3B8] leading-relaxed">
                <p>
                  The <strong className="text-[#F8FAFC]">3D Probability Surface</strong> demonstrates confidence distribution across consecutive trading intervals.
                </p>
                <p>
                  Peaks indicate times when multiple indicators converge, raising the expected direction confidence above 80%.
                </p>
              </div>
            )}

            {activeTab === 'featureImportance' && (
              <div className="space-y-3.5 text-xs text-[#94A3B8] leading-relaxed">
                <p>
                  The <strong className="text-[#F8FAFC]">3D Feature Importance Map</strong> showcases input weights calculated across classifiers.
                </p>
                <p>
                  RSI and Volatility metrics rank highest for Random Forest and Gradient Boosting, whereas USD/INR changes weight more for Logistic Regression.
                </p>
              </div>
            )}

            {activeTab === 'historyLandscape' && (
              <div className="space-y-3.5 text-xs text-[#94A3B8] leading-relaxed">
                <p>
                  The <strong className="text-[#F8FAFC]">3D Historical Landscape</strong> plots predictions (Y) against date sequences (X) and actual direction targets (Z).
                </p>
                <p>
                  Green markers represent correct forecasts, whereas red dots highlight false alerts.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#112240] text-[10px] text-[#64748B] leading-normal">
            Use click-and-drag inside the viewport to rotate coordinates, or scroll to zoom in/out of the simulation grid.
          </div>
        </Card>
      </div>

      {/* Baseline performance metrics panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between p-5 h-32">
          <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Logistic Regression</span>
          <span className="text-2xl font-black text-[#F8FAFC] tracking-tight">54.12%</span>
          <span className="text-xs text-[#00b060] font-semibold">Baseline Classifier</span>
        </Card>
        <Card className="flex flex-col justify-between p-5 h-32">
          <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Random Forest</span>
          <span className="text-2xl font-black text-[#F8FAFC] tracking-tight">48.45%</span>
          <span className="text-xs text-[#ff3b30] font-semibold">Bagging Ensemble</span>
        </Card>
        <Card className="flex flex-col justify-between p-5 h-32 border border-[#7C3AED]/40">
          <span className="text-[10px] text-[#7C3AED] font-bold uppercase tracking-wider">Gradient Boosting</span>
          <span className="text-2xl font-black text-[#F8FAFC] tracking-tight">54.25%</span>
          <span className="text-xs text-violet-400 font-semibold">Best Model Selected</span>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;

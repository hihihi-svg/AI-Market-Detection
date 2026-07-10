import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Eye, 
  Plus, 
  Minus,
  Filter,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Target,
  DollarSign,
  PieChart
} from 'lucide-react';
import { searchStocks, getStockAnalysis, getAllStocks, getSectors, addToWatchlist, removeFromWatchlist, compareStocks } from '../services/api';

function StockSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockAnalysis, setStockAnalysis] = useState(null);
  const [allStocks, setAllStocks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState(new Set());
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [watchlistItems, setWatchlistItems] = useState(new Set());

  // Load sectors on mount
  useEffect(() => {
    const loadSectors = async () => {
      try {
        const data = await getSectors();
        setSectors(data);
      } catch (error) {
        console.error('Error loading sectors:', error);
      }
    };
    loadSectors();
  }, []);

  // Search stocks
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        setLoading(true);
        const results = await searchStocks(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Load stock analysis
  const handleSelectStock = async (symbol) => {
    try {
      setLoading(true);
      setSelectedStock(symbol);
      const analysis = await getStockAnalysis(symbol);
      setStockAnalysis(analysis);
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load sector stocks
  const handleSectorFilter = async (sector) => {
    setSelectedSector(sector);
    try {
      setLoading(true);
      const stocks = await getAllStocks(sector);
      setAllStocks(stocks);
    } catch (error) {
      console.error('Error loading sector stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle comparison
  const toggleComparison = (symbol) => {
    const newSelected = new Set(selectedForComparison);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
    } else {
      newSelected.add(symbol);
    }
    setSelectedForComparison(newSelected);
  };

  // Load comparison
  const handleCompare = async () => {
    if (selectedForComparison.size > 1) {
      try {
        setLoading(true);
        const data = await compareStocks(Array.from(selectedForComparison));
        setComparisonData(data);
        setComparisonMode(true);
      } catch (error) {
        console.error('Error comparing stocks:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Add/remove from watchlist
  const handleWatchlist = async (symbol, action) => {
    try {
      if (action === 'add') {
        await addToWatchlist(symbol);
        setWatchlistItems(prev => new Set([...prev, symbol]));
      } else {
        await removeFromWatchlist(symbol);
        setWatchlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(symbol);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Watchlist error:', error);
    }
  };

  return (
    <div className="w-full">
      {comparisonMode && comparisonData.length > 0 ? (
        // Stock Comparison View
        <div>
          {/* Back Button */}
          <div className="p-6 border-b border-[#112240]/40">
            <button
              onClick={() => {
                setComparisonMode(false);
                setSelectedForComparison(new Set());
                setComparisonData([]);
              }}
              className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-semibold"
            >
              ← Back to Search
            </button>
          </div>

          {/* Comparison Header */}
          <div className="p-6 border-b border-[#112240]/40">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 size={20} className="text-violet-400" />
              <h2 className="text-2xl font-bold text-[#F8FAFC]">Stock Comparison</h2>
            </div>
            <p className="text-xs text-[#64748B]">Compare key metrics across {comparisonData.length} stocks</p>
          </div>

          {/* Comparison Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#112240]/40">
                    <th className="text-left p-3 text-xs font-bold text-[#94A3B8] uppercase">Metric</th>
                    {comparisonData.map(stock => (
                      <th key={stock.symbol} className="text-right p-3 text-xs font-bold text-[#F8FAFC]">
                        {stock.symbol}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#112240]/40 hover:bg-[#1E293B]/30">
                    <td className="p-3 text-xs font-semibold text-[#94A3B8]">Current Price</td>
                    {comparisonData.map(stock => (
                      <td key={stock.symbol} className="text-right p-3 text-xs font-bold text-[#F8FAFC]">
                        ₹{stock.currentPrice.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#112240]/40 hover:bg-[#1E293B]/30">
                    <td className="p-3 text-xs font-semibold text-[#94A3B8]">Change %</td>
                    {comparisonData.map(stock => (
                      <td key={stock.symbol} className="text-right p-3">
                        <span className={`text-xs font-bold ${stock.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#112240]/40 hover:bg-[#1E293B]/30">
                    <td className="p-3 text-xs font-semibold text-[#94A3B8]">P/E Ratio</td>
                    {comparisonData.map(stock => (
                      <td key={stock.symbol} className="text-right p-3 text-xs font-bold text-[#F8FAFC]">
                        {stock.peRatio.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#112240]/40 hover:bg-[#1E293B]/30">
                    <td className="p-3 text-xs font-semibold text-[#94A3B8]">Dividend</td>
                    {comparisonData.map(stock => (
                      <td key={stock.symbol} className="text-right p-3 text-xs font-bold text-[#F8FAFC]">
                        {stock.dividend}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-[#112240]/40 hover:bg-[#1E293B]/30">
                    <td className="p-3 text-xs font-semibold text-[#94A3B8]">Recommendation</td>
                    {comparisonData.map(stock => (
                      <td key={stock.symbol} className="text-right p-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          stock.recommendation === 'BUY' ? 'bg-green-500/20 text-green-300' :
                          stock.recommendation === 'HOLD' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {stock.recommendation}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : selectedStock && stockAnalysis ? (
        // Stock Analysis Detail View
        <div>
          {/* Back Button */}
          <div className="p-6 border-b border-[#112240]/40">
            <button
              onClick={() => {
                setSelectedStock(null);
                setStockAnalysis(null);
              }}
              className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-semibold mb-4"
            >
              ← Back to Search
            </button>
          </div>

          {/* Stock Header */}
          <div className="p-6 border-b border-[#112240]/40">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[#F8FAFC] mb-1">{stockAnalysis.symbol}</h1>
                <p className="text-sm text-[#64748B]">{stockAnalysis.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-violet-500/20 text-violet-300">
                    {stockAnalysis.sector}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleWatchlist(stockAnalysis.symbol, watchlistItems.has(stockAnalysis.symbol) ? 'remove' : 'add')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                  watchlistItems.has(stockAnalysis.symbol)
                    ? 'bg-violet-600 text-white hover:bg-violet-700'
                    : 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                }`}
              >
                {watchlistItems.has(stockAnalysis.symbol) ? (
                  <>
                    <Minus size={16} />
                    Remove from Watchlist
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add to Watchlist
                  </>
                )}
              </button>
            </div>

            {/* Price Section */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Current Price</p>
                <p className="text-2xl font-bold text-[#F8FAFC]">₹{stockAnalysis.marketData.currentPrice}</p>
              </div>
              <div className={`${stockAnalysis.marketData.change > 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-lg p-4`}>
                <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Change</p>
                <p className={`text-2xl font-bold ${stockAnalysis.marketData.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stockAnalysis.marketData.change > 0 ? '+' : ''}{stockAnalysis.marketData.change}%
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">₹{stockAnalysis.marketData.changeAmount}</p>
              </div>
              <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Target Price</p>
                <p className="text-2xl font-bold text-[#F8FAFC]">₹{stockAnalysis.recommendation.targetPrice}</p>
              </div>
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="p-6 grid grid-cols-2 gap-6">
            {/* Technical Analysis */}
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-4">Technical Analysis</h3>
              <div className="space-y-3">
                <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">RSI</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[#F8FAFC]">{stockAnalysis.technicalAnalysis.rsi.toFixed(2)}</p>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                      stockAnalysis.technicalAnalysis.rsi > 70 ? 'bg-red-500/20 text-red-300' :
                      stockAnalysis.technicalAnalysis.rsi < 30 ? 'bg-green-500/20 text-green-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {stockAnalysis.technicalAnalysis.rsi > 70 ? 'Overbought' : stockAnalysis.technicalAnalysis.rsi < 30 ? 'Oversold' : 'Neutral'}
                    </span>
                  </div>
                </div>
                <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase mb-2">Moving Averages</p>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">MA50:</span>
                      <span className="text-[#F8FAFC] font-semibold">₹{stockAnalysis.technicalAnalysis.movingAverage50}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">MA200:</span>
                      <span className="text-[#F8FAFC] font-semibold">₹{stockAnalysis.technicalAnalysis.movingAverage200}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase mb-2">Support & Resistance</p>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-green-400">Support:</span>
                      <span className="font-semibold">₹{stockAnalysis.technicalAnalysis.support}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-400">Resistance:</span>
                      <span className="font-semibold">₹{stockAnalysis.technicalAnalysis.resistance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fundamentals */}
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-4">Fundamentals</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">P/E Ratio</p>
                    <p className="text-lg font-bold text-[#F8FAFC]">{stockAnalysis.fundamentals.peRatio}</p>
                  </div>
                  <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">P/B Ratio</p>
                    <p className="text-lg font-bold text-[#F8FAFC]">{stockAnalysis.fundamentals.pbRatio}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Dividend</p>
                    <p className="text-lg font-bold text-[#F8FAFC]">{stockAnalysis.fundamentals.dividend}</p>
                  </div>
                  <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">ROE</p>
                    <p className="text-lg font-bold text-[#F8FAFC]">{stockAnalysis.fundamentals.roe}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-6 border-t border-[#112240]/40">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-4">Analyst Recommendation</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                <p className="text-[10px] font-bold text-[#64748B] uppercase mb-2">Action</p>
                <p className={`text-xl font-bold ${
                  stockAnalysis.recommendation.action === 'BUY' ? 'text-green-400' :
                  stockAnalysis.recommendation.action === 'HOLD' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {stockAnalysis.recommendation.action}
                </p>
              </div>
              <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                <p className="text-[10px] font-bold text-[#64748B] uppercase mb-2">Confidence</p>
                <p className="text-xl font-bold text-violet-400">{stockAnalysis.recommendation.confidence}%</p>
              </div>
              <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                <p className="text-[10px] font-bold text-[#64748B] uppercase mb-2">Analyst Count</p>
                <p className="text-xl font-bold text-[#F8FAFC]">{stockAnalysis.recommendation.analystCount}</p>
              </div>
              <div className="bg-[#1E293B] border border-[#112240]/40 rounded-lg p-4">
                <p className="text-[10px] font-bold text-[#64748B] uppercase mb-2">Votes</p>
                <div className="flex gap-1 text-xs">
                  <span className="text-green-400 font-semibold">{stockAnalysis.recommendation.buyCount}B</span>
                  <span className="text-yellow-400 font-semibold">{stockAnalysis.recommendation.holdCount}H</span>
                  <span className="text-red-400 font-semibold">{stockAnalysis.recommendation.sellCount}S</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Stock Search View
        <>
          {/* Header */}
          <div className="p-6 border-b border-[#112240]/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Search size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#F8FAFC]">Stock Search & Analysis</h1>
                <p className="text-xs text-[#64748B] mt-1">Search, analyze, and monitor stocks</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-4 top-3.5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by symbol or name (e.g., TCS, INFY)..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-[#112240]/40 rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-violet-500/50 transition"
              />
            </div>

            {/* Sector Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-[#64748B]" />
              <button
                onClick={() => {
                  setSelectedSector('');
                  setAllStocks([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedSector === '' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-[#112240]/30 text-[#94A3B8] hover:bg-[#112240]/50'
                }`}
              >
                All
              </button>
              {sectors.map(sector => (
                <button
                  key={sector}
                  onClick={() => handleSectorFilter(sector)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSector === sector 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-[#112240]/30 text-[#94A3B8] hover:bg-[#112240]/50'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 || allStocks.length > 0 ? (
            <div className="p-6">
              {selectedForComparison.size > 1 && (
                <div className="mb-6 p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-semibold text-violet-300">
                    {selectedForComparison.size} stocks selected for comparison
                  </span>
                  <button
                    onClick={handleCompare}
                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Compare Now
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(searchResults.length > 0 ? searchResults : allStocks).map(stock => (
                  <div
                    key={stock.symbol}
                    className="group bg-[#1E293B] border border-[#112240]/40 rounded-lg p-5 hover:border-violet-500/50 hover:bg-[#1E293B]/80 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#F8FAFC] text-sm group-hover:text-violet-300 transition">
                          {stock.symbol}
                        </h3>
                        <p className="text-[10px] text-[#64748B]">{stock.name}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleComparison(stock.symbol)}
                          className={`p-2 rounded-lg transition ${
                            selectedForComparison.has(stock.symbol)
                              ? 'bg-violet-600 text-white'
                              : 'bg-[#112240]/30 text-[#64748B] hover:text-[#F8FAFC]'
                          }`}
                        >
                          <BarChart3 size={14} />
                        </button>
                      </div>
                    </div>

                    <span className="inline-block text-[9px] font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300 mb-3">
                      {stock.sector}
                    </span>

                    <button
                      onClick={() => handleSelectStock(stock.symbol)}
                      className="w-full px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition mb-2"
                    >
                      View Analysis
                    </button>

                    <button
                      onClick={() => handleWatchlist(stock.symbol, watchlistItems.has(stock.symbol) ? 'remove' : 'add')}
                      className={`w-full px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                        watchlistItems.has(stock.symbol)
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                      }`}
                    >
                      {watchlistItems.has(stock.symbol) ? '✓ In Watchlist' : '+ Add to Watchlist'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery || selectedSector ? (
            <div className="p-6 text-center">
              <p className="text-[#94A3B8]">No stocks found. Try a different search or filter.</p>
            </div>
          ) : (
            <div className="p-6 text-center py-12">
              <Search size={40} className="mx-auto text-[#112240] mb-4" />
              <p className="text-[#64748B] mb-2">Start searching or select a sector to view stocks</p>
              <p className="text-xs text-[#64748B]">Search by symbol (e.g., TCS) or company name (e.g., Tata Consultancy)</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StockSearch;

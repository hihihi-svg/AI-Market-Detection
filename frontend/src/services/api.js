import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const getPrediction = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prediction`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

export const getMarketSnapshot = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market snapshot:', error);
    throw error;
  }
};

export const getExplanation = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/explanation`);
    return response.data;
  } catch (error) {
    console.error('Error fetching explanation:', error);
    throw error;
  }
};

export const getPredictionHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const getAnalyticsMetrics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics metrics:', error);
    throw error;
  }
};

export const getAlerts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const getMarketHistory = async (period = '1m') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market/history`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market history:', error);
    throw error;
  }
};

export const getReport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/report`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

export const getMarketCorrelations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market/correlations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market correlations:', error);
    throw error;
  }
};

export const getIntraday = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/intraday`);
    return response.data;
  } catch (error) {
    console.error('Error fetching intraday predictions:', error);
    throw error;
  }
};

export const getFeatureImportance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feature-importance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feature importance:', error);
    throw error;
  }
};

export const getPredictionsDetailed = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/predictions-detailed`);
    return response.data;
  } catch (error) {
    console.error('Error fetching detailed predictions:', error);
    throw error;
  }
};

export const getTechnicalIndicators = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/technical-indicators`);
    return response.data;
  } catch (error) {
    console.error('Error fetching technical indicators:', error);
    throw error;
  }
};

export const getModelComparison = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/model-comparison`);
    return response.data;
  } catch (error) {
    console.error('Error fetching model comparison:', error);
    throw error;
  }
};

export const getRiskMetrics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/risk-metrics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching risk metrics:', error);
    throw error;
  }
};

export const getWatchlist = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/watchlist`);
    return response.data;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};

export const getHoldings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/holdings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error;
  }
};

export const getPortfolioAlerts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio alerts:', error);
    throw error;
  }
};

export const getPortfolioAllocation = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/allocation`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio allocation:', error);
    throw error;
  }
};

export const getPortfolioPerformance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/performance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio performance:', error);
    throw error;
  }
};

export const getStockDetails = async (symbol) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/stock/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock details for ${symbol}:`, error);
    throw error;
  }
};

export const getPortfolioRecommendations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio recommendations:', error);
    throw error;
  }
};

export const getPortfolioRiskAnalysis = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/risk-analysis`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio risk analysis:', error);
    throw error;
  }
};

// Stock Search and Analysis Methods
export const searchStocks = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/search`, {
      params: { q: query, limit: 15 }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

export const getStockAnalysis = async (symbol) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/analysis/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching analysis for ${symbol}:`, error);
    throw error;
  }
};

export const getAllStocks = async (sector) => {
  try {
    const params = sector ? { sector } : {};
    const response = await axios.get(`${API_BASE_URL}/stocks/all`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all stocks:', error);
    throw error;
  }
};

export const getSectors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/sectors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};

export const addToWatchlist = async (symbol) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stocks/watchlist/add`, { symbol });
    return response.data;
  } catch (error) {
    console.error(`Error adding ${symbol} to watchlist:`, error);
    throw error;
  }
};

export const removeFromWatchlist = async (symbol) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stocks/watchlist/remove`, { symbol });
    return response.data;
  } catch (error) {
    console.error(`Error removing ${symbol} from watchlist:`, error);
    throw error;
  }
};

export const compareStocks = async (symbols) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/compare`, {
      params: { symbols }
    });
    return response.data;
  } catch (error) {
    console.error('Error comparing stocks:', error);
    throw error;
  }
};

>>>>>>> Stashed changes

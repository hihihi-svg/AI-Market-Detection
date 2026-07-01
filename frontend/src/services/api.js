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
